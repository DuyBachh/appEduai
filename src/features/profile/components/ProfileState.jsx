import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export function ProfileLoadingState() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator
                size="large"
                color={colors.primary}
            />
            <Text style={styles.loadingText}>
                Đang tải hồ sơ...
            </Text>
        </View>
    );
}

export function ProfileError({
    message,
}) {
    if (!message) {
        return null;
    }

    return (
        <Text style={styles.errorText}>
            {message}
        </Text>
    );
}

const styles=StyleSheet.create({
    loading:{
        flex:1,
        backgroundColor:colors.background,
        alignItems:"center",
        justifyContent:"center",
    },
    loadingText:{
        marginTop:12,
        fontSize:14,
        color:colors.gray,
    },
    errorText:{
        fontSize:14,
        color:colors.error,
        marginBottom:15,
    },
});
