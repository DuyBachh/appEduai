import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import DocumentCard from "../components/DocumentCard";
import RenameDocumentModal from "../components/RenameDocumentModal";
import ClassifyDocumentModal from "../components/ClassifyDocumentModal";
import useDocuments from "../hooks/useDocuments";
import { getDocumentId } from "../utils/documentUtils";

export default function DocumentsScreen({
    navigation,
}) {
    const documentsState =
        useDocuments(navigation);

    const {
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
    } = documentsState;

    const renderDocument = ({
        item,
    }) => (
        <DocumentCard
            document={item}
            disabled={actionLoading}
            onOpen={openDetail}
            onClassify={openClassify}
            onRename={openRename}
            onDelete={confirmDelete}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>
                        Tài liệu
                    </Text>

                    <Text style={styles.subtitle}>
                        {documents.length} tài liệu của bạn
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.uploadButton,
                        uploadLoading &&
                            styles.disabledButton,
                    ]}
                    onPress={upload}
                    disabled={uploadLoading}
                >
                    {uploadLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.white}
                        />
                    ) : (
                        <Text
                            style={styles.uploadText}
                        >
                            + Tải lên
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            loadDocuments()
                        }
                    >
                        <Text style={styles.retryText}>
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {isLoading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />

                    <Text style={styles.loadingText}>
                        Đang tải tài liệu...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={documents}
                    keyExtractor={(item, index) =>
                        String(
                            getDocumentId(item) ??
                                index
                        )
                    }
                    renderItem={renderDocument}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        documents.length === 0
                            ? styles.emptyList
                            : styles.listContent
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                        />
                    }
                    ListEmptyComponent={
                        <EmptyState
                            loading={uploadLoading}
                            onUpload={upload}
                        />
                    }
                />
            )}

            <ClassifyDocumentModal
                visible={
                    classifyModalVisible
                }
                subject={newSubject}
                topic={newTopic}
                loading={actionLoading}
                onSubjectChange={
                    setNewSubject
                }
                onTopicChange={setNewTopic}
                onClose={closeClassify}
                onSave={saveClassify}
            />

            <RenameDocumentModal
                visible={renameModalVisible}
                value={newName}
                loading={actionLoading}
                onChange={setNewName}
                onClose={closeRename}
                onSave={rename}
            />
        </View>
    );
}

function EmptyState({
    loading,
    onUpload,
}) {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>
                    📄
                </Text>
            </View>

            <Text style={styles.emptyTitle}>
                Chưa có tài liệu
            </Text>

            <Text style={styles.emptyText}>
                Tải PDF, DOCX hoặc TXT lên để bắt đầu học cùng AI.
            </Text>

            <TouchableOpacity
                style={[
                    styles.emptyButton,
                    loading &&
                        styles.disabledButton,
                ]}
                onPress={onUpload}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator
                        color={colors.white}
                    />
                ) : (
                    <Text
                        style={styles.emptyButtonText}
                    >
                        + Tải tài liệu lên
                    </Text>
                )}
            </TouchableOpacity>
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
    uploadText: {
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
    errorBox: {
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
    loadingBox: {
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
});
