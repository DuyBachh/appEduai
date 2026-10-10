import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

import colors from "../../../styles/colors";

import CameraCapture from "../components/CameraCapture";
import ScannerActions from "../components/ScannerActions";
import ScannerImageCard from "../components/ScannerImageCard";
import OcrResultCard from "../components/OcrResultCard";

import {
    ScannerEmpty,
    ScannerError,
    ScannerLoading,
} from "../components/ScannerState";

import useScanner from "../hooks/useScanner";

export default function ScanScreen() {
    const scanner = useScanner();

    if (scanner.showCamera) {
        return (
            <CameraCapture
                cameraRef={scanner.cameraRef}
                loading={scanner.loading}
                onClose={scanner.closeCamera}
                onCapture={scanner.takePhoto}
            />
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
            keyboardVerticalOffset={
                Platform.OS === "ios"
                    ? 80
                    : 0
            }
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={
                    false
                }
            >
                <Text style={styles.title}>
                    Scanner
                </Text>

                <Text style={styles.subtitle}>
                    Chụp hoặc chọn hình ảnh để nhận diện văn bản
                </Text>

                <ScannerActions
                    loading={scanner.loading}
                    onCamera={scanner.openCamera}
                    onLibrary={scanner.pickImage}
                />

                <ScannerError
                    message={scanner.error}
                />

                <ScannerImageCard
                    image={scanner.selectedImage}
                    loading={scanner.loading}
                    onReset={scanner.reset}
                    onRecognize={
                        scanner.recognizeText
                    }
                />

                {scanner.loading &&
                scanner.selectedImage ? (
                    <ScannerLoading />
                ) : null}

                <OcrResultCard
                    text={scanner.ocrText}
                    originalText={
                        scanner.originalOcrText
                    }
                    loading={scanner.loading}
                    onChangeText={
                        scanner.setOcrText
                    }
                    onRestore={
                        scanner.restoreText
                    }
                />

                {!scanner.selectedImage &&
                !scanner.loading ? (
                    <ScannerEmpty />
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.background,
    },
    content:{
        padding:20,
        paddingBottom:80,
    },
    title:{
        fontSize:28,
        fontWeight:"700",
        color:colors.text,
        marginBottom:6,
    },
    subtitle:{
        fontSize:15,
        lineHeight:22,
        color:colors.gray,
        marginBottom:24,
    },
});
