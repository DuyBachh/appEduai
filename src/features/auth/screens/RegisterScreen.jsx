import React from "react";
import {
    Alert,
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
import useRegister from "../hooks/useRegister";

export default function RegisterScreen({
    navigation,
}) {
    const form = useRegister();

    const handleRegister =
        async () => {
            const result =
                await form.submit();

            if (!result) {
                return;
            }

            Alert.alert(
                "Đăng ký thành công",
                result.message ||
                    "Tài khoản của bạn đã được tạo.",
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
                logo="Education Ai"
                title="Tạo tài khoản"
                subtitle="Bắt đầu học tập cùng AI"
            />

            <AuthError
                message={form.error}
            />

            <AuthField
                label="Tên"
                value={form.name}
                onChangeText={form.setName}
                placeholder="Nhập tên của bạn"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!form.loading}
            />

            <AuthField
                label="Email"
                value={form.email}
                onChangeText={form.setEmail}
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                editable={!form.loading}
            />

            <PasswordField
                label="Mật khẩu"
                value={form.password}
                onChangeText={form.setPassword}
                placeholder="Nhập mật khẩu"
                editable={!form.loading}
            />

            <PasswordField
                label="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChangeText={
                    form.setConfirmPassword
                }
                placeholder="Nhập lại mật khẩu"
                editable={!form.loading}
            />

            <AuthButton
                label="Đăng ký"
                loading={form.loading}
                onPress={handleRegister}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Đã có tài khoản?
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Login")
                    }
                    disabled={form.loading}
                >
                    <Text style={styles.footerLink}>
                        Đăng nhập
                    </Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}

const styles=StyleSheet.create({
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
