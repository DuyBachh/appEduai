import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import HintCard from "./HintCard";

function InfoBox({ label, value }) {
    return (
        <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
                {label}
            </Text>

            <Text style={styles.infoValue}>
                {value}
            </Text>
        </View>
    );
}

export default function SolverResult({
    result,
    hintIndex,
    onPreviousHint,
    onNextHint,
    onReset,
}) {
    if (!result) {
        return null;
    }

    return (
        <>
            <View style={styles.card}>
                <Text style={styles.title}>
                    Phân tích bài tập
                </Text>

                <View style={styles.infoRow}>
                    <InfoBox
                        label="Loại bài"
                        value={result.type}
                    />
                    <InfoBox
                        label="Chủ đề"
                        value={result.topic}
                    />
                </View>
            </View>

            <HintCard
                hints={result.hints}
                hintIndex={hintIndex}
                onPrevious={onPreviousHint}
                onNext={onNextHint}
            />

            <View style={styles.card}>
                <Text style={styles.title}>
                    📖 Giải thích
                </Text>

                <Text
                    selectable
                    style={styles.bodyText}
                >
                    {result.explanation}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>
                    📝 Các bước giải
                </Text>

                {result.steps.map(
                    (step, index) => (
                        <View
                            key={`${index}-${step}`}
                            style={styles.step}
                        >
                            <View
                                style={styles.stepNumber}
                            >
                                <Text
                                    style={
                                        styles.stepNumberText
                                    }
                                >
                                    {index + 1}
                                </Text>
                            </View>

                            <Text
                                selectable
                                style={styles.stepText}
                            >
                                {step}
                            </Text>
                        </View>
                    )
                )}
            </View>

            <View style={styles.answerBox}>
                <Text style={styles.answerTitle}>
                    ✅ Đáp án cuối cùng
                </Text>

                <Text
                    selectable
                    style={styles.answerText}
                >
                    {result.finalAnswer}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.resetButton}
                onPress={onReset}
            >
                <Text style={styles.resetText}>
                    + Giải bài khác
                </Text>
            </TouchableOpacity>
        </>
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
    infoRow: {
        flexDirection: "row",
        gap: 12,
    },
    infoBox: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 14,
    },
    infoLabel: {
        fontSize: 13,
        color: colors.gray,
        marginBottom: 6,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.text,
    },
    step: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 13,
        marginBottom: 10,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    stepNumberText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: "700",
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 23,
        color: colors.text,
    },
    answerBox: {
        backgroundColor: "#EEF2FF",
        borderWidth: 1,
        borderColor: "#C7D2FE",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    answerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 8,
    },
    answerText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
        color: colors.text,
    },
    resetButton: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: colors.white,
    },
    resetText: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
    },
});
