import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function HomeInfoCard() {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>
                    🤖
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    Học cùng AI
                </Text>

                <Text style={styles.text}>
                    AI có thể giúp bạn giải thích bài tập, đưa ra gợi ý và trình bày lời giải từng bước.
                </Text>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    card:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:16,
        padding:16,
        flexDirection:"row",
        alignItems:"flex-start",
    },
    iconBox:{
        width:44,
        height:44,
        borderRadius:14,
        backgroundColor:"#EEF2FF",
        alignItems:"center",
        justifyContent:"center",
        marginRight:13,
    },
    icon:{fontSize:22},
    content:{flex:1},
    title:{
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
        marginBottom:5,
    },
    text:{
        fontSize:13,
        lineHeight:20,
        color:colors.gray,
    },
});
