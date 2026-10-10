import React from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ScannerImageCard({
    image,
    loading,
    onReset,
    onRecognize,
}) {
    if (!image) {
        return null;
    }

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Hình ảnh
                </Text>

                <TouchableOpacity
                    onPress={onReset}
                    disabled={loading}
                >
                    <Text style={styles.resetText}>
                        Xóa
                    </Text>
                </TouchableOpacity>
            </View>

            <Image
                source={{ uri: image.uri }}
                style={styles.preview}
                resizeMode="contain"
            />

            <Text
                style={styles.fileName}
                numberOfLines={1}
            >
                {image.name}
            </Text>

            <TouchableOpacity
                style={[
                    styles.ocrButton,
                    loading && styles.disabled,
                ]}
                onPress={onRecognize}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator
                            size="small"
                            color={colors.white}
                        />
                        <Text style={styles.ocrText}>
                            Đang nhận diện...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.ocrText}>
                        Nhận diện văn bản
                    </Text>
                )}
            </TouchableOpacity>
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
    resetText:{
        fontSize:14,
        fontWeight:"600",
        color:colors.error,
    },
    preview:{
        width:"100%",
        height:280,
        borderRadius:12,
        backgroundColor:"#F3F4F6",
    },
    fileName:{
        marginTop:10,
        fontSize:12,
        color:colors.gray,
    },
    ocrButton:{
        marginTop:14,
        height:48,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:colors.primary,
    },
    ocrText:{
        marginLeft:7,
        color:colors.white,
        fontSize:15,
        fontWeight:"700",
    },
    loadingRow:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    disabled:{opacity:0.6},
});
