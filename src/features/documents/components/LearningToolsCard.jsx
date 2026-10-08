import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function LearningToolsCard({
    onSummary,
    onChat,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Công cụ học tập
            </Text>

            <TouchableOpacity
                style={styles.summaryButton}
                onPress={onSummary}
                activeOpacity={0.8}
            >
                <View style={styles.lightIconBox}>
                    <Text style={styles.icon}>
                        ✨
                    </Text>
                </View>

                <View style={styles.content}>
                    <Text
                        style={
                            styles.summaryTitle
                        }
                    >
                        AI Tóm tắt
                    </Text>

                    <Text
                        style={
                            styles.summaryDescription
                        }
                    >
                        Tạo bản tóm tắt thông minh từ tài liệu
                    </Text>
                </View>

                <Text style={styles.lightArrow}>
                    ›
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.chatButton}
                onPress={onChat}
                activeOpacity={0.8}
            >
                <View style={styles.chatIconBox}>
                    <Text style={styles.icon}>
                        💬
                    </Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.chatTitle}>
                        Chat với tài liệu
                    </Text>

                    <Text
                        style={
                            styles.chatDescription
                        }
                    >
                        Đặt câu hỏi dựa trên nội dung tài liệu
                    </Text>
                </View>

                <Text style={styles.darkArrow}>
                    ›
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 14,
    },
    summaryButton: {
        minHeight: 78,
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    chatButton: {
        minHeight: 78,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
    },
    lightIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor:
            "rgba(255,255,255,0.16)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    chatIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    icon: {
        fontSize: 22,
    },
    content: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 3,
    },
    summaryDescription: {
        fontSize: 12,
        lineHeight: 17,
        color: "#E0E7FF",
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 3,
    },
    chatDescription: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.gray,
    },
    lightArrow: {
        fontSize: 26,
        color: colors.white,
        marginLeft: 8,
    },
    darkArrow: {
        fontSize: 26,
        color: colors.gray,
        marginLeft: 8,
    },
});
