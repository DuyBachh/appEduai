import React, {
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

import colors from "../../styles/colors";

import {
    apiRequest,
} from "../../services/api";

export default function SummaryScreen({
    navigation,
    route,
}) {
    const document =
        route.params?.document;

    const [
        summaryLength,
        setSummaryLength,
    ] = useState("medium");

    const [
        summary,
        setSummary,
    ] = useState("");

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // DOCUMENT ID
    // ========================================

    const getDocumentId = () => {
        return (
            document?._id ||
            document?.id ||
            null
        );
    };

    // ========================================
    // DOCUMENT NAME
    // ========================================

    const getDocumentName = () => {
        return (
            document?.name ||
            document?.originalName ||
            "Tài liệu không tên"
        );
    };

    // ========================================
    // SUMMARY TEXT
    // ========================================

    const extractSummaryText = (
        result
    ) => {
        return (
            result?.data?.content ||
            result?.data?.summary ||
            result?.data?.summaryText ||
            result?.data?.text ||
            result?.summary ||
            ""
        );
    };

    // ========================================
    // CREATE SUMMARY
    // ========================================

    const handleCreateSummary =
        async () => {
            const documentId =
                getDocumentId();

            if (!documentId) {
                setError(
                    "Không tìm thấy Document ID."
                );

                return;
            }

            // Không cho gửi nhiều request cùng lúc
            if (isLoading) {
                return;
            }

            try {
                setIsLoading(true);

                setError("");

                // Giữ summary cũ nếu có.
                // Không xóa summary khi đang gọi lại AI.

                console.log(
                    "SUMMARY DOCUMENT ID:",
                    documentId
                );

                console.log(
                    "SUMMARY TYPE:",
                    summaryLength
                );

                console.log(
                    "SUMMARY START"
                );

                const startTime =
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

                const duration =
                    (
                        (Date.now() -
                            startTime) /
                        1000
                    ).toFixed(2);

                console.log(
                    "SUMMARY TIME:",
                    `${duration} giây`
                );

                console.log(
                    "SUMMARY GENERATE SUCCESS:",
                    result?.success
                );

                console.log(
                    "SUMMARY RESPONSE:",
                    result?.data
                );

                const generatedSummary =
                    extractSummaryText(
                        result
                    );

                if (
                    !generatedSummary
                ) {
                    throw new Error(
                        "Backend không trả về nội dung tóm tắt."
                    );
                }

                setSummary(
                    generatedSummary
                );
            } catch (err) {
                console.log(
                    "SUMMARY ERROR:",
                    err.message
                );

                // apiRequest sẽ lấy message từ backend.
                // Ví dụ:
                // "AI phản hồi quá lâu. Vui lòng thử lại."
                setError(
                    err.message ||
                        "Không thể tạo bản tóm tắt. Vui lòng thử lại."
                );
            } finally {
                // Luôn dừng loading dù API thành công hay lỗi 504.
                setIsLoading(
                    false
                );
            }
        };

    // ========================================
    // CHANGE TYPE
    // ========================================

    const handleChangeLength = (
        length
    ) => {
        if (isLoading) {
            return;
        }

        setSummaryLength(
            length
        );

        setError("");

        setSummary("");
    };

    // ========================================
    // HISTORY
    // ========================================

    const handleOpenHistory =
        () => {
            const documentId =
                getDocumentId();

            if (!documentId) {
                setError(
                    "Không tìm thấy Document ID."
                );

                return;
            }

            navigation.navigate(
                "SummaryHistory",
                {
                    documentId,

                    documentName:
                        getDocumentName(),
                }
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
                return "Vừa";
        }
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
            {/* HEADER */}

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
                    numberOfLines={
                        1
                    }
                >
                    AI Tóm tắt
                </Text>

                <TouchableOpacity
                    style={
                        styles.historyButton
                    }
                    onPress={
                        handleOpenHistory
                    }
                >
                    <Text
                        style={
                            styles.historyButtonText
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
                            styles.documentIconContainer
                        }
                    >
                        <Text
                            style={
                                styles.documentIcon
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
                            {getDocumentName()}
                        </Text>

                        {document?.subject ? (
                            <Text
                                style={
                                    styles.documentMeta
                                }
                            >
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
                                {
                                    document.topic
                                }
                            </Text>
                        ) : null}
                    </View>
                </View>

                {/* SETTINGS */}

                <View
                    style={
                        styles.settingCard
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
                            styles.lengthContainer
                        }
                    >
                        <TouchableOpacity
                            style={[
                                styles.lengthButton,

                                summaryLength ===
                                    "short" &&
                                    styles.lengthButtonActive,
                            ]}
                            onPress={() =>
                                handleChangeLength(
                                    "short"
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={[
                                    styles.lengthButtonText,

                                    summaryLength ===
                                        "short" &&
                                        styles.lengthButtonTextActive,
                                ]}
                            >
                                Ngắn
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.lengthButton,

                                summaryLength ===
                                    "medium" &&
                                    styles.lengthButtonActive,
                            ]}
                            onPress={() =>
                                handleChangeLength(
                                    "medium"
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={[
                                    styles.lengthButtonText,

                                    summaryLength ===
                                        "medium" &&
                                        styles.lengthButtonTextActive,
                                ]}
                            >
                                Vừa
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.lengthButton,

                                summaryLength ===
                                    "detailed" &&
                                    styles.lengthButtonActive,
                            ]}
                            onPress={() =>
                                handleChangeLength(
                                    "detailed"
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={[
                                    styles.lengthButtonText,

                                    summaryLength ===
                                        "detailed" &&
                                        styles.lengthButtonTextActive,
                                ]}
                            >
                                Chi tiết
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* CREATE BUTTON */}

                    <TouchableOpacity
                        style={[
                            styles.createButton,

                            isLoading &&
                                styles.createButtonDisabled,
                        ]}
                        onPress={
                            handleCreateSummary
                        }
                        disabled={
                            isLoading
                        }
                        activeOpacity={
                            0.8
                        }
                    >
                        {isLoading ? (
                            <View
                                style={
                                    styles.loadingButtonContent
                                }
                            >
                                <ActivityIndicator
                                    size="small"
                                    color={
                                        colors.white
                                    }
                                />

                                <Text
                                    style={
                                        styles.createButtonText
                                    }
                                >
                                    Đang tạo tóm tắt...
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

                {/* LOADING INFO */}

                {isLoading ? (
                    <View
                        style={
                            styles.loadingCard
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
                                styles.loadingTitle
                            }
                        >
                            AI đang tóm tắt tài liệu
                        </Text>

                        <Text
                            style={
                                styles.loadingDescription
                            }
                        >
                            Quá trình này có thể mất vài giây.
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
                            Không thể tạo bản tóm tắt
                        </Text>

                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {error}
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

                {/* SUMMARY */}

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
                                    styles.summaryBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.summaryBadgeText
                                    }
                                >
                                    {getTypeLabel(
                                        summaryLength
                                    )}
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
                                {
                                    summary
                                }
                            </Text>
                        </View>

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
    );
}

// ========================================
// STYLES
// ========================================

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
            width: 50,
            height: 40,
            alignItems:
                "flex-start",
            justifyContent:
                "center",
        },

        backText: {
            fontSize: 36,
            lineHeight: 40,
            color: colors.text,
        },

        headerTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            color: colors.text,
        },

        historyButton: {
            width: 70,
            height: 40,
            alignItems:
                "flex-end",
            justifyContent:
                "center",
        },

        historyButtonText: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.primary,
        },

        content: {
            padding: 20,
            paddingBottom: 50,
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

        documentIconContainer: {
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor:
                "#EEF2FF",
            alignItems: "center",
            justifyContent:
                "center",
            marginRight: 14,
        },

        documentIcon: {
            fontSize: 26,
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

        documentMeta: {
            fontSize: 13,
            color: colors.gray,
            marginTop: 2,
        },

        settingCard: {
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
            padding: 18,
            marginBottom: 16,
        },

        sectionTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 14,
        },

        lengthContainer: {
            flexDirection: "row",
            gap: 10,
            marginBottom: 20,
        },

        lengthButton: {
            flex: 1,
            height: 44,
            borderRadius: 10,
            borderWidth: 1,
            borderColor:
                colors.border,
            alignItems: "center",
            justifyContent:
                "center",
            backgroundColor:
                colors.white,
        },

        lengthButtonActive: {
            backgroundColor:
                colors.primary,
            borderColor:
                colors.primary,
        },

        lengthButtonText: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.gray,
        },

        lengthButtonTextActive: {
            color: colors.white,
        },

        createButton: {
            height: 50,
            borderRadius: 10,
            backgroundColor:
                colors.primary,
            alignItems: "center",
            justifyContent:
                "center",
        },

        createButtonDisabled: {
            opacity: 0.7,
        },

        createButtonText: {
            fontSize: 15,
            fontWeight: "700",
            color: colors.white,
        },

        loadingButtonContent: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },

        loadingCard: {
            alignItems: "center",
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
            padding: 24,
            marginBottom: 16,
        },

        loadingTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.text,
            marginTop: 14,
        },

        loadingDescription: {
            fontSize: 13,
            color: colors.gray,
            textAlign: "center",
            marginTop: 6,
        },

        errorCard: {
            backgroundColor:
                "#FEF2F2",
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                "#FECACA",
            padding: 18,
            marginBottom: 16,
        },

        errorTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.error,
            marginBottom: 6,
        },

        errorText: {
            fontSize: 14,
            lineHeight: 21,
            color: colors.error,
        },

        retryButton: {
            alignSelf:
                "flex-start",
            marginTop: 14,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 9,
            backgroundColor:
                colors.error,
        },

        retryButtonText: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.white,
        },

        summaryCard: {
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
            padding: 18,
        },

        summaryHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
            marginBottom: 16,
        },

        summaryTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
        },

        summaryBadge: {
            backgroundColor:
                "#EEF2FF",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
        },

        summaryBadgeText: {
            fontSize: 12,
            fontWeight: "700",
            color: colors.primary,
        },

        summaryContent: {
            borderTopWidth: 1,
            borderTopColor:
                colors.border,
            paddingTop: 16,
        },

        summaryText: {
            fontSize: 15,
            lineHeight: 25,
            color: colors.text,
        },

        historyLink: {
            marginTop: 20,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor:
                colors.border,
        },

        historyLinkText: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.primary,
        },
    });