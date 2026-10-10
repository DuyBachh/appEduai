import {
    useState,
} from "react";

import AuthService from "../services/authService";

import {
    validateForgotPasswordForm,
} from "../utils/authValidation";

export default function useForgotPassword() {
    const [email, setEmailState] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const setEmail = (value) => {
        setEmailState(value);
        setError("");
    };

    const submit = async () => {
        const validation =
            validateForgotPasswordForm(
                email
            );

        if (validation.error) {
            setError(validation.error);
            return null;
        }

        try {
            setLoading(true);
            setError("");

            const result =
                await AuthService.forgotPassword(
                    validation.normalizedEmail
                );

            return {
                email:
                    validation.normalizedEmail,
                resetToken:
                    result.resetToken,
            };
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể gửi yêu cầu đặt lại mật khẩu."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        loading,
        error,
        setEmail,
        submit,
    };
}
