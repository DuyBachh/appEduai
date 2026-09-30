import React, {
    useCallback,
    useState,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import {
    useFocusEffect,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../styles/colors";

const SUMMARY_HISTORY_KEY = "summary_history";

export default function SummaryHistoryScreen({
    navigation,
    route,
}) {
    const documentId =
        route.params?.documentId || null;

    const documentName =
        route.params?.documentName ||
        "Tài liệu không tên";

    const [history, setHistory] = useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const loadHistory = async () => {
        try {
            setIsLoading(true);

            const storedHistory =
                await AsyncStorage.getItem(
                    SUMMARY_HISTORY_KEY
                );

            if (!storedHistory) {
                setHistory([]);
                return;
            }

            const parsedHistory =
                JSON.parse(storedHistory);

            if (!Array.isArray(parsedHistory)) {
                setHistory([]);
                return;
            }

            /*
             * Chỉ lấy lịch sử thuộc tài liệu hiện tại.
             *
             * Ví dụ:
             * documentId = "123"
             *
             * Chỉ lấy:
             * item.documentId === "123"
             */
            const filteredHistory =
                parsedHistory.filter(
                    (item) =>
                        item.documentId ===
                        documentId
                );

            setHistory(filteredHistory);
        } catch (error) {
            console.log(
                "Load summary history error:",
                error
            );

            Alert.alert(
                "Lỗi",
                "Không thể tải lịch sử tóm tắt."
            );

            setHistory([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [documentId])
    );

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

    const handleOpenSummaryDetail = (item) => {
        navigation.navigate(
            "SummaryHistoryDetail",
            {
                summaryItem: item,
            }
        );
    };

    const handleDeleteHistory = async (id) => {
        Alert.alert(
            "Xóa lịch sử",
            "Bạn có chắc muốn xóa bản tóm tắt này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const storedHistory =
                                await AsyncStorage.getItem(
                                    SUMMARY_HISTORY_KEY
                                );

                            let allHistory = [];

                            if (storedHistory) {
                                const parsedHistory =
                                    JSON.parse(
                                        storedHistory
                                    );

                                if (
                                    Array.isArray(
                                        parsedHistory
                                    )
                                ) {
                                    allHistory =
                                        parsedHistory;
                                }
                            }

                            /*
                             * Xóa khỏi toàn bộ storage
                             * theo ID duy nhất của summary.
                             */
                            const updatedAllHistory =
                                allHistory.filter(
                                    (item) =>
                                        item.id !== id
                                );

                            await AsyncStorage.setItem(
                                SUMMARY_HISTORY_KEY,
                                JSON.stringify(
                                    updatedAllHistory
                                )
                            );

                            /*
                             * Cập nhật lại danh sách
                             * đang hiển thị.
                             */
                            const updatedCurrentHistory =
                                history.filter(
                                    (item) =>
                                        item.id !== id
                                );

                            setHistory(
                                updatedCurrentHistory
                            );
                        } catch (error) {
                            console.log(
                                "Delete summary history error:",
                                error
                            );

                            Alert.alert(
                                "Lỗi",
                                "Không thể xóa lịch sử."
                            );
                        }
                    },
                },
            ]
        );
    };

    const renderHistoryItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() =>
                        handleOpenSummaryDetail(
                            item
                        )
                    }
                    activeOpacity={0.8}
                >
                    <View
                        style={
                            styles.cardHeader
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.icon
                                }
                            >
                                📄
                            </Text>
                        </View>

                        <View
                            style={
                                styles.headerContent
                            }
                        >
                            <Text
                                style={
                                    styles.documentName
                                }
                                numberOfLines={2}
                            >
                                {item.documentName ||
                                    "Tài liệu không tên"}
                            </Text>

                            <Text
                                style={
                                    styles.date
                                }
                            >
                                {formatDate(
                                    item.createdAt
                                )}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={styles.infoRow}
                    >
                        <View
                            style={
                                styles.badge
                            }
                        >
                            <Text
                                style={
                                    styles.badgeText
                                }
                            >
                                {getLengthLabel(
                                    item.summaryLength
                                )}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.badge
                            }
                        >
                            <Text
                                style={
                                    styles.badgeText
                                }
                            >
                                {getChapterLabel(
                                    item.chapter
                                )}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={
                            styles.preview
                        }
                        numberOfLines={4}
                    >
                        {item.summary ||
                            "Không có nội dung tóm tắt."}
                    </Text>

                    <View
                        style={
                            styles.viewDetailContainer
                        }
                    >
                        <Text
                            style={
                                styles.viewDetailText
                            }
                        >
                            Xem đầy đủ →
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.deleteButton
                    }
                    onPress={() =>
                        handleDeleteHistory(
                            item.id
                        )
                    }
                >
                    <Text
                        style={
                            styles.deleteText
                        }
                    >
                        Xóa
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={() =>
                        navigation.goBack()
                    }
                >
                    <Text
                        style={
                            styles.backText
                        }
                    >
                        ‹
                    </Text>
                </TouchableOpacity>

                <View
                    style={
                        styles.headerTitleContainer
                    }
                >
                    <Text
                        style={
                            styles.title
                        }
                        numberOfLines={1}
                    >
                        Lịch sử tóm tắt
                    </Text>

                    <Text
                        style={
                            styles.headerDocumentName
                        }
                        numberOfLines={1}
                    >
                        {documentName}
                    </Text>
                </View>

                <View
                    style={
                        styles.headerSpace
                    }
                />
            </View>

            {isLoading ? (
                <View
                    style={
                        styles.centerContainer
                    }
                >
                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Đang tải lịch sử...
                    </Text>
                </View>
            ) : history.length === 0 ? (
                <View
                    style={
                        styles.centerContainer
                    }
                >
                    <Text
                        style={
                            styles.emptyIcon
                        }
                    >
                        📚
                    </Text>

                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        Chưa có lịch sử
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        Tài liệu này chưa có bản
                        tóm tắt nào được lưu.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) =>
                        item.id
                    }
                    renderItem={
                        renderHistoryItem
                    }
                    contentContainerStyle={
                        styles.listContent
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    header: {
        height: 100,
        paddingTop: 45,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        backgroundColor:
            colors.white,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent:
            "center",
    },

    backText: {
        fontSize: 36,
        color: colors.text,
        lineHeight: 40,
    },

    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 8,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    headerDocumentName: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 2,
    },

    headerSpace: {
        width: 40,
    },

    listContent: {
        padding: 20,
        paddingBottom: 40,
    },

    card: {
        backgroundColor:
            colors.white,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        overflow: "hidden",
    },

    cardContent: {
        padding: 16,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor:
            "#EEF2FF",
        alignItems: "center",
        justifyContent:
            "center",
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
        flexWrap: "wrap",
        marginTop: 14,
        gap: 8,
    },

    badge: {
        backgroundColor:
            "#F3F4F6",
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

    viewDetailContainer: {
        marginTop: 14,
    },

    viewDetailText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.primary,
    },

    deleteButton: {
        borderTopWidth: 1,
        borderTopColor:
            colors.border,
        paddingVertical: 12,
        alignItems: "center",
    },

    deleteText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.error,
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent:
            "center",
        paddingHorizontal: 30,
    },

    loadingText: {
        fontSize: 15,
        color: colors.gray,
    },

    emptyIcon: {
        fontSize: 50,
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.gray,
        textAlign: "center",
    },
});