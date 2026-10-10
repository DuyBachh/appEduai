import {
    apiRequest,
} from "../../../services/api";

export default class AuthService {
    static async login({
        email,
        password,
    }) {
        const result =
            await apiRequest(
                "/auth/login",
                {
                    method: "POST",
                    skipAuth: true,
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

        const token =
            result?.data?.token;

        if (!token) {
            throw new Error(
                "Backend không trả về token."
            );
        }

        return {
            token,
            user: result?.data?.user,
        };
    }

    static register({
        name,
        email,
        password,
    }) {
        return apiRequest(
            "/auth/register",
            {
                method: "POST",
                skipAuth: true,
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            }
        );
    }

    static async forgotPassword(email) {
        const result =
            await apiRequest(
                "/auth/forgot-password",
                {
                    method: "POST",
                    skipAuth: true,
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

        const resetToken =
            result?.data?.resetToken;

        if (!resetToken) {
            throw new Error(
                "Backend không trả về reset token."
            );
        }

        return {
            resetToken,
            message: result?.message,
        };
    }

    static resetPassword({
        token,
        newPassword,
    }) {
        return apiRequest(
            "/auth/reset-password",
            {
                method: "POST",
                skipAuth: true,
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            }
        );
    }
}
