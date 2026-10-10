import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function HomeHeroCard({
    onStart,
}) {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>
                    ✨
                </Text>
            </View>

            <Text style={styles.title}>
                Học tập thông minh hơn
            </Text>

            <Text style={styles.description}>
                Giải bài tập, đọc tài liệu, tóm tắt nội dung và học cùng AI trong một ứng dụng.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={onStart}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    Bắt đầu với AI Solver
                </Text>

                <Text style={styles.arrow}>
                    →
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    card:{
        backgroundColor:colors.primary,
        borderRadius:22,
        padding:22,
        marginBottom:30,
    },
    iconBox:{
        width:50,
        height:50,
        borderRadius:15,
        backgroundColor:"rgba(255,255,255,0.16)",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:18,
    },
    icon:{fontSize:26},
    title:{
        fontSize:25,
        lineHeight:32,
        fontWeight:"800",
        color:colors.white,
        marginBottom:10,
    },
    description:{
        fontSize:14,
        lineHeight:22,
        color:"#E0E7FF",
        marginBottom:22,
    },
    button:{
        minHeight:50,
        backgroundColor:colors.white,
        borderRadius:12,
        paddingHorizontal:16,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    buttonText:{
        fontSize:15,
        fontWeight:"700",
        color:colors.primary,
    },
    arrow:{
        fontSize:22,
        color:colors.primary,
    },
});
