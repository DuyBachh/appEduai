import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import colors from "../../../styles/colors";
import AuthButton from "../components/AuthButton";
import AuthField from "../components/AuthField";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";
import useForgotPassword from "../hooks/useForgotPassword";

export default function ForgotPasswordScreen({
    navigation,
}) {
    const form = useForgotPassword();

    const handleContinue =
        async () => {
            const result =
                await form.submit();

            if (!result) {
                return;
            }

            navigation.navigate(
                "ResetPassword",
                {
                    email: result.email,
                    resetToken:
                        result.resetToken,
                }
            );
        };

    return (
        <AuthLayout>
            <AuthHeader
                title="Quên mật khẩu?"
                subtitle="Nhập email của bạn để tiếp tục đặt lại mật khẩu."
            />

            <AuthField
                label="Email"
                value={form.email}
                onChangeText={form.setEmail}
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                editable={!form.loading}
                error={form.error}
            />

            <AuthButton
                label="Tiếp tục"
                loading={form.loading}
                onPress={handleContinue}
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
