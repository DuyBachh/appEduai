import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function AuthField({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    editable = true,
    keyboardType = "default",
    autoCapitalize = "none",
    autoCorrect = false,
}) {
    return (
        <View style={styles.group}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                editable={editable}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
            />

            {error ? (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles=StyleSheet.create({
    group:{marginBottom:18},
    label:{
        fontSize:14,
        fontWeight:"600",
        color:colors.text,
        marginBottom:8,
    },
    input:{
        height:48,
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        paddingHorizontal:14,
        fontSize:16,
        color:colors.text,
    },
    inputError:{
        borderColor:colors.error,
    },
    errorText:{
        fontSize:14,
        lineHeight:20,
        color:colors.error,
        marginTop:6,
    },
});
