import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function DocumentDetailHeader({
    onBack,
}) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
            >
                <Text style={styles.backText}>
                    ‹
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                Chi tiết tài liệu
            </Text>

            <View style={styles.space} />
        </View>
    );
}

const styles = StyleSheet.create({
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
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    space: {
        width: 40,
    },
});
