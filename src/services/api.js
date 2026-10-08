import {
    getToken,
} from "./tokenStorage";

// ========================================
// API URL
// ========================================

export const API_BASE_URL =
    "https://appeduai-backend.onrender.com/api";

// ========================================
// FORM DATA CHECK
// ========================================

const isFormData = (
    value
) => {
    return (
        typeof FormData !==
            "undefined" &&
        value instanceof
            FormData
    );
};

// ========================================
// API REQUEST
// ========================================

export const apiRequest =
    async (
        endpoint,
        options = {}
    ) => {
        const token =
            await getToken();

        const url =
            endpoint.startsWith(
                "http"
            )
                ? endpoint
                : `${API_BASE_URL}${endpoint}`;

        const headers = {
            Accept:
                "application/json",

            ...(options.headers ||
                {}),
        };

        // ========================================
        // CONTENT TYPE
        // ========================================

        if (
            options.body &&
            !isFormData(
                options.body
            ) &&
            !headers[
                "Content-Type"
            ]
        ) {
            headers[
                "Content-Type"
            ] =
                "application/json";
        }

        // ========================================
        // TOKEN
        // ========================================

        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }

        console.log(
            "API URL:",
            url
        );

        let response;

        // ========================================
        // REQUEST
        // ========================================

        try {
            // Cố ý không dùng
            // AbortController timeout.
            //
            // Summary tài liệu dài
            // được phép chờ lâu.
            response =
                await fetch(
                    url,
                    {
                        ...options,

                        headers,
                    }
                );
        } catch (error) {
            console.log(
                "API NETWORK ERROR:",
                error.message
            );

            const networkError =
                new Error(
                    "Không thể kết nối tới backend. Kiểm tra Wi-Fi và địa chỉ IP của máy tính."
                );

            networkError.cause =
                error;

            throw networkError;
        }

        console.log(
            "API STATUS:",
            response.status
        );

        // ========================================
        // RESPONSE BODY
        // ========================================

        const rawText =
            await response.text();

        let result =
            null;

        if (rawText) {
            try {
                result =
                    JSON.parse(
                        rawText
                    );
            } catch {
                result = {
                    message:
                        rawText,
                };
            }
        }

        // ========================================
        // ERROR
        // ========================================

        if (
            !response.ok
        ) {
            const error =
                new Error(
                    result?.message ||
                        `API lỗi ${response.status}.`
                );

            error.status =
                response.status;

            error.data =
                result;

            throw error;
        }

        // ========================================
        // SUCCESS
        // ========================================

        return (
            result || {
                success:
                    true,
            }
        );
    };