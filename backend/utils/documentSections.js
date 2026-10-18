const { normalizeText } = require("./summaryText");

// FR-19: Derive selectable sections from the stored extracted document text.
// Section IDs are recomputed on the server; the client never supplies source text.
const HEADING_PATTERN = /^(?:chương|chapter|phần|part|mục|section)\s+(?:\d+(?:\.\d+)*|[IVXLCDM]+)(?:\s*[:.\-–]\s*|\s+)?[^\n]{0,100}$/gimu;

const makeSection = (title, text) => ({
    title: String(title).trim().slice(0, 120),
    text: normalizeText(text),
});

const splitIntoParts = (source) => {
    // Graceful fallback for PDFs whose headings are not preserved by extraction.
    if (source.length < 350) {
        return [makeSection("Phần 1", source)];
    }

    const count = Math.max(2, Math.ceil(source.length / 10000));
    const target = Math.ceil(source.length / count);
    const parts = [];
    let start = 0;

    while (start < source.length) {
        if (source.length - start <= target * 1.25) {
            parts.push(makeSection(`Phần ${parts.length + 1}`, source.slice(start)));
            break;
        }
        let end = Math.min(source.length, start + target);
        const nextParagraph = source.indexOf("\n\n", end);
        if (nextParagraph >= 0 && nextParagraph - end <= 350) {
            end = nextParagraph + 2;
        } else {
            const nextSpace = source.indexOf(" ", end);
            if (nextSpace > end && nextSpace - end <= 80) {
                end = nextSpace + 1;
            }
        }
        parts.push(makeSection(`Phần ${parts.length + 1}`, source.slice(start, end)));
        start = end;
    }
    return parts;
};

const getDocumentSections = (extractedText) => {
    const source = normalizeText(extractedText);
    if (!source) {
        return [];
    }

    const headings = [...source.matchAll(HEADING_PATTERN)];
    let sections = [];

    // Multiple distinct chapter/part headings provide natural section boundaries.
    if (headings.length >= 2 && headings.length <= 60) {
        const intro = source.slice(0, headings[0].index).trim();
        if (intro.length >= 100) {
            sections.push(makeSection("Giới thiệu", intro));
        }

        for (let i = 0; i < headings.length; i += 1) {
            const from = headings[i].index;
            const to = headings[i + 1]?.index ?? source.length;
            const title = headings[i][0].trim();

            const sectionText = source.slice(from, to);
            if (sectionText.trim()) {
                sections.push(makeSection(title, sectionText));
            }
        }

        if (intro.length > 0 && intro.length < 100 && sections.length) {
            sections[0].text = normalizeText(intro + "\n\n" + sections[0].text);
        }
    } else {
        sections = splitIntoParts(source);
    }

    return sections
        .filter((section) => section.text)
        .map((section, index) => ({
            id: `section-${index}`,
            title: section.title,
            text: section.text,
            charCount: section.text.length,
        }));
};

module.exports = { getDocumentSections };
