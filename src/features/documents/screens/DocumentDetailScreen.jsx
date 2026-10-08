import React from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import colors from "../../../styles/colors";

import DocumentDetailHeader from "../components/DocumentDetailHeader";
import DocumentOverviewCard from "../components/DocumentOverviewCard";
import DocumentInfoCard from "../components/DocumentInfoCard";
import ExtractedTextCard from "../components/ExtractedTextCard";
import LearningToolsCard from "../components/LearningToolsCard";

import {
    DocumentErrorState,
    DocumentLoadingState,
} from "../components/DocumentDetailState";

import useDocumentDetail from "../hooks/useDocumentDetail";

export default function DocumentDetailScreen({
    navigation,
    route,
}) {
    const initialDocument =
        route.params?.document;

    const {
        document,
        isLoading,
        error,
        extractedText,
        displayedText,
        hasLongText,
        showFullText,
        loadDocument,
        toggleFullText,
    } = useDocumentDetail(
        initialDocument
    );

    const handleSummary = () => {
        if (!document) {
            return;
        }

        navigation.navigate(
            "Summary",
            { document }
        );
    };

    const handleChat = () => {
        if (!document) {
            return;
        }

        navigation.navigate(
            "Chat",
            { document }
        );
    };

    return (
        <View style={styles.container}>
            <DocumentDetailHeader
                onBack={() =>
                    navigation.goBack()
                }
            />

            {isLoading ? (
                <DocumentLoadingState />
            ) : error || !document ? (
                <DocumentErrorState
                    message={error}
                    onRetry={loadDocument}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <DocumentOverviewCard
                        document={document}
                    />

                    <DocumentInfoCard
                        document={document}
                    />

                    <ExtractedTextCard
                        extractedText={
                            extractedText
                        }
                        displayedText={
                            displayedText
                        }
                        hasLongText={
                            hasLongText
                        }
                        showFullText={
                            showFullText
                        }
                        onToggle={
                            toggleFullText
                        }
                    />

                    <LearningToolsCard
                        onSummary={
                            handleSummary
                        }
                        onChat={handleChat}
                    />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },
    content: {
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
});
