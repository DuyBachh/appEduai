import React from "react";
import {
    ScrollView,
    StyleSheet,
} from "react-native";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

import colors from "../../../styles/colors";
import SummaryHeader from "../components/SummaryHeader";
import SummaryDocumentCard from "../components/SummaryDocumentCard";
import SummaryOptions from "../components/SummaryOptions";
import SummarySections from "../components/SummarySections";
import SummaryResultCard from "../components/SummaryResultCard";
import {
    SummaryErrorCard,
    SummaryLoadingCard,
} from "../components/SummaryState";
import useSummary from "../hooks/useSummary";

export default function SummaryScreen({
    navigation,
    route,
}) {
    const document =
        route?.params?.document;

    const summary =
        useSummary(document);

    const openHistory = () => {
        if (!summary.documentId) {
            return;
        }

        navigation.navigate(
            "SummaryHistory",
            {
                documentId:
                    summary.documentId,
                documentName:
                    summary.documentName,
            }
        );
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top"]}
        >
            <SummaryHeader
                title="AI Tóm tắt"
                onBack={() =>
                    navigation.goBack()
                }
                rightLabel="Lịch sử"
                onRightPress={openHistory}
                disabled={
                    summary.isLoading
                }
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <SummaryDocumentCard
                    document={document}
                    documentName={
                        summary.documentName
                    }
                />

                <SummarySections
                    sections={summary.sections}
                    loading={summary.sectionsLoading}
                    error={summary.sectionsError}
                    selectedSectionId={summary.selectedSectionId}
                    onSelect={summary.changeSection}
                    disabled={summary.isLoading}
                />

                <SummaryOptions
                    selectedType={
                        summary.summaryLength
                    }
                    loading={
                        summary.isLoading
                    }
                    onChangeType={
                        summary.changeType
                    }
                    onCreate={
                        summary.createSummary
                    }
                />

                {summary.isLoading ? (
                    <SummaryLoadingCard />
                ) : null}

                {!summary.isLoading &&
                summary.error ? (
                    <SummaryErrorCard
                        message={
                            summary.error
                        }
                        onRetry={
                            summary.createSummary
                        }
                    />
                ) : null}

                {!summary.isLoading &&
                summary.summary ? (
                    <SummaryResultCard
                        summary={
                            summary.summary
                        }
                        typeLabel={
                            summary.typeLabel
                        }
                        sectionTitle={summary.summaryRecord?.sectionTitle || ""}

                        saved={Boolean(
                            summary.summaryRecord
                                ?._id
                        )}
                        onOpenHistory={
                            openHistory
                        }
                    />
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    safeArea:{
        flex:1,
        backgroundColor:colors.white,
    },
    container:{
        flex:1,
        backgroundColor:colors.background,
    },
    content:{
        padding:20,
        paddingBottom:40,
    },
});
