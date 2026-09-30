import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../styles/colors";

const SUMMARY_HISTORY_KEY = "summary_history";

export default function SummaryScreen({
    navigation,
    route,
}) {
    const document = route.params?.document;

    const [summaryLength, setSummaryLength] =
        useState("medium");

    const [selectedChapter, setSelectedChapter] =
        useState("all");

    const [summary, setSummary] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const [isSaved, setIsSaved] = useState(false);

    const handleCreateSummary = () => {
        setIsLoading(true);
        setError("");
        setIsSaved(false);

        setTimeout(() => {
            try {
                let generatedSummary = "";

                if (summaryLength === "short") {
                    generatedSummary = `
Nội dung chính:
Tài liệu trình bày các kiến thức và khái niệm quan trọng liên quan đến chủ đề đang học.

Ý chính:
• Khái niệm và nội dung cơ bản.
• Các thành phần quan trọng.
• Cách áp dụng kiến thức vào thực tế.

Kết luận:
Nắm được các kiến thức cốt lõi sẽ giúp người học hiểu và áp dụng tốt nội dung của tài liệu.
                    `.trim();
                }

                if (summaryLength === "medium") {
                    generatedSummary = `
Nội dung chính:
Tài liệu cung cấp những kiến thức nền tảng và các nội dung quan trọng của chủ đề. Các khái niệm được trình bày theo từng phần nhằm giúp người học dễ dàng tiếp cận và ghi nhớ.

Ý chính:
• Tìm hiểu các khái niệm cơ bản của chủ đề.
• Phân tích các thành phần và đặc điểm quan trọng.
• Hiểu mối quan hệ giữa các nội dung trong tài liệu.
• Áp dụng kiến thức vào các bài tập hoặc tình huống thực tế.

Kết luận:
Tài liệu giúp người học xây dựng nền tảng kiến thức và có thể sử dụng các nội dung đã học để giải quyết những vấn đề liên quan.
                    `.trim();
                }

                if (summaryLength === "detailed") {
                    generatedSummary = `
Nội dung chính:
Tài liệu trình bày tương đối đầy đủ các kiến thức liên quan đến chủ đề, bắt đầu từ những khái niệm cơ bản và mở rộng sang các nội dung chuyên sâu hơn. Các phần kiến thức có mối liên hệ với nhau và được sử dụng để hình thành nền tảng cho việc học tập.

Ý chính:

1. Kiến thức nền tảng
• Giải thích các khái niệm quan trọng.
• Xác định vai trò của từng thành phần.
• Làm rõ các thuật ngữ cần ghi nhớ.

2. Nội dung trọng tâm
• Phân tích các thành phần chính.
• Giải thích cách các thành phần hoạt động.
• Trình bày các đặc điểm và trường hợp sử dụng.

3. Ứng dụng
• Sử dụng kiến thức để giải quyết bài tập.
• Áp dụng vào các tình huống thực tế.
• Kết hợp nhiều nội dung để giải quyết vấn đề.

Kết luận:
Người học nên tập trung vào các khái niệm nền tảng, mối quan hệ giữa các thành phần và cách áp dụng kiến thức vào thực tế.
                    `.trim();
                }

                setSummary(generatedSummary);
            } catch (err) {
                console.log(
                    "Create summary error:",
                    err
                );

                setError(
                    "Không thể tạo bản tóm tắt."
                );
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    const handleSaveSummary = async () => {
        if (!summary.trim()) {
            Alert.alert(
                "Chưa có bản tóm tắt",
                "Vui lòng tạo bản tóm tắt trước khi lưu."
            );

            return;
        }

        try {
            const storedHistory =
                await AsyncStorage.getItem(
                    SUMMARY_HISTORY_KEY
                );

            let history = [];

            if (storedHistory) {
                const parsedHistory =
                    JSON.parse(storedHistory);

                if (Array.isArray(parsedHistory)) {
                    history = parsedHistory;
                }
            }

            const newSummary = {
                id: Date.now().toString(),

                // Quan trọng:
                // lưu ID của tài liệu để sau này lọc lịch sử
                documentId: document?.id || null,

                documentName:
                    document?.name ||
                    "Tài liệu không tên",

                summaryLength,

                chapter: selectedChapter,

                summary: summary.trim(),

                createdAt:
                    new Date().toISOString(),
            };

            const updatedHistory = [
                newSummary,
                ...history,
            ];

            await AsyncStorage.setItem(
                SUMMARY_HISTORY_KEY,
                JSON.stringify(updatedHistory)
            );

            setIsSaved(true);

            Alert.alert(
                "Đã lưu",
                "Bản tóm tắt đã được lưu vào lịch sử."
            );
        } catch (err) {
            console.log(
                "Save summary error:",
                err
            );

            Alert.alert(
                "Lỗi",
                "Không thể lưu bản tóm tắt."
            );
        }
    };

    const handleOpenHistory = () => {
        navigation.navigate("SummaryHistory", {
            documentId: document?.id || null,
            documentName:
                document?.name ||
                "Tài liệu không tên",
        });
    };

    const getLengthButtonStyle = (length) => {
        if (summaryLength === length) {
            return [
                styles.lengthButton,
                styles.lengthButtonActive,
            ];
        }

        return styles.lengthButton;
    };

    const getLengthTextStyle = (length) => {
        if (summaryLength === length) {
            return [
                styles.lengthButtonText,
                styles.lengthButtonTextActive,
            ];
        }

        return styles.lengthButtonText;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>
                        ‹
                    </Text>
                </TouchableOpacity>

                <Text
                    style={styles.headerTitle}
                    numberOfLines={1}
                >
                    AI Tóm tắt
                </Text>

                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={handleOpenHistory}
                >
                    <Text style={styles.historyButtonText}>
                        Lịch sử
                    </Text>
                </TouchableOpacity>
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
                            numberOfLines={2}
                        >
                            {document?.name ||
                                "Tài liệu không tên"}
                        </Text>

                        <Text style={styles.documentId}>
                            ID:{" "}
                            {document?.id ||
                                "Không xác định"}
                        </Text>
                    </View>
                </View>

                <View style={styles.optionCard}>
                    <Text style={styles.sectionTitle}>
                        Độ dài bản tóm tắt
                    </Text>

                    <View style={styles.lengthContainer}>
                        <TouchableOpacity
                            style={getLengthButtonStyle(
                                "short"
                            )}
                            onPress={() =>
                                setSummaryLength(
                                    "short"
                                )
                            }
                        >
                            <Text
                                style={getLengthTextStyle(
                                    "short"
                                )}
                            >
                                Ngắn
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={getLengthButtonStyle(
                                "medium"
                            )}
                            onPress={() =>
                                setSummaryLength(
                                    "medium"
                                )
                            }
                        >
                            <Text
                                style={getLengthTextStyle(
                                    "medium"
                                )}
                            >
                                Vừa
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={getLengthButtonStyle(
                                "detailed"
                            )}
                            onPress={() =>
                                setSummaryLength(
                                    "detailed"
                                )
                            }
                        >
                            <Text
                                style={getLengthTextStyle(
                                    "detailed"
                                )}
                            >
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>
                        Phạm vi
                    </Text>

                    <View style={styles.chapterContainer}>
                        <TouchableOpacity
                            style={
                                selectedChapter ===
                                "all"
                                    ? styles.chapterButtonActive
                                    : styles.chapterButton
                            }
                            onPress={() =>
                                setSelectedChapter(
                                    "all"
                                )
                            }
                        >
                            <Text
                                style={
                                    selectedChapter ===
                                    "all"
                                        ? styles.chapterTextActive
                                        : styles.chapterText
                                }
                            >
                                Toàn bộ tài liệu
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                selectedChapter ===
                                "chapter1"
                                    ? styles.chapterButtonActive
                                    : styles.chapterButton
                            }
                            onPress={() =>
                                setSelectedChapter(
                                    "chapter1"
                                )
                            }
                        >
                            <Text
                                style={
                                    selectedChapter ===
                                    "chapter1"
                                        ? styles.chapterTextActive
                                        : styles.chapterText
                                }
                            >
                                Chapter 1
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreateSummary}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={
                                styles.createButtonText
                            }
                        >
                            {isLoading
                                ? "Đang tạo..."
                                : "✨ Tạo bản tóm tắt"}
                        </Text>
                    </TouchableOpacity>

                    {error ? (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    ) : null}
                </View>

                {summary ? (
                    <View style={styles.summaryCard}>
                        <View
                            style={
                                styles.summaryHeader
                            }
                        >
                            <Text
                                style={
                                    styles.summaryTitle
                                }
                            >
                                Bản tóm tắt
                            </Text>

                            <View
                                style={
                                    styles.summaryBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.summaryBadgeText
                                    }
                                >
                                    {summaryLength ===
                                    "short"
                                        ? "Ngắn"
                                        : summaryLength ===
                                          "medium"
                                        ? "Vừa"
                                        : "Chi tiết"}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={
                                styles.summaryContent
                            }
                        >
                            <Text
                                style={
                                    styles.summaryText
                                }
                            >
                                {summary}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={
                                isSaved
                                    ? styles.savedButton
                                    : styles.saveButton
                            }
                            onPress={
                                handleSaveSummary
                            }
                            disabled={isSaved}
                        >
                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                {isSaved
                                    ? "✓ Đã lưu"
                                    : "💾 Lưu bản tóm tắt"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptySummaryCard}>
                        <Text
                            style={
                                styles.emptySummaryIcon
                            }
                        >
                            🤖
                        </Text>

                        <Text
                            style={
                                styles.emptySummaryTitle
                            }
                        >
                            Chưa có bản tóm tắt
                        </Text>

                        <Text
                            style={
                                styles.emptySummaryText
                            }
                        >
                            Chọn độ dài và phạm vi, sau đó
                            nhấn "Tạo bản tóm tắt".
                        </Text>
                    </View>
                )}
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
        paddingHorizontal: 16,
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
        flex: 1,
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        marginHorizontal: 8,
    },

    historyButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#EEF2FF",
    },

    historyButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary,
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
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },

    documentId: {
        fontSize: 12,
        color: colors.gray,
    },

    optionCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 12,
    },

    lengthContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 22,
    },

    lengthButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
    },

    lengthButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    lengthButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.gray,
    },

    lengthButtonTextActive: {
        color: colors.white,
    },

    chapterContainer: {
        gap: 10,
        marginBottom: 20,
    },

    chapterButton: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },

    chapterButtonActive: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: "#EEF2FF",
    },

    chapterText: {
        fontSize: 14,
        color: colors.gray,
    },

    chapterTextActive: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
    },

    createButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 4,
    },

    createButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.white,
    },

    errorText: {
        fontSize: 14,
        color: colors.error,
        marginTop: 12,
        textAlign: "center",
    },

    summaryCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
    },

    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    summaryTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    summaryBadge: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    summaryBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.primary,
    },

    summaryContent: {
        marginBottom: 18,
    },

    summaryText: {
        fontSize: 15,
        lineHeight: 25,
        color: colors.text,
    },

    saveButton: {
        backgroundColor: "#111827",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },

    savedButton: {
        backgroundColor: "#16A34A",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },

    saveButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.white,
    },

    emptySummaryCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 30,
        alignItems: "center",
    },

    emptySummaryIcon: {
        fontSize: 48,
        marginBottom: 14,
    },

    emptySummaryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptySummaryText: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
    },
});