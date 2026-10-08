import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import {
    formatDate,
    getFileType,
} from "../utils/documentUtils";

export default function DocumentOverviewCard({
    document,
}) {
    const fileType =
        document?.fileType
            ?.toUpperCase() ||
        getFileType(document);

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                    📄
                </Text>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {fileType}
                    </Text>
                </View>
            </View>

            <Text style={styles.fileName}>
                {document?.name ||
                    "Tài liệu không tên"}
            </Text>

            <Text style={styles.date}>
                Ngày tải lên:{" "}
                {formatDate(
                    document?.createdAt ||
                        document?.date
                ) || "Không rõ"}
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
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },
    iconContainer: {
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
    icon: {
        fontSize: 38,
    },
    badge: {
        position: "absolute",
        bottom: -6,
        backgroundColor:
            colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    badgeText: {
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
    date: {
        fontSize: 13,
        color: colors.gray,
        textAlign: "center",
    },
});
