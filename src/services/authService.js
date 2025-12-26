// shared-logic/src/services/authService.js
import { login as apiLogin, getUserProfile } from './api'; 

// Hàm xử lý login: Gọi API -> Kiểm tra dữ liệu -> Trả về kết quả sạch
export const authenticateUser = async (email, password) => {
    try {
        const response = await apiLogin({ email, password });
        
        // Logic bóc tách dữ liệu nằm ở đây
        const tokens = response.data?.tokens;
        const user = response.data?.user;

        if (tokens && tokens.access) {
            return {
                success: true,
                data: {
                    accessToken: tokens.access,
                    refreshToken: tokens.refresh,
                    username: user?.username || null,
                    user: user // Trả về cả object user nếu cần
                }
            };
        } else {
            return { 
                success: false, 
                message: 'Token not found in response' 
            };
        }
    } catch (error) {
        // Xử lý lỗi chung tại đây nếu muốn
        console.error("Login logic failed:", error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed. Please try again.' 
        };
    }
};

// Hàm lấy thông tin user
export const fetchUserProfileData = async (username) => {
    try {
        const res = await getUserProfile(username);
        if (res.data) {
            return { success: true, data: res.data };
        }
        return { success: false, message: 'No data returned' };
    } catch (error) {
        console.error("Fetch user profile failed:", error);
        return { success: false, error };
    }
};