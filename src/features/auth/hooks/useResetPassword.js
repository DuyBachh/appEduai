import {
    useState,
} from "react";

import AuthService from "../services/authService";

import {
    validateResetPasswordForm,
} from "../utils/authValidation";

export default function useResetPassword(
    resetToken
) {
    const [
        newPassword,
        setNewPasswordState,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPasswordState,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const clearError = () => {
        if (error) {
            setError("");
        }
    };

    const setNewPassword = (
        value
    ) => {
        setNewPasswordState(value);
        clearError();
    };

    const setConfirmPassword = (
        value
    ) => {
        setConfirmPasswordState(
            value
        );
        clearError();
    };

    const submit = async () => {
        const validation =
            validateResetPasswordForm({
                resetToken,
                newPassword,
                confirmPassword,
            });

        if (validation.error) {
            setError(validation.error);
            return null;
        }

        try {
            setLoading(true);
            setError("");

            return await AuthService.resetPassword({
                token: resetToken,
                newPassword,
            });
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể đặt lại mật khẩu."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        newPassword,
        confirmPassword,
        loading,
        error,
        setNewPassword,
        setConfirmPassword,
        submit,
    };
}
