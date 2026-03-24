import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: { id: string; email: string; name: string } | null;
    accessToken: string | null;
    refreshToken: string | null; // THÊM CÁI NÀY
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null, // mặc định là null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            // Bổ sung thêm refreshToken vào payload
            action: PayloadAction<{ user: any; accessToken: string; refreshToken: string }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken; // Lưu vào state
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null; // Xóa sạch khi logout
        },
        updateUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
    },
});


export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;