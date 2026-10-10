import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import colors from "../../../styles/colors";
import AuthButton from "../components/AuthButton";
import AuthError from "../components/AuthError";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import useResetPassword from "../hooks/useResetPassword";

export default function ResetPasswordScreen({
    navigation,
    route,
}) {
    const email =
        route?.params?.email || "";

    const resetToken =
        route?.params?.resetToken || "";

    const form =
        useResetPassword(
            resetToken
        );

    const handleReset =
        async () => {
            const result =
                await form.submit();

            if (!result) {
                return;
            }

            Alert.alert(
                "Thành công",
                result.message ||
                    "Mật khẩu của bạn đã được đặt lại.",
                [
                    {
                        text: "Đăng nhập",
                        onPress: () =>
                            navigation.replace(
                                "Login"
                            ),
                    },
                ]
            );
        };

    return (
        <AuthLayout>
            <AuthHeader
                title="Đặt lại mật khẩu"
                subtitle="Tạo mật khẩu mới cho tài khoản"
                extra={email || undefined}
            />

            <PasswordField
                label="Mật khẩu mới"
                value={form.newPassword}
                onChangeText={
                    form.setNewPassword
                }
                placeholder="Nhập mật khẩu mới"
                editable={!form.loading}
            />

            <PasswordField
                label="Xác nhận mật khẩu"
                value={
                    form.confirmPassword
                }
                onChangeText={
                    form.setConfirmPassword
                }
                placeholder="Nhập lại mật khẩu mới"
                editable={!form.loading}
            />

            <AuthError
                message={form.error}
            />

            <AuthButton
                label="Đặt lại mật khẩu"
                loading={form.loading}
                onPress={handleReset}
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                    navigation.navigate("Login")
                }
                disabled={form.loading}
            >
                <Text style={styles.backText}>
                    Quay lại đăng nhập
                </Text>
            </TouchableOpacity>
        </AuthLayout>
    );
}

const styles=StyleSheet.create({
    backButton:{
        alignItems:"center",
        marginTop:24,
    },
    backText:{
        fontSize:14,
        fontWeight:"600",
        color:colors.primary,
    },
});
