import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function SummaryHeader({
    title,
    subtitle,
    onBack,
    rightLabel,
    onRightPress,
    disabled = false,
}) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.side}
                onPress={onBack}
                disabled={disabled}
            >
                <Text style={styles.backText}>
                    ‹
                </Text>
            </TouchableOpacity>

            <View style={styles.center}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                {subtitle ? (
                    <Text
                        style={styles.subtitle}
                        numberOfLines={1}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>

            <TouchableOpacity
                style={[
                    styles.side,
                    styles.rightSide,
                ]}
                onPress={onRightPress}
                disabled={
                    !onRightPress || disabled
                }
            >
                <Text style={styles.rightText}>
                    {rightLabel || ""}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    header:{
        height:60,
        paddingHorizontal:16,
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:colors.white,
        borderBottomWidth:1,
        borderBottomColor:colors.border,
    },
    side:{
        width:72,
        justifyContent:"center",
    },
    rightSide:{
        alignItems:"flex-end",
    },
    center:{
        flex:1,
        alignItems:"center",
        paddingHorizontal:8,
    },
    backText:{
        fontSize:36,
        lineHeight:40,
        color:colors.text,
    },
    title:{
        fontSize:18,
        fontWeight:"700",
        color:colors.text,
    },
    subtitle:{
        marginTop:2,
        fontSize:11,
        color:colors.gray,
    },
    rightText:{
        fontSize:13,
        fontWeight:"700",
        color:colors.primary,
    },
});
