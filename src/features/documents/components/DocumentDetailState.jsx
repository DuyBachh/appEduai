import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export function DocumentLoadingState() {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />

            <Text style={styles.loadingText}>
                Đang tải chi tiết tài liệu...
            </Text>
        </View>
    );
}

export function DocumentErrorState({
    message,
    onRetry,
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>
                📄
            </Text>

            <Text style={styles.title}>
                Không thể tải tài liệu
            </Text>

            <Text style={styles.message}>
                {message ||
                    "Dữ liệu tài liệu không tồn tại."}
            </Text>

            <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
            >
                <Text style={styles.retryText}>
                    Thử lại
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingBottom: 70,
    },
    loadingText: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 12,
    },
    icon: {
        fontSize: 42,
        marginBottom: 14,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.gray,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        height: 46,
        minWidth: 120,
        paddingHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    retryText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
    },
});
