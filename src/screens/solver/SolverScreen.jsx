import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import colors from "../../styles/colors";

export default function SolverScreen() {
    const [question, setQuestion] = useState("");
    const [imageUri, setImageUri] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [result, setResult] = useState(null);
    const [hintIndex, setHintIndex] = useState(0);

    const [followUp, setFollowUp] = useState("");
    const [followUpAnswer, setFollowUpAnswer] = useState("");

    // =========================
    // UPLOAD IMAGE
    // =========================

    const handlePickImage = async () => {
        try {
            // Đóng keyboard trước khi mở thư viện ảnh
            Keyboard.dismiss();

            // Chờ iOS đóng keyboard hoàn toàn
            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });

            setError("");

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                setError(
                    "Ứng dụng cần quyền truy cập thư viện ảnh."
                );
                return;
            }

            const pickerResult =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.8,
                });

            if (pickerResult.canceled) {
                return;
            }

            const selectedImage = pickerResult.assets?.[0];

            if (!selectedImage?.uri) {
                setError("Không thể lấy hình ảnh.");
                return;
            }

            setImageUri(selectedImage.uri);
            setError("");
        } catch (err) {
            setError("Không thể chọn hình ảnh.");
        }
    };

    // =========================
    // ANALYZE
    // =========================

    const handleAnalyze = async () => {
        // Đóng keyboard
        Keyboard.dismiss();

        if (!question.trim() && !imageUri) {
            setError(
                "Vui lòng nhập bài toán hoặc tải ảnh bài toán."
            );
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);
        setHintIndex(0);
        setFollowUpAnswer("");

        try {
            // Mock AI
            await new Promise((resolve) => {
                setTimeout(resolve, 1500);
            });

            setResult({
                problemType: "Bài toán tính toán",

                topic: "Đại số",

                hints: [
                    "Xác định các dữ kiện đã cho trong đề bài.",
                    "Xác định công thức hoặc phương pháp cần sử dụng.",
                    "Thay các giá trị đã biết vào công thức và thực hiện phép tính.",
                ],

                explanation:
                    "Trước tiên, cần xác định dữ kiện và yêu cầu của bài toán. " +
                    "Sau đó lựa chọn công thức phù hợp và thực hiện các bước tính toán theo thứ tự.",

                fullSolution:
                    "Bước 1: Xác định dữ kiện của bài toán.\n\n" +
                    "Bước 2: Xác định công thức cần sử dụng.\n\n" +
                    "Bước 3: Thay các giá trị vào công thức.\n\n" +
                    "Bước 4: Thực hiện phép tính.\n\n" +
                    "Bước 5: Kiểm tra lại kết quả và đưa ra đáp án.",

                answer:
                    "Đây là kết quả mô phỏng của AI Solver. " +
                    "Khi kết nối AI API thật, hệ thống sẽ phân tích bài toán thực tế và tạo lời giải tương ứng.",
            });
        } catch (err) {
            setError("Không thể phân tích bài toán.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // NEXT HINT
    // =========================

    const handleNextHint = () => {
        if (!result) {
            return;
        }

        if (hintIndex < result.hints.length - 1) {
            setHintIndex((current) => current + 1);
        }
    };

    // =========================
    // FOLLOW UP
    // =========================

    const handleFollowUp = async () => {
        Keyboard.dismiss();

        if (!followUp.trim()) {
            setError("Vui lòng nhập câu hỏi.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            setFollowUpAnswer(
                "AI đã nhận được câu hỏi phụ của bạn.\n\n" +
                    "Đây là câu trả lời mô phỏng. Khi kết nối AI API thật, " +
                    "hệ thống sẽ sử dụng nội dung bài toán và lời giải trước đó " +
                    "để tạo câu trả lời phù hợp."
            );

            setFollowUp("");
        } catch (err) {
            setError("Không thể xử lý câu hỏi.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // RESET
    // =========================

    const handleReset = () => {
        Keyboard.dismiss();

        setQuestion("");
        setImageUri(null);
        setResult(null);
        setError("");
        setHintIndex(0);
        setFollowUp("");
        setFollowUpAnswer("");
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === "ios"
                        ? "interactive"
                        : "on-drag"
                }
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <Text style={styles.title}>
                    AI Solver
                </Text>

                <Text style={styles.subtitle}>
                    Nhập hoặc tải ảnh bài toán để AI phân tích
                </Text>

                {/* QUESTION */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Bài toán
                    </Text>

                    <TextInput
                        style={styles.questionInput}
                        value={question}
                        onChangeText={setQuestion}
                        placeholder="Nhập nội dung bài toán..."
                        placeholderTextColor={colors.gray}
                        multiline
                        textAlignVertical="top"
                        returnKeyType="default"
                    />

                    {/* IMAGE PICKER */}

                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={handlePickImage}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.imageButtonText}>
                            🖼️ Tải ảnh bài toán
                        </Text>
                    </TouchableOpacity>

                    {/* IMAGE PREVIEW */}

                    {imageUri ? (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{
                                    uri: imageUri,
                                }}
                                style={styles.previewImage}
                                resizeMode="contain"
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setImageUri(null)
                                }
                            >
                                <Text
                                    style={
                                        styles.removeText
                                    }
                                >
                                    Xóa ảnh
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* ERROR */}

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    {/* ANALYZE */}

                    <TouchableOpacity
                        style={[
                            styles.analyzeButton,
                            loading &&
                                styles.disabledAnalyzeButton,
                        ]}
                        onPress={handleAnalyze}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color={colors.white}
                            />
                        ) : (
                            <Text
                                style={
                                    styles.analyzeButtonText
                                }
                            >
                                🔍 Phân tích bài toán
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* RESULT */}

                {result ? (
                    <>
                        {/* TYPE + TOPIC */}

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                Phân tích bài toán
                            </Text>

                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Loại bài
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {
                                            result.problemType
                                        }
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Chủ đề
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {result.topic}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* HINT */}

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                💡 Gợi ý
                            </Text>

                            <View style={styles.hintBox}>
                                <Text
                                    style={
                                        styles.hintNumber
                                    }
                                >
                                    Gợi ý {hintIndex + 1}
                                </Text>

                                <Text
                                    style={styles.hintText}
                                >
                                    {
                                        result.hints[
                                            hintIndex
                                        ]
                                    }
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.secondaryButton,
                                    hintIndex >=
                                        result.hints
                                            .length -
                                            1 &&
                                        styles.disabledButton,
                                ]}
                                onPress={handleNextHint}
                                disabled={
                                    hintIndex >=
                                    result.hints.length - 1
                                }
                            >
                                <Text
                                    style={
                                        styles.secondaryButtonText
                                    }
                                >
                                    Gợi ý tiếp theo
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* EXPLANATION */}

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                📖 Giải thích
                            </Text>

                            <Text style={styles.bodyText}>
                                {result.explanation}
                            </Text>
                        </View>

                        {/* FULL SOLUTION */}

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                📝 Lời giải đầy đủ
                            </Text>

                            <Text style={styles.solutionText}>
                                {result.fullSolution}
                            </Text>
                        </View>

                        {/* ANSWER */}

                        <View style={styles.answerBox}>
                            <Text style={styles.answerTitle}>
                                ✅ Kết quả
                            </Text>

                            <Text style={styles.bodyText}>
                                {result.answer}
                            </Text>
                        </View>

                        {/* FOLLOW UP */}

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                💬 Hỏi thêm
                            </Text>

                            <TextInput
                                style={
                                    styles.followUpInput
                                }
                                value={followUp}
                                onChangeText={setFollowUp}
                                placeholder="Bạn muốn hỏi thêm điều gì?"
                                placeholderTextColor={
                                    colors.gray
                                }
                                multiline
                                textAlignVertical="top"
                            />

                            <TouchableOpacity
                                style={
                                    styles.secondaryButton
                                }
                                onPress={handleFollowUp}
                                disabled={loading}
                            >
                                <Text
                                    style={
                                        styles.secondaryButtonText
                                    }
                                >
                                    Gửi câu hỏi
                                </Text>
                            </TouchableOpacity>

                            {followUpAnswer ? (
                                <View
                                    style={
                                        styles.followUpAnswer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.followUpAnswerTitle
                                        }
                                    >
                                        🤖 AI trả lời
                                    </Text>

                                    <Text
                                        style={
                                            styles.bodyText
                                        }
                                    >
                                        {followUpAnswer}
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        {/* RESET */}

                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleReset}
                        >
                            <Text
                                style={
                                    styles.resetButtonText
                                }
                            >
                                + Giải bài khác
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingTop: 45,
        paddingHorizontal: 20,
        paddingBottom: 50,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.gray,
        marginBottom: 20,
    },

    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 12,
    },

    questionInput: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        lineHeight: 22,
        color: colors.text,
        backgroundColor: "#FAFAFA",
        marginBottom: 12,
    },

    imageButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: "center",
        marginBottom: 12,
    },

    imageButtonText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: "600",
    },

    imageContainer: {
        marginBottom: 12,
        alignItems: "center",
    },

    previewImage: {
        width: "100%",
        height: 220,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        marginBottom: 8,
    },

    removeText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: "600",
    },

    errorBox: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },

    errorText: {
        color: colors.error,
        fontSize: 14,
        lineHeight: 20,
    },

    analyzeButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        minHeight: 48,
        justifyContent: "center",
    },

    disabledAnalyzeButton: {
        opacity: 0.7,
    },

    analyzeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },

    infoRow: {
        flexDirection: "row",
        gap: 12,
    },

    infoItem: {
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
        lineHeight: 21,
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

    secondaryButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: "center",
    },

    secondaryButtonText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: "700",
    },

    disabledButton: {
        opacity: 0.4,
    },

    bodyText: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.text,
    },

    solutionText: {
        fontSize: 15,
        lineHeight: 25,
        color: colors.text,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 14,
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

    followUpInput: {
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: colors.text,
        marginBottom: 12,
        textAlignVertical: "top",
    },

    followUpAnswer: {
        marginTop: 14,
        padding: 14,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
    },

    followUpAnswerTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 8,
    },

    resetButton: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: colors.white,
    },

    resetButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
    },
});