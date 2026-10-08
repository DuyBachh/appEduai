import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function SummaryDocumentCard({
    document,
    documentName,
}) {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>
                    📄
                </Text>
            </View>

            <View style={styles.info}>
                <Text
                    style={styles.name}
                    numberOfLines={2}
                >
                    {documentName}
                </Text>

                {document?.subject ? (
                    <Text style={styles.meta}>
                        Môn: {document.subject}
                    </Text>
                ) : null}

                {document?.topic ? (
                    <Text style={styles.meta}>
                        Chủ đề: {document.topic}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    card:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:14,
        padding:16,
        marginBottom:16,
    },
    iconBox:{
        width:52,
        height:52,
        borderRadius:14,
        backgroundColor:"#EEF2FF",
        alignItems:"center",
        justifyContent:"center",
        marginRight:12,
    },
    icon:{fontSize:26},
    info:{flex:1},
    name:{
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
        marginBottom:4,
    },
    meta:{
        fontSize:12,
        lineHeight:18,
        color:colors.gray,
    },
});
