import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export function SummaryLoadingCard() {
    return (
        <View style={styles.card}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />

            <Text style={styles.title}>
                AI đang xử lý tài liệu
            </Text>

            <Text style={styles.description}>
                Tài liệu dài hoặc lúc dịch vụ AI bận có thể mất hơn một phút.
            </Text>
        </View>
    );
}

export function SummaryErrorCard({
    message,
    onRetry,
}) {
    return (
        <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
                Không thể tóm tắt
            </Text>

            <Text style={styles.errorText}>
                {message}
            </Text>

            <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
            >
                <Text style={styles.retryText}>
                    Thử lại
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    card:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:14,
        padding:22,
        alignItems:"center",
        marginBottom:16,
    },
    title:{
        marginTop:12,
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
    },
    description:{
        marginTop:6,
        fontSize:13,
        lineHeight:19,
        color:colors.gray,
        textAlign:"center",
    },
    errorCard:{
        backgroundColor:"#FEF2F2",
        borderWidth:1,
        borderColor:"#FECACA",
        borderRadius:14,
        padding:16,
        marginBottom:16,
    },
    errorTitle:{
        fontSize:16,
        fontWeight:"700",
        color:colors.error,
        marginBottom:6,
    },
    errorText:{
        fontSize:13,
        lineHeight:20,
        color:colors.error,
    },
    retryButton:{
        marginTop:12,
        alignSelf:"flex-start",
    },
    retryText:{
        fontSize:13,
        fontWeight:"700",
        color:colors.error,
    },
});
