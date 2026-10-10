import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ProfileAvatar({
    name,
}) {
    const initial =
        name
            ? name
                  .charAt(0)
                  .toUpperCase()
            : "U";

    return (
        <View style={styles.avatar}>
            <Text style={styles.text}>
                {initial}
            </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    avatar:{
        width:90,
        height:90,
        borderRadius:45,
        backgroundColor:colors.primary,
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:30,
    },
    text:{
        fontSize:36,
        fontWeight:"700",
        color:colors.white,
    },
});
