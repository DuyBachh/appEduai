import {
    useRef,
    useState,
} from "react";

import {
    useCameraPermissions,
} from "expo-camera";

import ScannerService from "../services/scannerService";

export default function useScanner() {
    const [
        cameraPermission,
        requestCameraPermission,
    ] = useCameraPermissions();

    const cameraRef = useRef(null);

    const [
        showCamera,
        setShowCamera,
    ] = useState(false);

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [ocrText, setOcrText] =
        useState("");

    const [
        originalOcrText,
        setOriginalOcrText,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const applyImage = (image) => {
        if (!image) {
            return;
        }

        setSelectedImage(image);
        setOcrText("");
        setOriginalOcrText("");
        setError("");
    };

    const openCamera = async () => {
        setError("");

        if (!cameraPermission?.granted) {
            const permission =
                await requestCameraPermission();

            if (!permission.granted) {
                setError(
                    "Ứng dụng cần quyền camera để chụp ảnh."
                );
                return;
            }
        }

        setShowCamera(true);
    };

    const closeCamera = () => {
        if (!loading) {
            setShowCamera(false);
        }
    };

    const takePhoto = async () => {
        if (
            !cameraRef.current ||
            loading
        ) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const photo =
                await cameraRef.current
                    .takePictureAsync({
                        quality: 0.9,
                    });

            if (!photo?.uri) {
                throw new Error(
                    "Camera không trả về hình ảnh."
                );
            }

            const image =
                ScannerService.fromCameraPhoto(
                    photo
                );

            applyImage(image);
            setShowCamera(false);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể chụp ảnh. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        if (loading) {
            return;
        }

        try {
            setError("");

            const image =
                await ScannerService.pickImage();

            applyImage(image);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể chọn ảnh. Vui lòng thử lại."
            );
        }
    };

    const recognizeText = async () => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setOcrText("");
            setOriginalOcrText("");

            const text =
                await ScannerService.recognizeText(
                    selectedImage
                );

            setOcrText(text);
            setOriginalOcrText(text);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể nhận diện văn bản."
            );
        } finally {
            setLoading(false);
        }
    };

    const restoreText = () => {
        setOcrText(
            originalOcrText
        );
        setError("");
    };

    const reset = () => {
        if (loading) {
            return;
        }

        setShowCamera(false);
        setSelectedImage(null);
        setOcrText("");
        setOriginalOcrText("");
        setError("");
    };

    return {
        cameraRef,
        showCamera,
        selectedImage,
        ocrText,
        originalOcrText,
        loading,
        error,

        setOcrText,
        openCamera,
        closeCamera,
        takePhoto,
        pickImage,
        recognizeText,
        restoreText,
        reset,
    };
}
