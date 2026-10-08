export default class SolverResult {
    constructor({
        question = "",
        type = "Không xác định",
        topic = "Không xác định",
        hints = [],
        explanation = "",
        steps = [],
        finalAnswer = "",
    } = {}) {
        this.question = question;
        this.type = type;
        this.topic = topic;
        this.hints = Array.isArray(hints) ? hints : [];
        this.explanation = explanation;
        this.steps = Array.isArray(steps) ? steps : [];
        this.finalAnswer = finalAnswer;
    }

    static fromApi(data, fallbackQuestion = "") {
        return new SolverResult({
            question: data?.question || fallbackQuestion,
            type: data?.type || "Không xác định",
            topic: data?.topic || "Không xác định",
            hints: data?.hints,
            explanation: data?.explanation || "",
            steps: data?.steps,
            finalAnswer:
                data?.finalAnswer ||
                data?.answer ||
                "",
        });
    }
}
