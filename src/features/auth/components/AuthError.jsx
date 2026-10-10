import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function AuthError({
    message,
}) {
    if (!message) {
        return null;
    }

    return (
        <View style={styles.box}>
            <Text style={styles.text}>
                {message}
            </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    box:{
        marginBottom:12,
        padding:10,
        borderRadius:10,
        backgroundColor:"#FEF2F2",
        borderWidth:1,
        borderColor:"#FECACA",
    },
    text:{
        fontSize:14,
        lineHeight:20,
        color:colors.error,
    },
});
