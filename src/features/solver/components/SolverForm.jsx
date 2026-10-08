import React from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function SolverForm({
    question,
    selectedImage,
    loading,
    solverLoading,
    ocrLoading,
    error,
    onQuestionChange,
    onTakePhoto,
    onPickImage,
    onRemoveImage,
    onReadImage,
    onSolve,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Bài tập
            </Text>

            <TextInput
                style={styles.input}
                value={question}
                onChangeText={onQuestionChange}
                placeholder="Ví dụ: Giải phương trình x² - 5x + 6 = 0"
                placeholderTextColor={colors.gray}
                multiline
                maxLength={6000}
                editable={!loading}
                textAlignVertical="top"
            />

            <Text style={styles.characterCount}>
                {question.length}/6000
            </Text>

            <View style={styles.imageActions}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onTakePhoto}
                    disabled={loading}
                >
                    <Text
                        style={styles.secondaryButtonText}
                    >
                        📷 Chụp ảnh
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onPickImage}
                    disabled={loading}
                >
                    <Text
                        style={styles.secondaryButtonText}
                    >
                        🖼️ Thư viện
                    </Text>
                </TouchableOpacity>
            </View>

            {selectedImage ? (
                <View style={styles.imageSection}>
                    <Image
                        source={{
                            uri: selectedImage.uri,
                        }}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />

                    <Text
                        style={styles.imageName}
                        numberOfLines={1}
                    >
                        {selectedImage.name}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            loading &&
                                styles.disabledButton,
                        ]}
                        onPress={onReadImage}
                        disabled={loading}
                    >
                        {ocrLoading ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator
                                    size="small"
                                    color={colors.white}
                                />
                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >
                                    Đang đọc đề...
                                </Text>
                            </View>
                        ) : (
                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                Đọc đề từ ảnh
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={onRemoveImage}
                        disabled={loading}
                    >
                        <Text style={styles.removeText}>
                            Xóa ảnh
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {selectedImage && question.trim() ? (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Nội dung OCR đã được đưa vào ô bài tập.
                        Bạn có thể chỉnh sửa trước khi giải.
                    </Text>
                </View>
            ) : null}

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            ) : null}

            <TouchableOpacity
                style={[
                    styles.solveButton,
                    loading &&
                        styles.disabledButton,
                ]}
                onPress={onSolve}
                disabled={loading}
            >
                {solverLoading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator
                            color={colors.white}
                        />
                        <Text
                            style={
                                styles.primaryButtonText
                            }
                        >
                            AI đang giải...
                        </Text>
                    </View>
                ) : (
                    <Text
                        style={styles.primaryButtonText}
                    >
                        Giải bài tập
                    </Text>
                )}
            </TouchableOpacity>
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
    input: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        lineHeight: 22,
        color: colors.text,
        backgroundColor: "#FAFAFA",
    },
    characterCount: {
        marginTop: 6,
        marginBottom: 12,
        textAlign: "right",
        fontSize: 12,
        color: colors.gray,
    },
    imageActions: {
        flexDirection: "row",
        gap: 10,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: "center",
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "700",
    },
    imageSection: {
        marginTop: 14,
    },
    previewImage: {
        width: "100%",
        height: 230,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
    },
    imageName: {
        marginTop: 8,
        fontSize: 12,
        color: colors.gray,
    },
    primaryButton: {
        marginTop: 12,
        minHeight: 46,
        backgroundColor: colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: "700",
    },
    removeButton: {
        marginTop: 10,
        minHeight: 44,
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    removeText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: "600",
    },
    infoBox: {
        marginTop: 12,
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        padding: 12,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.primary,
    },
    errorBox: {
        marginTop: 12,
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 12,
        padding: 12,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        lineHeight: 20,
    },
    solveButton: {
        marginTop: 14,
        minHeight: 48,
        backgroundColor: colors.primary,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    disabledButton: {
        opacity: 0.65,
    },
});
