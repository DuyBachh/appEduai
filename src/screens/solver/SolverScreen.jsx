import React, {
    useRef,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
    File,
    UploadType,
} from "expo-file-system";

import colors from "../../styles/colors";

import {
    API_BASE_URL,
    apiRequest,
} from "../../services/api";

import {
    getToken,
    removeToken,
} from "../../services/tokenStorage";

// ========================================
// SUPPORTED IMAGE TYPES
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
// MIME TYPE
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
// EXTENSION
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

export default function SolverScreen() {
    const scrollRef =
        useRef(null);

    const [
        question,
        setQuestion,
    ] = useState("");

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        solverLoading,
        setSolverLoading,
    ] = useState(false);

    const [
        ocrLoading,
        setOcrLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        result,
        setResult,
    ] = useState(null);

    const [
        hintIndex,
        setHintIndex,
    ] = useState(0);

    const loading =
        solverLoading ||
        ocrLoading;

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
                Keyboard.dismiss();

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

                const pickerResult =
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
                    pickerResult.canceled
                ) {
                    return;
                }

                const asset =
                    pickerResult
                        .assets?.[0];

                if (
                    !asset?.uri
                ) {
                    setError(
                        "Không thể lấy hình ảnh."
                    );

                    return;
                }

                const mimeType =
                    asset.mimeType ||
                    getMimeTypeFromUri(
                        asset.uri
                    );

                if (
                    !SUPPORTED_MIME_TYPES.has(
                        mimeType
                    )
                ) {
                    setError(
                        "Định dạng ảnh không được hỗ trợ."
                    );

                    return;
                }

                const fileName =
                    asset.fileName ||
                    `solver-${Date.now()}.${getExtensionFromMimeType(
                        mimeType
                    )}`;

                setSelectedImage(
                    {
                        uri:
                            asset.uri,

                        name:
                            fileName,

                        mimeType,
                    }
                );

                setResult(
                    null
                );

                setHintIndex(
                    0
                );

                console.log(
                    "SOLVER IMAGE SELECTED:",
                    fileName
                );
            } catch (
                requestError
            ) {
                console.log(
                    "SOLVER IMAGE ERROR:",
                    requestError.message
                );

                setError(
                    "Không thể chọn ảnh bài toán."
                );
            }
        };

    // ========================================
    // REMOVE IMAGE
    // ========================================

    const handleRemoveImage =
        () => {
            if (
                loading
            ) {
                return;
            }

            setSelectedImage(
                null
            );

            setError("");
        };

    // ========================================
    // OCR IMAGE
    // ========================================

    const handleOCRImage =
        async () => {
            if (
                !selectedImage
                    ?.uri
            ) {
                setError(
                    "Vui lòng chọn ảnh bài toán trước."
                );

                return;
            }

            if (
                loading
            ) {
                return;
            }

            try {
                setOcrLoading(
                    true
                );

                setError("");

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
                    "SOLVER OCR FILE EXISTS:",
                    uploadFile.exists
                );

                console.log(
                    "SOLVER OCR FILE SIZE:",
                    uploadFile.size
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
                // UPLOAD OCR
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
                    "SOLVER OCR START:",
                    selectedImage.name
                );

                const uploadResponse =
                    await uploadTask
                        .uploadAsync();

                console.log(
                    "SOLVER OCR STATUS:",
                    uploadResponse.status
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
                // AUTH
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
                        "Không nhận diện được đề bài trong ảnh."
                    );
                }

                const text =
                    String(
                        extractedText
                    ).trim();

                // ========================================
                // PUT OCR INTO QUESTION
                // ========================================

                setQuestion(
                    text
                );

                setResult(
                    null
                );

                setHintIndex(
                    0
                );

                console.log(
                    "SOLVER OCR SUCCESS:",
                    text.length,
                    "characters"
                );
            } catch (
                requestError
            ) {
                console.log(
                    "SOLVER OCR ERROR:",
                    requestError.message
                );

                setError(
                    requestError.message ||
                        "Không thể OCR ảnh bài toán."
                );
            } finally {
                setOcrLoading(
                    false
                );
            }
        };

    // ========================================
    // SOLVE
    // ========================================

    const handleSolve =
        async () => {
            Keyboard.dismiss();

            const trimmedQuestion =
                question.trim();

            if (
                !trimmedQuestion
            ) {
                setError(
                    "Vui lòng nhập câu hỏi hoặc OCR ảnh bài toán trước."
                );

                return;
            }

            if (
                loading
            ) {
                return;
            }

            try {
                setSolverLoading(
                    true
                );

                setError("");

                setResult(
                    null
                );

                setHintIndex(
                    0
                );

                console.log(
                    "SOLVER QUESTION:",
                    trimmedQuestion
                );

                const response =
                    await apiRequest(
                        "/solver",
                        {
                            method:
                                "POST",

                            body:
                                JSON.stringify(
                                    {
                                        question:
                                            trimmedQuestion,
                                    }
                                ),
                        }
                    );

                const data =
                    response?.data;

                if (
                    !data
                ) {
                    throw new Error(
                        "Backend không trả về kết quả."
                    );
                }

                const normalizedResult =
                    {
                        question:
                            data.question ||
                            trimmedQuestion,

                        type:
                            data.type ||
                            "Không xác định",

                        topic:
                            data.topic ||
                            "Không xác định",

                        hints:
                            Array.isArray(
                                data.hints
                            )
                                ? data.hints
                                : [],

                        explanation:
                            data.explanation ||
                            "",

                        steps:
                            Array.isArray(
                                data.steps
                            )
                                ? data.steps
                                : [],

                        finalAnswer:
                            data.finalAnswer ||
                            data.answer ||
                            "",
                    };

                setResult(
                    normalizedResult
                );

                console.log(
                    "SOLVER SUCCESS:",
                    normalizedResult.type,
                    "-",
                    normalizedResult.topic
                );

                setTimeout(
                    () => {
                        scrollRef.current
                            ?.scrollToEnd(
                                {
                                    animated:
                                        true,
                                }
                            );
                    },
                    150
                );
            } catch (
                requestError
            ) {
                console.log(
                    "SOLVER ERROR:",
                    requestError.message
                );

                setError(
                    requestError.message ||
                        "Không thể giải bài tập."
                );
            } finally {
                setSolverLoading(
                    false
                );
            }
        };

    // ========================================
    // NEXT HINT
    // ========================================

    const handleNextHint =
        () => {
            if (
                !result ||
                !Array.isArray(
                    result.hints
                )
            ) {
                return;
            }

            if (
                hintIndex <
                result.hints.length -
                    1
            ) {
                setHintIndex(
                    (
                        current
                    ) =>
                        current +
                        1
                );
            }
        };

    // ========================================
    // RESET
    // ========================================

    const handleReset =
        () => {
            Keyboard.dismiss();

            setQuestion("");

            setSelectedImage(
                null
            );

            setResult(
                null
            );

            setError("");

            setHintIndex(
                0
            );
        };

    // ========================================
    // UI
    // ========================================

    return (
        <KeyboardAvoidingView
            style={
                styles.keyboardContainer
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
                    ? 70
                    : 0
            }
        >
            <ScrollView
                ref={
                    scrollRef
                }
                style={
                    styles.container
                }
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS ===
                    "ios"
                        ? "interactive"
                        : "on-drag"
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                {/* HEADER */}

                <Text
                    style={
                        styles.title
                    }
                >
                    AI Solver
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Nhập bài tập hoặc chọn ảnh để AI phân tích và giải từng bước
                </Text>

                {/* QUESTION */}

                <View
                    style={
                        styles.card
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Bài tập
                    </Text>

                    <TextInput
                        style={
                            styles.questionInput
                        }
                        value={
                            question
                        }
                        onChangeText={(
                            value
                        ) => {
                            setQuestion(
                                value
                            );

                            if (
                                error
                            ) {
                                setError("");
                            }
                        }}
                        placeholder="Ví dụ: Giải phương trình x² - 5x + 6 = 0"
                        placeholderTextColor={
                            colors.gray
                        }
                        multiline
                        maxLength={
                            6000
                        }
                        editable={
                            !loading
                        }
                        textAlignVertical="top"
                    />

                    <Text
                        style={
                            styles.characterCount
                        }
                    >
                        {
                            question.length
                        }
                        /6000
                    </Text>

                    {/* IMAGE PICKER */}

                    <TouchableOpacity
                        style={
                            styles.imageButton
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
                                styles.imageButtonText
                            }
                        >
                            🖼️ Chọn ảnh bài toán
                        </Text>
                    </TouchableOpacity>

                    {/* IMAGE PREVIEW */}

                    {selectedImage ? (
                        <View
                            style={
                                styles.imageContainer
                            }
                        >
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
                                    styles.imageName
                                }
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    selectedImage.name
                                }
                            </Text>

                            <View
                                style={
                                    styles.imageActionRow
                                }
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.ocrButton,

                                        loading &&
                                            styles.disabledButton,
                                    ]}
                                    onPress={
                                        handleOCRImage
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {ocrLoading ? (
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
                                                Đang đọc đề...
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text
                                            style={
                                                styles.ocrButtonText
                                            }
                                        >
                                            Đọc đề từ ảnh
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={
                                        styles.removeImageButton
                                    }
                                    onPress={
                                        handleRemoveImage
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    <Text
                                        style={
                                            styles.removeImageText
                                        }
                                    >
                                        Xóa ảnh
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}

                    {/* OCR INFO */}

                    {selectedImage &&
                    question.trim() ? (
                        <View
                            style={
                                styles.ocrInfoBox
                            }
                        >
                            <Text
                                style={
                                    styles.ocrInfoText
                                }
                            >
                                Nội dung OCR đã được đưa vào ô bài tập. Bạn có thể chỉnh sửa trước khi giải.
                            </Text>
                        </View>
                    ) : null}

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

                    {/* SOLVE */}

                    <TouchableOpacity
                        style={[
                            styles.solveButton,

                            loading &&
                                styles.disabledButton,
                        ]}
                        onPress={
                            handleSolve
                        }
                        disabled={
                            loading
                        }
                    >
                        {solverLoading ? (
                            <View
                                style={
                                    styles.loadingRow
                                }
                            >
                                <ActivityIndicator
                                    color={
                                        colors.white
                                    }
                                />

                                <Text
                                    style={
                                        styles.solveButtonText
                                    }
                                >
                                    AI đang giải...
                                </Text>
                            </View>
                        ) : (
                            <Text
                                style={
                                    styles.solveButtonText
                                }
                            >
                                Giải bài tập
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* LOADING */}

                {solverLoading ? (
                    <View
                        style={
                            styles.loadingCard
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
                            AI đang phân tích bài tập
                        </Text>

                        <Text
                            style={
                                styles.loadingDescription
                            }
                        >
                            Bài phức tạp có thể cần thêm thời gian xử lý.
                        </Text>
                    </View>
                ) : null}

                {/* RESULT */}

                {result ? (
                    <>
                        {/* TYPE + TOPIC */}

                        <View
                            style={
                                styles.card
                            }
                        >
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Phân tích bài tập
                            </Text>

                            <View
                                style={
                                    styles.infoRow
                                }
                            >
                                <View
                                    style={
                                        styles.infoItem
                                    }
                                >
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
                                            result.type
                                        }
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.infoItem
                                    }
                                >
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
                                        {
                                            result.topic
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* HINT */}

                        {result.hints.length >
                        0 ? (
                            <View
                                style={
                                    styles.card
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    💡 Gợi ý
                                </Text>

                                <View
                                    style={
                                        styles.hintBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.hintNumber
                                        }
                                    >
                                        Gợi ý{" "}
                                        {hintIndex +
                                            1}
                                        /
                                        {
                                            result
                                                .hints
                                                .length
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.hintText
                                        }
                                    >
                                        {
                                            result
                                                .hints[
                                                hintIndex
                                            ]
                                        }
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.secondaryButton,

                                        hintIndex >=
                                            result
                                                .hints
                                                .length -
                                                1 &&
                                            styles.disabledSecondaryButton,
                                    ]}
                                    onPress={
                                        handleNextHint
                                    }
                                    disabled={
                                        hintIndex >=
                                        result
                                            .hints
                                            .length -
                                            1
                                    }
                                >
                                    <Text
                                        style={
                                            styles.secondaryButtonText
                                        }
                                    >
                                        {hintIndex >=
                                        result
                                            .hints
                                            .length -
                                            1
                                            ? "Đã xem hết gợi ý"
                                            : "Gợi ý tiếp theo"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {/* EXPLANATION */}

                        <View
                            style={
                                styles.card
                            }
                        >
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                📖 Giải thích
                            </Text>

                            <Text
                                selectable
                                style={
                                    styles.bodyText
                                }
                            >
                                {
                                    result.explanation
                                }
                            </Text>
                        </View>

                        {/* STEPS */}

                        <View
                            style={
                                styles.card
                            }
                        >
                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                📝 Các bước giải
                            </Text>

                            {result.steps.map(
                                (
                                    step,
                                    index
                                ) => (
                                    <View
                                        key={`${index}-${step}`}
                                        style={
                                            styles.stepBox
                                        }
                                    >
                                        <View
                                            style={
                                                styles.stepNumber
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.stepNumberText
                                                }
                                            >
                                                {index +
                                                    1}
                                            </Text>
                                        </View>

                                        <Text
                                            selectable
                                            style={
                                                styles.stepText
                                            }
                                        >
                                            {
                                                step
                                            }
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>

                        {/* ANSWER */}

                        <View
                            style={
                                styles.answerBox
                            }
                        >
                            <Text
                                style={
                                    styles.answerTitle
                                }
                            >
                                ✅ Đáp án cuối cùng
                            </Text>

                            <Text
                                selectable
                                style={
                                    styles.answerText
                                }
                            >
                                {
                                    result.finalAnswer
                                }
                            </Text>
                        </View>

                        {/* RESET */}

                        <TouchableOpacity
                            style={
                                styles.resetButton
                            }
                            onPress={
                                handleReset
                            }
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

// ========================================
// STYLES
// ========================================

const styles =
    StyleSheet.create({
        keyboardContainer: {
            flex: 1,
        },

        container: {
            flex: 1,

            backgroundColor:
                colors.background,
        },

        content: {
            paddingTop: 45,

            paddingHorizontal:
                20,

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
                20,
        },

        card: {
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

        sectionTitle: {
            fontSize: 18,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom:
                12,
        },

        questionInput: {
            minHeight: 150,

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
            marginTop: 6,

            marginBottom:
                12,

            textAlign:
                "right",

            fontSize: 12,

            color:
                colors.gray,
        },

        imageButton: {
            borderWidth:
                1,

            borderColor:
                colors.primary,

            borderRadius:
                12,

            paddingVertical:
                13,

            alignItems:
                "center",

            marginBottom:
                12,
        },

        imageButtonText: {
            color:
                colors.primary,

            fontSize: 15,

            fontWeight:
                "700",
        },

        imageContainer: {
            marginBottom:
                12,
        },

        previewImage: {
            width:
                "100%",

            height: 240,

            borderRadius:
                12,

            backgroundColor:
                "#F3F4F6",
        },

        imageName: {
            marginTop: 8,

            fontSize: 12,

            color:
                colors.gray,
        },

        imageActionRow: {
            marginTop: 12,

            gap: 10,
        },

        ocrButton: {
            minHeight: 46,

            backgroundColor:
                colors.primary,

            borderRadius:
                10,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        ocrButtonText: {
            color:
                colors.white,

            fontSize: 15,

            fontWeight:
                "700",

            marginLeft: 7,
        },

        removeImageButton: {
            minHeight: 44,

            borderWidth:
                1,

            borderColor:
                "#FECACA",

            borderRadius:
                10,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        removeImageText: {
            color:
                colors.error,

            fontSize: 14,

            fontWeight:
                "600",
        },

        ocrInfoBox: {
            backgroundColor:
                "#EEF2FF",

            borderRadius:
                10,

            padding: 12,

            marginBottom:
                12,
        },

        ocrInfoText: {
            fontSize: 13,

            lineHeight: 19,

            color:
                colors.primary,
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

            padding: 12,

            marginBottom:
                12,
        },

        errorText: {
            color:
                colors.error,

            fontSize: 14,

            lineHeight: 20,
        },

        solveButton: {
            minHeight: 48,

            backgroundColor:
                colors.primary,

            borderRadius:
                12,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        solveButtonText: {
            color:
                colors.white,

            fontSize: 16,

            fontWeight:
                "700",

            marginLeft: 8,
        },

        disabledButton: {
            opacity: 0.65,
        },

        loadingRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        loadingCard: {
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

        loadingDescription: {
            marginTop: 6,

            fontSize: 13,

            lineHeight: 19,

            color:
                colors.gray,

            textAlign:
                "center",
        },

        infoRow: {
            flexDirection:
                "row",

            gap: 12,
        },

        infoItem: {
            flex: 1,

            backgroundColor:
                "#F9FAFB",

            borderRadius:
                12,

            padding: 14,
        },

        infoLabel: {
            fontSize: 13,

            color:
                colors.gray,

            marginBottom: 6,
        },

        infoValue: {
            fontSize: 15,

            fontWeight:
                "600",

            color:
                colors.text,

            lineHeight: 21,
        },

        hintBox: {
            backgroundColor:
                "#FFFBEB",

            borderWidth:
                1,

            borderColor:
                "#FDE68A",

            borderRadius:
                12,

            padding: 14,

            marginBottom:
                12,
        },

        hintNumber: {
            fontSize: 13,

            fontWeight:
                "700",

            color:
                "#92400E",

            marginBottom: 6,
        },

        hintText: {
            fontSize: 15,

            lineHeight: 22,

            color:
                colors.text,
        },

        secondaryButton: {
            borderWidth:
                1,

            borderColor:
                colors.primary,

            borderRadius:
                12,

            paddingVertical:
                13,

            alignItems:
                "center",
        },

        secondaryButtonText: {
            color:
                colors.primary,

            fontSize: 15,

            fontWeight:
                "700",
        },

        disabledSecondaryButton: {
            opacity: 0.4,
        },

        bodyText: {
            fontSize: 15,

            lineHeight: 24,

            color:
                colors.text,
        },

        stepBox: {
            flexDirection:
                "row",

            alignItems:
                "flex-start",

            backgroundColor:
                "#F9FAFB",

            borderRadius:
                12,

            padding: 13,

            marginBottom:
                10,
        },

        stepNumber: {
            width: 28,

            height: 28,

            borderRadius:
                14,

            backgroundColor:
                colors.primary,

            alignItems:
                "center",

            justifyContent:
                "center",

            marginRight:
                10,
        },

        stepNumberText: {
            color:
                colors.white,

            fontSize: 13,

            fontWeight:
                "700",
        },

        stepText: {
            flex: 1,

            fontSize: 15,

            lineHeight: 23,

            color:
                colors.text,
        },

        answerBox: {
            backgroundColor:
                "#EEF2FF",

            borderWidth:
                1,

            borderColor:
                "#C7D2FE",

            borderRadius:
                16,

            padding: 16,

            marginBottom:
                16,
        },

        answerTitle: {
            fontSize: 17,

            fontWeight:
                "700",

            color:
                colors.primary,

            marginBottom: 8,
        },

        answerText: {
            fontSize: 16,

            lineHeight: 24,

            fontWeight:
                "600",

            color:
                colors.text,
        },

        resetButton: {
            borderWidth:
                1,

            borderColor:
                colors.border,

            borderRadius:
                12,

            paddingVertical:
                14,

            alignItems:
                "center",

            backgroundColor:
                colors.white,
        },

        resetButtonText: {
            fontSize: 15,

            fontWeight:
                "700",

            color:
                colors.text,
        },
    });