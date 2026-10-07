import React, {
    useRef,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import {
    CameraView,
    useCameraPermissions,
} from "expo-camera";

import * as ImagePicker from "expo-image-picker";

import {
    File,
    UploadType,
} from "expo-file-system";

import colors from "../../styles/colors";

import {
    API_BASE_URL,
} from "../../services/api";

import {
    getToken,
    removeToken,
} from "../../services/tokenStorage";

// ========================================
// SUPPORTED MIME TYPES
// ========================================

const SUPPORTED_MIME_TYPES =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
    ]);

// ========================================
// MIME TYPE FROM URI
// ========================================

const getMimeTypeFromUri = (
    uri = ""
) => {
    const cleanUri =
        String(uri)
            .split("?")[0]
            .toLowerCase();

    if (
        cleanUri.endsWith(
            ".png"
        )
    ) {
        return "image/png";
    }

    if (
        cleanUri.endsWith(
            ".webp"
        )
    ) {
        return "image/webp";
    }

    if (
        cleanUri.endsWith(
            ".heic"
        )
    ) {
        return "image/heic";
    }

    if (
        cleanUri.endsWith(
            ".heif"
        )
    ) {
        return "image/heif";
    }

    return "image/jpeg";
};

// ========================================
// EXTENSION FROM MIME
// ========================================

const getExtensionFromMimeType = (
    mimeType
) => {
    switch (
        mimeType
    ) {
        case "image/png":
            return "png";

        case "image/webp":
            return "webp";

        case "image/heic":
            return "heic";

        case "image/heif":
            return "heif";

        default:
            return "jpg";
    }
};

// ========================================
// SCREEN
// ========================================

export default function ScanScreen() {
    const [
        cameraPermission,
        requestCameraPermission,
    ] =
        useCameraPermissions();

    const cameraRef =
        useRef(null);

    const [
        showCamera,
        setShowCamera,
    ] = useState(false);

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        ocrText,
        setOcrText,
    ] = useState("");

    const [
        originalOcrText,
        setOriginalOcrText,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // ========================================
    // SET IMAGE
    // ========================================

    const setNewImage = ({
        uri,
        name,
        mimeType,
    }) => {
        const normalizedMimeType =
            mimeType ||
            getMimeTypeFromUri(
                uri
            );

        if (
            !SUPPORTED_MIME_TYPES.has(
                normalizedMimeType
            )
        ) {
            setError(
                "Định dạng ảnh không được hỗ trợ."
            );

            return;
        }

        setSelectedImage({
            uri,

            name:
                name ||
                `ocr-${Date.now()}.${getExtensionFromMimeType(
                    normalizedMimeType
                )}`,

            mimeType:
                normalizedMimeType,
        });

        setOcrText("");

        setOriginalOcrText("");

        setError("");
    };

    // ========================================
    // OPEN CAMERA
    // ========================================

    const handleOpenCamera =
        async () => {
            setError("");

            if (
                !cameraPermission
                    ?.granted
            ) {
                const permission =
                    await requestCameraPermission();

                if (
                    !permission
                        .granted
                ) {
                    setError(
                        "Ứng dụng cần quyền camera để chụp ảnh."
                    );

                    return;
                }
            }

            setShowCamera(
                true
            );
        };

    // ========================================
    // TAKE PHOTO
    // ========================================

    const handleTakePhoto =
        async () => {
            if (
                !cameraRef.current ||
                loading
            ) {
                return;
            }

            try {
                setLoading(
                    true
                );

                setError("");

                const photo =
                    await cameraRef.current
                        .takePictureAsync(
                            {
                                quality:
                                    0.9,
                            }
                        );

                if (
                    !photo?.uri
                ) {
                    throw new Error(
                        "Camera không trả về hình ảnh."
                    );
                }

                setNewImage({
                    uri:
                        photo.uri,

                    name:
                        `camera-${Date.now()}.jpg`,

                    mimeType:
                        "image/jpeg",
                });

                setShowCamera(
                    false
                );
            } catch (
                requestError
            ) {
                console.log(
                    "CAMERA ERROR:",
                    requestError.message
                );

                setError(
                    "Không thể chụp ảnh. Vui lòng thử lại."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    // ========================================
    // PICK IMAGE
    // ========================================

    const handlePickImage =
        async () => {
            if (
                loading
            ) {
                return;
            }

            try {
                setError("");

                const permission =
                    await ImagePicker
                        .requestMediaLibraryPermissionsAsync();

                if (
                    !permission
                        .granted
                ) {
                    setError(
                        "Ứng dụng cần quyền truy cập thư viện ảnh."
                    );

                    return;
                }

                const result =
                    await ImagePicker
                        .launchImageLibraryAsync(
                            {
                                mediaTypes:
                                    [
                                        "images",
                                    ],

                                allowsEditing:
                                    false,

                                quality:
                                    0.9,
                            }
                        );

                if (
                    result.canceled
                ) {
                    return;
                }

                const asset =
                    result
                        .assets?.[0];

                if (
                    !asset?.uri
                ) {
                    setError(
                        "Không thể lấy ảnh đã chọn."
                    );

                    return;
                }

                const mimeType =
                    asset.mimeType ||
                    getMimeTypeFromUri(
                        asset.uri
                    );

                setNewImage({
                    uri:
                        asset.uri,

                    name:
                        asset.fileName ||
                        `image-${Date.now()}.${getExtensionFromMimeType(
                            mimeType
                        )}`,

                    mimeType,
                });
            } catch (
                requestError
            ) {
                console.log(
                    "IMAGE PICKER ERROR:",
                    requestError.message
                );

                setError(
                    "Không thể chọn ảnh. Vui lòng thử lại."
                );
            }
        };

    // ========================================
    // OCR UPLOAD
    // ========================================

    const handleOCR =
        async () => {
            if (
                !selectedImage
                    ?.uri
            ) {
                setError(
                    "Vui lòng chụp hoặc chọn ảnh trước."
                );

                return;
            }

            if (
                loading
            ) {
                return;
            }

            try {
                setLoading(
                    true
                );

                setError("");

                setOcrText("");

                setOriginalOcrText(
                    ""
                );

                // ========================================
                // TOKEN
                // ========================================

                const token =
                    await getToken();

                if (!token) {
                    throw new Error(
                        "Bạn chưa đăng nhập."
                    );
                }

                // ========================================
                // FILE
                // ========================================

                const uploadFile =
                    new File(
                        selectedImage.uri
                    );

                console.log(
                    "OCR FILE EXISTS:",
                    uploadFile.exists
                );

                console.log(
                    "OCR FILE SIZE:",
                    uploadFile.size
                );

                console.log(
                    "OCR FILE TYPE:",
                    selectedImage.mimeType
                );

                if (
                    !uploadFile.exists
                ) {
                    throw new Error(
                        "Không tìm thấy file ảnh."
                    );
                }

                if (
                    uploadFile.size >
                    10 *
                        1024 *
                        1024
                ) {
                    throw new Error(
                        "Ảnh không được vượt quá 10 MB."
                    );
                }

                // ========================================
                // UPLOAD TASK
                // ========================================

                const uploadTask =
                    uploadFile
                        .createUploadTask(
                            `${API_BASE_URL}/ocr`,
                            {
                                httpMethod:
                                    "POST",

                                uploadType:
                                    UploadType.MULTIPART,

                                fieldName:
                                    "image",

                                mimeType:
                                    selectedImage.mimeType,

                                parameters:
                                    {
                                        originalName:
                                            selectedImage.name,
                                    },

                                headers:
                                    {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                            }
                        );

                console.log(
                    "OCR UPLOAD START:",
                    selectedImage.name
                );

                const uploadResponse =
                    await uploadTask
                        .uploadAsync();

                console.log(
                    "OCR STATUS:",
                    uploadResponse.status
                );

                console.log(
                    "OCR RESPONSE:",
                    uploadResponse.body
                );

                // ========================================
                // PARSE RESPONSE
                // ========================================

                let responseData =
                    {};

                try {
                    responseData =
                        uploadResponse
                            .body
                            ? JSON.parse(
                                  uploadResponse.body
                              )
                            : {};
                } catch {
                    throw new Error(
                        "Server không trả về JSON hợp lệ."
                    );
                }

                // ========================================
                // AUTH ERROR
                // ========================================

                if (
                    uploadResponse
                        .status ===
                    401
                ) {
                    await removeToken();

                    throw new Error(
                        responseData
                            ?.message ||
                            "Phiên đăng nhập đã hết hạn."
                    );
                }

                // ========================================
                // API ERROR
                // ========================================

                if (
                    uploadResponse
                        .status <
                        200 ||
                    uploadResponse
                        .status >=
                        300
                ) {
                    throw new Error(
                        responseData
                            ?.message ||
                            `OCR thất bại (${uploadResponse.status}).`
                    );
                }

                // ========================================
                // EXTRACT TEXT
                // ========================================

                const extractedText =
                    responseData
                        ?.data
                        ?.extractedText;

                if (
                    !extractedText ||
                    !String(
                        extractedText
                    ).trim()
                ) {
                    throw new Error(
                        "Backend không trả về văn bản OCR."
                    );
                }

                const text =
                    String(
                        extractedText
                    ).trim();

                setOcrText(
                    text
                );

                setOriginalOcrText(
                    text
                );

                console.log(
                    "OCR SUCCESS:",
                    text.length,
                    "characters"
                );
            } catch (
                requestError
            ) {
                console.log(
                    "OCR ERROR:",
                    requestError.message
                );

                setError(
                    requestError.message ||
                        "Không thể nhận diện văn bản."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    // ========================================
    // RESTORE OCR
    // ========================================

    const handleRestoreText =
        () => {
            setOcrText(
                originalOcrText
            );

            setError("");
        };

    // ========================================
    // RESET
    // ========================================

    const handleReset =
        () => {
            if (
                loading
            ) {
                return;
            }

            setShowCamera(
                false
            );

            setSelectedImage(
                null
            );

            setOcrText("");

            setOriginalOcrText(
                ""
            );

            setError("");
        };

    // ========================================
    // CAMERA VIEW
    // ========================================

    if (
        showCamera
    ) {
        return (
            <View
                style={
                    styles.cameraContainer
                }
            >
                <CameraView
                    ref={
                        cameraRef
                    }
                    style={
                        styles.camera
                    }
                    facing="back"
                />

                <View
                    style={
                        styles.cameraOverlay
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.cameraCloseButton
                        }
                        onPress={() =>
                            setShowCamera(
                                false
                            )
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.cameraCloseText
                            }
                        >
                            ✕
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={
                            styles.scanFrame
                        }
                    />

                    <Text
                        style={
                            styles.cameraInstruction
                        }
                    >
                        Đưa tài liệu vào khung hình
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.captureButton,

                            loading &&
                                styles.disabledButton,
                        ]}
                        onPress={
                            handleTakePhoto
                        }
                        disabled={
                            loading
                        }
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color={
                                    colors.white
                                }
                            />
                        ) : (
                            <View
                                style={
                                    styles.captureInner
                                }
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ========================================
    // MAIN
    // ========================================

    return (
        <KeyboardAvoidingView
            style={
                styles.container
            }
            behavior={
                Platform.OS ===
                "ios"
                    ? "padding"
                    : undefined
            }
            keyboardVerticalOffset={
                Platform.OS ===
                "ios"
                    ? 80
                    : 0
            }
        >
            <ScrollView
                style={
                    styles.container
                }
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={
                    false
                }
            >
                <Text
                    style={
                        styles.title
                    }
                >
                    Scanner
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Chụp hoặc chọn hình ảnh để nhận diện văn bản
                </Text>

                {/* ACTIONS */}

                <View
                    style={
                        styles.actionRow
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.actionButton
                        }
                        onPress={
                            handleOpenCamera
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            📷
                        </Text>

                        <Text
                            style={
                                styles.actionTitle
                            }
                        >
                            Chụp ảnh
                        </Text>

                        <Text
                            style={
                                styles.actionDescription
                            }
                        >
                            Sử dụng camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.actionButton
                        }
                        onPress={
                            handlePickImage
                        }
                        disabled={
                            loading
                        }
                    >
                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            🖼️
                        </Text>

                        <Text
                            style={
                                styles.actionTitle
                            }
                        >
                            Chọn ảnh
                        </Text>

                        <Text
                            style={
                                styles.actionDescription
                            }
                        >
                            Từ thư viện
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ERROR */}

                {error ? (
                    <View
                        style={
                            styles.errorBox
                        }
                    >
                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {
                                error
                            }
                        </Text>
                    </View>
                ) : null}

                {/* IMAGE */}

                {selectedImage ? (
                    <View
                        style={
                            styles.section
                        }
                    >
                        <View
                            style={
                                styles.sectionHeader
                            }
                        >
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Hình ảnh
                            </Text>

                            <TouchableOpacity
                                onPress={
                                    handleReset
                                }
                                disabled={
                                    loading
                                }
                            >
                                <Text
                                    style={
                                        styles.resetText
                                    }
                                >
                                    Xóa
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={{
                                uri:
                                    selectedImage.uri,
                            }}
                            style={
                                styles.previewImage
                            }
                            resizeMode="contain"
                        />

                        <Text
                            style={
                                styles.fileName
                            }
                            numberOfLines={
                                1
                            }
                        >
                            {
                                selectedImage.name
                            }
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.ocrButton,

                                loading &&
                                    styles.disabledButton,
                            ]}
                            onPress={
                                handleOCR
                            }
                            disabled={
                                loading
                            }
                        >
                            {loading ? (
                                <View
                                    style={
                                        styles.loadingRow
                                    }
                                >
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            colors.white
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.ocrButtonText
                                        }
                                    >
                                        Đang nhận diện...
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={
                                        styles.ocrButtonText
                                    }
                                >
                                    Nhận diện văn bản
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* LOADING */}

                {loading &&
                selectedImage ? (
                    <View
                        style={
                            styles.loadingBox
                        }
                    >
                        <ActivityIndicator
                            size="large"
                            color={
                                colors.primary
                            }
                        />

                        <Text
                            style={
                                styles.loadingTitle
                            }
                        >
                            AI đang đọc hình ảnh
                        </Text>

                        <Text
                            style={
                                styles.loadingText
                            }
                        >
                            Ảnh nhiều chữ có thể cần thêm thời gian xử lý.
                        </Text>
                    </View>
                ) : null}

                {/* OCR RESULT */}

                {ocrText ? (
                    <View
                        style={
                            styles.section
                        }
                    >
                        <View
                            style={
                                styles.sectionHeader
                            }
                        >
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Văn bản nhận diện
                            </Text>

                            {ocrText !==
                            originalOcrText ? (
                                <TouchableOpacity
                                    onPress={
                                        handleRestoreText
                                    }
                                >
                                    <Text
                                        style={
                                            styles.restoreText
                                        }
                                    >
                                        Khôi phục
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        <Text
                            style={
                                styles.helperText
                            }
                        >
                            Bạn có thể chỉnh sửa trực tiếp nội dung OCR bên dưới.
                        </Text>

                        <TextInput
                            style={
                                styles.textInput
                            }
                            value={
                                ocrText
                            }
                            onChangeText={
                                setOcrText
                            }
                            multiline
                            editable={
                                !loading
                            }
                            textAlignVertical="top"
                            placeholder="Nội dung OCR..."
                            placeholderTextColor={
                                colors.gray
                            }
                        />

                        <Text
                            style={
                                styles.characterCount
                            }
                        >
                            {
                                ocrText.length
                            }{" "}
                            ký tự
                        </Text>
                    </View>
                ) : null}

                {/* EMPTY */}

                {!selectedImage &&
                !loading ? (
                    <View
                        style={
                            styles.emptyBox
                        }
                    >
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            📄
                        </Text>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            Chưa có hình ảnh
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Chụp tài liệu bằng camera hoặc chọn một hình ảnh từ thư viện.
                        </Text>
                    </View>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ========================================
// STYLES
// ========================================

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                colors.background,
        },

        content: {
            padding: 20,

            paddingBottom:
                80,
        },

        title: {
            fontSize: 28,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom: 6,
        },

        subtitle: {
            fontSize: 15,

            lineHeight: 22,

            color:
                colors.gray,

            marginBottom:
                24,
        },

        actionRow: {
            flexDirection:
                "row",

            gap: 12,

            marginBottom:
                20,
        },

        actionButton: {
            flex: 1,

            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                16,

            padding: 18,

            alignItems:
                "center",
        },

        actionIcon: {
            fontSize: 32,

            marginBottom:
                10,
        },

        actionTitle: {
            fontSize: 16,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom: 4,
        },

        actionDescription: {
            fontSize: 13,

            color:
                colors.gray,

            textAlign:
                "center",
        },

        errorBox: {
            backgroundColor:
                "#FEF2F2",

            borderWidth:
                1,

            borderColor:
                "#FECACA",

            borderRadius:
                12,

            padding: 14,

            marginBottom:
                16,
        },

        errorText: {
            color:
                colors.error,

            fontSize: 14,

            lineHeight: 20,
        },

        section: {
            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                16,

            padding: 16,

            marginBottom:
                16,
        },

        sectionHeader: {
            flexDirection:
                "row",

            justifyContent:
                "space-between",

            alignItems:
                "center",

            marginBottom:
                12,
        },

        sectionTitle: {
            fontSize: 18,

            fontWeight:
                "700",

            color:
                colors.text,
        },

        resetText: {
            fontSize: 14,

            fontWeight:
                "600",

            color:
                colors.error,
        },

        restoreText: {
            fontSize: 14,

            fontWeight:
                "600",

            color:
                colors.primary,
        },

        previewImage: {
            width:
                "100%",

            height: 280,

            borderRadius:
                12,

            backgroundColor:
                "#F3F4F6",
        },

        fileName: {
            marginTop: 10,

            fontSize: 12,

            color:
                colors.gray,
        },

        ocrButton: {
            marginTop: 14,

            height: 48,

            borderRadius:
                10,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                colors.primary,
        },

        ocrButtonText: {
            marginLeft: 7,

            color:
                colors.white,

            fontSize: 15,

            fontWeight:
                "700",
        },

        disabledButton: {
            opacity: 0.6,
        },

        loadingRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        loadingBox: {
            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                16,

            padding: 24,

            alignItems:
                "center",

            marginBottom:
                16,
        },

        loadingTitle: {
            marginTop: 12,

            fontSize: 16,

            fontWeight:
                "700",

            color:
                colors.text,
        },

        loadingText: {
            marginTop: 6,

            fontSize: 13,

            lineHeight: 19,

            textAlign:
                "center",

            color:
                colors.gray,
        },

        helperText: {
            fontSize: 13,

            lineHeight: 19,

            color:
                colors.gray,

            marginBottom:
                12,
        },

        textInput: {
            minHeight: 220,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                12,

            padding: 14,

            fontSize: 15,

            lineHeight: 22,

            color:
                colors.text,

            backgroundColor:
                "#FAFAFA",
        },

        characterCount: {
            marginTop: 8,

            textAlign:
                "right",

            fontSize: 12,

            color:
                colors.gray,
        },

        emptyBox: {
            backgroundColor:
                colors.white,

            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                16,

            padding: 32,

            alignItems:
                "center",

            marginTop: 4,
        },

        emptyIcon: {
            fontSize: 42,

            marginBottom:
                12,
        },

        emptyTitle: {
            fontSize: 18,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom: 8,
        },

        emptyText: {
            fontSize: 14,

            lineHeight: 21,

            color:
                colors.gray,

            textAlign:
                "center",
        },

        cameraContainer: {
            flex: 1,

            backgroundColor:
                "#000000",
        },

        camera: {
            flex: 1,
        },

        cameraOverlay: {
            ...StyleSheet.absoluteFillObject,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        cameraCloseButton: {
            position:
                "absolute",

            top: 50,

            left: 20,

            width: 44,

            height: 44,

            borderRadius:
                22,

            backgroundColor:
                "rgba(0,0,0,0.5)",

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        cameraCloseText: {
            color:
                colors.white,

            fontSize: 22,

            fontWeight:
                "600",
        },

        scanFrame: {
            width:
                "82%",

            height:
                "48%",

            borderWidth:
                2,

            borderColor:
                colors.white,

            borderRadius:
                16,
        },

        cameraInstruction: {
            position:
                "absolute",

            bottom: 150,

            color:
                colors.white,

            fontSize: 15,

            fontWeight:
                "600",

            backgroundColor:
                "rgba(0,0,0,0.5)",

            paddingHorizontal:
                16,

            paddingVertical:
                10,

            borderRadius:
                20,
        },

        captureButton: {
            position:
                "absolute",

            bottom: 40,

            width: 76,

            height: 76,

            borderRadius:
                38,

            borderWidth:
                5,

            borderColor:
                colors.white,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        captureInner: {
            width: 58,

            height: 58,

            borderRadius:
                29,

            backgroundColor:
                colors.white,
        },
    });