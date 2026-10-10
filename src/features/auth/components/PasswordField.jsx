import React, {
    useState,
} from "react";

import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function PasswordField({
    label,
    value,
    onChangeText,
    placeholder,
    editable = true,
    error,
}) {
    const [visible, setVisible] =
        useState(false);

    return (
        <View style={styles.group}>
            <Text style={styles.label}>
                {label}
            </Text>

            <View
                style={[
                    styles.container,
                    error &&
                        styles.inputError,
                ]}
            >
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={
                        colors.gray
                    }
                    secureTextEntry={!visible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={editable}
                />

                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                        setVisible(
                            (current) =>
                                !current
                        )
                    }
                    disabled={!editable}
                >
                    <Text style={styles.eyeIcon}>
                        {visible
                            ? "🙈"
                            : "👁️"}
                    </Text>
                </TouchableOpacity>
            </View>

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
    container:{
        height:48,
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
    },
    input:{
        flex:1,
        height:"100%",
        paddingHorizontal:14,
        fontSize:16,
        color:colors.text,
    },
    eyeButton:{
        height:"100%",
        paddingHorizontal:12,
        alignItems:"center",
        justifyContent:"center",
    },
    eyeIcon:{fontSize:20},
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
