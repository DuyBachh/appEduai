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

export default function LoginScreen({ navigation, onLogin }) {
    // ========================================
    // STATE
    // ========================================

    // Lưu email
    const [email, setEmail] = useState("");

    // Lưu password
    const [password, setPassword] = useState("");

    // Trạng thái loading
    const [loading, setLoading] = useState(false);

    // Lưu lỗi đăng nhập
    const [loginError, setLoginError] = useState("");

    // Hiện thị mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // ========================================
    // VALIDATE EMAIL
    // ========================================

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ========================================
    // VALIDATE PASSWORD
    // ========================================

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // ========================================
    // HANDLE LOGIN
    // ========================================

    const handleLogin = () => {
        // Xóa lỗi cũ
        setLoginError("");

        // Kiểm tra email rỗng
        if (!email.trim()) {
            setLoginError("Vui lòng nhập email");
            return;
        }

        // Kiểm tra email hợp lệ
        if (!validateEmail(email)) {
            setLoginError("Email không hợp lệ");
            return;
        }

        // Kiểm tra password rỗng
        if (!password) {
            setLoginError("Vui lòng nhập mật khẩu");
            return;
        }

        // Kiểm tra password
        if (!validatePassword(password)) {
            setLoginError(
                "Mật khẩu phải có ít nhất 6 ký tự"
            );
            return;
        }

        // ========================================
        // BẮT ĐẦU LOGIN
        // ========================================

        setLoading(true);

        // Mô phỏng gọi API Backend
        setTimeout(() => {
            setLoading(false);

            // ========================================
            // TÀI KHOẢN DEMO
            // ========================================

            if (
                email.trim().toLowerCase() === "test@gmail.com" &&
                password === "123456"
            ) {
                
                onLogin();
                        
            } else {
                setLoginError(
                    "Email hoặc mật khẩu không chính xác"
                );
            }
        }, 2000);
    };

    // ========================================
    // FORGOT PASSWORD
    // ========================================

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword");
    };

    // ========================================
    // UI
    // ========================================

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
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* ========================================
                    LOGO
                ======================================== */}

                <Text style={styles.logo}>
                    appEduai
                </Text>

                {/* ========================================
                    TITLE
                ======================================== */}

                <Text style={styles.title}>
                    Đăng nhập
                </Text>

                <Text style={styles.subtitle}>
                    Đăng nhập để tiếp tục học tập cùng AI
                </Text>

                {/* ========================================
                    EMAIL
                ======================================== */}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Email
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            email &&
                                !validateEmail(email) &&
                                styles.inputError,
                        ]}
                        placeholder="Nhập email của bạn"
                        placeholderTextColor={colors.gray}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setLoginError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {email && !validateEmail(email) && (
                        <Text style={styles.errorText}>
                            Email không hợp lệ
                        </Text>
                    )}
                </View>


                {/* ========================================
                    PASSWORD
                ======================================== */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Mật khẩu
                    </Text>

                    <View
                        style={[
                            styles.passwordContainer,
                            password &&
                                !validatePassword(password) &&
                                styles.inputError,
                        ]}
                    >
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor={colors.gray}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setLoginError("");
                            }}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() =>
                                setShowPassword(!showPassword)
                            }
                            disabled={loading}
                        >
                            <Text style={styles.eyeIcon}>
                                {showPassword ? "🙈" : "👁️"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {password &&
                        !validatePassword(password) && (
                            <Text style={styles.errorText}>
                                Mật khẩu phải có ít nhất 6 ký tự
                            </Text>
                        )}
                </View>



                {/* ========================================
                    FORGOT PASSWORD
                ======================================== */}

                <TouchableOpacity
                    style={styles.forgotContainer}
                    onPress={handleForgotPassword}
                    disabled={loading}
                >
                    <Text style={styles.forgotText}>
                        Quên mật khẩu?
                    </Text>
                </TouchableOpacity>

                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {loginError !== "" && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            {loginError}
                        </Text>
                    </View>
                )}

                {/* ========================================
                    LOGIN BUTTON
                ======================================== */}

                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        loading &&
                            styles.loginButtonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator
                            color={colors.white}
                        />
                    ) : (
                        <Text style={styles.loginButtonText}>
                            Đăng nhập
                        </Text>
                    )}
                </TouchableOpacity>

                {/* ========================================
                    REGISTER LINK
                ======================================== */}

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                        Chưa có tài khoản?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Register")
                        }
                        disabled={loading}
                    >
                        <Text style={styles.registerLink}>
                            Đăng ký
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ========================================
                    DEMO ACCOUNT
                ======================================== */}

                <View style={styles.demoContainer}>
                    <Text style={styles.demoTitle}>
                        Tài khoản Demo
                    </Text>

                    <Text style={styles.demoText}>
                        Email: test@gmail.com
                    </Text>

                    <Text style={styles.demoText}>
                        Mật khẩu: 123456
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    // ========================================
    // LOGO
    // ========================================

    logo: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 32,
    },

    // ========================================
    // TITLE
    // ========================================

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

    // ========================================
    // INPUT
    // ========================================

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
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        color: colors.text,
    },

    // ========================================
    // PASSWORD INPUT
    // ========================================

    passwordContainer: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
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
        borderColor: colors.error,
    },

    errorText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
        marginTop: 6,
    },

    // ========================================
    // FORGOT PASSWORD
    // ========================================

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

    // ========================================
    // ERROR CONTAINER
    // ========================================

    errorContainer: {
        marginBottom: 12,
    },

    // ========================================
    // LOGIN BUTTON
    // ========================================

    loginButton: {
        height: 48,
        backgroundColor: colors.primary,
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

    // ========================================
    // REGISTER
    // ========================================

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

    // ========================================
    // DEMO ACCOUNT
    // ========================================

    demoContainer: {
        marginTop: 28,
        padding: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
    },

    demoTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 4,
    },

    demoText: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
    },
});



