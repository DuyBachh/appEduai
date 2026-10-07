import React, {
    useMemo,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";

import {
    apiRequest,
} from "../../services/api";

// ========================================
// COLORS
// ========================================

const COLORS = {
    primary: "#4F46E5",

    background:
        "#F9FAFB",

    white: "#FFFFFF",

    text: "#111827",

    gray: "#6B7280",

    border: "#E5E7EB",

    error: "#DC2626",

    errorBackground:
        "#FEF2F2",

    errorBorder:
        "#FECACA",

    primarySoft:
        "#EEF2FF",
};

// ========================================
// SUMMARY TYPES
// ========================================

const TYPE_OPTIONS = [
    {
        value:
            "short",

        label:
            "Ngắn",
    },

    {
        value:
            "medium",

        label:
            "Vừa",
    },

    {
        value:
            "detailed",

        label:
            "Chi tiết",
    },
];

// ========================================
// SCREEN
// ========================================

export default function SummaryScreen({
    navigation,
    route,
}) {
    const document =
        route?.params
            ?.document;

    const documentId =
        document?._id ||
        document?.id ||
        null;

    const documentName =
        document?.name ||
        document?.originalName ||
        document?.fileName ||
        "Tài liệu";

    const [
        summaryLength,
        setSummaryLength,
    ] = useState(
        "medium"
    );

    const [
        summary,
        setSummary,
    ] = useState("");

    const [
        summaryRecord,
        setSummaryRecord,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // TYPE LABEL
    // ========================================

    const typeLabel =
        useMemo(() => {
            return (
                TYPE_OPTIONS.find(
                    (
                        item
                    ) =>
                        item.value ===
                        summaryLength
                )?.label ||
                "Vừa"
            );
        }, [
            summaryLength,
        ]);

    // ========================================
    // CREATE SUMMARY
    // ========================================

    const handleCreateSummary =
        async () => {
            if (
                !documentId
            ) {
                setError(
                    "Không tìm thấy Document ID."
                );

                return;
            }

            if (
                isLoading
            ) {
                return;
            }

            try {
                setIsLoading(
                    true
                );

                setError(
                    ""
                );

                const startedAt =
                    Date.now();

                const result =
                    await apiRequest(
                        `/summaries/documents/${documentId}`,
                        {
                            method:
                                "POST",

                            body:
                                JSON.stringify(
                                    {
                                        type:
                                            summaryLength,
                                    }
                                ),
                        }
                    );

                const content =
                    result?.data
                        ?.content ||
                    "";

                if (
                    !content
                ) {
                    throw new Error(
                        "Backend không trả về nội dung tóm tắt."
                    );
                }

                setSummary(
                    content
                );

                setSummaryRecord(
                    result?.data ||
                        null
                );

                console.log(
                    "SUMMARY TIME:",
                    `${(
                        (Date.now() -
                            startedAt) /
                        1000
                    ).toFixed(
                        2
                    )} giây`
                );
            } catch (
                requestError
            ) {
                console.log(
                    "SUMMARY ERROR:",
                    requestError.message
                );

                setError(
                    requestError.message ||
                        "Không thể tạo bản tóm tắt. Vui lòng thử lại."
                );
            } finally {
                setIsLoading(
                    false
                );
            }
        };

    // ========================================
    // CHANGE TYPE
    // ========================================

    const handleChangeType = (
        value
    ) => {
        if (
            isLoading
        ) {
            return;
        }

        setSummaryLength(
            value
        );

        setSummary("");

        setSummaryRecord(
            null
        );

        setError("");
    };

    // ========================================
    // HISTORY
    // ========================================

    const handleOpenHistory =
        () => {
            if (
                !documentId
            ) {
                setError(
                    "Không tìm thấy Document ID."
                );

                return;
            }

            navigation.navigate(
                "SummaryHistory",
                {
                    documentId,

                    documentName,
                }
            );
        };

    // ========================================
    // UI
    // ========================================

    return (
        <SafeAreaView
            style={
                styles.safeArea
            }
        >
            <View
                style={
                    styles.container
                }
            >
                {/* HEADER */}

                <View
                    style={
                        styles.header
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.headerSide
                        }
                        onPress={() =>
                            navigation.goBack()
                        }
                        disabled={
                            isLoading
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
                        AI Tóm tắt
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.headerSide,

                            styles.headerSideRight,
                        ]}
                        onPress={
                            handleOpenHistory
                        }
                    >
                        <Text
                            style={
                                styles.historyText
                            }
                        >
                            Lịch sử
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    {/* DOCUMENT */}

                    <View
                        style={
                            styles.documentCard
                        }
                    >
                        <View
                            style={
                                styles.documentIcon
                            }
                        >
                            <Text
                                style={
                                    styles.documentIconText
                                }
                            >
                                📄
                            </Text>
                        </View>

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
                                    2
                                }
                            >
                                {
                                    documentName
                                }
                            </Text>

                            {document?.subject ? (
                                <Text
                                    style={
                                        styles.documentMeta
                                    }
                                >
                                    Môn:{" "}
                                    {
                                        document.subject
                                    }
                                </Text>
                            ) : null}

                            {document?.topic ? (
                                <Text
                                    style={
                                        styles.documentMeta
                                    }
                                >
                                    Chủ đề:{" "}
                                    {
                                        document.topic
                                    }
                                </Text>
                            ) : null}
                        </View>
                    </View>

                    {/* OPTIONS */}

                    <View
                        style={
                            styles.card
                        }
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Độ dài bản tóm tắt
                        </Text>

                        <View
                            style={
                                styles.typeRow
                            }
                        >
                            {TYPE_OPTIONS.map(
                                (
                                    option,
                                    index
                                ) => {
                                    const active =
                                        summaryLength ===
                                        option.value;

                                    return (
                                        <TouchableOpacity
                                            key={
                                                option.value
                                            }
                                            style={[
                                                styles.typeButton,

                                                index <
                                                    TYPE_OPTIONS.length -
                                                        1 &&
                                                    styles.typeButtonSpacing,

                                                active &&
                                                    styles.typeButtonActive,
                                            ]}
                                            onPress={() =>
                                                handleChangeType(
                                                    option.value
                                                )
                                            }
                                            disabled={
                                                isLoading
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.typeButtonText,

                                                    active &&
                                                        styles.typeButtonTextActive,
                                                ]}
                                            >
                                                {
                                                    option.label
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            )}
                        </View>

                        {/* CREATE */}

                        <TouchableOpacity
                            style={[
                                styles.createButton,

                                isLoading &&
                                    styles.disabledButton,
                            ]}
                            onPress={
                                handleCreateSummary
                            }
                            disabled={
                                isLoading
                            }
                        >
                            {isLoading ? (
                                <View
                                    style={
                                        styles.loadingButtonRow
                                    }
                                >
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            COLORS.white
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.createButtonText
                                        }
                                    >
                                        Đang tóm tắt...
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={
                                        styles.createButtonText
                                    }
                                >
                                    ✨ Tạo bản tóm tắt
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* LONG LOADING */}

                    {isLoading ? (
                        <View
                            style={
                                styles.loadingCard
                            }
                        >
                            <ActivityIndicator
                                size="large"
                                color={
                                    COLORS.primary
                                }
                            />

                            <Text
                                style={
                                    styles.loadingTitle
                                }
                            >
                                AI đang xử lý tài liệu
                            </Text>

                            <Text
                                style={
                                    styles.loadingDescription
                                }
                            >
                                Tài liệu dài hoặc lúc dịch vụ AI bận có thể mất hơn một phút. Hãy giữ ứng dụng mở cho đến khi hoàn tất.
                            </Text>
                        </View>
                    ) : null}

                    {/* ERROR */}

                    {!isLoading &&
                    error ? (
                        <View
                            style={
                                styles.errorCard
                            }
                        >
                            <Text
                                style={
                                    styles.errorTitle
                                }
                            >
                                Không thể tóm tắt
                            </Text>

                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                {
                                    error
                                }
                            </Text>

                            <TouchableOpacity
                                style={
                                    styles.retryButton
                                }
                                onPress={
                                    handleCreateSummary
                                }
                            >
                                <Text
                                    style={
                                        styles.retryButtonText
                                    }
                                >
                                    Thử lại
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* RESULT */}

                    {!isLoading &&
                    summary ? (
                        <View
                            style={
                                styles.summaryCard
                            }
                        >
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
                                        styles.badge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.badgeText
                                        }
                                    >
                                        {
                                            typeLabel
                                        }
                                    </Text>
                                </View>
                            </View>

                            <Text
                                selectable
                                style={
                                    styles.summaryText
                                }
                            >
                                {
                                    summary
                                }
                            </Text>

                            {summaryRecord?._id ? (
                                <Text
                                    style={
                                        styles.savedText
                                    }
                                >
                                    Đã lưu vào lịch sử
                                </Text>
                            ) : null}

                            <TouchableOpacity
                                style={
                                    styles.historyLink
                                }
                                onPress={
                                    handleOpenHistory
                                }
                            >
                                <Text
                                    style={
                                        styles.historyLinkText
                                    }
                                >
                                    Xem lịch sử tóm tắt →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// ========================================
// STYLES
// ========================================

const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,

            backgroundColor:
                COLORS.white,
        },

        container: {
            flex: 1,

            backgroundColor:
                COLORS.background,
        },

        header: {
            height: 60,

            paddingHorizontal:
                16,

            flexDirection:
                "row",

            alignItems:
                "center",

            backgroundColor:
                COLORS.white,

            borderBottomWidth:
                1,

            borderBottomColor:
                COLORS.border,
        },

        headerSide: {
            width: 72,

            justifyContent:
                "center",
        },

        headerSideRight: {
            alignItems:
                "flex-end",
        },

        backText: {
            fontSize: 36,

            lineHeight: 40,

            color:
                COLORS.text,
        },

        headerTitle: {
            flex: 1,

            fontSize: 20,

            fontWeight:
                "700",

            textAlign:
                "center",

            color:
                COLORS.text,
        },

        historyText: {
            fontSize: 14,

            fontWeight:
                "700",

            color:
                COLORS.primary,
        },

        content: {
            padding: 20,

            paddingBottom:
                50,
        },

        documentCard: {
            flexDirection:
                "row",

            alignItems:
                "center",

            padding: 16,

            marginBottom:
                16,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.white,
        },

        documentIcon: {
            width: 52,

            height: 52,

            marginRight:
                14,

            borderRadius:
                12,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                COLORS.primarySoft,
        },

        documentIconText: {
            fontSize: 26,
        },

        documentInfo: {
            flex: 1,
        },

        documentName: {
            fontSize: 17,

            fontWeight:
                "700",

            color:
                COLORS.text,

            marginBottom:
                5,
        },

        documentMeta: {
            fontSize: 13,

            color:
                COLORS.gray,

            marginTop: 2,
        },

        card: {
            padding: 18,

            marginBottom:
                16,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.white,
        },

        sectionTitle: {
            fontSize: 16,

            fontWeight:
                "700",

            color:
                COLORS.text,

            marginBottom:
                14,
        },

        typeRow: {
            flexDirection:
                "row",

            marginBottom:
                20,
        },

        typeButton: {
            flex: 1,

            height: 44,

            borderRadius:
                10,

            borderWidth:
                1,

            borderColor:
                COLORS.border,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                COLORS.white,
        },

        typeButtonSpacing: {
            marginRight:
                10,
        },

        typeButtonActive: {
            backgroundColor:
                COLORS.primary,

            borderColor:
                COLORS.primary,
        },

        typeButtonText: {
            fontSize: 14,

            fontWeight:
                "600",

            color:
                COLORS.gray,
        },

        typeButtonTextActive: {
            color:
                COLORS.white,
        },

        createButton: {
            height: 50,

            borderRadius:
                10,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                COLORS.primary,
        },

        disabledButton: {
            opacity: 0.7,
        },

        createButtonText: {
            fontSize: 15,

            fontWeight:
                "700",

            color:
                COLORS.white,

            marginLeft: 8,
        },

        loadingButtonRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        loadingCard: {
            alignItems:
                "center",

            padding: 24,

            marginBottom:
                16,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.white,
        },

        loadingTitle: {
            marginTop: 14,

            fontSize: 16,

            fontWeight:
                "700",

            color:
                COLORS.text,
        },

        loadingDescription: {
            marginTop: 8,

            fontSize: 13,

            lineHeight: 20,

            textAlign:
                "center",

            color:
                COLORS.gray,
        },

        errorCard: {
            padding: 18,

            marginBottom:
                16,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                COLORS.errorBorder,

            backgroundColor:
                COLORS.errorBackground,
        },

        errorTitle: {
            fontSize: 16,

            fontWeight:
                "700",

            color:
                COLORS.error,

            marginBottom:
                6,
        },

        errorText: {
            fontSize: 14,

            lineHeight: 21,

            color:
                COLORS.error,
        },

        retryButton: {
            alignSelf:
                "flex-start",

            marginTop: 14,

            paddingHorizontal:
                18,

            paddingVertical:
                10,

            borderRadius:
                9,

            backgroundColor:
                COLORS.error,
        },

        retryButtonText: {
            fontSize: 14,

            fontWeight:
                "700",

            color:
                COLORS.white,
        },

        summaryCard: {
            padding: 18,

            borderRadius:
                14,

            borderWidth:
                1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.white,
        },

        summaryHeader: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            paddingBottom:
                14,

            marginBottom:
                14,

            borderBottomWidth:
                1,

            borderBottomColor:
                COLORS.border,
        },

        summaryTitle: {
            fontSize: 20,

            fontWeight:
                "700",

            color:
                COLORS.text,
        },

        badge: {
            paddingHorizontal:
                10,

            paddingVertical:
                6,

            borderRadius:
                8,

            backgroundColor:
                COLORS.primarySoft,
        },

        badgeText: {
            fontSize: 12,

            fontWeight:
                "700",

            color:
                COLORS.primary,
        },

        summaryText: {
            fontSize: 15,

            lineHeight: 25,

            color:
                COLORS.text,
        },

        savedText: {
            marginTop: 16,

            fontSize: 12,

            color:
                COLORS.gray,
        },

        historyLink: {
            marginTop: 16,

            paddingTop: 14,

            borderTopWidth:
                1,

            borderTopColor:
                COLORS.border,
        },

        historyLinkText: {
            fontSize: 14,

            fontWeight:
                "700",

            color:
                COLORS.primary,
        },
    });