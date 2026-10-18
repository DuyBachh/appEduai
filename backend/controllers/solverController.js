const solverService =
    require(
        "../services/solverService"
    );

// ========================================
// VERIFY SERVICE
// ========================================

if (
    typeof solverService
        .solveQuestion !==
    "function"
) {
    throw new TypeError(
        "solverService.solveQuestion không phải function."
    );
}

const {
    solveQuestion,
    askSolverFollowUp,
} = solverService;

// ========================================
// SOLVE
// ========================================

const solve =
    async (
        req,
        res,
        next
    ) => {
        try {
            const {
                question,
            } =
                req.body || {};

            const result =
                await solveQuestion(
                    {
                        question,
                    }
                );

            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Giải bài tập thành công.",

                    data:
                        result,
                });
        } catch (error) {
            return next(
                error
            );
        }
    };

// ========================================
// FR-45: FOLLOW UP
// ========================================
const followUp = async (req, res, next) => {
    try {
        const result = await askSolverFollowUp(req.body || {});
        return res.status(200).json({
            success: true,
            message: "Giải thích thêm thành công.",
            data: result,
        });
    } catch (error) {
        return next(error);
    }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
    solve,
    followUp,
};