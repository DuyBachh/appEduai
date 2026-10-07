import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

import {
    saveToken,
} from "../../services/tokenStorage";

export default function LoginScreen({
    navigation,
    onLogin,
}) {
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loginError, setLoginError] =
        useState("");

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const validateEmail = (
        emailValue
    ) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            emailValue
        );
    };

    const validatePassword = (
        passwordValue
    ) => {
        return (
            passwordValue.length >= 6
        );
    };

    const handleLogin = async () => {
        setLoginError("");

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        if (!normalizedEmail) {
            setLoginError(
                "Vui lòng nhập email"
            );

            return;
        }

        if (
            !validateEmail(
                normalizedEmail
            )
        ) {
            setLoginError(
                "Email không hợp lệ"
            );

            return;
        }

        if (!password) {
            setLoginError(
                "Vui lòng nhập mật khẩu"
            );

            return;
        }

        if (
            !validatePassword(password)
        ) {
            setLoginError(
                "Mật khẩu phải có ít nhất 6 ký tự"
            );

            return;
        }

        try {
            setLoading(true);

            const result =
                await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",

                        skipAuth: true,

                        body:
                            JSON.stringify(
                                {
                                    email:
                                        normalizedEmail,
                                    password,
                                }
                            ),
                    }
                );

            const token =
                result?.data?.token;

            const user =
                result?.data?.user;

            if (!token) {
                throw new Error(
                    "Backend không trả về token."
                );
            }

            await saveToken(token);

            console.log(
                "LOGIN SUCCESS:",
                user
            );

            onLogin(user);
        } catch (error) {
            console.log(
                "LOGIN ERROR:",
                error.message
            );

            setLoginError(
                error.message ||
                    "Đăng nhập thất bại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword =
        () => {
            navigation.navigate(
                "ForgotPassword"
            );
        };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    style={styles.logo}
                >
                    appEduai
                </Text>

                <Text
                    style={styles.title}
                >
                    Đăng nhập
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Đăng nhập để tiếp
                    tục học tập cùng AI
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

                            email &&
                                !validateEmail(
                                    email
                                ) &&
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

                            setLoginError(
                                ""
                            );
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

                    {email &&
                        !validateEmail(
                            email
                        ) && (
                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                Email
                                không
                                hợp lệ
                            </Text>
                        )}
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
                        Mật khẩu
                    </Text>

                    <View
                        style={[
                            styles.passwordContainer,

                            password &&
                                !validatePassword(
                                    password
                                ) &&
                                styles.inputError,
                        ]}
                    >
                        <TextInput
                            style={
                                styles.passwordInput
                            }
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor={
                                colors.gray
                            }
                            value={
                                password
                            }
                            onChangeText={(
                                text
                            ) => {
                                setPassword(
                                    text
                                );

                                setLoginError(
                                    ""
                                );
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

                    {password &&
                        !validatePassword(
                            password
                        ) && (
                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                Mật khẩu
                                phải có ít
                                nhất 6 ký
                                tự
                            </Text>
                        )}
                </View>

                <TouchableOpacity
                    style={
                        styles.forgotContainer
                    }
                    onPress={
                        handleForgotPassword
                    }
                    disabled={loading}
                >
                    <Text
                        style={
                            styles.forgotText
                        }
                    >
                        Quên mật khẩu?
                    </Text>
                </TouchableOpacity>

                {loginError !==
                    "" && (
                    <View
                        style={
                            styles.errorContainer
                        }
                    >
                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {
                                loginError
                            }
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.loginButton,

                        loading &&
                            styles.loginButtonDisabled,
                    ]}
                    onPress={
                        handleLogin
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
                                styles.loginButtonText
                            }
                        >
                            Đăng nhập
                        </Text>
                    )}
                </TouchableOpacity>

                <View
                    style={
                        styles.registerContainer
                    }
                >
                    <Text
                        style={
                            styles.registerText
                        }
                    >
                        Chưa có tài
                        khoản?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "Register"
                            )
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.registerLink
                            }
                        >
                            Đăng ký
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    logo: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 32,
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

    forgotContainer: {
        alignSelf: "flex-end",
        marginTop: -4,
        marginBottom: 16,
    },

    forgotText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
    },

    errorContainer: {
        marginBottom: 12,
    },

    loginButton: {
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },

    loginButtonDisabled: {
        opacity: 0.7,
    },

    loginButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },

    registerText: {
        fontSize: 14,
        color: colors.gray,
    },

    registerLink: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginLeft: 5,
    },
});