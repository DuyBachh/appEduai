import {
    getToken,
    removeToken,
} from "./tokenStorage";

const API_BASE_URL =
    "http://192.168.1.204:5000/api";

const apiRequest = async (
    endpoint,
    options = {}
) => {
    try {
        const {
            skipAuth = false,
            ...fetchOptions
        } = options;

        const token =
            skipAuth
                ? null
                : await getToken();

        const isFormData =
            fetchOptions.body instanceof FormData;

        const headers = {
            ...(!isFormData && {
                "Content-Type":
                    "application/json",
            }),

            ...(token && {
                Authorization:
                    `Bearer ${token}`,
            }),

            ...fetchOptions.headers,
        };

        const url =
            `${API_BASE_URL}${endpoint}`;

        console.log(
            "API URL:",
            url
        );

        const response =
            await fetch(
                url,
                {
                    ...fetchOptions,
                    headers,
                }
            );

        const responseText =
            await response.text();

        console.log(
            "API STATUS:",
            response.status
        );

        let data;

        try {
            data =
                responseText
                    ? JSON.parse(
                          responseText
                      )
                    : {};
        } catch {
            throw new Error(
                "Server không trả về JSON hợp lệ."
            );
        }

        if (
            response.status === 401
        ) {
            if (!skipAuth) {
                await removeToken();
            }

            const error =
                new Error(
                    data.message ||
                        "Phiên đăng nhập đã hết hạn."
                );

            error.status = 401;

            throw error;
        }

        if (!response.ok) {
            const error =
                new Error(
                    data.message ||
                        "Đã xảy ra lỗi khi gọi API."
                );

            error.status =
                response.status;

            throw error;
        }

        return data;
    } catch (error) {
        if (
            error.message ===
            "Network request failed"
        ) {
            throw new Error(
                "Không thể kết nối tới server."
            );
        }

        throw error;
    }
};

export {
    API_BASE_URL,
    apiRequest,
};