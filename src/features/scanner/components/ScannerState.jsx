import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export function ScannerError({ message }) {
    if (!message) return null;

    return (
        <View style={styles.errorBox}>
            <Text style={styles.errorText}>
                {message}
            </Text>
        </View>
    );
}

export function ScannerLoading() {
    return (
        <View style={styles.loadingBox}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />
            <Text style={styles.loadingTitle}>
                AI đang đọc hình ảnh
            </Text>
            <Text style={styles.loadingText}>
                Ảnh nhiều chữ có thể cần thêm thời gian xử lý.
            </Text>
        </View>
    );
}

export function ScannerEmpty() {
    return (
        <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>
                📄
            </Text>
            <Text style={styles.emptyTitle}>
                Chưa có hình ảnh
            </Text>
            <Text style={styles.emptyText}>
                Chụp tài liệu bằng camera hoặc chọn một hình ảnh từ thư viện.
            </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    errorBox:{
        backgroundColor:"#FEF2F2",
        borderWidth:1,
        borderColor:"#FECACA",
        borderRadius:12,
        padding:14,
        marginBottom:16,
    },
    errorText:{
        color:colors.error,
        fontSize:14,
        lineHeight:20,
    },
    loadingBox:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:16,
        padding:24,
        alignItems:"center",
        marginBottom:16,
    },
    loadingTitle:{
        marginTop:12,
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
    },
    loadingText:{
        marginTop:6,
        fontSize:13,
        lineHeight:19,
        textAlign:"center",
        color:colors.gray,
    },
    emptyBox:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:16,
        padding:32,
        alignItems:"center",
        marginTop:4,
    },
    emptyIcon:{fontSize:42,marginBottom:12},
    emptyTitle:{
        fontSize:18,
        fontWeight:"700",
        color:colors.text,
        marginBottom:8,
    },
    emptyText:{
        fontSize:14,
        lineHeight:21,
        color:colors.gray,
        textAlign:"center",
    },
});
