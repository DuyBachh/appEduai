import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ScannerActions({
    loading,
    onCamera,
    onLibrary,
}) {
    return (
        <View style={styles.row}>
            <Action
                icon="📷"
                title="Chụp ảnh"
                description="Sử dụng camera"
                onPress={onCamera}
                disabled={loading}
            />
            <Action
                icon="🖼️"
                title="Chọn ảnh"
                description="Từ thư viện"
                onPress={onLibrary}
                disabled={loading}
            />
        </View>
    );
}

function Action({
    icon,
    title,
    description,
    onPress,
    disabled,
}) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
                {description}
            </Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    row:{
        flexDirection:"row",
        gap:12,
        marginBottom:20,
    },
    button:{
        flex:1,
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:16,
        padding:18,
        alignItems:"center",
    },
    icon:{fontSize:32,marginBottom:10},
    title:{
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
        marginBottom:4,
    },
    description:{
        fontSize:13,
        color:colors.gray,
        textAlign:"center",
    },
});
