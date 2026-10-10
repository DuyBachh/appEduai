const { generateText } = require("./aiService");
const { getChunkSummaryPrompt } = require("../prompts/summaryPrompts");
const { normalizeText, cleanSummaryText } = require("../utils/summaryText");
const { createServiceError } = require("../utils/serviceError");

// Nếu tài liệu nhỏ hơn mức này
// gửi trực tiếp cho AI.
const DIRECT_SUMMARY_MAX_CHARS =
    28000;

// Nếu tài liệu quá dài,
// chia thành từng phần.
const CHUNK_MAX_CHARS =
    16000;

const CHUNK_OUTPUT_TOKENS =
    260;

const CHUNK_DELAY_MS =
    500;

const MAX_REDUCTION_LEVELS =
    6;

// ========================================
// WAIT
// ========================================

const wait = (
    milliseconds
) => {
    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds
            );
        }
    );
};

// ========================================
// SPLIT DOCUMENT
// ========================================

const splitTextIntoChunks = (
    text,
    maxChars =
        CHUNK_MAX_CHARS
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

    const flushCurrent =
        () => {
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

        // Một paragraph quá dài
        if (
            value.length >
            maxChars
        ) {
            flushCurrent();

            for (
                let start = 0;
                start <
                value.length;
                start +=
                    maxChars
            ) {
                const part =
                    value
                        .slice(
                            start,
                            start +
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
            flushCurrent();

            current =
                value;
        } else {
            current =
                candidate;
        }
    }

    flushCurrent();

    return chunks;
};

// ========================================
// LONG DOCUMENT REDUCTION
// ========================================

const summarizeLongSource =
    async (
        sourceText
    ) => {
        let currentText =
            normalizeText(
                sourceText
            );

        let level =
            1;

        while (
            currentText.length >
                DIRECT_SUMMARY_MAX_CHARS &&
            level <=
                MAX_REDUCTION_LEVELS
        ) {
            const chunks =
                splitTextIntoChunks(
                    currentText,
                    CHUNK_MAX_CHARS
                );

            console.log(
                `SUMMARY REDUCTION LEVEL ${level}: ${chunks.length} chunk(s)`
            );

            const partialSummaries =
                [];

            for (
                let index = 0;
                index <
                chunks.length;
                index += 1
            ) {
                console.log(
                    `SUMMARY CHUNK ${index + 1}/${chunks.length} - LEVEL ${level}`
                );

                const chunkResult =
                    await generateText(
                        {
                            instructions:
                                [
                                    "Bạn đang rút gọn một phần của tài liệu để phục vụ bước tóm tắt cuối.",

                                    "Chỉ dùng dữ liệu trong phần được cung cấp.",

                                    "Viết tiếng Việt có dấu.",

                                    "Không dùng Markdown.",

                                    "Không chào hỏi.",
                                ].join(
                                    " "
                                ),

                            prompt:
                                getChunkSummaryPrompt(
                                    {
                                        text:
                                            chunks[
                                                index
                                            ],

                                        index:
                                            index +
                                            1,

                                        total:
                                            chunks.length,
                                    }
                                ),

                            maxOutputTokens:
                                CHUNK_OUTPUT_TOKENS,
                        }
                    );

                const cleaned =
                    cleanSummaryText(
                        chunkResult
                    );

                if (
                    !cleaned
                ) {
                    throw createServiceError(
                        `AI không thể rút gọn phần ${index + 1}/${chunks.length}.`,
                        502
                    );
                }

                partialSummaries.push(
                    `Phần ${index + 1}:\n${cleaned}`
                );

                // Không spam Gemini
                if (
                    index <
                    chunks.length -
                        1
                ) {
                    await wait(
                        CHUNK_DELAY_MS
                    );
                }
            }

            const nextText =
                partialSummaries
                    .join(
                        "\n\n"
                    )
                    .trim();

            if (!nextText) {
                throw createServiceError(
                    "Không thể chuẩn bị nội dung cho bước tóm tắt cuối.",
                    502
                );
            }

            currentText =
                nextText;

            level += 1;
        }

        return currentText;
    };


module.exports = { summarizeLongSource };
