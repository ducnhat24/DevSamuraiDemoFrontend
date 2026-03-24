import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { axiosInstance } from "@/lib/axios";
import { updateUser } from "@/store/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const fetchMe = async () => {
            // Chỉ gọi khi đã có Access Token trong Redux
            if (accessToken) {
                try {
                    const response = await axiosInstance.get("/users/me");
                    // Cập nhật thông tin thật từ Backend vào Redux
                    dispatch(updateUser(response.data));
                } catch (error) {
                    console.error("Không thể lấy thông tin user:", error);
                    // Nếu lỗi 401 nặng quá thì đá ra login luôn
                    // dispatch(logout()); 
                }
            }
        };

        fetchMe();
    }, [accessToken, dispatch]);

    return <>{children}</>;
}