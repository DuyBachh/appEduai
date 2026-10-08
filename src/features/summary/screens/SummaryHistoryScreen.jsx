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
import {
    SafeAreaView,
} from "react-native-safe-area-context";

import colors from "../../../styles/colors";
import SummaryHeader from "../components/SummaryHeader";
import SummaryHistoryCard from "../components/SummaryHistoryCard";
import useSummaryHistory from "../hooks/useSummaryHistory";

export default function SummaryHistoryScreen({
    navigation,
    route,
}) {
    const documentId =
        route.params?.documentId ||
        null;

    const documentName =
        route.params?.documentName ||
        "Tài liệu không tên";

    const history =
        useSummaryHistory(
            documentId
        );

    const openDetail = (item) => {
        navigation.navigate(
            "SummaryHistoryDetail",
            {
                summaryId: item._id,
                documentName,
            }
        );
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top"]}
        >
            <SummaryHeader
                title="Lịch sử tóm tắt"
                subtitle={documentName}
                onBack={() =>
                    navigation.goBack()
                }
            />

            {history.isLoading ? (
                <CenterState>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                    <Text style={styles.loadingText}>
                        Đang tải lịch sử...
                    </Text>
                </CenterState>
            ) : history.error ? (
                <CenterState>
                    <Text style={styles.emptyTitle}>
                        Không thể tải
                    </Text>

                    <Text style={styles.emptyText}>
                        {history.error}
                    </Text>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() =>
                            history.loadHistory()
                        }
                    >
                        <Text style={styles.retryText}>
                            Thử lại
                        </Text>
                    </TouchableOpacity>
                </CenterState>
            ) : history.history.length === 0 ? (
                <CenterState>
                    <Text style={styles.emptyIcon}>
                        📚
                    </Text>

                    <Text style={styles.emptyTitle}>
                        Chưa có lịch sử
                    </Text>

                    <Text style={styles.emptyText}>
                        Tài liệu này chưa có bản tóm tắt nào.
                    </Text>
                </CenterState>
            ) : (
                <FlatList
                    style={styles.list}
                    data={history.history}
                    keyExtractor={(item) =>
                        item._id
                    }
                    renderItem={({ item }) => (
                        <SummaryHistoryCard
                            item={item}
                            documentName={
                                documentName
                            }
                            onOpen={openDetail}
                            onDelete={
                                history.deleteSummary
                            }
                        />
                    )}
                    contentContainerStyle={
                        styles.listContent
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                history.refreshing
                            }
                            onRefresh={
                                history.refresh
                            }
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

function CenterState({ children }) {
    return (
        <View style={styles.center}>
            {children}
        </View>
    );
}

const styles=StyleSheet.create({
    safeArea:{
        flex:1,
        backgroundColor:colors.white,
    },
    list:{
        flex:1,
        backgroundColor:colors.background,
    },
    listContent:{
        padding:20,
        paddingBottom:40,
    },
    center:{
        flex:1,
        backgroundColor:colors.background,
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:30,
    },
    loadingText:{
        marginTop:12,
        fontSize:15,
        color:colors.gray,
    },
    emptyIcon:{
        fontSize:50,
        marginBottom:16,
    },
    emptyTitle:{
        fontSize:20,
        fontWeight:"700",
        color:colors.text,
        marginBottom:8,
        textAlign:"center",
    },
    emptyText:{
        fontSize:15,
        lineHeight:22,
        color:colors.gray,
        textAlign:"center",
    },
    retryButton:{
        marginTop:18,
        backgroundColor:colors.primary,
        paddingHorizontal:20,
        paddingVertical:11,
        borderRadius:10,
    },
    retryText:{
        color:colors.white,
        fontSize:14,
        fontWeight:"700",
    },
});
