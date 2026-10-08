import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";
import {
    SUMMARY_TYPES,
} from "../utils/summaryUtils";

export default function SummaryOptions({
    selectedType,
    loading,
    onChangeType,
    onCreate,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Độ dài bản tóm tắt
            </Text>

            <View style={styles.typeRow}>
                {SUMMARY_TYPES.map(
                    (option) => {
                        const active =
                            selectedType ===
                            option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.typeButton,
                                    active &&
                                        styles.activeButton,
                                ]}
                                onPress={() =>
                                    onChangeType(
                                        option.value
                                    )
                                }
                                disabled={loading}
                            >
                                <Text
                                    style={[
                                        styles.typeText,
                                        active &&
                                            styles.activeText,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    }
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.createButton,
                    loading &&
                        styles.disabled,
                ]}
                onPress={onCreate}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator
                            size="small"
                            color={colors.white}
                        />
                        <Text
                            style={styles.createText}
                        >
                            Đang tóm tắt...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.createText}>
                        ✨ Tạo bản tóm tắt
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    card:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:14,
        padding:16,
        marginBottom:16,
    },
    title:{
        fontSize:17,
        fontWeight:"700",
        color:colors.text,
        marginBottom:14,
    },
    typeRow:{
        flexDirection:"row",
        gap:8,
        marginBottom:16,
    },
    typeButton:{
        flex:1,
        height:42,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:colors.white,
    },
    activeButton:{
        borderColor:colors.primary,
        backgroundColor:"#EEF2FF",
    },
    typeText:{
        fontSize:13,
        fontWeight:"600",
        color:colors.gray,
    },
    activeText:{
        color:colors.primary,
    },
    createButton:{
        height:48,
        backgroundColor:colors.primary,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
    },
    createText:{
        color:colors.white,
        fontSize:15,
        fontWeight:"700",
    },
    loadingRow:{
        flexDirection:"row",
        alignItems:"center",
        gap:8,
    },
    disabled:{opacity:0.65},
});
