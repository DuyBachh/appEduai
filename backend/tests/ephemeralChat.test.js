const test = require("node:test");
const assert = require("node:assert/strict");
const { MAX_HISTORY_MESSAGES, validateEphemeralHistory } = require("../utils/ephemeralChat");

test("FR-30: empty temporary history is accepted", () => {
    assert.deepEqual(validateEphemeralHistory([]), []);
});

test("FR-30: temporary turns keep only role and content", () => {
    assert.deepEqual(
        validateEphemeralHistory([
            { role: "user", content: "  Câu hỏi 1  ", userId: "untrusted" },
            { role: "assistant", content: "Trả lời 1", _id: "untrusted" },
        ]),
        [
            { role: "user", content: "Câu hỏi 1" },
            { role: "assistant", content: "Trả lời 1" },
        ]
    );
});

test("FR-30: reject invalid roles and empty content", () => {
    assert.throws(() =>
        validateEphemeralHistory([{ role: "system", content: "hi" }])
    );
    assert.throws(() =>
        validateEphemeralHistory([{ role: "user", content: " " }])
    );
});

test("FR-30: reject invalid history shapes and too many messages", () => {
    assert.throws(() => validateEphemeralHistory({}));
    assert.throws(() => validateEphemeralHistory(
        Array.from({ length: MAX_HISTORY_MESSAGES + 1 },
            () => ({ role: "user", content: "Hi" }))
    ));
});

test("FR-30: reject oversized individual or cumulative history", () => {
    assert.throws(() => validateEphemeralHistory([
        { role: "user", content: "a".repeat(4001) },
    ]));
    assert.throws(() => validateEphemeralHistory(
        Array.from({ length: 7 }, () => ({
            role: "assistant", content: "a".repeat(4000),
        }))
    ));
});
