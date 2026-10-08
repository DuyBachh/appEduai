import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import {
    formatFileSize,
    getFileType,
} from "../utils/documentUtils";

export default function DocumentInfoCard({
    document,
}) {
    const fileType =
        document?.fileType
            ?.toUpperCase() ||
        getFileType(document);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Thông tin tài liệu
            </Text>

            <InfoRow
                label="Tên file"
                value={
                    document?.name ||
                    "Không có"
                }
            />

            <InfoRow
                label="Loại file"
                value={fileType}
            />

            <InfoRow
                label="Kích thước"
                value={formatFileSize(
                    document?.size
                )}
            />

            <InfoRow
                label="Môn học"
                value={
                    document?.subject ||
                    "Chưa phân loại"
                }
                primary={
                    Boolean(
                        document?.subject
                    )
                }
            />

            <InfoRow
                label="Chủ đề"
                value={
                    document?.topic ||
                    "Chưa phân loại"
                }
                primary={
                    Boolean(
                        document?.topic
                    )
                }
                last
            />
        </View>
    );
}

function InfoRow({
    label,
    value,
    primary = false,
    last = false,
}) {
    return (
        <View
            style={[
                styles.row,
                last && styles.lastRow,
            ]}
        >
            <Text style={styles.label}>
                {label}
            </Text>

            <Text
                style={[
                    styles.value,
                    primary &&
                        styles.primaryValue,
                ]}
                numberOfLines={
                    label === "Tên file"
                        ? 3
                        : undefined
                }
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 18,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
    },
    lastRow: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    label: {
        width: 95,
        fontSize: 13,
        color: colors.gray,
    },
    value: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "600",
        color: colors.text,
        textAlign: "right",
    },
    primaryValue: {
        color: colors.primary,
    },
});
