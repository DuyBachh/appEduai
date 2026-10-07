import {
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

export default function DocumentDetailScreen({
    navigation,
    route,
}) {
    const initialDocument =
        route.params?.document;

    const [
        document,
        setDocument,
    ] = useState(
        initialDocument || null
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        showFullText,
        setShowFullText,
    ] = useState(false);

    // ========================================
    // HELPERS
    // ========================================

    const getDocumentId = (
        value
    ) => {
        return (
            value?.id ||
            value?._id
        );
    };

    const formatFileSize = (
        size
    ) => {
        const number =
            Number(size);

        if (
            !number ||
            Number.isNaN(number)
        ) {
            return "Không xác định";
        }

        if (number < 1024) {
            return `${number} B`;
        }

        if (
            number <
            1024 * 1024
        ) {
            return `${(
                number / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            number /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "Không rõ";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Không rõ";
        }

        return date.toLocaleDateString(
            "vi-VN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    const getFileType = () => {
        if (
            document?.fileType
        ) {
            return document.fileType
                .toUpperCase();
        }

        return (
            document?.name
                ?.split(".")
                .pop()
                ?.toUpperCase() ||
            "FILE"
        );
    };

    // ========================================
    // LOAD DOCUMENT DETAIL
    // ========================================

    const loadDocument =
        useCallback(
            async () => {
                const documentId =
                    getDocumentId(
                        initialDocument
                    );

                if (!documentId) {
                    setError(
                        "Không tìm thấy ID tài liệu."
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
                            `/documents/${documentId}`
                        );

                    if (
                        !result?.data
                    ) {
                        throw new Error(
                            "Không tìm thấy dữ liệu tài liệu."
                        );
                    }

                    setDocument(
                        result.data
                    );

                    console.log(
                        "DOCUMENT DETAIL SUCCESS:",
                        result.data
                    );
                } catch (error) {
                    console.log(
                        "DOCUMENT DETAIL ERROR:",
                        error.message
                    );

                    setError(
                        error.message ||
                            "Không thể tải chi tiết tài liệu."
                    );
                } finally {
                    setIsLoading(
                        false
                    );
                }
            },
            [initialDocument]
        );

    useFocusEffect(
        useCallback(() => {
            loadDocument();

            return undefined;
        }, [loadDocument])
    );

    // ========================================
    // NAVIGATION
    // ========================================

    const handleSummary = () => {
        if (!document) {
            return;
        }

        navigation.navigate(
            "Summary",
            {
                document,
            }
        );
    };

    const handleChat = () => {
        if (!document) {
            return;
        }

        navigation.navigate(
            "Chat",
            {
                document,
            }
        );
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
                    activeOpacity={
                        0.7
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
                    Chi tiết tài liệu
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
                        styles.loadingContainer
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
                        Đang tải chi tiết tài liệu...
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
        !document
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
                        styles.emptyContainer
                    }
                >
                    <Text
                        style={
                            styles.emptyIcon
                        }
                    >
                        📄
                    </Text>

                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        Không thể tải tài liệu
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        {error ||
                            "Dữ liệu tài liệu không tồn tại."}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.retryButton
                        }
                        onPress={
                            loadDocument
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
            </View>
        );
    }

    const extractedText =
        document.extractedText
            ?.trim() || "";

    const hasLongText =
        extractedText.length >
        700;

    const displayedText =
        !showFullText &&
        hasLongText
            ? `${extractedText.slice(
                  0,
                  700
              )}...`
            : extractedText;

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
                {/* =================================
                    FILE CARD
                ================================= */}

                <View
                    style={
                        styles.fileCard
                    }
                >
                    <View
                        style={
                            styles.fileIconContainer
                        }
                    >
                        <Text
                            style={
                                styles.fileIcon
                            }
                        >
                            📄
                        </Text>

                        <View
                            style={
                                styles.fileTypeBadge
                            }
                        >
                            <Text
                                style={
                                    styles.fileTypeBadgeText
                                }
                            >
                                {getFileType()}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={
                            styles.fileName
                        }
                    >
                        {document.name ||
                            "Tài liệu không tên"}
                    </Text>

                    <Text
                        style={
                            styles.fileDate
                        }
                    >
                        Ngày tải lên:{" "}
                        {formatDate(
                            document.createdAt ||
                                document.date
                        )}
                    </Text>
                </View>

                {/* =================================
                    INFORMATION
                ================================= */}

                <View
                    style={
                        styles.infoCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Thông tin tài liệu
                    </Text>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Tên file
                        </Text>

                        <Text
                            style={
                                styles.infoValue
                            }
                            numberOfLines={
                                3
                            }
                        >
                            {document.name ||
                                "Không có"}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Loại file
                        </Text>

                        <Text
                            style={
                                styles.infoValue
                            }
                        >
                            {getFileType()}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Kích thước
                        </Text>

                        <Text
                            style={
                                styles.infoValue
                            }
                        >
                            {formatFileSize(
                                document.size
                            )}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Môn học
                        </Text>

                        <Text
                            style={[
                                styles.infoValue,

                                document.subject &&
                                    styles.infoValuePrimary,
                            ]}
                        >
                            {document.subject ||
                                "Chưa phân loại"}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.infoRow,
                            styles.lastInfoRow,
                        ]}
                    >
                        <Text
                            style={
                                styles.infoLabel
                            }
                        >
                            Chủ đề
                        </Text>

                        <Text
                            style={[
                                styles.infoValue,

                                document.topic &&
                                    styles.infoValuePrimary,
                            ]}
                        >
                            {document.topic ||
                                "Chưa phân loại"}
                        </Text>
                    </View>
                </View>

                {/* =================================
                    EXTRACTED TEXT
                ================================= */}

                <View
                    style={
                        styles.textCard
                    }
                >
                    <View
                        style={
                            styles.sectionHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.sectionTitleNoMargin
                                }
                            >
                                Nội dung tài liệu
                            </Text>

                            <Text
                                style={
                                    styles.sectionSubtitle
                                }
                            >
                                Văn bản được trích xuất tự động
                            </Text>
                        </View>

                        {extractedText ? (
                            <View
                                style={
                                    styles.successBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.successBadgeText
                                    }
                                >
                                    Đã xử lý
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {extractedText ? (
                        <>
                            <View
                                style={
                                    styles.extractedTextContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.extractedText
                                    }
                                    selectable
                                >
                                    {displayedText}
                                </Text>
                            </View>

                            {hasLongText ? (
                                <TouchableOpacity
                                    style={
                                        styles.expandButton
                                    }
                                    onPress={() =>
                                        setShowFullText(
                                            (
                                                current
                                            ) =>
                                                !current
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.expandButtonText
                                        }
                                    >
                                        {showFullText
                                            ? "Thu gọn"
                                            : "Xem toàn bộ nội dung"}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </>
                    ) : (
                        <View
                            style={
                                styles.noTextContainer
                            }
                        >
                            <Text
                                style={
                                    styles.noTextIcon
                                }
                            >
                                📝
                            </Text>

                            <Text
                                style={
                                    styles.noTextTitle
                                }
                            >
                                Chưa có nội dung
                            </Text>

                            <Text
                                style={
                                    styles.noTextDescription
                                }
                            >
                                Tài liệu này chưa có văn bản được trích xuất.
                            </Text>
                        </View>
                    )}
                </View>

                {/* =================================
                    AI TOOLS
                ================================= */}

                <View
                    style={
                        styles.actionCard
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Công cụ học tập
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.summaryButton
                        }
                        onPress={
                            handleSummary
                        }
                        activeOpacity={
                            0.8
                        }
                    >
                        <View
                            style={
                                styles.actionIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.actionIcon
                                }
                            >
                                ✨
                            </Text>
                        </View>

                        <View
                            style={
                                styles.actionButtonContent
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
                                Tạo bản tóm tắt thông minh từ tài liệu
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.lightArrow
                            }
                        >
                            ›
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.chatButton
                        }
                        onPress={
                            handleChat
                        }
                        activeOpacity={
                            0.8
                        }
                    >
                        <View
                            style={
                                styles.chatIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.actionIcon
                                }
                            >
                                💬
                            </Text>
                        </View>

                        <View
                            style={
                                styles.actionButtonContent
                            }
                        >
                            <Text
                                style={
                                    styles.chatButtonTitle
                                }
                            >
                                Chat với tài liệu
                            </Text>

                            <Text
                                style={
                                    styles.chatButtonDescription
                                }
                            >
                                Đặt câu hỏi dựa trên nội dung tài liệu
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.darkArrow
                            }
                        >
                            ›
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
        backgroundColor:
            colors.background,
    },

    // ========================================
    // HEADER
    // ========================================

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
        justifyContent: "center",
    },

    backText: {
        fontSize: 36,
        color: colors.text,
        lineHeight: 40,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },

    headerSpace: {
        width: 40,
    },

    // ========================================
    // CONTENT
    // ========================================

    content: {
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    // ========================================
    // FILE CARD
    // ========================================

    fileCard: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },

    fileIconContainer: {
        width: 82,
        height: 82,
        borderRadius: 22,
        backgroundColor:
            "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        position: "relative",
    },

    fileIcon: {
        fontSize: 38,
    },

    fileTypeBadge: {
        position: "absolute",
        bottom: -6,
        backgroundColor:
            colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },

    fileTypeBadgeText: {
        fontSize: 9,
        fontWeight: "700",
        color: colors.white,
    },

    fileName: {
        fontSize: 19,
        lineHeight: 26,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        marginBottom: 8,
    },

    fileDate: {
        fontSize: 13,
        color: colors.gray,
        textAlign: "center",
    },

    // ========================================
    // INFO CARD
    // ========================================

    infoCard: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 18,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 14,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
    },

    lastInfoRow: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },

    infoLabel: {
        width: 95,
        fontSize: 13,
        color: colors.gray,
    },

    infoValue: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "600",
        color: colors.text,
        textAlign: "right",
    },

    infoValuePrimary: {
        color: colors.primary,
    },

    // ========================================
    // EXTRACTED TEXT
    // ========================================

    textCard: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 18,
        marginBottom: 16,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent:
            "space-between",
        gap: 10,
        marginBottom: 14,
    },

    sectionTitleNoMargin: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },

    sectionSubtitle: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 4,
    },

    successBadge: {
        backgroundColor:
            "#ECFDF5",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
    },

    successBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#059669",
    },

    extractedTextContainer: {
        backgroundColor:
            colors.background,
        borderRadius: 12,
        padding: 14,
    },

    extractedText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
    },

    expandButton: {
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    expandButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary,
    },

    noTextContainer: {
        alignItems: "center",
        paddingVertical: 24,
    },

    noTextIcon: {
        fontSize: 30,
        marginBottom: 10,
    },

    noTextTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },

    noTextDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        textAlign: "center",
    },

    // ========================================
    // AI ACTIONS
    // ========================================

    actionCard: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 18,
    },

    summaryButton: {
        minHeight: 78,
        backgroundColor:
            colors.primary,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    chatButton: {
        minHeight: 78,
        backgroundColor:
            colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor:
            colors.border,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
    },

    actionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor:
            "rgba(255,255,255,0.16)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    chatIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor:
            "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    actionIcon: {
        fontSize: 22,
    },

    actionButtonContent: {
        flex: 1,
    },

    summaryButtonTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 3,
    },

    summaryButtonDescription: {
        fontSize: 12,
        lineHeight: 17,
        color: "#E0E7FF",
    },

    chatButtonTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 3,
    },

    chatButtonDescription: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.gray,
    },

    lightArrow: {
        fontSize: 26,
        color: colors.white,
        marginLeft: 8,
    },

    darkArrow: {
        fontSize: 26,
        color: colors.gray,
        marginLeft: 8,
    },

    // ========================================
    // LOADING / ERROR
    // ========================================

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 70,
    },

    loadingText: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 12,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingBottom: 70,
    },

    emptyIcon: {
        fontSize: 42,
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.gray,
        textAlign: "center",
        marginBottom: 20,
    },

    retryButton: {
        height: 46,
        minWidth: 120,
        paddingHorizontal: 20,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    retryButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
    },
});