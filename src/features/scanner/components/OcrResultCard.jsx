import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function OcrResultCard({
    text,
    originalText,
    loading,
    onChangeText,
    onRestore,
}) {
    if (!text) {
        return null;
    }

    const changed =
        text !== originalText;

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Văn bản nhận diện
                </Text>

                {changed ? (
                    <TouchableOpacity
                        onPress={onRestore}
                    >
                        <Text style={styles.restoreText}>
                            Khôi phục
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            <Text style={styles.helper}>
                Bạn có thể chỉnh sửa trực tiếp nội dung OCR bên dưới.
            </Text>

            <TextInput
                style={styles.input}
                value={text}
                onChangeText={onChangeText}
                multiline
                editable={!loading}
                textAlignVertical="top"
                placeholder="Nội dung OCR..."
                placeholderTextColor={colors.gray}
            />

            <Text style={styles.count}>
                {text.length} ký tự
            </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    section:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:16,
        padding:16,
        marginBottom:16,
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:12,
    },
    title:{
        fontSize:18,
        fontWeight:"700",
        color:colors.text,
    },
    restoreText:{
        fontSize:14,
        fontWeight:"600",
        color:colors.primary,
    },
    helper:{
        fontSize:13,
        lineHeight:19,
        color:colors.gray,
        marginBottom:12,
    },
    input:{
        minHeight:220,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:12,
        padding:14,
        fontSize:15,
        lineHeight:22,
        color:colors.text,
        backgroundColor:"#FAFAFA",
    },
    count:{
        marginTop:8,
        textAlign:"right",
        fontSize:12,
        color:colors.gray,
    },
});
