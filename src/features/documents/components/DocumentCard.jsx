import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import {
    formatDate,
    formatFileSize,
    getDocumentName,
    getFileType,
} from "../utils/documentUtils";

export default function DocumentCard({
    document,
    disabled,
    onOpen,
    onClassify,
    onRename,
    onDelete,
}) {
    const name =
        getDocumentName(document);

    const date =
        formatDate(
            document?.createdAt ||
                document?.updatedAt ||
                document?.date
        );

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.main}
                onPress={() =>
                    onOpen(document)
                }
                activeOpacity={0.75}
            >
                <View style={styles.fileIcon}>
                    <Text style={styles.fileIconText}>
                        📄
                    </Text>

                    <Text style={styles.fileType}>
                        {getFileType(document)}
                    </Text>
                </View>

                <View style={styles.info}>
                    <Text
                        style={styles.fileName}
                        numberOfLines={2}
                    >
                        {name}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>
                            {formatFileSize(
                                document?.size ||
                                    document?.fileSize
                            )}
                        </Text>

                        {date ? (
                            <>
                                <Text style={styles.metaDot}>
                                    •
                                </Text>
                                <Text style={styles.metaText}>
                                    {date}
                                </Text>
                            </>
                        ) : null}
                    </View>

                    {document?.subject ? (
                        <Text
                            style={styles.subjectText}
                            numberOfLines={1}
                        >
                            Môn học: {document.subject}
                        </Text>
                    ) : null}

                    {document?.topic ? (
                        <Text
                            style={styles.topicText}
                            numberOfLines={1}
                        >
                            Chủ đề: {document.topic}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.actions}>
                <ActionButton
                    label="Xem"
                    onPress={() =>
                        onOpen(document)
                    }
                    disabled={disabled}
                />

                <ActionButton
                    label="Phân loại"
                    onPress={() =>
                        onClassify(document)
                    }
                    disabled={disabled}
                />

                <ActionButton
                    label="Đổi tên"
                    onPress={() =>
                        onRename(document)
                    }
                    disabled={disabled}
                />

                <ActionButton
                    label="Xóa"
                    danger
                    onPress={() =>
                        onDelete(document)
                    }
                    disabled={disabled}
                />
            </View>
        </View>
    );
}

function ActionButton({
    label,
    onPress,
    disabled,
    danger = false,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.actionButton,
                danger &&
                    styles.dangerButton,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    styles.actionText,
                    danger &&
                        styles.dangerText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    main: {
        flexDirection: "row",
        alignItems: "center",
    },
    fileIcon: {
        width: 58,
        height: 58,
        borderRadius: 12,
        backgroundColor:
            colors.background,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    fileIconText: {
        fontSize: 25,
    },
    fileType: {
        fontSize: 9,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 2,
    },
    info: {
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "600",
        color: colors.text,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    metaText: {
        fontSize: 12,
        color: colors.gray,
    },
    metaDot: {
        fontSize: 12,
        color: colors.gray,
        marginHorizontal: 7,
    },
    subjectText: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "600",
        color: colors.primary,
    },
    topicText: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 18,
        color: colors.gray,
    },
    divider: {
        height: 1,
        backgroundColor:
            colors.border,
        marginVertical: 13,
    },
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:
            "space-between",
        gap: 8,
    },
    actionButton: {
        width: "48%",
        height: 38,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 8,
        backgroundColor:
            colors.white,
        alignItems: "center",
        justifyContent: "center",
    },
    actionText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text,
    },
    dangerButton: {
        borderColor: colors.error,
    },
    dangerText: {
        color: colors.error,
    },
});
