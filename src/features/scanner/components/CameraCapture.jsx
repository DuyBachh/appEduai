import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CameraView } from "expo-camera";

import colors from "../../../styles/colors";

export default function CameraCapture({
    cameraRef,
    loading,
    onClose,
    onCapture,
}) {
    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
            />

            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    disabled={loading}
                >
                    <Text style={styles.closeText}>
                        ✕
                    </Text>
                </TouchableOpacity>

                <View style={styles.frame} />

                <Text style={styles.instruction}>
                    Đưa tài liệu vào khung hình
                </Text>

                <TouchableOpacity
                    style={[
                        styles.captureButton,
                        loading && styles.disabled,
                    ]}
                    onPress={onCapture}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={colors.white}
                        />
                    ) : (
                        <View style={styles.captureInner} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{flex:1,backgroundColor:"#000"},
    camera:{flex:1},
    overlay:{
        ...StyleSheet.absoluteFillObject,
        alignItems:"center",
        justifyContent:"center",
    },
    closeButton:{
        position:"absolute",
        top:50,
        left:20,
        width:44,
        height:44,
        borderRadius:22,
        backgroundColor:"rgba(0,0,0,0.5)",
        alignItems:"center",
        justifyContent:"center",
    },
    closeText:{color:colors.white,fontSize:22,fontWeight:"600"},
    frame:{
        width:"82%",
        height:"48%",
        borderWidth:2,
        borderColor:colors.white,
        borderRadius:16,
    },
    instruction:{
        position:"absolute",
        bottom:150,
        color:colors.white,
        fontSize:15,
        fontWeight:"600",
        backgroundColor:"rgba(0,0,0,0.5)",
        paddingHorizontal:16,
        paddingVertical:10,
        borderRadius:20,
    },
    captureButton:{
        position:"absolute",
        bottom:40,
        width:76,
        height:76,
        borderRadius:38,
        borderWidth:5,
        borderColor:colors.white,
        alignItems:"center",
        justifyContent:"center",
    },
    captureInner:{
        width:58,
        height:58,
        borderRadius:29,
        backgroundColor:colors.white,
    },
    disabled:{opacity:0.6},
});
