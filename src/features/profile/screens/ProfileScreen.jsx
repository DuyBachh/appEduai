import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import ProfileActions from "../components/ProfileActions";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileField from "../components/ProfileField";

import {
    ProfileError,
    ProfileLoadingState,
} from "../components/ProfileState";

import useProfile from "../hooks/useProfile";

export default function ProfileScreen({
    currentUser,
    onLogout,
}) {
    const profile = useProfile({
        currentUser,
        onLogout,
    });

    if (profile.profileLoading) {
        return (
            <ProfileLoadingState />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Hồ sơ
            </Text>

            <ProfileError
                message={
                    profile.profileError
                }
            />

            <ProfileAvatar
                name={profile.name}
            />

            <ProfileField
                label="Họ và tên"
                value={profile.name}
                editing={
                    profile.isEditing
                }
                editable={
                    !profile.saveLoading
                }
                onChangeText={
                    profile.setName
                }
            />

            <ProfileField
                label="Email"
                value={profile.email}
                note="Email không thể chỉnh sửa"
            />

            <ProfileActions
                isEditing={
                    profile.isEditing
                }
                saveLoading={
                    profile.saveLoading
                }
                logoutLoading={
                    profile.logoutLoading
                }
                onEdit={
                    profile.startEditing
                }
                onCancel={
                    profile.cancelEditing
                }
                onSave={
                    profile.saveProfile
                }
                onLogout={
                    profile.confirmLogout
                }
            />
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.background,
        padding:20,
    },
    title:{
        fontSize:28,
        fontWeight:"700",
        color:colors.text,
        marginBottom:30,
    },
});
