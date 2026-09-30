import React, {
    useCallback,
    useState,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    useFocusEffect,
} from "@react-navigation/native";

import colors from "../../styles/colors";

const CHAT_HISTORY_KEY = "chat_history";

export default function ChatHistoryScreen({
    navigation,
    route,
}) {
    const document =
        route.params?.document;

    const [conversations, setConversations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const loadHistory = async () => {
        try {
            setLoading(true);

            const storedData =
                await AsyncStorage.getItem(
                    CHAT_HISTORY_KEY
                );

            const allConversations =
                storedData
                    ? JSON.parse(storedData)
                    : [];

            const filtered =
                allConversations.filter(
                    (item) =>
                        item.documentId ===
                        (document?.id || null)
                );

            filtered.sort(
                (a, b) =>
                    new Date(
                        b.updatedAt ||
                            b.createdAt
                    ) -
                    new Date(
                        a.updatedAt ||
                            a.createdAt
                    )
            );

            setConversations(filtered);
        } catch (error) {
            console.log(
                "Load chat history error:",
                error
            );

            setConversations([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [document?.id])
    );

    const handleOpenConversation = (
        item
    ) => {
        navigation.navigate("Chat", {
            document: document,
            conversationId: item.id,
            messages: item.messages || [],
        });
    };

    const handleDeleteConversation = (
        conversationId
    ) => {
        Alert.alert(
            "Xóa cuộc trò chuyện",
            "Bạn có chắc muốn xóa cuộc trò chuyện này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const storedData =
                                await AsyncStorage.getItem(
                                    CHAT_HISTORY_KEY
                                );

                            const allConversations =
                                storedData
                                    ? JSON.parse(
                                          storedData
                                      )
                                    : [];

                            const updated =
                                allConversations.filter(
                                    (item) =>
                                        item.id !==
                                        conversationId
                                );

                            await AsyncStorage.setItem(
                                CHAT_HISTORY_KEY,
                                JSON.stringify(
                                    updated
                                )
                            );

                            setConversations(
                                (prev) =>
                                    prev.filter(
                                        (item) =>
                                            item.id !==
                                            conversationId
                                    )
                            );
                        } catch (error) {
                            console.log(
                                "Delete chat history error:",
                                error
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleNewChat = () => {
        navigation.navigate("Chat", {
            document: document,
        });
    };

    const formatDate = (
        dateString
    ) => {
        if (!dateString) {
            return "Không rõ thời gian";
        }

        const date =
            new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Không rõ thời gian";
        }

        return date.toLocaleString(
            "vi-VN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const renderConversation = ({
        item,
    }) => {
        const messageCount =
            item.messages?.length || 0;

        return (
            <TouchableOpacity
                style={
                    styles.conversationCard
                }
                activeOpacity={0.8}
                onPress={() =>
                    handleOpenConversation(
                        item
                    )
                }
            >
                <View
                    style={
                        styles.conversationIcon
                    }
                >
                    <Text
                        style={
                            styles.conversationIconText
                        }
                    >
                        💬
                    </Text>
                </View>

                <View
                    style={
                        styles.conversationContent
                    }
                >
                    <Text
                        style={
                            styles.conversationTitle
                        }
                        numberOfLines={2}
                    >
                        {item.title ||
                            "Cuộc trò chuyện"}
                    </Text>

                    <Text
                        style={
                            styles.conversationMeta
                        }
                    >
                        {messageCount} tin nhắn
                    </Text>

                    <Text
                        style={
                            styles.conversationDate
                        }
                    >
                        {formatDate(
                            item.updatedAt ||
                                item.createdAt
                        )}
                    </Text>
                </View>

                <TouchableOpacity
                    style={
                        styles.deleteButton
                    }
                    onPress={(event) => {
                        event.stopPropagation();

                        handleDeleteConversation(
                            item.id
                        );
                    }}
                >
                    <Text
                        style={
                            styles.deleteText
                        }
                    >
                        🗑
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={() =>
                        navigation.goBack()
                    }
                >
                    <Text
                        style={
                            styles.backText
                        }
                    >
                        ‹
                    </Text>
                </TouchableOpacity>

                <View
                    style={
                        styles.headerContent
                    }
                >
                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        Lịch sử AI Q&A
                    </Text>

                    <Text
                        style={
                            styles.headerSubtitle
                        }
                        numberOfLines={1}
                    >
                        {document?.name ||
                            "Tài liệu không tên"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={
                        styles.newButton
                    }
                    onPress={handleNewChat}
                >
                    <Text
                        style={
                            styles.newButtonText
                        }
                    >
                        +
                    </Text>
                </TouchableOpacity>
            </View>

            {/* History */}
            {loading ? (
                <View
                    style={
                        styles.centerContainer
                    }
                >
                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Đang tải lịch sử...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) =>
                        item.id
                    }
                    renderItem={
                        renderConversation
                    }
                    contentContainerStyle={
                        conversations.length ===
                        0
                            ? styles.emptyList
                            : styles.list
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    ListEmptyComponent={
                        <View
                            style={
                                styles.emptyContainer
                            }
                        >
                            <Text
                                style={
                                    styles.emptyIcon
                                }
                            >
                                💬
                            </Text>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Chưa có cuộc trò
                                chuyện
                            </Text>

                            <Text
                                style={
                                    styles.emptyDescription
                                }
                            >
                                Hãy bắt đầu một cuộc
                                trò chuyện với AI về
                                tài liệu này.
                            </Text>

                            <TouchableOpacity
                                style={
                                    styles.startButton
                                }
                                onPress={
                                    handleNewChat
                                }
                            >
                                <Text
                                    style={
                                        styles.startButtonText
                                    }
                                >
                                    Bắt đầu trò chuyện
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    header: {
        height: 100,
        paddingTop: 45,
        paddingHorizontal: 14,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    backText: {
        fontSize: 36,
        lineHeight: 40,
        color: colors.text,
    },

    headerContent: {
        flex: 1,
        paddingHorizontal: 8,
    },

    headerTitle: {
        fontSize: 19,
        fontWeight: "700",
        color: colors.text,
    },

    headerSubtitle: {
        marginTop: 2,
        fontSize: 12,
        color: colors.gray,
    },

    newButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor:
            colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    newButtonText: {
        fontSize: 26,
        color: colors.white,
        lineHeight: 28,
    },

    list: {
        padding: 16,
    },

    conversationCard: {
        backgroundColor:
            colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
            colors.border,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    conversationIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor:
            "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    conversationIconText: {
        fontSize: 23,
    },

    conversationContent: {
        flex: 1,
    },

    conversationTitle: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 5,
    },

    conversationMeta: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },

    conversationDate: {
        fontSize: 12,
        color: colors.gray,
    },

    deleteButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 4,
    },

    deleteText: {
        fontSize: 18,
    },

    emptyList: {
        flexGrow: 1,
        padding: 24,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyIcon: {
        fontSize: 50,
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
        textAlign: "center",
    },

    emptyDescription: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.gray,
        textAlign: "center",
        maxWidth: 300,
        marginBottom: 20,
    },

    startButton: {
        backgroundColor:
            colors.primary,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },

    startButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "700",
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        fontSize: 14,
        color: colors.gray,
    },
});