import {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    useFocusEffect,
} from "@react-navigation/native";

import DocumentService from "../services/documentService";
import {
    getDocumentId,
} from "../utils/documentUtils";

const PREVIEW_LENGTH = 700;

export default function useDocumentDetail(
    initialDocument
) {
    const [document, setDocument] =
        useState(initialDocument || null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        showFullText,
        setShowFullText,
    ] = useState(false);

    const loadDocument =
        useCallback(async () => {
            const documentId =
                getDocumentId(
                    initialDocument
                );

            if (!documentId) {
                setError(
                    "Không tìm thấy ID tài liệu."
                );
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const data =
                    await DocumentService.getDocumentById(
                        documentId
                    );

                setDocument(data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                        "Không thể tải chi tiết tài liệu."
                );
            } finally {
                setIsLoading(false);
            }
        }, [initialDocument]);

    useFocusEffect(
        useCallback(() => {
            loadDocument();

            return undefined;
        }, [loadDocument])
    );

    const extractedText =
        useMemo(
            () =>
                document?.extractedText
                    ?.trim() || "",
            [document]
        );

    const hasLongText =
        extractedText.length >
        PREVIEW_LENGTH;

    const displayedText =
        !showFullText && hasLongText
            ? `${extractedText.slice(
                  0,
                  PREVIEW_LENGTH
              )}...`
            : extractedText;

    const toggleFullText = () => {
        setShowFullText(
            (current) => !current
        );
    };

    return {
        document,
        isLoading,
        error,
        extractedText,
        displayedText,
        hasLongText,
        showFullText,
        loadDocument,
        toggleFullText,
    };
}
