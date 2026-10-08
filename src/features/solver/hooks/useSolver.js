import { useState } from "react";
import { Keyboard } from "react-native";

import ImageService from "../services/ImageService";
import SolverService from "../services/SolverService";

export default function useSolver() {
    const [question, setQuestion] = useState("");
    const [selectedImage, setSelectedImage] =
        useState(null);

    const [solverLoading, setSolverLoading] =
        useState(false);
    const [ocrLoading, setOcrLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [hintIndex, setHintIndex] = useState(0);

    const loading =
        solverLoading || ocrLoading;

    const clearResult = () => {
        setResult(null);
        setHintIndex(0);
    };

    const updateQuestion = (value) => {
        setQuestion(value);

        if (error) {
            setError("");
        }
    };

    const applyImage = (image) => {
        if (!image) {
            return;
        }

        setSelectedImage(image);
        setError("");
        clearResult();
    };

    const pickImage = async () => {
        if (loading) {
            return;
        }

        try {
            Keyboard.dismiss();
            setError("");

            const image =
                await ImageService.pickFromLibrary();

            applyImage(image);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể chọn ảnh bài toán."
            );
        }
    };

    const takePhoto = async () => {
        if (loading) {
            return;
        }

        try {
            Keyboard.dismiss();
            setError("");

            const image =
                await ImageService.takePhoto();

            applyImage(image);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể chụp ảnh bài toán."
            );
        }
    };

    const removeImage = () => {
        if (loading) {
            return;
        }

        setSelectedImage(null);
        setError("");
    };

    const readImage = async () => {
        if (loading) {
            return;
        }

        try {
            setOcrLoading(true);
            setError("");

            const text =
                await SolverService.readQuestionFromImage(
                    selectedImage
                );

            setQuestion(text);
            clearResult();
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể OCR ảnh bài toán."
            );
        } finally {
            setOcrLoading(false);
        }
    };

    const solve = async () => {
        if (loading) {
            return;
        }

        Keyboard.dismiss();

        try {
            setSolverLoading(true);
            setError("");
            clearResult();

            const solverResult =
                await SolverService.solve(question);

            setResult(solverResult);
        } catch (requestError) {
            setError(
                requestError.message ||
                    "Không thể giải bài tập."
            );
        } finally {
            setSolverLoading(false);
        }
    };

    const previousHint = () => {
        setHintIndex((current) =>
            Math.max(0, current - 1)
        );
    };

    const nextHint = () => {
        if (!result?.hints?.length) {
            return;
        }

        setHintIndex((current) =>
            Math.min(
                result.hints.length - 1,
                current + 1
            )
        );
    };

    const reset = () => {
        Keyboard.dismiss();

        setQuestion("");
        setSelectedImage(null);
        setError("");
        clearResult();
    };

    return {
        question,
        selectedImage,
        solverLoading,
        ocrLoading,
        loading,
        error,
        result,
        hintIndex,
        updateQuestion,
        pickImage,
        takePhoto,
        removeImage,
        readImage,
        solve,
        previousHint,
        nextHint,
        reset,
    };
}
