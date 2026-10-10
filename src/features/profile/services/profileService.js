import {
    apiRequest,
} from "../../../services/api";

export default class ProfileService {
    static async getProfile() {
        const result =
            await apiRequest(
                "/auth/me"
            );

        if (!result?.data) {
            throw new Error(
                "Không lấy được thông tin người dùng."
            );
        }

        return result.data;
    }

    static async updateProfile(name) {
        const result =
            await apiRequest(
                "/auth/profile",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        name,
                    }),
                }
            );

        return {
            user: result?.data || null,
            message: result?.message,
        };
    }

    static logout() {
        return apiRequest(
            "/auth/logout",
            {
                method: "POST",
            }
        );
    }
}
