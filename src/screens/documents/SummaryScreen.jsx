import {
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
        generatedType,
        setGeneratedType,
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
    // HELPERS
    // ========================================

    const getDocumentId = () => {
        return (
            document?._id ||
            document?.id ||
            null
        );
    };

    const getDocumentName = () => {
        return (
            document?.name ||
            "Tài liệu không tên"
        );
    };

    const getTypeLabel = (
        type
    ) => {
        if (type === "short") {
            return "Ngắn";
        }

        if (type === "medium") {
            return "Vừa";
        }

        if (
            type === "detailed"
        ) {
            return "Chi tiết";
        }

        return "";
    };

    const extractSummaryText = (
        result
    ) => {
        const data =
            result?.data;

        if (
            typeof data ===
            "string"
        ) {
            return data;
        }

        const candidates = [
            data?.summary,
            data?.summaryText,
            data?.content,
            data?.text,
            result?.summary,
        ];

        const found =
            candidates.find(
                (
                    value
                ) =>
                    typeof value ===
                        "string" &&
                    value.trim()
            );

        return found || "";
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
                "Không tìm thấy ID tài liệu."
            );

            return;
        }

        try {
            setIsLoading(
                true
            );

            setError("");
            setSummary("");

            console.log(
                "SUMMARY DOCUMENT ID:",
                documentId
            );

            console.log(
                "SUMMARY TYPE:",
                summaryLength
            );

            // Bắt đầu đo thời gian
            const startTime =
                Date.now();

            console.log(
                "SUMMARY START"
            );

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

            // Kết thúc đo thời gian
            const endTime =
                Date.now();

            const duration =
                (
                    (endTime -
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

            setGeneratedType(
                summaryLength
            );
        } catch (error) {
            console.log(
                "SUMMARY GENERATE ERROR:",
                error.message
            );

            setError(
                error.message ||
                    "Không thể tạo bản tóm tắt."
            );
        } finally {
            setIsLoading(
                false
            );
        }
    };

    // ========================================
    // HISTORY
    // ========================================

    const handleOpenHistory =
        () => {
            navigation.navigate(
                "SummaryHistory",
                {
                    documentId:
                        getDocumentId(),

                    documentName:
                        getDocumentName(),
                }
            );
        };

    // ========================================
    // BUTTON STYLE
    // ========================================

    const getLengthButtonStyle =
        (
            length
        ) => {
            if (
                summaryLength ===
                length
            ) {
                return [
                    styles.lengthButton,
                    styles.lengthButtonActive,
                ];
            }

            return styles.lengthButton;
        };

    const getLengthTextStyle =
        (
            length
        ) => {
            if (
                summaryLength ===
                length
            ) {
                return [
                    styles.lengthButtonText,
                    styles.lengthButtonTextActive,
                ];
            }

            return styles.lengthButtonText;
        };

    // ========================================
    // NO DOCUMENT
    // ========================================

    if (!document) {
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

                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        AI Tóm tắt
                    </Text>

                    <View
                        style={
                            styles.headerSpace
                        }
                    />
                </View>

                <View
                    style={
                        styles.emptyDocumentContainer
                    }
                >
                    <Text
                        style={
                            styles.emptyDocumentIcon
                        }
                    >
                        📄
                    </Text>

                    <Text
                        style={
                            styles.emptyDocumentTitle
                        }
                    >
                        Không tìm thấy tài liệu
                    </Text>

                    <Text
                        style={
                            styles.emptyDocumentText
                        }
                    >
                        Vui lòng quay lại và chọn một tài liệu.
                    </Text>
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

                        <Text
                            style={
                                styles.documentMeta
                            }
                        >
                            {document.fileType
                                ? document.fileType.toUpperCase()
                                : "Tài liệu"}
                        </Text>

                        {document.subject ? (
                            <Text
                                style={
                                    styles.documentSubject
                                }
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    document.subject
                                }
                            </Text>
                        ) : null}
                    </View>
                </View>

                {/* OPTIONS */}

                <View
                    style={
                        styles.optionCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Độ dài bản tóm tắt
                    </Text>

                    <Text
                        style={
                            styles.sectionDescription
                        }
                    >
                        Chọn mức độ chi tiết mà bạn muốn AI tạo.
                    </Text>

                    <View
                        style={
                            styles.lengthContainer
                        }
                    >
                        <TouchableOpacity
                            style={
                                getLengthButtonStyle(
                                    "short"
                                )
                            }
                            onPress={() => {
                                setSummaryLength(
                                    "short"
                                );

                                setError(
                                    ""
                                );
                            }}
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={
                                    styles.lengthIcon
                                }
                            >
                                ⚡
                            </Text>

                            <Text
                                style={
                                    getLengthTextStyle(
                                        "short"
                                    )
                                }
                            >
                                Ngắn
                            </Text>

                            <Text
                                style={
                                    styles.lengthDescription
                                }
                            >
                                Ý chính
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                getLengthButtonStyle(
                                    "medium"
                                )
                            }
                            onPress={() => {
                                setSummaryLength(
                                    "medium"
                                );

                                setError(
                                    ""
                                );
                            }}
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={
                                    styles.lengthIcon
                                }
                            >
                                📝
                            </Text>

                            <Text
                                style={
                                    getLengthTextStyle(
                                        "medium"
                                    )
                                }
                            >
                                Vừa
                            </Text>

                            <Text
                                style={
                                    styles.lengthDescription
                                }
                            >
                                Cân bằng
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                getLengthButtonStyle(
                                    "detailed"
                                )
                            }
                            onPress={() => {
                                setSummaryLength(
                                    "detailed"
                                );

                                setError(
                                    ""
                                );
                            }}
                            disabled={
                                isLoading
                            }
                        >
                            <Text
                                style={
                                    styles.lengthIcon
                                }
                            >
                                📚
                            </Text>

                            <Text
                                style={
                                    getLengthTextStyle(
                                        "detailed"
                                    )
                                }
                            >
                                Chi tiết
                            </Text>

                            <Text
                                style={
                                    styles.lengthDescription
                                }
                            >
                                Đầy đủ
                            </Text>
                        </TouchableOpacity>
                    </View>

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
                        activeOpacity={
                            0.8
                        }
                    >
                        {isLoading ? (
                            <>
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
                                    AI đang tóm tắt...
                                </Text>
                            </>
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

                    {error ? (
                        <View
                            style={
                                styles.errorContainer
                            }
                        >
                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                {error}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* SUMMARY */}

                {summary ? (
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
                            <View>
                                <Text
                                    style={
                                        styles.summaryTitle
                                    }
                                >
                                    Bản tóm tắt
                                </Text>

                                <Text
                                    style={
                                        styles.summarySubtitle
                                    }
                                >
                                    Được tạo bởi AI
                                </Text>
                            </View>

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
                                        generatedType
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
                                selectable
                            >
                                {summary}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.generatedContainer
                            }
                        >
                            <View
                                style={
                                    styles.generatedDot
                                }
                            />

                            <Text
                                style={
                                    styles.generatedText
                                }
                            >
                                Tóm tắt đã được tạo thành công
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View
                        style={
                            styles.emptySummaryCard
                        }
                    >
                        <View
                            style={
                                styles.emptySummaryIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.emptySummaryIcon
                                }
                            >
                                ✨
                            </Text>
                        </View>

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
                            Chọn độ dài mong muốn rồi nhấn
                            "Tạo bản tóm tắt" để AI xử lý tài liệu.
                        </Text>
                    </View>
                )}
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

        // ========================================
        // HEADER
        // ========================================

        header: {
            height: 100,
            paddingTop: 45,
            paddingHorizontal: 16,
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
            flex: 1,
            fontSize: 19,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
            marginHorizontal: 8,
        },

        headerSpace: {
            width: 40,
        },

        historyButton: {
            paddingHorizontal: 11,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor:
                "#EEF2FF",
        },

        historyButtonText: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.primary,
        },

        // ========================================
        // CONTENT
        // ========================================

        content: {
            padding: 20,
            paddingBottom: 40,
        },

        // ========================================
        // DOCUMENT CARD
        // ========================================

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
            width: 54,
            height: 54,
            borderRadius: 13,
            backgroundColor:
                "#EEF2FF",
            alignItems: "center",
            justifyContent:
                "center",
            marginRight: 14,
        },

        documentIcon: {
            fontSize: 27,
        },

        documentInfo: {
            flex: 1,
        },

        documentName: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "700",
            color: colors.text,
        },

        documentMeta: {
            fontSize: 11,
            fontWeight: "700",
            color: colors.primary,
            marginTop: 5,
        },

        documentSubject: {
            fontSize: 12,
            color: colors.gray,
            marginTop: 3,
        },

        // ========================================
        // OPTIONS
        // ========================================

        optionCard: {
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
            fontSize: 17,
            fontWeight: "700",
            color: colors.text,
        },

        sectionDescription: {
            fontSize: 13,
            lineHeight: 19,
            color: colors.gray,
            marginTop: 5,
            marginBottom: 16,
        },

        lengthContainer: {
            flexDirection: "row",
            gap: 8,
            marginBottom: 20,
        },

        lengthButton: {
            flex: 1,
            minHeight: 92,
            paddingVertical: 12,
            paddingHorizontal: 5,
            borderRadius: 11,
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
                "#EEF2FF",
            borderColor:
                colors.primary,
        },

        lengthIcon: {
            fontSize: 20,
            marginBottom: 7,
        },

        lengthButtonText: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.gray,
        },

        lengthButtonTextActive: {
            color: colors.primary,
        },

        lengthDescription: {
            fontSize: 10,
            color: colors.gray,
            marginTop: 4,
        },

        createButton: {
            minHeight: 50,
            flexDirection: "row",
            gap: 9,
            backgroundColor:
                colors.primary,
            borderRadius: 11,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent:
                "center",
        },

        createButtonText: {
            fontSize: 15,
            fontWeight: "700",
            color: colors.white,
        },

        disabledButton: {
            opacity: 0.65,
        },

        errorContainer: {
            backgroundColor:
                "#FEF2F2",
            borderRadius: 9,
            padding: 11,
            marginTop: 12,
        },

        errorText: {
            fontSize: 13,
            lineHeight: 19,
            color: colors.error,
            textAlign: "center",
        },

        // ========================================
        // SUMMARY
        // ========================================

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
            alignItems:
                "flex-start",
            justifyContent:
                "space-between",
            marginBottom: 16,
        },

        summaryTitle: {
            fontSize: 19,
            fontWeight: "700",
            color: colors.text,
        },

        summarySubtitle: {
            fontSize: 12,
            color: colors.gray,
            marginTop: 3,
        },

        summaryBadge: {
            backgroundColor:
                "#EEF2FF",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
        },

        summaryBadgeText: {
            fontSize: 11,
            fontWeight: "700",
            color: colors.primary,
        },

        summaryContent: {
            backgroundColor:
                colors.background,
            borderRadius: 11,
            padding: 15,
        },

        summaryText: {
            fontSize: 14,
            lineHeight: 23,
            color: colors.text,
        },

        generatedContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 14,
        },

        generatedDot: {
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor:
                "#16A34A",
            marginRight: 7,
        },

        generatedText: {
            fontSize: 12,
            color: colors.gray,
        },

        // ========================================
        // EMPTY SUMMARY
        // ========================================

        emptySummaryCard: {
            backgroundColor:
                colors.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                colors.border,
            paddingVertical: 35,
            paddingHorizontal: 25,
            alignItems: "center",
        },

        emptySummaryIconContainer: {
            width: 64,
            height: 64,
            borderRadius: 18,
            backgroundColor:
                "#EEF2FF",
            alignItems: "center",
            justifyContent:
                "center",
            marginBottom: 14,
        },

        emptySummaryIcon: {
            fontSize: 30,
        },

        emptySummaryTitle: {
            fontSize: 17,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 7,
        },

        emptySummaryText: {
            fontSize: 13,
            lineHeight: 20,
            color: colors.gray,
            textAlign: "center",
            maxWidth: 310,
        },

        // ========================================
        // EMPTY DOCUMENT
        // ========================================

        emptyDocumentContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent:
                "center",
            paddingHorizontal: 30,
            paddingBottom: 80,
        },

        emptyDocumentIcon: {
            fontSize: 45,
            marginBottom: 15,
        },

        emptyDocumentTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 8,
        },

        emptyDocumentText: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.gray,
            textAlign: "center",
        },
    });