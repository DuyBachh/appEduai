import {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
    Modal,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import * as DocumentPicker from "expo-document-picker";

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

export default function DocumentsScreen({
    navigation,
}) {
    const [
        documents,
        setDocuments,
    ] = useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        uploadLoading,
        setUploadLoading,
    ] = useState(false);

    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // =========================
    // RENAME
    // =========================

    const [
        isRenameModalVisible,
        setIsRenameModalVisible,
    ] = useState(false);

    const [
        selectedDocumentId,
        setSelectedDocumentId,
    ] = useState(null);

    const [
        newName,
        setNewName,
    ] = useState("");

    // =========================
    // CLASSIFY
    // =========================

    const [
        isClassifyModalVisible,
        setIsClassifyModalVisible,
    ] = useState(false);

    const [
        newSubject,
        setNewSubject,
    ] = useState("");

    const [
        newTopic,
        setNewTopic,
    ] = useState("");

    // ========================================
    // HELPERS
    // ========================================

    const getDocumentId = (
        document
    ) => {
        return (
            document?.id ||
            document?._id
        );
    };

    const getDocumentName = (
        document
    ) => {
        return (
            document?.name ||
            document?.originalName ||
            document?.fileName ||
            "Tài liệu"
        );
    };

    const getDocumentsFromResponse = (
        result
    ) => {
        if (
            Array.isArray(
                result?.data
            )
        ) {
            return result.data;
        }

        if (
            Array.isArray(
                result?.data
                    ?.documents
            )
        ) {
            return result.data
                .documents;
        }

        return [];
    };

    // ========================================
    // LOAD DOCUMENTS
    // ========================================

    const loadDocuments =
        useCallback(
            async (
                showLoading =
                    true
            ) => {
                try {
                    if (
                        showLoading
                    ) {
                        setIsLoading(
                            true
                        );
                    }

                    setError("");

                    const result =
                        await apiRequest(
                            "/documents"
                        );

                    const list =
                        getDocumentsFromResponse(
                            result
                        );

                    setDocuments(
                        list
                    );

                    console.log(
                        "DOCUMENT LIST SUCCESS:",
                        list.length
                    );
                } catch (error) {
                    console.log(
                        "DOCUMENT LIST ERROR:",
                        error.message
                    );

                    setError(
                        error.message ||
                            "Không thể tải danh sách tài liệu."
                    );
                } finally {
                    if (
                        showLoading
                    ) {
                        setIsLoading(
                            false
                        );
                    }
                }
            },
            []
        );

    useFocusEffect(
        useCallback(() => {
            loadDocuments();

            return undefined;
        }, [loadDocuments])
    );

    // ========================================
    // REFRESH
    // ========================================

    const handleRefresh =
        async () => {
            try {
                setRefreshing(
                    true
                );

                await loadDocuments(
                    false
                );
            } finally {
                setRefreshing(
                    false
                );
            }
        };

    // ========================================
    // UPLOAD
    // ========================================

    const handleUpload =
        async () => {
            setError("");

            try {
                const result =
                    await DocumentPicker
                        .getDocumentAsync({
                            type: [
                                "application/pdf",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                "text/plain",
                            ],

                            copyToCacheDirectory:
                                true,

                            multiple:
                                false,
                        });

                if (
                    result.canceled
                ) {
                    return;
                }

                const pickedFile =
                    result.assets[0];

                console.log(
                    "FILE ĐÃ CHỌN:",
                    pickedFile.name
                );

                console.log(
                    "FILE URI:",
                    pickedFile.uri
                );

                const token =
                    await getToken();

                if (!token) {
                    throw new Error(
                        "Bạn chưa đăng nhập."
                    );
                }

                setUploadLoading(
                    true
                );

                let mimeType =
                    pickedFile.mimeType;

                if (!mimeType) {
                    const extension =
                        pickedFile.name
                            ?.split(".")
                            .pop()
                            ?.toLowerCase();

                    if (
                        extension ===
                        "pdf"
                    ) {
                        mimeType =
                            "application/pdf";
                    } else if (
                        extension ===
                        "docx"
                    ) {
                        mimeType =
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    } else if (
                        extension ===
                        "txt"
                    ) {
                        mimeType =
                            "text/plain";
                    } else {
                        mimeType =
                            "application/octet-stream";
                    }
                }

                const uploadFile =
                    new File(
                        pickedFile.uri
                    );

                console.log(
                    "UPLOAD FILE EXISTS:",
                    uploadFile.exists
                );

                console.log(
                    "UPLOAD FILE SIZE:",
                    uploadFile.size
                );

                const uploadTask =
                    uploadFile
                        .createUploadTask(
                            `${API_BASE_URL}/documents/upload`,
                            {
                                httpMethod:
                                    "POST",

                                uploadType:
                                    UploadType
                                        .MULTIPART,

                                fieldName:
                                    "file",

                                mimeType,

                                parameters: {
                                    originalName:
                                        pickedFile.name,
                                },

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                const uploadResponse =
                    await uploadTask
                        .uploadAsync();

                console.log(
                    "UPLOAD STATUS:",
                    uploadResponse.status
                );

                console.log(
                    "UPLOAD RESPONSE:",
                    uploadResponse.body
                );

                let responseData =
                    {};

                try {
                    responseData =
                        uploadResponse.body
                            ? JSON.parse(
                                  uploadResponse.body
                              )
                            : {};
                } catch {
                    throw new Error(
                        "Server không trả về JSON hợp lệ."
                    );
                }

                if (
                    uploadResponse.status ===
                    401
                ) {
                    await removeToken();

                    throw new Error(
                        responseData.message ||
                            "Phiên đăng nhập đã hết hạn."
                    );
                }

                if (
                    uploadResponse.status <
                        200 ||
                    uploadResponse.status >=
                        300
                ) {
                    throw new Error(
                        responseData.message ||
                            "Upload tài liệu thất bại."
                    );
                }

                console.log(
                    "DOCUMENT UPLOAD SUCCESS:",
                    responseData.success
                );

                Alert.alert(
                    "Thành công",
                    responseData.message ||
                        "Tải tài liệu lên thành công."
                );

                await loadDocuments(
                    false
                );
            } catch (error) {
                console.log(
                    "DOCUMENT UPLOAD ERROR:",
                    error.message
                );

                setError(
                    error.message ||
                        "Không thể tải tài liệu lên."
                );
            } finally {
                setUploadLoading(
                    false
                );
            }
        };

    // ========================================
    // DETAIL
    // ========================================

    const handleOpenDetail = (
        document
    ) => {
        navigation.navigate(
            "DocumentDetail",
            {
                document,
            }
        );
    };

    // ========================================
    // RENAME
    // ========================================

    const handleOpenRename = (
        document
    ) => {
        setSelectedDocumentId(
            getDocumentId(
                document
            )
        );

        setNewName(
            getDocumentName(
                document
            )
        );

        setIsRenameModalVisible(
            true
        );
    };

    const handleCancelRename =
        () => {
            setIsRenameModalVisible(
                false
            );

            setSelectedDocumentId(
                null
            );

            setNewName("");
        };

    const handleRename =
        async () => {
            const trimmedName =
                newName.trim();

            if (!trimmedName) {
                Alert.alert(
                    "Lỗi",
                    "Tên tài liệu không được để trống."
                );

                return;
            }

            if (
                !selectedDocumentId
            ) {
                return;
            }

            try {
                setActionLoading(
                    true
                );

                const result =
                    await apiRequest(
                        `/documents/${selectedDocumentId}`,
                        {
                            method:
                                "PUT",

                            body:
                                JSON.stringify(
                                    {
                                        name:
                                            trimmedName,
                                    }
                                ),
                        }
                    );

                console.log(
                    "DOCUMENT RENAME SUCCESS:",
                    result?.success
                );

                handleCancelRename();

                await loadDocuments(
                    false
                );

                Alert.alert(
                    "Thành công",
                    result?.message ||
                        "Đã đổi tên tài liệu."
                );
            } catch (error) {
                console.log(
                    "DOCUMENT RENAME ERROR:",
                    error.message
                );

                Alert.alert(
                    "Lỗi",
                    error.message ||
                        "Không thể đổi tên tài liệu."
                );
            } finally {
                setActionLoading(
                    false
                );
            }
        };

    // ========================================
    // CLASSIFY
    // ========================================

    const handleOpenClassify = (
        document
    ) => {
        setSelectedDocumentId(
            getDocumentId(
                document
            )
        );

        setNewSubject(
            document.subject || ""
        );

        setNewTopic(
            document.topic || ""
        );

        setIsClassifyModalVisible(
            true
        );
    };

    const handleCancelClassify =
        () => {
            setIsClassifyModalVisible(
                false
            );

            setSelectedDocumentId(
                null
            );

            setNewSubject("");
            setNewTopic("");
        };

    const handleSaveClassify =
        async () => {
            const subject =
                newSubject.trim();

            const topic =
                newTopic.trim();

            if (
                !subject &&
                !topic
            ) {
                Alert.alert(
                    "Lỗi",
                    "Vui lòng nhập môn học hoặc chủ đề."
                );

                return;
            }

            if (
                !selectedDocumentId
            ) {
                return;
            }

            try {
                setActionLoading(
                    true
                );

                const result =
                    await apiRequest(
                        `/documents/${selectedDocumentId}`,
                        {
                            method:
                                "PUT",

                            body:
                                JSON.stringify(
                                    {
                                        subject,
                                        topic,
                                    }
                                ),
                        }
                    );

                console.log(
                    "DOCUMENT CLASSIFY SUCCESS:",
                    result?.success
                );

                handleCancelClassify();

                await loadDocuments(
                    false
                );

                Alert.alert(
                    "Thành công",
                    result?.message ||
                        "Đã cập nhật môn học và chủ đề."
                );
            } catch (error) {
                console.log(
                    "DOCUMENT CLASSIFY ERROR:",
                    error.message
                );

                Alert.alert(
                    "Lỗi",
                    error.message ||
                        "Không thể cập nhật phân loại."
                );
            } finally {
                setActionLoading(
                    false
                );
            }
        };

    // ========================================
    // DELETE
    // ========================================

    const deleteDocument =
        async (
            documentId
        ) => {
            try {
                setActionLoading(
                    true
                );

                const result =
                    await apiRequest(
                        `/documents/${documentId}`,
                        {
                            method:
                                "DELETE",
                        }
                    );

                console.log(
                    "DOCUMENT DELETE SUCCESS:",
                    result?.success
                );

                setDocuments(
                    (
                        currentDocuments
                    ) =>
                        currentDocuments.filter(
                            (
                                document
                            ) =>
                                getDocumentId(
                                    document
                                ) !==
                                documentId
                        )
                );

                Alert.alert(
                    "Thành công",
                    result?.message ||
                        "Đã xóa tài liệu."
                );
            } catch (error) {
                console.log(
                    "DOCUMENT DELETE ERROR:",
                    error.message
                );

                Alert.alert(
                    "Lỗi",
                    error.message ||
                        "Không thể xóa tài liệu."
                );
            } finally {
                setActionLoading(
                    false
                );
            }
        };

    const handleDelete = (
        document
    ) => {
        const documentId =
            getDocumentId(
                document
            );

        if (!documentId) {
            return;
        }

        Alert.alert(
            "Xóa tài liệu",
            `Bạn có chắc chắn muốn xóa "${getDocumentName(
                document
            )}" không?`,
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style:
                        "destructive",

                    onPress:
                        () =>
                            deleteDocument(
                                documentId
                            ),
                },
            ]
        );
    };

    // ========================================
    // FORMAT SIZE
    // ========================================

    const formatFileSize = (
        size
    ) => {
        const number =
            Number(size);

        if (
            !number ||
            Number.isNaN(number)
        ) {
            return "Không xác định";
        }

        if (number < 1024) {
            return `${number} B`;
        }

        if (
            number <
            1024 * 1024
        ) {
            return `${(
                number / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            number /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleDateString(
            "vi-VN"
        );
    };

    // ========================================
    // FILE TYPE
    // ========================================

    const getFileType = (
        document
    ) => {
        const name =
            getDocumentName(
                document
            );

        const extension =
            name
                .split(".")
                .pop()
                ?.toUpperCase();

        return (
            extension ||
            document?.fileType ||
            "FILE"
        );
    };

    // ========================================
    // RENDER DOCUMENT
    // ========================================

    const renderDocument = ({
        item,
    }) => {
        const name =
            getDocumentName(
                item
            );

        const date =
            formatDate(
                item.createdAt ||
                    item.updatedAt ||
                    item.date
            );

        return (
            <View
                style={
                    styles.documentCard
                }
            >
                <TouchableOpacity
                    style={
                        styles.documentMain
                    }
                    onPress={() =>
                        handleOpenDetail(
                            item
                        )
                    }
                    activeOpacity={
                        0.75
                    }
                >
                    <View
                        style={
                            styles.fileIcon
                        }
                    >
                        <Text
                            style={
                                styles.fileIconText
                            }
                        >
                            📄
                        </Text>

                        <Text
                            style={
                                styles.fileType
                            }
                        >
                            {getFileType(
                                item
                            )}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.documentInfo
                        }
                    >
                        <Text
                            style={
                                styles.fileName
                            }
                            numberOfLines={
                                2
                            }
                        >
                            {name}
                        </Text>

                        <View
                            style={
                                styles.metaRow
                            }
                        >
                            <Text
                                style={
                                    styles.metaText
                                }
                            >
                                {formatFileSize(
                                    item.size ||
                                        item.fileSize
                                )}
                            </Text>

                            {date ? (
                                <>
                                    <Text
                                        style={
                                            styles.metaDot
                                        }
                                    >
                                        •
                                    </Text>

                                    <Text
                                        style={
                                            styles.metaText
                                        }
                                    >
                                        {date}
                                    </Text>
                                </>
                            ) : null}
                        </View>

                        {item.subject ? (
                            <Text
                                style={
                                    styles.subjectText
                                }
                                numberOfLines={
                                    1
                                }
                            >
                                Môn học:{" "}
                                {item.subject}
                            </Text>
                        ) : null}

                        {item.topic ? (
                            <Text
                                style={
                                    styles.topicText
                                }
                                numberOfLines={
                                    1
                                }
                            >
                                Chủ đề:{" "}
                                {item.topic}
                            </Text>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <View
                    style={
                        styles.divider
                    }
                />

                <View
                    style={
                        styles.documentActions
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.secondaryButton
                        }
                        onPress={() =>
                            handleOpenDetail(
                                item
                            )
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        <Text
                            style={
                                styles.secondaryButtonText
                            }
                        >
                            Xem
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.secondaryButton
                        }
                        onPress={() =>
                            handleOpenClassify(
                                item
                            )
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        <Text
                            style={
                                styles.secondaryButtonText
                            }
                        >
                            Phân loại
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.secondaryButton
                        }
                        onPress={() =>
                            handleOpenRename(
                                item
                            )
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        <Text
                            style={
                                styles.secondaryButtonText
                            }
                        >
                            Đổi tên
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.deleteButton
                        }
                        onPress={() =>
                            handleDelete(
                                item
                            )
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        <Text
                            style={
                                styles.deleteButtonText
                            }
                        >
                            Xóa
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ========================================
    // UI
    // ========================================

    return (
        <View
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <View>
                    <Text
                        style={
                            styles.title
                        }
                    >
                        Tài liệu
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        {documents.length} tài
                        liệu của bạn
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.uploadButton,

                        uploadLoading &&
                            styles.disabledButton,
                    ]}
                    onPress={
                        handleUpload
                    }
                    disabled={
                        uploadLoading
                    }
                >
                    {uploadLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={
                                colors.white
                            }
                        />
                    ) : (
                        <Text
                            style={
                                styles.uploadButtonText
                            }
                        >
                            + Tải lên
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {error ? (
                <View
                    style={
                        styles.errorContainer
                    }
                >
                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        {error}
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            loadDocuments()
                        }
                    >
                        <Text
                            style={
                                styles.retryText
                            }
                        >
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {isLoading ? (
                <View
                    style={
                        styles.loadingContainer
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
                            styles.loadingText
                        }
                    >
                        Đang tải tài liệu...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={
                        documents
                    }
                    keyExtractor={(
                        item,
                        index
                    ) =>
                        String(
                            getDocumentId(
                                item
                            ) ??
                                index
                        )
                    }
                    renderItem={
                        renderDocument
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        documents.length ===
                        0
                            ? styles.emptyList
                            : styles.listContent
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                refreshing
                            }
                            onRefresh={
                                handleRefresh
                            }
                        />
                    }
                    ListEmptyComponent={
                        <View
                            style={
                                styles.emptyContainer
                            }
                        >
                            <View
                                style={
                                    styles.emptyIcon
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyIconText
                                    }
                                >
                                    📄
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Chưa có tài liệu
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Tải PDF, DOCX hoặc TXT
                                lên để bắt đầu học
                                cùng AI.
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.emptyButton,

                                    uploadLoading &&
                                        styles.disabledButton,
                                ]}
                                onPress={
                                    handleUpload
                                }
                                disabled={
                                    uploadLoading
                                }
                            >
                                {uploadLoading ? (
                                    <ActivityIndicator
                                        color={
                                            colors.white
                                        }
                                    />
                                ) : (
                                    <Text
                                        style={
                                            styles.emptyButtonText
                                        }
                                    >
                                        + Tải tài liệu lên
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* =================================
                CLASSIFY MODAL
            ================================= */}

            <Modal
                visible={
                    isClassifyModalVisible
                }
                transparent
                animationType="fade"
                onRequestClose={
                    handleCancelClassify
                }
            >
                <View
                    style={
                        styles.modalOverlay
                    }
                >
                    <View
                        style={
                            styles.modalContainer
                        }
                    >
                        <Text
                            style={
                                styles.modalTitle
                            }
                        >
                            Phân loại tài liệu
                        </Text>

                        <Text
                            style={
                                styles.modalDescription
                            }
                        >
                            Thêm môn học và chủ đề để quản lý tài liệu dễ hơn.
                        </Text>

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Môn học
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            value={
                                newSubject
                            }
                            onChangeText={
                                setNewSubject
                            }
                            placeholder="Ví dụ: Lập trình Mobile"
                            placeholderTextColor={
                                colors.gray
                            }
                            editable={
                                !actionLoading
                            }
                        />

                        <Text
                            style={[
                                styles.inputLabel,
                                styles.topicLabel,
                            ]}
                        >
                            Chủ đề
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            value={
                                newTopic
                            }
                            onChangeText={
                                setNewTopic
                            }
                            placeholder="Ví dụ: React Native"
                            placeholderTextColor={
                                colors.gray
                            }
                            editable={
                                !actionLoading
                            }
                        />

                        <View
                            style={
                                styles.modalActions
                            }
                        >
                            <TouchableOpacity
                                style={
                                    styles.cancelButton
                                }
                                onPress={
                                    handleCancelClassify
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelButtonText
                                    }
                                >
                                    Hủy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.saveButton,

                                    actionLoading &&
                                        styles.disabledButton,
                                ]}
                                onPress={
                                    handleSaveClassify
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                {actionLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            colors.white
                                        }
                                    />
                                ) : (
                                    <Text
                                        style={
                                            styles.saveButtonText
                                        }
                                    >
                                        Lưu
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* =================================
                RENAME MODAL
            ================================= */}

            <Modal
                visible={
                    isRenameModalVisible
                }
                transparent
                animationType="fade"
                onRequestClose={
                    handleCancelRename
                }
            >
                <View
                    style={
                        styles.modalOverlay
                    }
                >
                    <View
                        style={
                            styles.modalContainer
                        }
                    >
                        <Text
                            style={
                                styles.modalTitle
                            }
                        >
                            Đổi tên tài liệu
                        </Text>

                        <Text
                            style={
                                styles.modalDescription
                            }
                        >
                            Nhập tên mới cho tài liệu.
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            value={
                                newName
                            }
                            onChangeText={
                                setNewName
                            }
                            placeholder="Tên tài liệu"
                            placeholderTextColor={
                                colors.gray
                            }
                            editable={
                                !actionLoading
                            }
                            autoFocus
                        />

                        <View
                            style={
                                styles.modalActions
                            }
                        >
                            <TouchableOpacity
                                style={
                                    styles.cancelButton
                                }
                                onPress={
                                    handleCancelRename
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelButtonText
                                    }
                                >
                                    Hủy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.saveButton,

                                    actionLoading &&
                                        styles.disabledButton,
                                ]}
                                onPress={
                                    handleRename
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                {actionLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            colors.white
                                        }
                                    />
                                ) : (
                                    <Text
                                        style={
                                            styles.saveButtonText
                                        }
                                    >
                                        Lưu
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        fontSize: 13,
        color: colors.gray,
        marginTop: 4,
    },

    uploadButton: {
        height: 44,
        minWidth: 96,
        paddingHorizontal: 16,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    uploadButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
    },

    disabledButton: {
        opacity: 0.6,
    },

    listContent: {
        paddingBottom: 30,
    },

    documentCard: {
        backgroundColor:
            colors.white,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },

    documentMain: {
        flexDirection: "row",
        alignItems: "center",
    },

    fileIcon: {
        width: 58,
        height: 58,
        borderRadius: 12,
        backgroundColor:
            colors.background,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    fileIconText: {
        fontSize: 25,
    },

    fileType: {
        fontSize: 9,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 2,
    },

    documentInfo: {
        flex: 1,
    },

    fileName: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "600",
        color: colors.text,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    metaText: {
        fontSize: 12,
        color: colors.gray,
    },

    metaDot: {
        fontSize: 12,
        color: colors.gray,
        marginHorizontal: 7,
    },

    subjectText: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "600",
        color: colors.primary,
    },

    topicText: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 18,
        color: colors.gray,
    },

    divider: {
        height: 1,
        backgroundColor:
            colors.border,
        marginVertical: 13,
    },

    documentActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:
            "space-between",
        gap: 8,
    },

    secondaryButton: {
        width: "48%",
        height: 38,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 8,
        backgroundColor:
            colors.white,
        alignItems: "center",
        justifyContent: "center",
    },

    secondaryButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text,
    },

    deleteButton: {
        width: "48%",
        height: 38,
        borderWidth: 1,
        borderColor:
            colors.error,
        borderRadius: 8,
        backgroundColor:
            colors.white,
        alignItems: "center",
        justifyContent: "center",
    },

    deleteButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.error,
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 80,
    },

    loadingText: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 12,
    },

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        backgroundColor:
            "#FEF2F2",
        borderWidth: 1,
        borderColor:
            colors.error,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
    },

    errorText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: colors.error,
        marginRight: 10,
    },

    retryText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.error,
    },

    emptyList: {
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },

    emptyIcon: {
        width: 76,
        height: 76,
        borderRadius: 20,
        backgroundColor:
            colors.white,
        borderWidth: 1,
        borderColor:
            colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    emptyIconText: {
        fontSize: 34,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
        maxWidth: 290,
        marginBottom: 20,
    },

    emptyButton: {
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    modalContainer: {
        width: "100%",
        backgroundColor:
            colors.white,
        borderRadius: 14,
        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    modalDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.gray,
        marginTop: 5,
        marginBottom: 16,
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 7,
    },

    topicLabel: {
        marginTop: 14,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor:
            colors.primary,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text,
        backgroundColor:
            colors.white,
    },

    modalActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },

    cancelButton: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    cancelButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },

    saveButton: {
        flex: 1,
        height: 48,
        backgroundColor:
            colors.primary,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    saveButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white,
    },
});