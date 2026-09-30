import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import colors from "../../styles/colors";

export default function DocumentDetailScreen({
    navigation,
    route,
}) {
    const document = route.params?.document;

    if (!document) {
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
                        Chi tiết tài liệu
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>
                        Không tìm thấy tài liệu
                    </Text>

                    <Text style={styles.emptyText}>
                        Dữ liệu tài liệu không tồn tại.
                    </Text>
                </View>
            </View>
        );
    }

    const handleSummary = () => {
        navigation.navigate("Summary", {
            document: document,
        });
    };

    const handleChat = () => {
        navigation.navigate("Chat", {
            document: document,
        });
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
                    Chi tiết tài liệu
                </Text>

                <View style={styles.headerSpace} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* File information */}
                <View style={styles.fileCard}>
                    <View style={styles.fileIconContainer}>
                        <Text style={styles.fileIcon}>
                            📄
                        </Text>
                    </View>

                    <Text style={styles.fileName}>
                        {document.name ||
                            "Tài liệu không tên"}
                    </Text>

                    <Text style={styles.fileDate}>
                        Ngày tải lên:{" "}
                        {document.date || "Không rõ"}
                    </Text>
                </View>

                {/* Document information */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>
                        Thông tin tài liệu
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Tên file
                        </Text>

                        <Text
                            style={styles.infoValue}
                            numberOfLines={2}
                        >
                            {document.name || "Không có"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Loại file
                        </Text>

                        <Text style={styles.infoValue}>
                            {document.name
                                ?.split(".")
                                .pop()
                                ?.toUpperCase() ||
                                "Không xác định"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Kích thước
                        </Text>

                        <Text style={styles.infoValue}>
                            {document.size
                                ? `${(
                                      document.size /
                                      1024
                                  ).toFixed(2)} KB`
                                : "Không xác định"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Môn học
                        </Text>

                        <Text style={styles.infoValue}>
                            {document.subject ||
                                "Chưa phân loại"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Chủ đề
                        </Text>

                        <Text style={styles.infoValue}>
                            {document.topic ||
                                "Chưa phân loại"}
                        </Text>
                    </View>
                </View>

                {/* Learning tools */}
                <View style={styles.actionCard}>
                    <Text style={styles.sectionTitle}>
                        Công cụ học tập
                    </Text>

                    {/* AI Summary */}
                    <TouchableOpacity
                        style={styles.summaryButton}
                        onPress={handleSummary}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.summaryIcon}>
                            🤖
                        </Text>

                        <View
                            style={
                                styles.summaryButtonContent
                            }
                        >
                            <Text
                                style={
                                    styles.summaryButtonTitle
                                }
                            >
                                AI Tóm tắt
                            </Text>

                            <Text
                                style={
                                    styles.summaryButtonDescription
                                }
                            >
                                Tạo bản tóm tắt thông minh từ
                                tài liệu
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            →
                        </Text>
                    </TouchableOpacity>

                    {/* AI Q&A */}
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={handleChat}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.chatIcon}>
                            💬
                        </Text>

                        <View
                            style={
                                styles.chatButtonContent
                            }
                        >
                            <Text
                                style={
                                    styles.chatButtonTitle
                                }
                            >
                                AI Q&A
                            </Text>

                            <Text
                                style={
                                    styles.chatButtonDescription
                                }
                            >
                                Đặt câu hỏi và trao đổi với AI
                                về tài liệu
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            →
                        </Text>
                    </TouchableOpacity>
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
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    fileCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },

    fileIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    fileIcon: {
        fontSize: 40,
    },

    fileName: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        marginBottom: 8,
    },

    fileDate: {
        fontSize: 14,
        color: colors.gray,
        textAlign: "center",
    },

    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 16,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    infoLabel: {
        width: 100,
        fontSize: 14,
        color: colors.gray,
    },

    infoValue: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        textAlign: "right",
    },

    actionCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
    },

    summaryButton: {
        minHeight: 78,
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    summaryIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    summaryButtonContent: {
        flex: 1,
    },

    summaryButtonTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 4,
    },

    summaryButtonDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: "#E0E7FF",
    },

    chatButton: {
        minHeight: 78,
        backgroundColor: "#111827",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
    },

    chatIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    chatButtonContent: {
        flex: 1,
    },

    chatButtonTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 4,
    },

    chatButtonDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: "#D1D5DB",
    },

    arrow: {
        fontSize: 24,
        color: colors.white,
        marginLeft: 10,
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