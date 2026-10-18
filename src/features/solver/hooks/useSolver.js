import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

import ImageService from "../services/ImageService";
import SolverService from "../services/SolverService";

export default function useSolver(initialQuestion = "") {
    const [question, setQuestion] = useState(
        typeof initialQuestion === "string" ? initialQuestion.trim().slice(0, 6000) : ""
    );
    const [selectedImage, setSelectedImage] =
        useState(null);

    const [solverLoading, setSolverLoading] =
        useState(false);
    const [ocrLoading, setOcrLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [hintIndex, setHintIndex] = useState(0);

    // FR-43: reveal complete solution only after an explicit tap.
    const [showFullSolution, setShowFullSolution] = useState(false);

    // FR-45: follow-up exchanges are kept only in this screen's memory.
    const [followUpText, setFollowUpText] = useState("");
    const [followUpMessages, setFollowUpMessages] = useState([]);
    const [followUpLoading, setFollowUpLoading] = useState(false);
    const [followUpError, setFollowUpError] = useState("");

    const loading =
        solverLoading || ocrLoading || followUpLoading;

    useEffect(() => {
        if (typeof initialQuestion !== "string" || !initialQuestion.trim()) {
            return;
        }

        setQuestion(initialQuestion.trim().slice(0, 6000));
        setSelectedImage(null);
        setResult(null);
        setHintIndex(0);
        setShowFullSolution(false);
        setFollowUpText("");
        setFollowUpMessages([]);
        setFollowUpError("");
        setError("");
    }, [initialQuestion]);

    const clearResult = () => {
        setResult(null);
        setHintIndex(0);
        setShowFullSolution(false);
        setFollowUpText("");
        setFollowUpMessages([]);
        setFollowUpError("");
    };

    const updateQuestion = (value) => {
        if (value !== question && result) {
            clearResult();
        }
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

    const toggleFullSolution = () => {
        if (result) {
            setShowFullSolution((current) => !current);
        }
    };

    const askFollowUp = async () => {
        const nextQuestion = followUpText.trim();
        if (!result || !nextQuestion || loading) {
            return;
        }

        Keyboard.dismiss();
        setFollowUpLoading(true);
        setFollowUpError("");

        try {
            const answer = await SolverService.askFollowUp({
                originalQuestion: result.question || question,
                result,
                question: nextQuestion,
                history: followUpMessages.slice(-6).map(({ role, content }) => ({
                    role,
                    content: String(content).slice(0, 1200),
                })),
            });

            setFollowUpMessages((current) => [
                ...current,
                { role: "user", content: nextQuestion },
                { role: "assistant", content: answer },
            ]);
            setFollowUpText("");
        } catch (requestError) {
            setFollowUpError(
                requestError.message ||
                "Không thể giải thích thêm. Vui lòng thử lại."
            );
        } finally {
            setFollowUpLoading(false);
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
        showFullSolution,
        toggleFullSolution,
        followUpText,
        setFollowUpText,
        followUpMessages,
        followUpLoading,
        followUpError,
        askFollowUp,
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
