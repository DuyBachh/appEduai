import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import {
    formatSummaryDate,
    getSummaryTypeLabel,
} from "../utils/summaryUtils";

export default function SummaryHistoryCard({
    item,
    documentName,
    onOpen,
    onDelete,
}) {
    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.content}
                onPress={() =>
                    onOpen(item)
                }
                activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <View style={styles.iconBox}>
                        <Text style={styles.icon}>
                            📄
                        </Text>
                    </View>

                    <View style={styles.headerContent}>
                        <Text
                            style={styles.documentName}
                            numberOfLines={2}
                        >
                            {documentName}
                        </Text>

                        <Text style={styles.date}>
                            {formatSummaryDate(
                                item.createdAt
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {getSummaryTypeLabel(
                                item.type
                            )}
                        </Text>
                    </View>
                </View>

                <Text
                    style={styles.preview}
                    numberOfLines={4}
                >
                    {item.content ||
                        "Không có nội dung tóm tắt."}
                </Text>

                <Text style={styles.detailText}>
                    Xem đầy đủ →
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                    onDelete(item._id)
                }
            >
                <Text style={styles.deleteText}>
                    Xóa
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
    },
    headerContent: {
        flex: 1,
    },
    documentName: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: colors.gray,
    },
    infoRow: {
        flexDirection: "row",
        marginTop: 14,
    },
    badge: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.gray,
    },
    preview: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.text,
        marginTop: 14,
    },
    detailText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 14,
    },
    deleteButton: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 12,
        alignItems: "center",
    },
    deleteText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.error,
    },
});
