import {
    getToken,
} from "./tokenStorage";

export const API_BASE_URL =
    "https://appeduai-backend.onrender.com/api";

const isFormData = (value) => {
    return (
        typeof FormData !== "undefined" &&
        value instanceof FormData
    );
};

export const apiRequest = async (
    endpoint,
    options = {}
) => {
    const {
        skipAuth = false,
        headers: optionHeaders,
        ...fetchOptions
    } = options;

    const token = skipAuth
        ? null
        : await getToken();

    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;

    const headers = {
        Accept: "application/json",
        ...(optionHeaders || {}),
    };

    if (
        fetchOptions.body &&
        !isFormData(fetchOptions.body) &&
        !headers["Content-Type"]
    ) {
        headers["Content-Type"] =
            "application/json";
    }

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    console.log("API URL:", url);

    let response;

    try {
        response = await fetch(url, {
            ...fetchOptions,
            headers,
        });
    } catch (error) {
        console.log(
            "API NETWORK ERROR:",
            error.message
        );

        const networkError =
            new Error(
                "Không thể kết nối tới backend. Vui lòng kiểm tra kết nối mạng và thử lại."
            );

        networkError.cause = error;

        throw networkError;
    }

    console.log(
        "API STATUS:",
        response.status
    );

    const rawText =
        await response.text();

    let result = null;

    if (rawText) {
        try {
            result =
                JSON.parse(rawText);
        } catch {
            result = {
                message: rawText,
            };
        }
    }

    if (!response.ok) {
        const error =
            new Error(
                result?.message ||
                    `API lỗi ${response.status}.`
            );

        error.status =
            response.status;

        error.data = result;

        throw error;
    }

    return (
        result || {
            success: true,
        }
    );
};
