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

export default function RegisterScreen({ navigation }) {

    // ========================================
    // STATE
    // ========================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // Error message
    const [errorMessage, setErrorMessage] = useState("");

    // Hiện / ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // ========================================
    // VALIDATION
    // ========================================

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateConfirmPassword = (confirmPassword) => {
        return confirmPassword === password;
    };


    // ========================================
    // REGISTER
    // ========================================

    const handleRegister = () => {

        // Xóa lỗi cũ
        setErrorMessage("");


        // ========================================
        // KIỂM TRA EMAIL
        // ========================================

        if (!email.trim()) {
            setErrorMessage("Vui lòng nhập email");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Email không hợp lệ");
            return;
        }


        // ========================================
        // KIỂM TRA PASSWORD
        // ========================================

        if (!password) {
            setErrorMessage("Vui lòng nhập mật khẩu");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage(
                "Mật khẩu phải có ít nhất 6 ký tự"
            );
            return;
        }


        // ========================================
        // KIỂM TRA CONFIRM PASSWORD
        // ========================================

        if (!confirmPassword) {
            setErrorMessage(
                "Vui lòng xác nhận mật khẩu"
            );
            return;
        }

        if (!validateConfirmPassword(confirmPassword)) {
            setErrorMessage(
                "Mật khẩu xác nhận không khớp"
            );
            return;
        }


        // ========================================
        // DỮ LIỆU HỢP LỆ
        // ========================================

        setErrorMessage("");


        // ========================================
        // BẮT ĐẦU LOADING
        // ========================================

        setLoading(true);


        // ========================================
        // GIẢ LẬP QUÁ TRÌNH ĐĂNG KÝ
        // ========================================

        setTimeout(() => {

            setLoading(false);

            Alert.alert(
                "Đăng ký thành công",
                "Tài khoản của bạn đã được tạo.",
                [
                    {
                        text: "Đăng nhập",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        }, 2000);
    };


    // ========================================
    // RENDER
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
                    Education Ai
                </Text>


                {/* ========================================
                    TITLE
                ======================================== */}

                <Text style={styles.title}>
                    Tạo tài khoản
                </Text>

                <Text style={styles.subtitle}>
                    Bắt đầu học tập cùng AI
                </Text>


                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {errorMessage ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            {errorMessage}
                        </Text>
                    </View>
                ) : null}


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
                            setErrorMessage("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />

                </View>


                {/* ========================================
                    PASSWORD
                ======================================== */}

                <View style={styles.inputGroup}>

                    <Text style={styles.label}>
                        Mật khẩu
                    </Text>

                    <View style={styles.passwordContainer}>

                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor={colors.gray}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErrorMessage("");
                            }}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />

                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            disabled={loading}
                        >

                            <Text style={styles.eyeIcon}>
                                {showPassword
                                    ? "🙈"
                                    : "👁️"}
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* ========================================
                    CONFIRM PASSWORD
                ======================================== */}

                <View style={styles.inputGroup}>

                    <Text style={styles.label}>
                        Xác nhận mật khẩu
                    </Text>

                    <View style={styles.passwordContainer}>

                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor={colors.gray}
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrorMessage("");
                            }}
                            secureTextEntry={
                                !showConfirmPassword
                            }
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />

                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            disabled={loading}
                        >

                            <Text style={styles.eyeIcon}>
                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* ========================================
                    REGISTER BUTTON
                ======================================== */}

                <TouchableOpacity
                    style={[
                        styles.registerButton,
                        loading &&
                            styles.buttonDisabled,
                    ]}
                    onPress={handleRegister}
                    disabled={loading}
                >

                    {loading ? (

                        <ActivityIndicator
                            color={colors.white}
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


                {/* ========================================
                    LOGIN LINK
                ======================================== */}

                <View style={styles.loginContainer}>

                    <Text style={styles.loginText}>
                        Đã có tài khoản?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Login")
                        }
                        disabled={loading}
                    >

                        <Text style={styles.loginLink}>
                            Đăng nhập
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
}


// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

    // ========================================
    // CONTAINER
    // ========================================

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
    // ERROR
    // ========================================

    errorBox: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },


    errorText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
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


    inputError: {
        borderColor: colors.error,
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


    // ========================================
    // REGISTER BUTTON
    // ========================================

    registerButton: {
        height: 48,
        backgroundColor: colors.primary,
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


    // ========================================
    // LOGIN
    // ========================================

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

