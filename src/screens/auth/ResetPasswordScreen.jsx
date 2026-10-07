import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function ResetPasswordScreen({
    navigation,
    route,
}) {
    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const email =
        route?.params?.email || "";

    const resetToken =
        route?.params?.resetToken || "";

    const validatePassword = (
        password
    ) => {
        return password.length >= 6;
    };

    const handleResetPassword =
        async () => {
            setError("");

            if (!resetToken) {
                setError(
                    "Yêu cầu đặt lại mật khẩu không hợp lệ."
                );

                return;
            }

            if (
                !newPassword.trim()
            ) {
                setError(
                    "Vui lòng nhập mật khẩu mới"
                );

                return;
            }

            if (
                !validatePassword(
                    newPassword
                )
            ) {
                setError(
                    "Mật khẩu phải có ít nhất 6 ký tự"
                );

                return;
            }

            if (
                !confirmPassword.trim()
            ) {
                setError(
                    "Vui lòng xác nhận mật khẩu"
                );

                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "Mật khẩu xác nhận không khớp"
                );

                return;
            }

            try {
                setLoading(true);

                const result =
                    await apiRequest(
                        "/auth/reset-password",
                        {
                            method:
                                "POST",

                            skipAuth:
                                true,

                            body:
                                JSON.stringify(
                                    {
                                        token:
                                            resetToken,

                                        newPassword,
                                    }
                                ),
                        }
                    );

                console.log(
                    "RESET PASSWORD SUCCESS:",
                    {
                        success:
                            result.success,
                        message:
                            result.message,
                    }
                );

                Alert.alert(
                    "Thành công",
                    result.message ||
                        "Mật khẩu của bạn đã được đặt lại.",
                    [
                        {
                            text:
                                "Đăng nhập",

                            onPress:
                                () =>
                                    navigation.replace(
                                        "Login"
                                    ),
                        },
                    ]
                );
            } catch (error) {
                console.log(
                    "RESET PASSWORD ERROR:",
                    error.message
                );

                setError(
                    error.message ||
                        "Không thể đặt lại mật khẩu."
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <View
            style={
                styles.container
            }
        >
            <Text
                style={styles.title}
            >
                Đặt lại mật khẩu
            </Text>

            <Text
                style={
                    styles.subtitle
                }
            >
                Tạo mật khẩu mới
                cho tài khoản
            </Text>

            {email !== "" && (
                <Text
                    style={
                        styles.emailText
                    }
                >
                    {email}
                </Text>
            )}

            <View
                style={
                    styles.inputGroup
                }
            >
                <Text
                    style={
                        styles.label
                    }
                >
                    Mật khẩu mới
                </Text>

                <View
                    style={
                        styles.passwordContainer
                    }
                >
                    <TextInput
                        style={
                            styles.passwordInput
                        }
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor={
                            colors.gray
                        }
                        value={
                            newPassword
                        }
                        onChangeText={(
                            text
                        ) => {
                            setNewPassword(
                                text
                            );

                            setError("");
                        }}
                        secureTextEntry={
                            !showPassword
                        }
                        autoCapitalize="none"
                        autoCorrect={
                            false
                        }
                        editable={
                            !loading
                        }
                    />

                    <TouchableOpacity
                        style={
                            styles.eyeButton
                        }
                        onPress={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.eyeIcon
                            }
                        >
                            {showPassword
                                ? "🙈"
                                : "👁️"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={
                    styles.inputGroup
                }
            >
                <Text
                    style={
                        styles.label
                    }
                >
                    Xác nhận mật khẩu
                </Text>

                <View
                    style={
                        styles.passwordContainer
                    }
                >
                    <TextInput
                        style={
                            styles.passwordInput
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        placeholderTextColor={
                            colors.gray
                        }
                        value={
                            confirmPassword
                        }
                        onChangeText={(
                            text
                        ) => {
                            setConfirmPassword(
                                text
                            );

                            setError("");
                        }}
                        secureTextEntry={
                            !showConfirmPassword
                        }
                        autoCapitalize="none"
                        autoCorrect={
                            false
                        }
                        editable={
                            !loading
                        }
                    />

                    <TouchableOpacity
                        style={
                            styles.eyeButton
                        }
                        onPress={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.eyeIcon
                            }
                        >
                            {showConfirmPassword
                                ? "🙈"
                                : "👁️"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error !== "" && (
                <Text
                    style={
                        styles.errorText
                    }
                >
                    {error}
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.resetButton,

                    loading &&
                        styles.buttonDisabled,
                ]}
                onPress={
                    handleResetPassword
                }
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator
                        color={
                            colors.white
                        }
                    />
                ) : (
                    <Text
                        style={
                            styles.resetButtonText
                        }
                    >
                        Đặt lại mật khẩu
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={
                    styles.backButton
                }
                onPress={() =>
                    navigation.navigate(
                        "Login"
                    )
                }
                disabled={loading}
            >
                <Text
                    style={
                        styles.backText
                    }
                >
                    Quay lại đăng nhập
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
        justifyContent: "center",
        padding: 20,
    },

    title: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.gray,
        textAlign: "center",
        marginTop: 8,
    },

    emailText: {
        fontSize: 14,
        color: colors.primary,
        textAlign: "center",
        marginTop: 6,
        marginBottom: 32,
    },

    inputGroup: {
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },

    passwordContainer: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:
            colors.white,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 10,
    },

    passwordInput: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 14,
        fontSize: 16,
        color: colors.text,
    },

    eyeButton: {
        height: "100%",
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    eyeIcon: {
        fontSize: 20,
    },

    errorText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
        marginTop: -6,
        marginBottom: 12,
    },

    resetButton: {
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    resetButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    backButton: {
        alignItems: "center",
        marginTop: 24,
    },

    backText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
    },
});