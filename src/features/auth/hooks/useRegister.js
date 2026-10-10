import {
    useState,
} from "react";

import AuthService from "../services/authService";

import {
    validateRegisterForm,
} from "../utils/authValidation";

export default function useRegister() {
    const [name, setNameState] =
        useState("");

    const [email, setEmailState] =
        useState("");

    const [
        password,
        setPasswordState,
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

    const setName = (value) => {
        setNameState(value);
        clearError();
    };

    const setEmail = (value) => {
        setEmailState(value);
        clearError();
    };

    const setPassword = (value) => {
        setPasswordState(value);
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
            validateRegisterForm({
                name,
                email,
                password,
                confirmPassword,
            });

        if (validation.error) {
            setError(validation.error);
            return null;
        }

        try {
            setLoading(true);
            setError("");

            return await AuthService.register({
                name:
                    validation.normalizedName,
                email:
                    validation.normalizedEmail,
                password,
            });
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Đăng ký thất bại."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        email,
        password,
        confirmPassword,
        loading,
        error,
        setName,
        setEmail,
        setPassword,
        setConfirmPassword,
        submit,
    };
}
