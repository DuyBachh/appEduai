import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import AuthButton from "../components/AuthButton";
import AuthError from "../components/AuthError";
import AuthField from "../components/AuthField";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import useLogin from "../hooks/useLogin";
import {
    validateEmail,
    validatePassword,
} from "../utils/authValidation";

export default function LoginScreen({
    navigation,
    onLogin,
}) {
    const form = useLogin(onLogin);

    const emailError =
        form.email &&
        !validateEmail(form.email.trim())
            ? "Email không hợp lệ"
            : "";

    const passwordError =
        form.password &&
        !validatePassword(form.password)
            ? "Mật khẩu phải có ít nhất 6 ký tự"
            : "";

    return (
        <AuthLayout>
            <AuthHeader
                logo="appEduai"
                title="Đăng nhập"
                subtitle="Đăng nhập để tiếp tục học tập cùng AI"
            />

            <AuthField
                label="Email"
                value={form.email}
                onChangeText={form.setEmail}
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                editable={!form.loading}
                error={emailError}
            />

            <PasswordField
                label="Mật khẩu"
                value={form.password}
                onChangeText={form.setPassword}
                placeholder="Nhập mật khẩu"
                editable={!form.loading}
                error={passwordError}
            />

            <TouchableOpacity
                style={styles.forgotButton}
                onPress={() =>
                    navigation.navigate("ForgotPassword")
                }
                disabled={form.loading}
            >
                <Text style={styles.forgotText}>
                    Quên mật khẩu?
                </Text>
            </TouchableOpacity>

            <AuthError message={form.error} />

            <AuthButton
                label="Đăng nhập"
                loading={form.loading}
                onPress={form.submit}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Chưa có tài khoản?
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Register")
                    }
                    disabled={form.loading}
                >
                    <Text style={styles.footerLink}>
                        Đăng ký
                    </Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}

const styles=StyleSheet.create({
    forgotButton:{
        alignSelf:"flex-end",
        marginTop:-4,
        marginBottom:16,
    },
    forgotText:{
        fontSize:14,
        fontWeight:"600",
        color:colors.primary,
    },
    footer:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:24,
    },
    footerText:{
        fontSize:14,
        color:colors.gray,
    },
    footerLink:{
        fontSize:14,
        fontWeight:"600",
        color:colors.primary,
        marginLeft:5,
    },
});
