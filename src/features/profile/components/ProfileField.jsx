import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ProfileField({
    label,
    value,
    editing = false,
    editable = true,
    onChangeText,
    note,
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>
                {label}
            </Text>

            {editing ? (
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={
                        onChangeText
                    }
                    placeholder="Nhập họ và tên"
                    placeholderTextColor={
                        colors.gray
                    }
                    editable={editable}
                />
            ) : (
                <View style={styles.infoBox}>
                    <Text style={styles.value}>
                        {value}
                    </Text>
                </View>
            )}

            {note ? (
                <Text style={styles.note}>
                    {note}
                </Text>
            ) : null}
        </View>
    );
}

const styles=StyleSheet.create({
    section:{
        marginBottom:20,
    },
    label:{
        fontSize:14,
        fontWeight:"600",
        color:colors.text,
        marginBottom:8,
    },
    infoBox:{
        minHeight:50,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        backgroundColor:colors.white,
        justifyContent:"center",
        paddingHorizontal:15,
    },
    value:{
        fontSize:16,
        color:colors.text,
    },
    input:{
        height:50,
        borderWidth:1,
        borderColor:colors.primary,
        borderRadius:10,
        backgroundColor:colors.white,
        paddingHorizontal:15,
        fontSize:16,
        color:colors.text,
    },
    note:{
        fontSize:12,
        color:colors.gray,
        marginTop:6,
    },
});
