import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function SummaryResultCard({
    summary,
    typeLabel,
    saved,
    onOpenHistory,
}) {
    if (!summary) {
        return null;
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Bản tóm tắt
                </Text>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {typeLabel}
                    </Text>
                </View>
            </View>

            <Text
                selectable
                style={styles.content}
            >
                {summary}
            </Text>

            {saved ? (
                <Text style={styles.saved}>
                    Đã lưu vào lịch sử
                </Text>
            ) : null}

            <TouchableOpacity
                onPress={onOpenHistory}
            >
                <Text style={styles.historyLink}>
                    Xem lịch sử tóm tắt →
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
        padding:18,
        marginBottom:20,
    },
    header:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom:16,
    },
    title:{
        fontSize:18,
        fontWeight:"700",
        color:colors.text,
    },
    badge:{
        backgroundColor:"#EEF2FF",
        borderRadius:8,
        paddingHorizontal:10,
        paddingVertical:6,
    },
    badgeText:{
        fontSize:12,
        fontWeight:"700",
        color:colors.primary,
    },
    content:{
        fontSize:15,
        lineHeight:25,
        color:colors.text,
    },
    saved:{
        marginTop:16,
        fontSize:12,
        fontWeight:"600",
        color:"#059669",
    },
    historyLink:{
        marginTop:16,
        fontSize:14,
        fontWeight:"700",
        color:colors.primary,
    },
});
