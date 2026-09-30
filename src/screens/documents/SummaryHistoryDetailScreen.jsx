import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import colors from "../../styles/colors";

export default function SummaryHistoryDetailScreen({
    navigation,
    route,
}) {
    const summaryItem = route.params?.summaryItem;

    if (!summaryItem) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Chi tiết tóm tắt
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>
                        Không tìm thấy bản tóm tắt
                    </Text>

                    <Text style={styles.emptyText}>
                        Dữ liệu bản tóm tắt không tồn tại.
                    </Text>
                </View>
            </View>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) {
            return "Không rõ thời gian";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Không rõ thời gian";
        }

        return date.toLocaleString("vi-VN");
    };

    const getLengthLabel = (length) => {
        switch (length) {
            case "short":
                return "Ngắn";

            case "medium":
                return "Vừa";

            case "detailed":
                return "Chi tiết";

            default:
                return "Không xác định";
        }
    };

    const getChapterLabel = (chapter) => {
        if (chapter === "all") {
            return "Toàn bộ tài liệu";
        }

        if (chapter === "chapter1") {
            return "Chapter 1";
        }

        return chapter || "Không xác định";
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Chi tiết tóm tắt
                </Text>

                <View style={styles.headerSpace} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.documentCard}>
                    <Text style={styles.documentIcon}>
                        📄
                    </Text>

                    <View style={styles.documentInfo}>
                        <Text
                            style={styles.documentName}
                            numberOfLines={3}
                        >
                            {summaryItem.documentName ||
                                "Tài liệu không tên"}
                        </Text>

                        <Text style={styles.date}>
                            {formatDate(
                                summaryItem.createdAt
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>
                            Độ dài
                        </Text>

                        <Text style={styles.infoValue}>
                            {getLengthLabel(
                                summaryItem.summaryLength
                            )}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>
                            Phạm vi
                        </Text>

                        <Text style={styles.infoValue}>
                            {getChapterLabel(
                                summaryItem.chapter
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>
                        Bản tóm tắt
                    </Text>

                    <View style={styles.summarySection}>
                        <Text style={styles.sectionTitle}>
                            Nội dung
                        </Text>

                        <Text style={styles.summaryText}>
                            {summaryItem.summary ||
                                "Không có nội dung tóm tắt."}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        height: 100,
        paddingTop: 45,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    backText: {
        fontSize: 36,
        color: colors.text,
        lineHeight: 40,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    headerSpace: {
        width: 40,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    documentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
    },

    documentIcon: {
        fontSize: 32,
        marginRight: 14,
    },

    documentInfo: {
        flex: 1,
    },

    documentName: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },

    date: {
        fontSize: 13,
        color: colors.gray,
    },

    infoContainer: {
        flexDirection: "row",
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
    },

    infoItem: {
        flex: 1,
    },

    infoLabel: {
        fontSize: 13,
        color: colors.gray,
        marginBottom: 5,
    },

    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },

    summaryContainer: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
    },

    summaryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 20,
    },

    summarySection: {
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 10,
    },

    summaryText: {
        fontSize: 15,
        lineHeight: 25,
        color: colors.text,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 15,
        color: colors.gray,
        textAlign: "center",
    },
});