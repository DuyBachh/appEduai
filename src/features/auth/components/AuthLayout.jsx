import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";

import colors from "../../../styles/colors";

export default function AuthLayout({
    children,
}) {
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
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.background,
    },
    content:{
        flexGrow:1,
        justifyContent:"center",
        padding:20,
    },
});
