import {
    useCallback,
    useState,
} from "react";

import { Alert } from "react-native";
import {
    useFocusEffect,
} from "@react-navigation/native";

import DocumentService from "../services/documentService";
import {
    getDocumentId,
    getDocumentName,
} from "../utils/documentUtils";

export default function useDocuments(
    navigation
) {
    const [documents, setDocuments] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [
        uploadLoading,
        setUploadLoading,
    ] = useState(false);

    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const [
        renameModalVisible,
        setRenameModalVisible,
    ] = useState(false);

    const [
        classifyModalVisible,
        setClassifyModalVisible,
    ] = useState(false);

    const [
        selectedDocumentId,
        setSelectedDocumentId,
    ] = useState(null);

    const [newName, setNewName] =
        useState("");

    const [
        newSubject,
        setNewSubject,
    ] = useState("");

    const [newTopic, setNewTopic] =
        useState("");

    const loadDocuments =
        useCallback(
            async (
                showLoading = true
            ) => {
                try {
                    if (showLoading) {
                        setIsLoading(true);
                    }

                    setError("");

                    const list =
                        await DocumentService.getDocuments();

                    setDocuments(list);
                } catch (requestError) {
                    setError(
                        requestError.message ||
                            "Không thể tải danh sách tài liệu."
                    );
                } finally {
                    if (showLoading) {
                        setIsLoading(false);
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

    const refresh = async () => {
        try {
            setRefreshing(true);
            await loadDocuments(false);
        } finally {
            setRefreshing(false);
        }
    };

    const upload = async () => {
        if (uploadLoading) {
            return;
        }

        try {
            setError("");

            const file =
                await DocumentService.pickDocument();

            if (!file) {
                return;
            }

            setUploadLoading(true);

            const result =
                await DocumentService.uploadDocument(
                    file
                );

            await loadDocuments(false);

            Alert.alert(
                "Thành công",
                result?.message ||
                    "Tải tài liệu lên thành công."
            );
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể tải tài liệu lên."
            );
        } finally {
            setUploadLoading(false);
        }
    };

    const openDetail = (document) => {
        navigation.navigate(
            "DocumentDetail",
            { document }
        );
    };

    const openRename = (document) => {
        setSelectedDocumentId(
            getDocumentId(document)
        );
        setNewName(
            getDocumentName(document)
        );
        setRenameModalVisible(true);
    };

    const closeRename = () => {
        setRenameModalVisible(false);
        setSelectedDocumentId(null);
        setNewName("");
    };

    const rename = async () => {
        const name = newName.trim();

        if (!name) {
            Alert.alert(
                "Lỗi",
                "Tên tài liệu không được để trống."
            );
            return;
        }

        if (!selectedDocumentId) {
            return;
        }

        try {
            setActionLoading(true);

            const result =
                await DocumentService.updateDocument(
                    selectedDocumentId,
                    { name }
                );

            closeRename();
            await loadDocuments(false);

            Alert.alert(
                "Thành công",
                result?.message ||
                    "Đã đổi tên tài liệu."
            );
        } catch (requestError) {
            Alert.alert(
                "Lỗi",
                requestError.message ||
                    "Không thể đổi tên tài liệu."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const openClassify = (document) => {
        setSelectedDocumentId(
            getDocumentId(document)
        );
        setNewSubject(
            document?.subject || ""
        );
        setNewTopic(
            document?.topic || ""
        );
        setClassifyModalVisible(true);
    };

    const closeClassify = () => {
        setClassifyModalVisible(false);
        setSelectedDocumentId(null);
        setNewSubject("");
        setNewTopic("");
    };

    const saveClassify = async () => {
        const subject =
            newSubject.trim();
        const topic = newTopic.trim();

        if (!subject && !topic) {
            Alert.alert(
                "Lỗi",
                "Vui lòng nhập môn học hoặc chủ đề."
            );
            return;
        }

        if (!selectedDocumentId) {
            return;
        }

        try {
            setActionLoading(true);

            const result =
                await DocumentService.updateDocument(
                    selectedDocumentId,
                    { subject, topic }
                );

            closeClassify();
            await loadDocuments(false);

            Alert.alert(
                "Thành công",
                result?.message ||
                    "Đã cập nhật môn học và chủ đề."
            );
        } catch (requestError) {
            Alert.alert(
                "Lỗi",
                requestError.message ||
                    "Không thể cập nhật phân loại."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const removeDocument =
        async (documentId) => {
            try {
                setActionLoading(true);

                const result =
                    await DocumentService.deleteDocument(
                        documentId
                    );

                setDocuments(
                    (current) =>
                        current.filter(
                            (item) =>
                                getDocumentId(
                                    item
                                ) !==
                                documentId
                        )
                );

                Alert.alert(
                    "Thành công",
                    result?.message ||
                        "Đã xóa tài liệu."
                );
            } catch (requestError) {
                Alert.alert(
                    "Lỗi",
                    requestError.message ||
                        "Không thể xóa tài liệu."
                );
            } finally {
                setActionLoading(false);
            }
        };

    const confirmDelete = (document) => {
        const documentId =
            getDocumentId(document);

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
                    style: "destructive",
                    onPress: () =>
                        removeDocument(
                            documentId
                        ),
                },
            ]
        );
    };

    return {
        documents,
        isLoading,
        refreshing,
        uploadLoading,
        actionLoading,
        error,

        renameModalVisible,
        classifyModalVisible,

        newName,
        newSubject,
        newTopic,

        setNewName,
        setNewSubject,
        setNewTopic,

        loadDocuments,
        refresh,
        upload,
        openDetail,
        openRename,
        closeRename,
        rename,
        openClassify,
        closeClassify,
        saveClassify,
        confirmDelete,
    };
}
