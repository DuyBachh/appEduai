import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import colors from "../../styles/colors";

export default function ScanScreen() {
    const [cameraPermission, requestCameraPermission] =
        useCameraPermissions();

    const [showCamera, setShowCamera] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [ocrText, setOcrText] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cameraRef = useRef(null);

    // =========================
    // CAMERA
    // =========================

    const handleOpenCamera = async () => {
        setError("");
        setAiAnswer("");

        if (!cameraPermission?.granted) {
            const permission = await requestCameraPermission();

            if (!permission.granted) {
                setError(
                    "Ứng dụng cần quyền camera để chụp ảnh."
                );
                return;
            }
        }

        setShowCamera(true);
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
            });

            if (photo?.uri) {
                setImageUri(photo.uri);
                setShowCamera(false);

                // Mock OCR
                await handleMockOCR();
            }
        } catch (err) {
            setError("Không thể chụp ảnh. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // IMAGE PICKER
    // =========================

    const handlePickImage = async () => {
        try {
            setError("");
            setAiAnswer("");

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                setError(
                    "Ứng dụng cần quyền truy cập thư viện ảnh."
                );
                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.8,
                });

            if (result.canceled) {
                return;
            }

            const selectedImage = result.assets?.[0];

            if (!selectedImage?.uri) {
                setError("Không thể lấy ảnh đã chọn.");
                return;
            }

            setImageUri(selectedImage.uri);

            // Mock OCR
            await handleMockOCR();
        } catch (err) {
            setError(
                "Không thể chọn ảnh. Vui lòng thử lại."
            );
        }
    };

    // =========================
    // MOCK OCR
    // =========================

    const handleMockOCR = async () => {
        setLoading(true);
        setError("");
        setOcrText("");

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 1200)
            );

            setOcrText(
                "Đây là nội dung văn bản được nhận diện từ hình ảnh.\n\n" +
                "Ví dụ: React Native là framework giúp xây dựng " +
                "ứng dụng di động bằng JavaScript và React.\n\n" +
                "Bạn có thể chỉnh sửa nội dung này trước khi gửi cho AI."
            );
        } catch (err) {
            setError("Không thể nhận diện văn bản.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // SEND AI
    // =========================

    const handleSendAI = async () => {
        if (!ocrText.trim()) {
            setError("Vui lòng nhập nội dung trước khi gửi AI.");
            return;
        }

        setLoading(true);
        setError("");
        setAiAnswer("");

        try {
            // Mock AI
            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            setAiAnswer(
                "AI đã nhận được nội dung của bạn.\n\n" +
                "Tóm tắt:\n" +
                "Nội dung nói về React Native và khả năng xây dựng " +
                "ứng dụng mobile bằng JavaScript và React.\n\n" +
                "Đây hiện là dữ liệu mô phỏng. Sau này phần này " +
                "sẽ được kết nối với AI API thật."
            );
        } catch (err) {
            setError("Không thể gửi nội dung đến AI.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // RESET
    // =========================

    const handleReset = () => {
        setShowCamera(false);
        setImageUri(null);
        setOcrText("");
        setAiAnswer("");
        setError("");
        setLoading(false);
    };

    // =========================
    // CAMERA SCREEN
    // =========================

    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="back"
                />

                <View style={styles.cameraOverlay}>
                    <TouchableOpacity
                        style={styles.cameraCloseButton}
                        onPress={() => setShowCamera(false)}
                    >
                        <Text style={styles.cameraCloseText}>
                            ✕
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.scanFrame} />

                    <Text style={styles.cameraInstruction}>
                        Đưa tài liệu vào khung hình
                    </Text>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={handleTakePhoto}
                    >
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // =========================
    // MAIN SCREEN
    // =========================

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
                Scanner
            </Text>

            <Text style={styles.subtitle}>
                Chụp hoặc chọn hình ảnh để nhận diện văn bản
            </Text>

            {/* ACTION BUTTONS */}

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleOpenCamera}
                    disabled={loading}
                >
                    <Text style={styles.actionIcon}>
                        📷
                    </Text>

                    <Text style={styles.actionTitle}>
                        Chụp ảnh
                    </Text>

                    <Text style={styles.actionDescription}>
                        Sử dụng camera
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handlePickImage}
                    disabled={loading}
                >
                    <Text style={styles.actionIcon}>
                        🖼️
                    </Text>

                    <Text style={styles.actionTitle}>
                        Chọn ảnh
                    </Text>

                    <Text style={styles.actionDescription}>
                        Từ thư viện
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ERROR */}

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            ) : null}

            {/* IMAGE PREVIEW */}

            {imageUri ? (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Hình ảnh
                        </Text>

                        <TouchableOpacity
                            onPress={handleReset}
                        >
                            <Text style={styles.resetText}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={{ uri: imageUri }}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                </View>
            ) : null}

            {/* LOADING */}

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />

                    <Text style={styles.loadingText}>
                        Đang xử lý...
                    </Text>
                </View>
            ) : null}

            {/* OCR RESULT */}

            {ocrText ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Văn bản nhận diện
                    </Text>

                    <Text style={styles.helperText}>
                        Bạn có thể chỉnh sửa nội dung trước
                        khi gửi cho AI.
                    </Text>

                    <TextInput
                        style={styles.textInput}
                        value={ocrText}
                        onChangeText={setOcrText}
                        multiline
                        textAlignVertical="top"
                        placeholder="Nội dung OCR..."
                        placeholderTextColor={colors.gray}
                    />

                    <TouchableOpacity
                        style={styles.aiButton}
                        onPress={handleSendAI}
                        disabled={loading}
                    >
                        <Text style={styles.aiButtonText}>
                            🤖 Gửi đến AI
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {/* AI RESULT */}

            {aiAnswer ? (
                <View style={styles.aiResultBox}>
                    <Text style={styles.aiResultTitle}>
                        🤖 AI trả lời
                    </Text>

                    <Text style={styles.aiResultText}>
                        {aiAnswer}
                    </Text>
                </View>
            ) : null}

            {/* EMPTY STATE */}

            {!imageUri && !loading ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyIcon}>
                        📄
                    </Text>

                    <Text style={styles.emptyTitle}>
                        Chưa có hình ảnh
                    </Text>

                    <Text style={styles.emptyText}>
                        Chụp tài liệu bằng camera hoặc chọn
                        một hình ảnh từ thư viện.
                    </Text>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
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
        marginBottom: 24,
    },

    actionRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },

    actionButton: {
        flex: 1,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 18,
        alignItems: "center",
    },

    actionIcon: {
        fontSize: 32,
        marginBottom: 10,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 4,
    },

    actionDescription: {
        fontSize: 13,
        color: colors.gray,
        textAlign: "center",
    },

    errorBox: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },

    errorText: {
        color: colors.error,
        fontSize: 14,
        lineHeight: 20,
    },

    section: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    resetText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.error,
    },

    previewImage: {
        width: "100%",
        height: 240,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
    },

    helperText: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        marginBottom: 12,
    },

    textInput: {
        minHeight: 180,
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

    aiButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },

    aiButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },

    loadingBox: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 16,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.gray,
    },

    aiResultBox: {
        backgroundColor: "#EEF2FF",
        borderWidth: 1,
        borderColor: "#C7D2FE",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },

    aiResultTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 10,
    },

    aiResultText: {
        fontSize: 15,
        lineHeight: 23,
        color: colors.text,
    },

    emptyBox: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        marginTop: 4,
    },

    emptyIcon: {
        fontSize: 42,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
    },

    cameraContainer: {
        flex: 1,
        backgroundColor: "#000000",
    },

    camera: {
        flex: 1,
    },

    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },

    cameraCloseButton: {
        position: "absolute",
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },

    cameraCloseText: {
        color: colors.white,
        fontSize: 22,
        fontWeight: "600",
    },

    scanFrame: {
        width: "82%",
        height: "48%",
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 16,
    },

    cameraInstruction: {
        position: "absolute",
        bottom: 150,
        color: colors.white,
        fontSize: 15,
        fontWeight: "600",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },

    captureButton: {
        position: "absolute",
        bottom: 40,
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 5,
        borderColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
    },

    captureInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.white,
    },
});