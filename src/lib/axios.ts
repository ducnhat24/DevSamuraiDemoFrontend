import axios from 'axios';
import { store } from '@/store/store';
import { setCredentials, logout } from '@/store/authSlice';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
    withCredentials: true, // RẤT QUAN TRỌNG: Để trình duyệt tự đính kèm Cookie chứa Refresh Token
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 1. TRẠM KIỂM SOÁT ĐẦU RA (Request) ---
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken = state.auth.accessToken;
        const refreshToken = state.auth.refreshToken;

        if (config.url === '/auth/refresh' && refreshToken) {
            // ✅ SỬ DỤNG .set() THAY VÌ DẤU =
            config.headers.set('Authorization', `Bearer ${refreshToken}`);
        } else if (accessToken) {
            // ✅ SỬ DỤNG .set() THAY VÌ DẤU =
            config.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 2. TRẠM KIỂM SOÁT ĐẦU VÀO (Response) ---
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/login' &&
            originalRequest.url !== '/auth/refresh'
        ) {
            originalRequest._retry = true;

            try {
                // Gọi API lấy thẻ mới
                const refreshResponse = await axiosInstance.post('/auth/refresh');

                // Lấy token chuẩn từ JSON ông vừa đưa
                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                if (newAccessToken) {
                    // Lấy user cũ trong Redux (dù có null cũng không sao)
                    const currentUser = store.getState().auth.user;

                    // 1. Cập nhật Token mới vào Redux
                    store.dispatch(setCredentials({
                        user: currentUser, // Cứ giữ nguyên thằng cũ, null cũng được
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken || store.getState().auth.refreshToken
                    }));

                    // 2. Gắn token mới vào Header của request cũ
                    originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

                    // 3. Gọi lại API lỗi (ví dụ API /users/me) BẰNG TOKEN MỚI
                    return axiosInstance.request(originalRequest);
                }
            } catch (refreshError) {
                // Xóa Redux và đá văng ra ngoài nếu Refresh Token cũng tèo
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);