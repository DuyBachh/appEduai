import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function HomeHeader() {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.logo}>
                    appEduai
                </Text>

                <Text style={styles.subtitle}>
                    Trợ lý học tập AI của bạn
                </Text>
            </View>

            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    AI
                </Text>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    header:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom:24,
    },
    logo:{
        fontSize:26,
        fontWeight:"800",
        color:colors.primary,
    },
    subtitle:{
        marginTop:4,
        fontSize:14,
        color:colors.gray,
    },
    avatar:{
        width:46,
        height:46,
        borderRadius:23,
        backgroundColor:"#EEF2FF",
        alignItems:"center",
        justifyContent:"center",
        borderWidth:1,
        borderColor:"#C7D2FE",
    },
    avatarText:{
        fontSize:15,
        fontWeight:"800",
        color:colors.primary,
    },
});
