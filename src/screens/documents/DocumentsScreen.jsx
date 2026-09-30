import { useState } from "react";

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
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

import colors from "../../styles/colors";

export default function DocumentsScreen({ navigation }) {
    const [documents, setDocuments] = useState([]);

    // =========================
    // LOADING
    // =========================

    const [isLoading, setIsLoading] = useState(false);

    // =========================
    // ERROR
    // =========================

    const [error, setError] = useState("");

    // =========================
    // RENAME
    // =========================

    const [isRenameModalVisible, setIsRenameModalVisible] =
        useState(false);

    const [selectedDocumentId, setSelectedDocumentId] =
        useState(null);

    const [newName, setNewName] = useState("");

    // =========================
    // SUBJECT
    // =========================

    const [isSubjectModalVisible, setIsSubjectModalVisible] =
        useState(false);

    const [newSubject, setNewSubject] = useState("");

    // =========================
    // TOPIC
    // =========================

    const [isTopicModalVisible, setIsTopicModalVisible] =
        useState(false);

    const [newTopic, setNewTopic] = useState("");

    // =========================
    // UPLOAD
    // =========================

    const handleUpload = async () => {
        setError("");
        setIsLoading(true);

        try {
            const result =
                await DocumentPicker.getDocumentAsync({
                    type: [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "text/plain",
                    ],
                    copyToCacheDirectory: true,
                    multiple: false,
                });

            if (!result.canceled) {
                const file = result.assets[0];

                const newDocument = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size || 0,
                    uri: file.uri,
                    date: new Date().toLocaleDateString(
                        "vi-VN"
                    ),
                    subject: "",
                    topic: "",
                };

                setDocuments((currentDocuments) => [
                    ...currentDocuments,
                    newDocument,
                ]);
            }
        } catch (error) {
            console.error(
                "Lỗi chọn file:",
                error
            );

            setError(
                "Không thể chọn tài liệu. Vui lòng thử lại."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // =========================
    // DETAIL
    // =========================

    const handleOpenDetail = (document) => {
        navigation.navigate("DocumentDetail", {
            document: document,
        });
    };

    // =========================
    // RENAME
    // =========================

    const handleOpenRename = (document) => {
        setSelectedDocumentId(document.id);
        setNewName(document.name);
        setIsRenameModalVisible(true);
    };

    const handleRename = () => {
        const trimmedName = newName.trim();

        if (!trimmedName) {
            Alert.alert(
                "Lỗi",
                "Tên tài liệu không được để trống."
            );

            return;
        }

        setDocuments((currentDocuments) =>
            currentDocuments.map((document) =>
                document.id === selectedDocumentId
                    ? {
                          ...document,
                          name: trimmedName,
                      }
                    : document
            )
        );

        setIsRenameModalVisible(false);
        setSelectedDocumentId(null);
        setNewName("");

        Alert.alert(
            "Thành công",
            "Đã đổi tên tài liệu."
        );
    };

    const handleCancelRename = () => {
        setIsRenameModalVisible(false);
        setSelectedDocumentId(null);
        setNewName("");
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = (documentId) => {
        Alert.alert(
            "Xóa tài liệu",
            "Bạn có chắc chắn muốn xóa tài liệu này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => {
                        setDocuments((currentDocuments) =>
                            currentDocuments.filter(
                                (document) =>
                                    document.id !==
                                    documentId
                            )
                        );
                    },
                },
            ]
        );
    };

    // =========================
    // SUBJECT
    // =========================

    const handleOpenSubject = (document) => {
        setSelectedDocumentId(document.id);
        setNewSubject(document.subject || "");
        setIsSubjectModalVisible(true);
    };

    const handleSaveSubject = () => {
        const trimmedSubject = newSubject.trim();

        if (!trimmedSubject) {
            Alert.alert(
                "Lỗi",
                "Môn học không được để trống."
            );

            return;
        }

        setDocuments((currentDocuments) =>
            currentDocuments.map((document) =>
                document.id === selectedDocumentId
                    ? {
                          ...document,
                          subject: trimmedSubject,
                      }
                    : document
            )
        );

        setIsSubjectModalVisible(false);
        setSelectedDocumentId(null);
        setNewSubject("");

        Alert.alert(
            "Thành công",
            "Đã cập nhật môn học."
        );
    };

    const handleCancelSubject = () => {
        setIsSubjectModalVisible(false);
        setSelectedDocumentId(null);
        setNewSubject("");
    };

    // =========================
    // TOPIC
    // =========================

    const handleOpenTopic = (document) => {
        setSelectedDocumentId(document.id);
        setNewTopic(document.topic || "");
        setIsTopicModalVisible(true);
    };

    const handleSaveTopic = () => {
        const trimmedTopic = newTopic.trim();

        if (!trimmedTopic) {
            Alert.alert(
                "Lỗi",
                "Chủ đề không được để trống."
            );

            return;
        }

        setDocuments((currentDocuments) =>
            currentDocuments.map((document) =>
                document.id === selectedDocumentId
                    ? {
                          ...document,
                          topic: trimmedTopic,
                      }
                    : document
            )
        );

        setIsTopicModalVisible(false);
        setSelectedDocumentId(null);
        setNewTopic("");

        Alert.alert(
            "Thành công",
            "Đã cập nhật chủ đề."
        );
    };

    const handleCancelTopic = () => {
        setIsTopicModalVisible(false);
        setSelectedDocumentId(null);
        setNewTopic("");
    };

    // =========================
    // DOCUMENT CARD
    // =========================

    const renderDocument = ({ item }) => {
        return (
            <View style={styles.documentCard}>
                {/* CLICK TO DETAIL */}
                <TouchableOpacity
                    style={styles.documentMain}
                    onPress={() =>
                        handleOpenDetail(item)
                    }
                    activeOpacity={0.7}
                >
                    <View style={styles.fileIcon}>
                        <Text style={styles.fileIconText}>
                            📄
                        </Text>
                    </View>

                    <View style={styles.documentInfo}>
                        <Text
                            style={styles.fileName}
                            numberOfLines={1}
                        >
                            {item.name}
                        </Text>

                        <Text style={styles.fileSize}>
                            {item.size > 0
                                ? `${(
                                      item.size / 1024
                                  ).toFixed(2)} KB`
                                : "Không xác định"}
                        </Text>

                        <Text style={styles.fileDate}>
                            Thêm ngày: {item.date}
                        </Text>

                        <Text style={styles.subjectText}>
                            Môn học:{" "}
                            {item.subject || "Chưa có"}
                        </Text>

                        <Text style={styles.topicText}>
                            Chủ đề:{" "}
                            {item.topic || "Chưa có"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* ACTION BUTTONS */}

                <View style={styles.documentActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            handleOpenSubject(item)
                        }
                    >
                        <Text
                            style={styles.actionButtonText}
                        >
                            Môn học
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            handleOpenTopic(item)
                        }
                    >
                        <Text
                            style={styles.actionButtonText}
                        >
                            Chủ đề
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            handleOpenRename(item)
                        }
                    >
                        <Text
                            style={styles.actionButtonText}
                        >
                            Đổi tên
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                            handleDelete(item.id)
                        }
                    >
                        <Text
                            style={styles.deleteButtonText}
                        >
                            Xóa
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // =========================
    // UI
    // =========================

    return (
        <View style={styles.container}>
            {/* HEADER */}

            <View style={styles.header}>
                <Text style={styles.title}>
                    Tài liệu
                </Text>

                <TouchableOpacity
                    style={[
                        styles.uploadButton,
                        isLoading &&
                            styles.disabledButton,
                    ]}
                    onPress={handleUpload}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.white}
                        />
                    ) : (
                        <Text style={styles.uploadButtonText}>
                            + Tải lên
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* ERROR */}

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setError("")}
                    >
                        <Text style={styles.closeError}>
                            Đóng
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {/* LOADING / LIST / EMPTY */}

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />

                    <Text style={styles.loadingText}>
                        Đang xử lý tài liệu...
                    </Text>
                </View>
            ) : documents.length > 0 ? (
                <FlatList
                    data={documents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderDocument}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>
                        Chưa có tài liệu
                    </Text>

                    <Text style={styles.emptyText}>
                        Hãy tải tài liệu lên để bắt đầu
                        học cùng AI.
                    </Text>

                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={handleUpload}
                    >
                        <Text style={styles.emptyButtonText}>
                            + Tải tài liệu lên
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* =========================
                RENAME MODAL
            ========================= */}

            <Modal
                visible={isRenameModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancelRename}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Đổi tên tài liệu
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Nhập tên tài liệu"
                            placeholderTextColor={
                                colors.gray
                            }
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelRename}
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
                                style={styles.saveButton}
                                onPress={handleRename}
                            >
                                <Text
                                    style={
                                        styles.saveButtonText
                                    }
                                >
                                    Lưu
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* =========================
                SUBJECT MODAL
            ========================= */}

            <Modal
                visible={isSubjectModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancelSubject}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Môn học
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={newSubject}
                            onChangeText={setNewSubject}
                            placeholder="Ví dụ: Lập trình Mobile"
                            placeholderTextColor={
                                colors.gray
                            }
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelSubject}
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
                                style={styles.saveButton}
                                onPress={handleSaveSubject}
                            >
                                <Text
                                    style={
                                        styles.saveButtonText
                                    }
                                >
                                    Lưu
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* =========================
                TOPIC MODAL
            ========================= */}

            <Modal
                visible={isTopicModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancelTopic}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Chủ đề
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={newTopic}
                            onChangeText={setNewTopic}
                            placeholder="Ví dụ: React Native & Expo"
                            placeholderTextColor={
                                colors.gray
                            }
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelTopic}
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
                                style={styles.saveButton}
                                onPress={handleSaveTopic}
                            >
                                <Text
                                    style={
                                        styles.saveButtonText
                                    }
                                >
                                    Lưu
                                </Text>
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
        backgroundColor: colors.background,
        padding: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
    },

    uploadButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        height: 42,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 90,
    },

    disabledButton: {
        opacity: 0.6,
    },

    uploadButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
    },

    documentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },

    documentMain: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    fileIcon: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    fileIconText: {
        fontSize: 24,
    },

    documentInfo: {
        flex: 1,
    },

    fileName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 5,
    },

    fileSize: {
        fontSize: 13,
        color: colors.gray,
    },

    fileDate: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 3,
    },

    subjectText: {
        fontSize: 12,
        color: colors.primary,
        marginTop: 4,
        fontWeight: "600",
    },

    topicText: {
        fontSize: 12,
        color: colors.primary,
        marginTop: 3,
        fontWeight: "600",
    },

    documentActions: {
        alignItems: "flex-end",
        marginLeft: 8,
    },

    actionButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: 6,
    },

    actionButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text,
    },

    deleteButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 8,
    },

    deleteButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.error,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 80,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.gray,
        textAlign: "center",
        maxWidth: 280,
        marginBottom: 20,
    },

    emptyButton: {
        height: 48,
        backgroundColor: colors.primary,
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
        justifyContent: "space-between",
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },

    errorText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: colors.error,
        marginRight: 10,
    },

    closeError: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.error,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    modalContainer: {
        width: "100%",
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 16,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text,
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
        borderColor: colors.border,
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
        backgroundColor: colors.primary,
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
