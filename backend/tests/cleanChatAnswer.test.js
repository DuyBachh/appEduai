const test = require("node:test");
const assert = require("node:assert/strict");
const { cleanChatAnswer } = require("../utils/cleanChatAnswer");

test("Chat AI: strip bold and italic Markdown markers", () => {
    assert.equal(
        cleanChatAnswer("**Quan trọng:** *Giới thiệu* và __kết luận__."),
        "Quan trọng: Giới thiệu và kết luận."
    );
});

test("Chat AI: convert Markdown bullets into readable bullets", () => {
    assert.equal(
        cleanChatAnswer("* React Native\n- Expo\n+ Node.js"),
        "• React Native\n• Expo\n• Node.js"
    );
});

test("Chat AI: remove heading and code fence markers", () => {
    assert.equal(
        cleanChatAnswer("### Ví dụ\n```js\nconst x = 2 * 3;\n```"),
        "Ví dụ\nconst x = 2 * 3;"
    );
});

test("Chat AI: keep mathematical multiplication and identifiers intact", () => {
    assert.equal(
        cleanChatAnswer("2 * 3 = 6; x*y*z; a_b"),
        "2 * 3 = 6; x*y*z; a_b"
    );
});

test("Chat AI: preserve numbered lists", () => {
    assert.equal(
        cleanChatAnswer("1. **Lý thuyết**\n2. **Ví dụ**"),
        "1. Lý thuyết\n2. Ví dụ"
    );
});

test("Chat AI: keep responses without Markdown unchanged", () => {
    assert.equal(
        cleanChatAnswer("React Native dùng JavaScript.\n\nExpo giúp chạy app."),
        "React Native dùng JavaScript.\n\nExpo giúp chạy app."
    );
});

test("Chat AI: empty result stays empty", () => {
    assert.equal(cleanChatAnswer("  "), "");
});
