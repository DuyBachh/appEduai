const MAX_DOCUMENT_CONTEXT_CHARS =
    28000;

const DOCUMENT_CHUNK_SIZE =
    7000;

const MAX_RELEVANT_CHUNKS =
    4;

// ========================================
// NORMALIZE TEXT
// ========================================

const normalizeText = (
    text = ""
) => {
    return String(
        text
    )
        .replace(
            /\r\n/g,
            "\n"
        )

        .replace(
            /\u0000/g,
            ""
        )

        .replace(
            /[ \t]+\n/g,
            "\n"
        )

        .replace(
            /\n{3,}/g,
            "\n\n"
        )

        .trim();
};

// ========================================
// SPLIT DOCUMENT
// ========================================

const splitTextIntoChunks = (
    text,
    maxChars =
        DOCUMENT_CHUNK_SIZE
) => {
    const normalized =
        normalizeText(
            text
        );

    if (!normalized) {
        return [];
    }

    if (
        normalized.length <=
        maxChars
    ) {
        return [
            normalized,
        ];
    }

    const paragraphs =
        normalized.split(
            /\n{2,}/
        );

    const chunks = [];

    let current =
        "";

    const flush = () => {
        const value =
            current.trim();

        if (value) {
            chunks.push(
                value
            );
        }

        current = "";
    };

    for (
        const paragraph of
        paragraphs
    ) {
        const value =
            paragraph.trim();

        if (!value) {
            continue;
        }

        if (
            value.length >
            maxChars
        ) {
            flush();

            for (
                let index = 0;
                index <
                value.length;
                index +=
                    maxChars
            ) {
                const part =
                    value
                        .slice(
                            index,
                            index +
                                maxChars
                        )
                        .trim();

                if (part) {
                    chunks.push(
                        part
                    );
                }
            }

            continue;
        }

        const candidate =
            current
                ? `${current}\n\n${value}`
                : value;

        if (
            candidate.length >
            maxChars
        ) {
            flush();

            current =
                value;
        } else {
            current =
                candidate;
        }
    }

    flush();

    return chunks;
};

// ========================================
// KEYWORDS
// ========================================

const getKeywords = (
    text
) => {
    const stopWords =
        new Set([
            "của",
            "cho",
            "với",
            "trong",
            "những",
            "các",
            "này",
            "đó",
            "được",
            "là",
            "và",
            "hay",
            "một",
            "về",
            "theo",
            "như",
            "tôi",
            "bạn",
            "thì",
            "nào",
            "gì",
            "sao",
            "hãy",
            "giải",
            "thích",
        ]);

    const words =
        String(
            text || ""
        )
            .toLowerCase()
            .match(
                /[\p{L}\p{N}]+/gu
            ) || [];

    return [
        ...new Set(
            words.filter(
                (
                    word
                ) =>
                    word.length >=
                        3 &&
                    !stopWords.has(
                        word
                    )
            )
        ),
    ].slice(
        0,
        30
    );
};

// ========================================
// SELECT DOCUMENT CONTEXT
// ========================================

const selectDocumentContext = ({
    documentText,
    question,
    history = [],
}) => {
    const normalized =
        normalizeText(
            documentText
        );

    if (
        normalized.length <=
        MAX_DOCUMENT_CONTEXT_CHARS
    ) {
        return normalized;
    }

    const chunks =
        splitTextIntoChunks(
            normalized
        );

    const recentUserHistory =
        history
            .filter(
                (
                    item
                ) =>
                    item.role ===
                    "user"
            )
            .slice(-3)
            .map(
                (
                    item
                ) =>
                    item.content
            )
            .join(
                " "
            );

    const queryText =
        `${recentUserHistory} ${question}`;

    const keywords =
        getKeywords(
            queryText
        );

    const scoredChunks =
        chunks.map(
            (
                chunk,
                index
            ) => {
                const lowerChunk =
                    chunk.toLowerCase();

                let score =
                    0;

                for (
                    const keyword of
                    keywords
                ) {
                    if (
                        lowerChunk.includes(
                            keyword
                        )
                    ) {
                        score +=
                            1;
                    }
                }

                return {
                    index,
                    chunk,
                    score,
                };
            }
        );

    let selected =
        scoredChunks
            .sort(
                (
                    a,
                    b
                ) =>
                    b.score -
                    a.score
            )
            .slice(
                0,
                MAX_RELEVANT_CHUNKS
            );

    // Nếu không tìm được keyword phù hợp,
    // lấy các phần đầu tài liệu.
    if (
        selected.every(
            (
                item
            ) =>
                item.score ===
                0
        )
    ) {
        selected =
            scoredChunks
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.index -
                        b.index
                )
                .slice(
                    0,
                    MAX_RELEVANT_CHUNKS
                );
    }

    // Đưa về đúng thứ tự xuất hiện
    selected.sort(
        (
            a,
            b
        ) =>
            a.index -
            b.index
    );

    return selected
        .map(
            (
                item,
                index
            ) =>
                `Phần tài liệu ${index + 1}:\n${item.chunk}`
        )
        .join(
            "\n\n"
        )
        .slice(
            0,
            MAX_DOCUMENT_CONTEXT_CHARS
        );
};

module.exports = { normalizeText, selectDocumentContext };
