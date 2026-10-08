import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import useSummaryDetail from "../hooks/useSummaryDetail";
import {
    formatSummaryDate,
    getSummaryTypeLabel,
} from "../utils/summaryUtils";

export default function SummaryHistoryDetailScreen({
    route,
}) {
    const summaryId =
        route.params?.summaryId ||
        null;

    const documentName =
        route.params?.documentName ||
        "Tài liệu";

    const detail =
        useSummaryDetail(
            summaryId
        );

    if (detail.isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
                <Text style={styles.loadingText}>
                    Đang tải chi tiết...
                </Text>
            </View>
        );
    }

    if (
        detail.error ||
        !detail.summary
    ) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyTitle}>
                    Không tìm thấy bản tóm tắt
                </Text>

                <Text style={styles.emptyText}>
                    {detail.error ||
                        "Dữ liệu bản tóm tắt không tồn tại."}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={
                        detail.loadSummary
                    }
                >
                    <Text style={styles.retryText}>
                        Thử lại
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const summary =
        detail.summary;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            <View style={styles.documentCard}>
                <Text style={styles.documentIcon}>
                    📄
                </Text>

                <View style={styles.documentInfo}>
                    <Text
                        style={styles.documentName}
                        numberOfLines={3}
                    >
                        {documentName}
                    </Text>

                    <Text style={styles.date}>
                        {formatSummaryDate(
                            summary.createdAt
                        )}
                    </Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <InfoItem
                    label="Độ dài"
                    value={
                        getSummaryTypeLabel(
                            summary.type
                        )
                    }
                />

                <InfoItem
                    label="Cập nhật"
                    value={
                        formatSummaryDate(
                            summary.updatedAt
                        )
                    }
                    small
                />
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                    {summary.title ||
                        "Bản tóm tắt"}
                </Text>

                <Text
                    selectable
                    style={styles.summaryText}
                >
                    {summary.content ||
                        "Không có nội dung tóm tắt."}
                </Text>
            </View>
        </ScrollView>
    );
}

function InfoItem({
    label,
    value,
    small = false,
}) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>
                {label}
            </Text>

            <Text
                style={[
                    styles.infoValue,
                    small &&
                        styles.infoValueSmall,
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.background,
    },
    content:{
        padding:20,
        paddingBottom:40,
    },
    documentCard:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:colors.white,
        borderRadius:14,
        borderWidth:1,
        borderColor:colors.border,
        padding:16,
        marginBottom:16,
    },
    documentIcon:{
        fontSize:32,
        marginRight:14,
    },
    documentInfo:{flex:1},
    documentName:{
        fontSize:18,
        fontWeight:"700",
        color:colors.text,
        marginBottom:5,
    },
    date:{
        fontSize:13,
        color:colors.gray,
    },
    infoCard:{
        flexDirection:"row",
        backgroundColor:colors.white,
        borderRadius:14,
        borderWidth:1,
        borderColor:colors.border,
        padding:16,
        marginBottom:16,
    },
    infoItem:{flex:1},
    infoLabel:{
        fontSize:13,
        color:colors.gray,
        marginBottom:5,
    },
    infoValue:{
        fontSize:15,
        fontWeight:"600",
        color:colors.text,
    },
    infoValueSmall:{
        fontSize:12,
    },
    summaryCard:{
        backgroundColor:colors.white,
        borderRadius:14,
        borderWidth:1,
        borderColor:colors.border,
        padding:18,
    },
    summaryTitle:{
        fontSize:20,
        fontWeight:"700",
        color:colors.text,
        marginBottom:18,
    },
    summaryText:{
        fontSize:15,
        lineHeight:25,
        color:colors.text,
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
    emptyTitle:{
        fontSize:20,
        fontWeight:"700",
        color:colors.text,
        marginBottom:8,
        textAlign:"center",
    },
    emptyText:{
        fontSize:15,
        color:colors.gray,
        textAlign:"center",
        lineHeight:22,
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
