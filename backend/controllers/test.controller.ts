import { Request, Response } from "express";
import Test from "../models/test.model";
import Attempt from "../models/attempt.model";

export async function getMyTests(req: Request, res: Response) {
    try {
        const tests = await Test.find({
            createdBy: req.user!._id,
        }).select("-questions").lean();

        return res.status(200).json({
            success: true,
            count: tests.length,
            tests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export async function createTest(req: Request, res: Response) {
    try {
        const { title, description, duration, questions, correctMarks, negativeMarks } = req.body;
        if (!title || !duration || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const exist = await Test.findOne({ title, createdBy: req.user!._id }).lean();
        if (exist) {
            return res.status(400).json({ error: "Test with this title already exists" });
        }
        const questionCount = questions.length;
        const test = await Test.create({
            createdBy: req.user!._id,
            title,
            description,
            duration,
            questions,
            questionCount,
            correctMarks,
            negativeMarks
        });

        return res.status(201).json(test);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAttemptByTestId(req: Request, res: Response) {
    try {
        const { testId } = req.params;
        const attempts = await Attempt.find({
            user: req.user!._id,
            test: testId,
        }).lean();
        if (attempts.length === 0) {
            return res.status(404).json({ error: "No existing attempts found for this test" });
        }

        return res.status(200).json(attempts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function startAttempt(req: Request, res: Response) {
    try {
        const { testId } = req.params
        const test = await Test.findById(testId).select("-questions.correctOption").lean()
        if (!test) {
            return res.status(404).json({ error: "Test not found" })
        }

        const existingAttempt = await Attempt.findOne({
            user: req.user!._id,
            test: testId,
        }).lean();

        if (existingAttempt?.status === "IN_PROGRESS") {
            return res.status(200).json({ attempt: existingAttempt, test });
        }

        const { _id, duration } = test
        const startedAt = new Date()
        const endsAt = new Date(startedAt.getTime() + duration * 60000)
        const attempt = await Attempt.create({
            user: req.user!._id,
            test: _id,
            startedAt,
            endsAt
        })
        return res.status(201).json({ attempt, test })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAttemptById(req: Request, res: Response) {
    try {
        const { attemptId } = req.params;
        const attempt = await Attempt.findOne({
            _id: attemptId,
            user: req.user!._id,
        }).lean();

        if (!attempt) {
            return res.status(404).json({
                error: "Attempt not found",
            });
        }

        if (attempt.status === "IN_PROGRESS") {
            const testId = attempt.test;
            const test = await Test.findById(testId).select("-questions.correctOption").lean();

            if (!test) {
                return res.status(404).json({
                    error: "Test not found",
                });
            }

            return res.status(200).json({ attempt, test });
        }

        return res.status(200).json({ attempt });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function saveAnswer(req: Request, res: Response) {
    try {
        const { attemptId } = req.params;
        const { questionIndex, selectedOption, currentQuestion } = req.body;

        const attempt = await Attempt.findOne({
            _id: attemptId,
            user: req.user!._id,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({
                error: "Attempt not found",
            });
        }

        attempt.answers.set(
            questionIndex.toString(),
            selectedOption
        );

        attempt.currentQuestion = currentQuestion;

        await attempt.save();

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

export async function clearAnswer(req: Request, res: Response) {
    try {
        const { attemptId } = req.params;

        const attempt = await Attempt.findOne({
            _id: attemptId,
            user: req.user!._id,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({
                error: "Attempt not found",
            });
        }

        attempt.answers.delete(req.body.questionIndex.toString());

        await attempt.save();

        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

export async function submitAttempt(req: Request, res: Response) {
    try {
        const { attemptId } = req.params;
        const { testId } = req.body;

        const attempt = await Attempt.findOne({
            _id: attemptId,
            user: req.user!._id,
            test: testId,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({
                error: "Attempt not found",
            });
        }

        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({
                error: "Test not found",
            });
        }

        let score = 0;

        test.questions.forEach((question, index) => {
            const selected = attempt.answers.get(index.toString());

            if (selected === undefined) {
                return;
            }

            if (selected === question.correctOption) {
                score += test.correctMarks;
            } else {
                score -= test.negativeMarks;
            }
        });

        attempt.score = score;
        attempt.status = "SUBMITTED";
        attempt.submittedAt = new Date();

        await attempt.save();

        return res.status(200).json({
            score,
            totalQuestions: test.questionCount,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}