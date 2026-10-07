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
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function SummaryHistoryScreen({
    navigation,
    route,
}) {
    const documentId =
        route.params?.documentId ||
        null;

    const documentName =
        route.params?.documentName ||
        "Tài liệu không tên";

    const [
        history,
        setHistory,
    ] = useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // LOAD HISTORY
    // ========================================

    const loadHistory =
        useCallback(
            async (
                showLoading = true
            ) => {
                if (!documentId) {
                    setHistory([]);
                    setError(
                        "Không tìm thấy Document ID."
                    );
                    setIsLoading(false);

                    return;
                }

                try {
                    if (showLoading) {
                        setIsLoading(true);
                    }

                    setError("");

                    const result =
                        await apiRequest(
                            `/summaries/documents/${documentId}`
                        );

                    const summaries =
                        Array.isArray(
                            result?.data
                        )
                            ? result.data
                            : [];

                    console.log(
                        "SUMMARY HISTORY SUCCESS:",
                        summaries.length
                    );

                    setHistory(
                        summaries
                    );
                } catch (err) {
                    console.log(
                        "SUMMARY HISTORY ERROR:",
                        err.message
                    );

                    setError(
                        err.message ||
                            "Không thể tải lịch sử tóm tắt."
                    );

                    setHistory([]);
                } finally {
                    if (showLoading) {
                        setIsLoading(
                            false
                        );
                    }

                    setRefreshing(
                        false
                    );
                }
            },
            [documentId]
        );

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    // ========================================
    // REFRESH
    // ========================================

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadHistory(
                false
            );
        };

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (
        dateString
    ) => {
        if (!dateString) {
            return "Không rõ thời gian";
        }

        const date =
            new Date(
                dateString
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Không rõ thời gian";
        }

        return date.toLocaleString(
            "vi-VN"
        );
    };

    // ========================================
    // TYPE LABEL
    // ========================================

    const getTypeLabel = (
        type
    ) => {
        switch (type) {
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

    // ========================================
    // OPEN DETAIL
    // ========================================

    const handleOpenSummaryDetail =
        (
            item
        ) => {
            navigation.navigate(
                "SummaryHistoryDetail",
                {
                    summaryId:
                        item._id,

                    documentName,
                }
            );
        };

    // ========================================
    // DELETE
    // ========================================

    const handleDeleteHistory =
        (
            summaryId
        ) => {
            Alert.alert(
                "Xóa bản tóm tắt",
                "Bạn có chắc muốn xóa bản tóm tắt này?",
                [
                    {
                        text: "Hủy",
                        style: "cancel",
                    },
                    {
                        text: "Xóa",
                        style: "destructive",

                        onPress:
                            async () => {
                                try {
                                    await apiRequest(
                                        `/summaries/${summaryId}`,
                                        {
                                            method:
                                                "DELETE",
                                        }
                                    );

                                    setHistory(
                                        (
                                            current
                                        ) =>
                                            current.filter(
                                                (
                                                    item
                                                ) =>
                                                    item._id !==
                                                    summaryId
                                            )
                                    );
                                } catch (
                                    err
                                ) {
                                    Alert.alert(
                                        "Lỗi",
                                        err.message ||
                                            "Không thể xóa bản tóm tắt."
                                    );
                                }
                            },
                    },
                ]
            );
        };

    // ========================================
    // ITEM
    // ========================================

    const renderHistoryItem = ({
        item,
    }) => {
        return (
            <View
                style={
                    styles.card
                }
            >
                <TouchableOpacity
                    style={
                        styles.cardContent
                    }
                    onPress={() =>
                        handleOpenSummaryDetail(
                            item
                        )
                    }
                    activeOpacity={
                        0.8
                    }
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
                                numberOfLines={
                                    2
                                }
                            >
                                {
                                    documentName
                                }
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
                        style={
                            styles.infoRow
                        }
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
                                {getTypeLabel(
                                    item.type
                                )}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={
                            styles.preview
                        }
                        numberOfLines={
                            4
                        }
                    >
                        {item.content ||
                            "Không có nội dung tóm tắt."}
                    </Text>

                    <Text
                        style={
                            styles.viewDetailText
                        }
                    >
                        Xem đầy đủ →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.deleteButton
                    }
                    onPress={() =>
                        handleDeleteHistory(
                            item._id
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

    // ========================================
    // UI
    // ========================================

    return (
        <View
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
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
                    >
                        Lịch sử tóm tắt
                    </Text>

                    <Text
                        style={
                            styles.headerDocumentName
                        }
                        numberOfLines={
                            1
                        }
                    >
                        {
                            documentName
                        }
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
                    <ActivityIndicator
                        size="large"
                        color={
                            colors.primary
                        }
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Đang tải lịch sử...
                    </Text>
                </View>
            ) : error ? (
                <View
                    style={
                        styles.centerContainer
                    }
                >
                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        Không thể tải
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        {error}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.retryButton
                        }
                        onPress={() =>
                            loadHistory()
                        }
                    >
                        <Text
                            style={
                                styles.retryText
                            }
                        >
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : history.length ===
              0 ? (
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
                        tóm tắt nào.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={
                        history
                    }
                    keyExtractor={(
                        item
                    ) =>
                        item._id
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
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                refreshing
                            }
                            onRefresh={
                                handleRefresh
                            }
                        />
                    }
                />
            )}
        </View>
    );
}

const styles =
    StyleSheet.create({
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
            marginTop: 14,
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

        viewDetailText: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.primary,
            marginTop: 14,
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
            marginTop: 12,
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

        retryButton: {
            marginTop: 18,
            backgroundColor:
                colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 11,
            borderRadius: 10,
        },

        retryText: {
            color: colors.white,
            fontSize: 14,
            fontWeight: "700",
        },
    });