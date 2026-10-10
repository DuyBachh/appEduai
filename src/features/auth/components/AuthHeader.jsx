import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function AuthHeader({
    logo,
    title,
    subtitle,
    extra,
}) {
    return (
        <View>
            {logo ? (
                <Text style={styles.logo}>
                    {logo}
                </Text>
            ) : null}

            <Text style={styles.title}>
                {title}
            </Text>

            {subtitle ? (
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
            ) : null}

            {extra ? (
                <Text style={styles.extra}>
                    {extra}
                </Text>
            ) : null}
        </View>
    );
}

const styles=StyleSheet.create({
    logo:{
        fontSize:24,
        fontWeight:"700",
        color:colors.primary,
        textAlign:"center",
        marginBottom:32,
    },
    title:{
        fontSize:28,
        lineHeight:34,
        fontWeight:"700",
        color:colors.text,
        textAlign:"center",
    },
    subtitle:{
        fontSize:14,
        lineHeight:20,
        color:colors.gray,
        textAlign:"center",
        marginTop:8,
        marginBottom:32,
    },
    extra:{
        fontSize:14,
        color:colors.primary,
        textAlign:"center",
        marginTop:6,
        marginBottom:32,
    },
});
