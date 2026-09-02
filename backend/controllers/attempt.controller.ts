import {Request, Response} from 'express';
import Attempt from '../models/attempt.model'
import Test from '../models/test.model';

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
            status: "IN_PROGRESS"
        }).lean();

        if (existingAttempt) {
            if (existingAttempt.endsAt && new Date() > existingAttempt.endsAt) {
                existingAttempt.status = "SUBMITTED";
                existingAttempt.submittedAt = existingAttempt.endsAt;
                await Attempt.findByIdAndUpdate(existingAttempt._id, existingAttempt);
            } else {
                return res.status(200).json({ attempt: existingAttempt});
            }
        }

        const { _id, duration, questions, correctMarks, negativeMarks } = test
        const startedAt = new Date()
        const endsAt = new Date(startedAt.getTime() + duration * 1000)
        const attempt = await Attempt.create({
            user: req.user!._id,
            test: _id,
            questions,
            correctMarks,
            negativeMarks,
            startedAt,
            endsAt
        })
        return res.status(201).json({ attempt, test })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAttempt(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const attempt = await Attempt.findById(id)

        if (!attempt) {
            return res.status(404).json({
                error: "Attempt not found",
            });
        }

        const testId = attempt.test;
        const test = await Test.findById(testId).select("-questions.correctOption").lean();

        if (!test) {
            return res.status(404).json({error: "Test not found",});
        }

        return res.status(200).json({ attempt });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function saveAnswer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { questionIndex, selectedOption, currentQuestion } = req.body;

        const attempt = await Attempt.findOne({
            _id: id,
            user: req.user!._id,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({error: "Attempt not found or submitted already"});
        }

        attempt.answers.set(
            questionIndex.toString(),
            selectedOption
        );
        attempt.currentQuestion = currentQuestion;

        await attempt.save();

        return res.status(200).json({success: true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error",});
    }
}

export async function clearAnswer(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const attempt = await Attempt.findOne({
            _id: id,
            user: req.user!._id,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({error: "Attempt not found"});
        }

        attempt.answers.delete(req.body.questionIndex.toString());

        await attempt.save();

        return res.status(200).json({success: true});

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

export async function submitAttempt(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { testId } = req.body;

        const attempt = await Attempt.findOne({
            _id: id,
            user: req.user!._id,
            test: testId,
            status: "IN_PROGRESS",
        });

        if (!attempt) {
            return res.status(404).json({error: "Attempt not found"});
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
        attempt.questions = test.questions;

        await attempt.save();

        return res.status(200).json({attempt});

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error",});
    }
}