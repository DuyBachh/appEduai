import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function SummarySections({
    sections,
    loading,
    error,
    selectedSectionId,
    onSelect,
    disabled,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>Phạm vi tóm tắt</Text>
            <Text style={styles.description}>
                Chọn toàn bộ tài liệu hoặc một chương/phần riêng.
            </Text>

            {loading ? (
                <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.muted}>Đang tải chương/phần...</Text>
                </View>
            ) : null}

            {error ? (
                <Text style={styles.error}>
                    {error} Bạn vẫn có thể chọn tóm tắt toàn bộ.
                </Text>
            ) : null}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.options}
            >
                <Option
                    title="Toàn bộ tài liệu"
                    selected={selectedSectionId === null}
                    onPress={() => onSelect(null)}
                    disabled={disabled}
                />
                {sections.map((section) => (
                    <Option
                        key={section.id}
                        title={section.title}
                        caption={`${section.charCount} ký tự`}
                        selected={selectedSectionId === section.id}
                        onPress={() => onSelect(section.id)}
                        disabled={disabled}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

function Option({ title, caption, selected, onPress, disabled }) {
    return (
        <TouchableOpacity
            style={[styles.option, selected && styles.activeOption]}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
        >
            <Text
                style={[styles.optionTitle, selected && styles.activeText]}
                numberOfLines={2}
            >
                {title}
            </Text>
            {caption ? (
                <Text style={[styles.caption, selected && styles.activeText]}>
                    {caption}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },
    heading: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
    },
    description: {
        fontSize: 13,
        color: colors.gray,
        marginTop: 5,
        marginBottom: 12,
    },
    loadingRow: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        marginBottom: 8,
    },
    muted: { color: colors.gray, fontSize: 13 },
    error: { color: colors.error, fontSize: 13, marginBottom: 8 },
    options: { gap: 9, paddingRight: 10 },
    option: {
        minWidth: 128,
        maxWidth: 190,
        minHeight: 56,
        padding: 11,
        justifyContent: "center",
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: colors.white,
    },
    activeOption: {
        borderColor: colors.primary,
        backgroundColor: "#EEF2FF",
    },
    optionTitle: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "600",
    },
    activeText: { color: colors.primary },
    caption: { fontSize: 11, color: colors.gray, marginTop: 3 },
});
