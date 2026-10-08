import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function HintCard({
    hints = [],
    hintIndex = 0,
    onPrevious,
    onNext,
}) {
    if (!hints.length) {
        return null;
    }

    const isFirst = hintIndex === 0;
    const isLast =
        hintIndex >= hints.length - 1;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                💡 Gợi ý
            </Text>

            <View style={styles.hintBox}>
                <Text style={styles.hintNumber}>
                    Gợi ý {hintIndex + 1}/{hints.length}
                </Text>

                <Text style={styles.hintText}>
                    {hints[hintIndex]}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        isFirst &&
                            styles.disabledButton,
                    ]}
                    onPress={onPrevious}
                    disabled={isFirst}
                >
                    <Text style={styles.buttonText}>
                        ← Gợi ý trước
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        isLast &&
                            styles.disabledButton,
                    ]}
                    onPress={onNext}
                    disabled={isLast}
                >
                    <Text style={styles.buttonText}>
                        {isLast
                            ? "Đã hết"
                            : "Gợi ý tiếp →"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 12,
    },
    hintBox: {
        backgroundColor: "#FFFBEB",
        borderWidth: 1,
        borderColor: "#FDE68A",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    hintNumber: {
        fontSize: 13,
        fontWeight: "700",
        color: "#92400E",
        marginBottom: 6,
    },
    hintText: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.text,
    },
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    buttonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "700",
    },
    disabledButton: {
        opacity: 0.4,
    },
});
