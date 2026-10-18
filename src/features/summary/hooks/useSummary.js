import {
    useEffect,
    useMemo,
    useState,
} from "react";

import SummaryService from "../services/summaryService";
import {
    getSummaryDocumentId,
    getSummaryDocumentName,
    getSummaryTypeLabel,
} from "../utils/summaryUtils";

export default function useSummary(
    document
) {
    const documentId =
        getSummaryDocumentId(
            document
        );

    const documentName =
        getSummaryDocumentName(
            document
        );

    const [
        summaryLength,
        setSummaryLength,
    ] = useState("medium");

    const [summary, setSummary] =
        useState("");

    const [sections, setSections] = useState([]);
    const [sectionsLoading, setSectionsLoading] = useState(true);
    const [sectionsError, setSectionsError] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState(null);

    useEffect(() => {
        let active = true;
        setSelectedSectionId(null);
        setSections([]);
        setSectionsError("");

        if (!documentId) {
            setSectionsLoading(false);
            return () => { active = false; };
        }

        setSectionsLoading(true);
        SummaryService.getSections(documentId)
            .then((items) => {
                if (active) {
                    setSections(items);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setSectionsError(
                        requestError.message ||
                        "Không tải được danh sách chương/phần."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setSectionsLoading(false);
                }
            });

        return () => { active = false; };
    }, [documentId]);

    const selectedSection = useMemo(
        () => sections.find((section) => section.id === selectedSectionId) || null,
        [sections, selectedSectionId]
    );

    const changeSection = (value) => {
        if (isLoading) return;
        setSelectedSectionId(value);
        setSummary("");
        setSummaryRecord(null);
        setError("");
    };

    const [
        summaryRecord,
        setSummaryRecord,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const typeLabel =
        useMemo(
            () =>
                getSummaryTypeLabel(
                    summaryLength
                ),
            [summaryLength]
        );

    const createSummary =
        async () => {
            if (!documentId) {
                setError(
                    "Không tìm thấy Document ID."
                );
                return;
            }

            if (isLoading) {
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const result =
                    await SummaryService.createSummary(
                        documentId,
                        summaryLength,
                        selectedSectionId
                    );

                setSummary(
                    result.content
                );
                setSummaryRecord(
                    result
                );
            } catch (requestError) {
                setError(
                    requestError.message ||
                        "Không thể tạo bản tóm tắt. Vui lòng thử lại."
                );
            } finally {
                setIsLoading(false);
            }
        };

    const changeType = (value) => {
        if (isLoading) {
            return;
        }

        setSummaryLength(value);
        setSummary("");
        setSummaryRecord(null);
        setError("");
    };

    return {
        documentId,
        documentName,
        summaryLength,
        summary,
        summaryRecord,
        sections,
        sectionsLoading,
        sectionsError,
        selectedSectionId,
        selectedSection,
        changeSection,
        isLoading,
        error,
        typeLabel,
        createSummary,
        changeType,
    };
}
