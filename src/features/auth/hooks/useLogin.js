import {
    useState,
} from "react";

import {
    saveToken,
} from "../../../services/tokenStorage";

import AuthService from "../services/authService";

import {
    validateLoginForm,
} from "../utils/authValidation";

export default function useLogin(
    onLogin
) {
    const [email, setEmailState] =
        useState("");

    const [
        password,
        setPasswordState,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const setEmail = (value) => {
        setEmailState(value);
        setError("");
    };

    const setPassword = (value) => {
        setPasswordState(value);
        setError("");
    };

    const submit = async () => {
        const validation =
            validateLoginForm({
                email,
                password,
            });

        if (validation.error) {
            setError(validation.error);
            return false;
        }

        try {
            setLoading(true);
            setError("");

            const result =
                await AuthService.login({
                    email:
                        validation.normalizedEmail,
                    password,
                });

            await saveToken(
                result.token
            );

            onLogin?.(result.user);

            return true;
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Đăng nhập thất bại."
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        password,
        loading,
        error,
        setEmail,
        setPassword,
        submit,
    };
}
