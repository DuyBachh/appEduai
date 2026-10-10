import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export function ChatLoadingState() {
    return (
        <View style={styles.center}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />
            <Text style={styles.loadingText}>
                Đang tải cuộc trò chuyện...
            </Text>
        </View>
    );
}

export function ChatEmptyState() {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
                🤖
            </Text>

            <Text style={styles.emptyTitle}>
                Hỏi AI về tài liệu
            </Text>

            <Text
                style={styles.emptyDescription}
            >
                Đặt câu hỏi về nội dung tài liệu. AI sẽ ghi nhớ ngữ cảnh của cuộc trò chuyện để xử lý các câu hỏi tiếp theo.
            </Text>
        </View>
    );
}

export function ChatThinkingState() {
    return (
        <View style={styles.aiRow}>
            <View style={styles.thinkingBubble}>
                <ActivityIndicator
                    size="small"
                    color={colors.primary}
                />

                <Text style={styles.thinkingText}>
                    AI đang suy nghĩ...
                </Text>
            </View>
        </View>
    );
}

export function ChatErrorState({
    message,
}) {
    if (!message) {
        return null;
    }

    return (
        <View style={styles.errorBox}>
            <Text style={styles.errorText}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.gray,
    },
    empty: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
        textAlign: "center",
    },
    emptyDescription: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
    },
    aiRow: {
        alignItems: "flex-start",
    },
    thinkingBubble: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    thinkingText: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.gray,
    },
    errorBox: {
        marginTop: 4,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#FEF2F2",
        borderRadius: 10,
    },
    errorText: {
        fontSize: 13,
        lineHeight: 18,
        color: colors.error,
    },
});
