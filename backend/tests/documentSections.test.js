const test = require("node:test");
const assert = require("node:assert/strict");
const { getDocumentSections } = require("../utils/documentSections");

test("FR-19: detect distinct chapters from document text", () => {
    const source = [
        "Chương 1. Tổng quan",
        "Nội dung chỉ thuộc chương một: học React Native và Expo.",
        "",
        "Chương 2. Backend",
        "Nội dung chỉ thuộc chương hai: Node.js và MongoDB.",
    ].join("\n");

    const sections = getDocumentSections(source);
    assert.equal(sections.length, 2);
    assert.equal(sections[0].id, "section-0");
    assert.match(sections[0].title, /Chương 1/);
    assert.match(sections[1].title, /Chương 2/);
    assert.match(sections[0].text, /React Native/);
    assert.doesNotMatch(sections[0].text, /MongoDB/);
    assert.match(sections[1].text, /MongoDB/);
    assert.doesNotMatch(sections[1].text, /React Native/);
});

test("FR-19: fallback to selectable parts without chapter headings", () => {
    const source = Array.from(
        { length: 500 }, (_, i) => `Đoạn ${i}: lý thuyết mẫu.`
    ).join("\n\n");
    const sections = getDocumentSections(source);
    assert.ok(sections.length >= 2);
    assert.ok(sections.every((s) => s.text.length > 0));
    assert.equal(sections[0].title, "Phần 1");
});

test("FR-19: stable identifiers for the same document", () => {
    const source = "Chương 1\nNội dung A\nChương 2\nNội dung B";
    const a = getDocumentSections(source);
    const b = getDocumentSections(source);
    assert.deepEqual(a, b);
});

test("FR-19: empty document has no parts", () => {
    assert.deepEqual(getDocumentSections(" \n "), []);
});

test("FR-19: short unstructured document is one part", () => {
    const sections = getDocumentSections("Đây là một tài liệu ngắn.");
    assert.equal(sections.length, 1);
    assert.equal(sections[0].charCount, sections[0].text.length);
});
