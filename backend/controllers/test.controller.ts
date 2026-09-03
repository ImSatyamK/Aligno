import { Request, Response } from "express";
import Test from "../models/test.model";
import Attempt from "../models/attempt.model";

export async function createTest(req: Request, res: Response) {
    try {
        const { title, description, instructions, duration, questions, correctMarks, negativeMarks, visibility } = req.body;
        if (!title || !duration || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const exist = await Test.findOne({ title, createdBy: req.user!._id }).lean();
        if (exist) {
            return res.status(400).json({ error: "You already have a test with this title already exists" });
        }
        const questionCount = questions.length;
        const test = await Test.create({
            createdBy: req.user!._id,
            title,
            description,
            instructions,
            duration,
            questions,
            questionCount,
            correctMarks,
            negativeMarks,
            visibility
        });

        return res.status(201).json(test);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getMyTests(req: Request, res: Response) {
    try {
        const myTests = await Test.find({
            createdBy: req.user!._id
        }).select("-questions").lean();

        return res.status(200).json({ success: true, myTests });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getPublicTests(req: Request, res: Response) {
    try {
        const publicTests = await Test.aggregate([
            { $match: { visibility: "PUBLIC" } },
            { $sample: { size: 10 } },
            { $project: { questions: 0 } }
        ])

        return res.status(200).json({success: true,publicTests})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export async function getTestDetail(req: Request, res: Response) {
    try {
        const { testId } = req.params
        const test = await Test.findById(testId).select("-questions").lean()
        if (!test) {
            return res.status(404).json({ error: "Test not found" })
        }
        const attempts = await Attempt.find({ test: testId, user: req.user!._id }).lean()
        return res.status(200).json({ test, attempts })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateTest(req: Request, res: Response) {
    try {
        const { testId } = req.params
        const test = await Test.findById(testId).lean()

        if (!test) {
            return res.status(404).json({ error: "Test not found" })
        }

        if (test.createdBy !== req.user?._id){
            return res.status(403).json({error: "Forbidden"})
        }

        const { title, description, instructions, duration, questions, correctMarks, negativeMarks, visibility } = req.body;
        if (!title || !duration || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const exist = await Test.findOne({ title, createdBy: req.user!._id }).lean();
        if (exist) {
            return res.status(400).json({ error: "You already have a test with this title already exists" });
        }
        const questionCount = questions.length;
        const updatedTest = await Test.findByIdAndUpdate(testId, {
            title,
            description,
            instructions,
            duration,
            questions,
            questionCount,
            correctMarks,
            negativeMarks,
            visibility
        },
        {return: "after"}
        )
        return res.status(200).json({test: updatedTest})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteTest(req: Request, res: Response) {
    try{
        const { testId } = req.params
        const test = await Test.findById(testId).lean()
        if (!test){
            return res.status(404).json({error: "Test not found"})
        }
        if (test.createdBy !== req.user?._id){
            return res.status(403).json({error: "Forbidden"})
        }
        await Test.findByIdAndDelete(testId)
        return res.status(200).json({message: "Test deleted successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}