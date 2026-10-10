import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import colors from "../../../styles/colors";

export default function AuthButton({
    label,
    loading,
    onPress,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                loading && styles.disabled,
            ]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator
                    color={colors.white}
                />
            ) : (
                <Text style={styles.text}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        height:48,
        backgroundColor:colors.primary,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
    },
    disabled:{opacity:0.7},
    text:{
        fontSize:16,
        fontWeight:"600",
        color:colors.white,
    },
});
