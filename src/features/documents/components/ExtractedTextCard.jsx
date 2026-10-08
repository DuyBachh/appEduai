import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ExtractedTextCard({
    extractedText,
    displayedText,
    hasLongText,
    showFullText,
    onToggle,
}) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>
                        Nội dung tài liệu
                    </Text>

                    <Text style={styles.subtitle}>
                        Văn bản được trích xuất tự động
                    </Text>
                </View>

                {extractedText ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            Đã xử lý
                        </Text>
                    </View>
                ) : null}
            </View>

            {extractedText ? (
                <>
                    <View style={styles.textBox}>
                        <Text
                            style={styles.text}
                            selectable
                        >
                            {displayedText}
                        </Text>
                    </View>

                    {hasLongText ? (
                        <TouchableOpacity
                            style={styles.expandButton}
                            onPress={onToggle}
                        >
                            <Text
                                style={
                                    styles.expandText
                                }
                            >
                                {showFullText
                                    ? "Thu gọn"
                                    : "Xem toàn bộ nội dung"}
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </>
            ) : (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>
                        📝
                    </Text>

                    <Text style={styles.emptyTitle}>
                        Chưa có nội dung
                    </Text>

                    <Text
                        style={styles.emptyDescription}
                    >
                        Tài liệu này chưa có văn bản được trích xuất.
                    </Text>
                </View>
            )}
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
        marginBottom: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    subtitle: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 4,
    },
    badge: {
        backgroundColor: "#ECFDF5",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#059669",
    },
    textBox: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 14,
    },
    text: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
    },
    expandButton: {
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    expandText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary,
    },
    empty: {
        alignItems: "center",
        paddingVertical: 24,
    },
    emptyIcon: {
        fontSize: 30,
        marginBottom: 10,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },
    emptyDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        textAlign: "center",
    },
});
