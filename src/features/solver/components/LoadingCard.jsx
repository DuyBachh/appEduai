import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function LoadingCard() {
    return (
        <View style={styles.card}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />

            <Text style={styles.title}>
                AI đang phân tích bài tập
            </Text>

            <Text style={styles.description}>
                Bài phức tạp có thể cần thêm thời gian xử lý.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    description: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        textAlign: "center",
    },
});
