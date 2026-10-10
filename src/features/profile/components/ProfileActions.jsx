import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function ProfileActions({
    isEditing,
    saveLoading,
    logoutLoading,
    onEdit,
    onCancel,
    onSave,
    onLogout,
}) {
    return (
        <>
            {!isEditing ? (
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={onEdit}
                >
                    <Text style={styles.editText}>
                        Chỉnh sửa thông tin
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.editActions}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancel}
                        disabled={saveLoading}
                    >
                        <Text style={styles.cancelText}>
                            Hủy
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={onSave}
                        disabled={saveLoading}
                    >
                        {saveLoading ? (
                            <ActivityIndicator
                                color={colors.white}
                            />
                        ) : (
                            <Text style={styles.saveText}>
                                Lưu
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.logoutButton,
                    logoutLoading &&
                        styles.disabled,
                ]}
                onPress={onLogout}
                disabled={logoutLoading}
            >
                {logoutLoading ? (
                    <ActivityIndicator
                        color={colors.error}
                    />
                ) : (
                    <Text style={styles.logoutText}>
                        Đăng xuất
                    </Text>
                )}
            </TouchableOpacity>
        </>
    );
}

const styles=StyleSheet.create({
    editButton:{
        height:50,
        backgroundColor:colors.primary,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        marginTop:5,
    },
    editText:{
        fontSize:16,
        fontWeight:"600",
        color:colors.white,
    },
    editActions:{
        flexDirection:"row",
        gap:10,
        marginTop:5,
    },
    cancelButton:{
        flex:1,
        height:50,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius:10,
        backgroundColor:colors.white,
        alignItems:"center",
        justifyContent:"center",
    },
    cancelText:{
        fontSize:16,
        fontWeight:"600",
        color:colors.text,
    },
    saveButton:{
        flex:1,
        height:50,
        backgroundColor:colors.primary,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
    },
    saveText:{
        fontSize:16,
        fontWeight:"600",
        color:colors.white,
    },
    logoutButton:{
        height:50,
        borderWidth:1,
        borderColor:colors.error,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
    },
    disabled:{
        opacity:0.6,
    },
    logoutText:{
        fontSize:16,
        fontWeight:"600",
        color:colors.error,
    },
});
