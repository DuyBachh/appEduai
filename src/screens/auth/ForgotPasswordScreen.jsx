import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function ForgotPasswordScreen({
    navigation,
}) {
    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const validateEmail = (
        emailValue
    ) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            emailValue
        );
    };

    const handleSend =
        async () => {
            setError("");

            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();

            if (!normalizedEmail) {
                setError(
                    "Vui lòng nhập email"
                );

                return;
            }

            if (
                !validateEmail(
                    normalizedEmail
                )
            ) {
                setError(
                    "Email không hợp lệ"
                );

                return;
            }

            try {
                setLoading(true);

                const result =
                    await apiRequest(
                        "/auth/forgot-password",
                        {
                            method:
                                "POST",

                            skipAuth:
                                true,

                            body:
                                JSON.stringify(
                                    {
                                        email:
                                            normalizedEmail,
                                    }
                                ),
                        }
                    );

                console.log(
                    "FORGOT PASSWORD SUCCESS:",
                    {
                        success:
                            result.success,
                        message:
                            result.message,
                    }
                );

                const resetToken =
                    result?.data
                        ?.resetToken;

                if (!resetToken) {
                    throw new Error(
                        "Backend không trả về reset token."
                    );
                }

                navigation.navigate(
                    "ResetPassword",
                    {
                        email:
                            normalizedEmail,
                        resetToken,
                    }
                );
            } catch (error) {
                console.log(
                    "FORGOT PASSWORD ERROR:",
                    error.message
                );

                setError(
                    error.message ||
                        "Không thể gửi yêu cầu đặt lại mật khẩu."
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
                Quên mật khẩu?
            </Text>

            <Text
                style={
                    styles.subtitle
                }
            >
                Nhập email của bạn
                để tiếp tục đặt lại
                mật khẩu.
            </Text>

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
                    Email
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        error &&
                            styles.inputError,
                    ]}
                    placeholder="Nhập email của bạn"
                    placeholderTextColor={
                        colors.gray
                    }
                    value={email}
                    onChangeText={(
                        text
                    ) => {
                        setEmail(
                            text
                        );

                        setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={
                        false
                    }
                    editable={
                        !loading
                    }
                />

                {error !== "" && (
                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        {error}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.sendButton,
                    loading &&
                        styles.buttonDisabled,
                ]}
                onPress={
                    handleSend
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
                            styles.sendButtonText
                        }
                    >
                        Tiếp tục
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

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                colors.background,
            justifyContent:
                "center",
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

        input: {
            height: 48,
            backgroundColor:
                colors.white,
            borderWidth: 1,
            borderColor:
                colors.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            fontSize: 16,
            color: colors.text,
        },

        inputError: {
            borderColor:
                colors.error,
        },

        errorText: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.error,
            marginTop: 6,
        },

        sendButton: {
            height: 48,
            backgroundColor:
                colors.primary,
            borderRadius: 10,
            alignItems: "center",
            justifyContent:
                "center",
            marginTop: 4,
        },

        buttonDisabled: {
            opacity: 0.7,
        },

        sendButtonText: {
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