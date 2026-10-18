const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { ObjectId } = require("mongodb");
const { deleteDocumentWithDependencies } = require("../services/documentDeletionService");
const { resolveManagedUploadPath, removeManagedUpload } = require("../utils/managedUpload");

const id = (hex) => new ObjectId(hex);
const userA = "aaaaaaaaaaaaaaaaaaaaaaaa";
const userB = "bbbbbbbbbbbbbbbbbbbbbbbb";
const docA = "111111111111111111111111";
const docB = "222222222222222222222222";
const convA = "333333333333333333333333";
const convB = "444444444444444444444444";

function matches(document, filter) {
    return Object.entries(filter).every(([key, required]) => {
        const current = document[key];
        if (required && typeof required === "object" && Array.isArray(required.$in)) {
            return required.$in.some((item) => String(item) === String(current));
        }
        return String(current) === String(required);
    });
}

function mockDb({ sharedUri = false, failSummaries = false } = {}) {
    const uri = "/uploads/123456789-12345.pdf";
    const store = {
        documents: [
            { _id: id(docA), userId: id(userA), uri },
            { _id: id(docB), userId: id(userB), uri: sharedUri ? uri : "/uploads/2222222-9876.txt" },
        ],
        summaries: [
            { _id: id("555555555555555555555555"), userId: id(userA), documentId: id(docA) },
            { _id: id("666666666666666666666666"), userId: id(userB), documentId: id(docB) },
        ],
        conversations: [
            { _id: id(convA), userId: id(userA), documentId: id(docA) },
            { _id: id(convB), userId: id(userB), documentId: id(docB) },
        ],
        messages: [
            { _id: id("777777777777777777777777"), userId: id(userA), conversationId: id(convA) },
            { _id: id("888888888888888888888888"), userId: id(userB), conversationId: id(convB) },
        ],
    };

    const collection = (name) => ({
        findOne: async (filter) => store[name].find((x) => matches(x, filter)) || null,
        find: (filter) => ({
            project: () => ({
                toArray: async () => store[name].filter((x) => matches(x, filter)),
            }),
        }),
        deleteMany: async (filter) => {
            if (name === "summaries" && failSummaries) {
                throw new Error("database unavailable");
            }
            const before = store[name].length;
            store[name] = store[name].filter((x) => !matches(x, filter));
            return { deletedCount: before - store[name].length };
        },
        deleteOne: async (filter) => {
            const index = store[name].findIndex((x) => matches(x, filter));
            if (index < 0) return { deletedCount: 0 };
            store[name].splice(index, 1);
            return { deletedCount: 1 };
        },
        countDocuments: async (filter) => store[name].filter((x) => matches(x, filter)).length,
    });

    return { db: { collection }, store };
}

test("FR-11: deleting owned document cleans summaries, chats and messages", async () => {
    const { db, store } = mockDb();
    const removed = [];
    const result = await deleteDocumentWithDependencies(
        { userId: userA, documentId: docA },
        { db, cleanupFile: async (uri) => { removed.push(uri); return "deleted"; } }
    );
    assert.deepEqual(removed, ["/uploads/123456789-12345.pdf"]);
    assert.equal(result.fileStatus, "deleted");
    assert.equal(result.deletedSummaries, 1);
    assert.equal(result.deletedConversations, 1);
    assert.equal(result.deletedMessages, 1);
    for (const [name, expectedId] of [
        ["documents", docB],
        ["summaries", "666666666666666666666666"],
        ["conversations", convB],
        ["messages", "888888888888888888888888"],
    ]) {
        assert.equal(store[name].length, 1, name);
        assert.equal(String(store[name][0]._id), expectedId, name);
    }
});

test("FR-11: users cannot delete another user's document", async () => {
    const { db, store } = mockDb();
    let called = false;
    await assert.rejects(
        deleteDocumentWithDependencies(
            { userId: userB, documentId: docA },
            { db, cleanupFile: async () => { called = true; } }
        ),
        { statusCode: 404 }
    );
    assert.equal(called, false);
    assert.equal(store.documents.length, 2);
    assert.equal(store.summaries.length, 2);
});

test("FR-11: preserve a file still referenced by another document", async () => {
    const { db } = mockDb({ sharedUri: true });
    let called = false;
    const result = await deleteDocumentWithDependencies(
        { userId: userA, documentId: docA },
        { db, cleanupFile: async () => { called = true; } }
    );
    assert.equal(result.fileStatus, "shared");
    assert.equal(called, false);
});

test("FR-11: a database cleanup error preserves the document for retry", async () => {
    const { db, store } = mockDb({ failSummaries: true });
    await assert.rejects(
        deleteDocumentWithDependencies({ userId: userA, documentId: docA }, {
            db,
            cleanupFile: async () => "deleted",
        }),
        /database unavailable/
    );
    assert.equal(store.documents.length, 2);
});

test("FR-11: a filesystem error is reported without restoring deleted data", async () => {
    const { db, store } = mockDb();
    const previousError = console.error;
    console.error = () => {};
    try {
        const result = await deleteDocumentWithDependencies(
            { userId: userA, documentId: docA },
            { db, cleanupFile: async () => { throw new Error("EACCES"); } }
        );
        assert.equal(result.fileStatus, "failed");
        assert.equal(store.documents.length, 1);
    } finally {
        console.error = previousError;
    }
});

test("FR-11: safely reject user-provided arbitrary upload paths", () => {
    const unsafe = [
        "../../secret.txt",
        "/uploads/../secret.txt",
        "/uploads/%2e%2e%2fsecret.txt",
        "https://example.com/uploads/123-456.pdf",
        "/uploads/other.pdf",
        "/uploads/123-456.pdf/extra",
        "/uploads/123-456.pdf?download=1",
        "/etc/passwd",
        null,
    ];
    for (const uri of unsafe) {
        assert.equal(resolveManagedUploadPath(uri), null, String(uri));
    }
    assert.equal(
        path.basename(resolveManagedUploadPath("/uploads/123-456.PDF")),
        "123-456.PDF"
    );
});

test("FR-11: missing physical file is treated as already removed", async () => {
    const result = await removeManagedUpload("/uploads/123-456.txt", async () => {
        const error = new Error("File not found");
        error.code = "ENOENT";
        throw error;
    });
    assert.equal(result, "already-missing");
});
