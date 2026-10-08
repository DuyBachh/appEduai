import React, {
    useEffect,
    useRef,
} from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

import colors from "../../../styles/colors";
import SolverForm from "../components/SolverForm";
import SolverResult from "../components/SolverResult";
import LoadingCard from "../components/LoadingCard";
import useSolver from "../hooks/useSolver";

export default function SolverScreen() {
    const scrollRef = useRef(null);
    const solver = useSolver();

    useEffect(() => {
        if (!solver.result) {
            return;
        }

        const timer = setTimeout(() => {
            scrollRef.current?.scrollToEnd({
                animated: true,
            });
        }, 150);

        return () => clearTimeout(timer);
    }, [solver.result]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
            keyboardVerticalOffset={
                Platform.OS === "ios" ? 70 : 0
            }
        >
            <ScrollView
                ref={scrollRef}
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === "ios"
                        ? "interactive"
                        : "on-drag"
                }
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    AI Solver
                </Text>

                <Text style={styles.subtitle}>
                    Nhập bài tập hoặc chụp ảnh để AI phân tích và giải từng bước.
                </Text>

                <SolverForm
                    question={solver.question}
                    selectedImage={solver.selectedImage}
                    loading={solver.loading}
                    solverLoading={solver.solverLoading}
                    ocrLoading={solver.ocrLoading}
                    error={solver.error}
                    onQuestionChange={solver.updateQuestion}
                    onTakePhoto={solver.takePhoto}
                    onPickImage={solver.pickImage}
                    onRemoveImage={solver.removeImage}
                    onReadImage={solver.readImage}
                    onSolve={solver.solve}
                />

                {solver.solverLoading ? (
                    <LoadingCard />
                ) : null}

                <SolverResult
                    result={solver.result}
                    hintIndex={solver.hintIndex}
                    onPreviousHint={solver.previousHint}
                    onNextHint={solver.nextHint}
                    onReset={solver.reset}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.gray,
        marginBottom: 20,
    },
});
