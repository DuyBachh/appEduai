import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    SectionList,
    ScrollView,
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
import {
    getDocumentId,
    getDocumentSubjects,
    groupDocumentsByClassification,
} from "../utils/documentUtils";

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

    // FR-12: group and filter by user-assigned subject/topic.
    const [selectedSubject, setSelectedSubject] = useState(null);

    const subjects = useMemo(
        () => getDocumentSubjects(documents),
        [documents]
    );

    const hasUnclassified = useMemo(
        () => documents.some((doc) => !String(doc?.subject || "").trim()),
        [documents]
    );

    useEffect(() => {
        if (selectedSubject === null) {
            return;
        }

        if (
            (selectedSubject === "" && !hasUnclassified) ||
            (selectedSubject !== "" &&
                !subjects.some(
                    (subject) =>
                        subject.toLocaleLowerCase("vi") ===
                        selectedSubject.toLocaleLowerCase("vi")
                ))
        ) {
            setSelectedSubject(null);
        }
    }, [selectedSubject, subjects, hasUnclassified]);

    const filteredDocuments = useMemo(
        () =>
            selectedSubject === null
                ? documents
                : documents.filter(
                      (document) =>
                          String(document?.subject || "")
                              .trim()
                              .toLocaleLowerCase("vi") ===
                          selectedSubject.toLocaleLowerCase("vi")
                  ),
        [documents, selectedSubject]
    );

    const sections = useMemo(
        () => groupDocumentsByClassification(filteredDocuments),
        [filteredDocuments]
    );

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

            {documents.length > 0 ? (
                <View style={styles.filterBar}>
                    <Text style={styles.filterLabel}>
                        Lọc theo môn học
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterChips}
                    >
                        <SubjectChip
                            label="Tất cả"
                            selected={selectedSubject === null}
                            onPress={() => setSelectedSubject(null)}
                        />
                        {subjects.map((subject) => (
                            <SubjectChip
                                key={subject}
                                label={subject}
                                selected={
                                    selectedSubject !== null &&
                                    selectedSubject.toLocaleLowerCase("vi") ===
                                        subject.toLocaleLowerCase("vi")
                                }
                                onPress={() => setSelectedSubject(subject)}
                            />
                        ))}
                        {hasUnclassified ? (
                            <SubjectChip
                                label="Chưa phân loại"
                                selected={selectedSubject === ""}
                                onPress={() => setSelectedSubject("")}
                            />
                        ) : null}
                    </ScrollView>
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
                <SectionList
                    sections={sections}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionSubject}>
                                📁 {section.subject}
                            </Text>
                            <Text style={styles.sectionTopic}>
                                Chủ đề: {section.topic} · {section.data.length} tài liệu
                            </Text>
                        </View>
                    )}
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
                        documents.length === 0 ? (
                            <EmptyState
                                loading={uploadLoading}
                                onUpload={upload}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Không có tài liệu thuộc môn học này.
                                </Text>
                            </View>
                        )
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

function SubjectChip({ label, selected, onPress }) {
    return (
        <TouchableOpacity
            style={[
                styles.subjectChip,
                selected && styles.subjectChipSelected,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <Text
                style={[
                    styles.subjectChipText,
                    selected && styles.subjectChipTextSelected,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
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
    filterBar: {
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },
    filterChips: {
        gap: 8,
        paddingBottom: 4,
    },
    subjectChip: {
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    subjectChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    subjectChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
    },
    subjectChipTextSelected: {
        color: colors.white,
    },
    sectionHeader: {
        paddingVertical: 10,
        paddingHorizontal: 2,
    },
    sectionSubject: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    sectionTopic: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 3,
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
