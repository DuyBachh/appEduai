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
    Alert,
} from "react-native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function RegisterScreen({
    navigation,
}) {
    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
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

    const validateConfirmPassword = (
        confirmPasswordValue
    ) => {
        return (
            confirmPasswordValue ===
            password
        );
    };

    const handleRegister =
        async () => {
            setErrorMessage("");

            const normalizedName =
                name.trim();

            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();

            if (!normalizedName) {
                setErrorMessage(
                    "Vui lòng nhập tên"
                );

                return;
            }

            if (!normalizedEmail) {
                setErrorMessage(
                    "Vui lòng nhập email"
                );

                return;
            }

            if (
                !validateEmail(
                    normalizedEmail
                )
            ) {
                setErrorMessage(
                    "Email không hợp lệ"
                );

                return;
            }

            if (!password) {
                setErrorMessage(
                    "Vui lòng nhập mật khẩu"
                );

                return;
            }

            if (
                !validatePassword(
                    password
                )
            ) {
                setErrorMessage(
                    "Mật khẩu phải có ít nhất 6 ký tự"
                );

                return;
            }

            if (!confirmPassword) {
                setErrorMessage(
                    "Vui lòng xác nhận mật khẩu"
                );

                return;
            }

            if (
                !validateConfirmPassword(
                    confirmPassword
                )
            ) {
                setErrorMessage(
                    "Mật khẩu xác nhận không khớp"
                );

                return;
            }

            try {
                setLoading(true);

                const result =
                    await apiRequest(
                        "/auth/register",
                        {
                            method:
                                "POST",

                            skipAuth:
                                true,

                            body:
                                JSON.stringify(
                                    {
                                        name:
                                            normalizedName,
                                        email:
                                            normalizedEmail,
                                        password,
                                    }
                                ),
                        }
                    );

                console.log(
                    "REGISTER SUCCESS:",
                    result
                );

                Alert.alert(
                    "Đăng ký thành công",
                    result.message ||
                        "Tài khoản của bạn đã được tạo.",
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
                    "REGISTER ERROR:",
                    error.message
                );

                setErrorMessage(
                    error.message ||
                        "Đăng ký thất bại."
                );
            } finally {
                setLoading(false);
            }
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
                    Education Ai
                </Text>

                <Text
                    style={styles.title}
                >
                    Tạo tài khoản
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Bắt đầu học tập cùng
                    AI
                </Text>

                {errorMessage ? (
                    <View
                        style={
                            styles.errorBox
                        }
                    >
                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {
                                errorMessage
                            }
                        </Text>
                    </View>
                ) : null}

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
                        Tên
                    </Text>

                    <TextInput
                        style={
                            styles.input
                        }
                        placeholder="Nhập tên của bạn"
                        placeholderTextColor={
                            colors.gray
                        }
                        value={name}
                        onChangeText={(
                            text
                        ) => {
                            setName(
                                text
                            );

                            setErrorMessage(
                                ""
                            );
                        }}
                        autoCapitalize="words"
                        editable={
                            !loading
                        }
                    />
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

                            setErrorMessage(
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
                        style={
                            styles.passwordContainer
                        }
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

                                setErrorMessage(
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
                            placeholder="Nhập lại mật khẩu"
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

                                setErrorMessage(
                                    ""
                                );
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

                <TouchableOpacity
                    style={[
                        styles.registerButton,

                        loading &&
                            styles.buttonDisabled,
                    ]}
                    onPress={
                        handleRegister
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
                                styles.registerButtonText
                            }
                        >
                            Đăng ký
                        </Text>
                    )}
                </TouchableOpacity>

                <View
                    style={
                        styles.loginContainer
                    }
                >
                    <Text
                        style={
                            styles.loginText
                        }
                    >
                        Đã có tài khoản?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "Login"
                            )
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.loginLink
                            }
                        >
                            Đăng nhập
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

    errorBox: {
        backgroundColor:
            "#FEF2F2",
        borderWidth: 1,
        borderColor:
            colors.error,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },

    errorText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
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

    registerButton: {
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    registerButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },

    loginText: {
        fontSize: 14,
        color: colors.gray,
    },

    loginLink: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginLeft: 5,
    },
});