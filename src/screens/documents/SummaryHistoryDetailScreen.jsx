import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function SummaryHistoryDetailScreen({
    navigation,
    route,
}) {
    const summaryId =
        route.params?.summaryId ||
        null;

    const documentName =
        route.params?.documentName ||
        "Tài liệu";

    const [
        summary,
        setSummary,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // LOAD DETAIL
    // ========================================

    const loadSummaryDetail =
        useCallback(
            async () => {
                if (!summaryId) {
                    setError(
                        "Không tìm thấy Summary ID."
                    );
                    setIsLoading(
                        false
                    );

                    return;
                }

                try {
                    setIsLoading(
                        true
                    );

                    setError("");

                    const result =
                        await apiRequest(
                            `/summaries/${summaryId}`
                        );

                    console.log(
                        "SUMMARY DETAIL SUCCESS:",
                        result?.data
                    );

                    setSummary(
                        result?.data ||
                            null
                    );
                } catch (err) {
                    console.log(
                        "SUMMARY DETAIL ERROR:",
                        err.message
                    );

                    setError(
                        err.message ||
                            "Không thể tải chi tiết tóm tắt."
                    );

                    setSummary(
                        null
                    );
                } finally {
                    setIsLoading(
                        false
                    );
                }
            },
            [summaryId]
        );

    useFocusEffect(
        useCallback(() => {
            loadSummaryDetail();
        }, [loadSummaryDetail])
    );

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
    // TYPE
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
    // HEADER
    // ========================================

    const renderHeader = () => {
        return (
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

                <Text
                    style={
                        styles.headerTitle
                    }
                >
                    Chi tiết tóm tắt
                </Text>

                <View
                    style={
                        styles.headerSpace
                    }
                />
            </View>
        );
    };

    // ========================================
    // LOADING
    // ========================================

    if (isLoading) {
        return (
            <View
                style={
                    styles.container
                }
            >
                {renderHeader()}

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
                        Đang tải chi tiết...
                    </Text>
                </View>
            </View>
        );
    }

    // ========================================
    // ERROR
    // ========================================

    if (
        error ||
        !summary
    ) {
        return (
            <View
                style={
                    styles.container
                }
            >
                {renderHeader()}

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
                        Không tìm thấy bản tóm tắt
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        {error ||
                            "Dữ liệu bản tóm tắt không tồn tại."}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.retryButton
                        }
                        onPress={
                            loadSummaryDetail
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
            </View>
        );
    }

    // ========================================
    // UI
    // ========================================

    return (
        <View
            style={
                styles.container
            }
        >
            {renderHeader()}

            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <View
                    style={
                        styles.documentCard
                    }
                >
                    <Text
                        style={
                            styles.documentIcon
                        }
                    >
                        📄
                    </Text>

                    <View
                        style={
                            styles.documentInfo
                        }
                    >
                        <Text
                            style={
                                styles.documentName
                            }
                            numberOfLines={
                                3
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
                                summary.createdAt
                            )}
                        </Text>
                    </View>
                </View>

                <View
                    style={
                        styles.infoContainer
                    }
                >
                    <View
                        style={
                            styles.infoItem
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Độ dài
                        </Text>

                        <Text
                            style={
                                styles.infoValue
                            }
                        >
                            {getTypeLabel(
                                summary.type
                            )}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoItem
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Cập nhật
                        </Text>

                        <Text
                            style={
                                styles.infoValueSmall
                            }
                        >
                            {formatDate(
                                summary.updatedAt
                            )}
                        </Text>
                    </View>
                </View>

                <View
                    style={
                        styles.summaryContainer
                    }
                >
                    <Text
                        style={
                            styles.summaryTitle
                        }
                    >
                        {summary.title ||
                            "Bản tóm tắt"}
                    </Text>

                    <Text
                        style={
                            styles.summaryText
                        }
                    >
                        {summary.content ||
                            "Không có nội dung tóm tắt."}
                    </Text>
                </View>
            </ScrollView>
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
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
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
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
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

        infoValueSmall: {
            fontSize: 12,
            fontWeight: "600",
            color: colors.text,
        },

        summaryContainer: {
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
            padding: 18,
        },

        summaryTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 18,
        },

        summaryText: {
            fontSize: 15,
            lineHeight: 25,
            color: colors.text,
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

        emptyTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 8,
            textAlign: "center",
        },

        emptyText: {
            fontSize: 15,
            color: colors.gray,
            textAlign: "center",
            lineHeight: 22,
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