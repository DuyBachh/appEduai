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

export default function ResetPasswordScreen({ navigation, route }) {

    // ========================================
    // STATE
    // ========================================

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // Hiện / ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // ========================================
    // EMAIL TỪ FORGOT PASSWORD
    // ========================================

    const email = route?.params?.email || "";


    // ========================================
    // VALIDATE PASSWORD
    // ========================================

    const validatePassword = (password) => {
        return password.length >= 6;
    };


    // ========================================
    // HANDLE RESET PASSWORD
    // ========================================

    const handleResetPassword = () => {

        // Xóa lỗi cũ
        setError("");


        // ========================================
        // KIỂM TRA MẬT KHẨU MỚI
        // ========================================

        if (!newPassword.trim()) {
            setError("Vui lòng nhập mật khẩu mới");
            return;
        }


        // ========================================
        // KIỂM TRA ĐỘ DÀI MẬT KHẨU
        // ========================================

        if (!validatePassword(newPassword)) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }


        // ========================================
        // KIỂM TRA XÁC NHẬN MẬT KHẨU
        // ========================================

        if (!confirmPassword.trim()) {
            setError("Vui lòng xác nhận mật khẩu");
            return;
        }


        // ========================================
        // KIỂM TRA PASSWORD KHỚP
        // ========================================

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }


        // ========================================
        // BẮT ĐẦU LOADING
        // ========================================

        setLoading(true);


        // ========================================
        // MÔ PHỎNG RESET PASSWORD
        // ========================================

        setTimeout(() => {

            setLoading(false);

            Alert.alert(
                "Thành công",
                "Mật khẩu của bạn đã được đặt lại.",
                [
                    {
                        text: "Đăng nhập",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]
            );

        }, 1500);
    };


    // ========================================
    // RENDER
    // ========================================

    return (
        <View style={styles.container}>

            {/* ========================================
                TITLE
            ======================================== */}

            <Text style={styles.title}>
                Đặt lại mật khẩu
            </Text>


            {/* ========================================
                DESCRIPTION
            ======================================== */}

            <Text style={styles.subtitle}>
                Tạo mật khẩu mới cho tài khoản
            </Text>


            {/* ========================================
                EMAIL
            ======================================== */}

            {email !== "" && (
                <Text style={styles.emailText}>
                    {email}
                </Text>
            )}


            {/* ========================================
                NEW PASSWORD
            ======================================== */}

            <View style={styles.inputGroup}>

                <Text style={styles.label}>
                    Mật khẩu mới
                </Text>

                <View style={styles.passwordContainer}>

                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor={colors.gray}
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text);
                            setError("");
                        }}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
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
                        placeholder="Nhập lại mật khẩu mới"
                        placeholderTextColor={colors.gray}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError("");
                        }}
                        secureTextEntry={!showConfirmPassword}
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
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>


            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error !== "" && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}


            {/* ========================================
                RESET BUTTON
            ======================================== */}

            <TouchableOpacity
                style={[
                    styles.resetButton,
                    loading && styles.buttonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={loading}
            >

                {loading ? (

                    <ActivityIndicator
                        color={colors.white}
                    />

                ) : (

                    <Text style={styles.resetButtonText}>
                        Đặt lại mật khẩu
                    </Text>

                )}

            </TouchableOpacity>


            {/* ========================================
                BACK TO LOGIN
            ======================================== */}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
            >

                <Text style={styles.backText}>
                    Quay lại đăng nhập
                </Text>

            </TouchableOpacity>

        </View>
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
        justifyContent: "center",
        padding: 20,
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
    },


    // ========================================
    // EMAIL
    // ========================================

    emailText: {
        fontSize: 14,
        color: colors.primary,
        textAlign: "center",
        marginTop: 6,
        marginBottom: 32,
    },


    // ========================================
    // INPUT GROUP
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


    // ========================================
    // PASSWORD
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
    // ERROR
    // ========================================

    errorText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
        marginTop: -6,
        marginBottom: 12,
    },


    // ========================================
    // RESET BUTTON
    // ========================================

    resetButton: {
        height: 48,
        backgroundColor: colors.primary,
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


    // ========================================
    // BACK TO LOGIN
    // ========================================

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

