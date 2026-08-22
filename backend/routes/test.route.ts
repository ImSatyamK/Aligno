import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import {
    getMyTests,
    createTest,
    getAttemptByTestId,
    startAttempt,
    saveAnswer,
    submitAttempt,
    clearAnswer,
    getAttemptById,
} from "../controllers/test.controller";

export const testRouter = express.Router();

testRouter.get("/", protectRoute, getMyTests);
testRouter.post("/", protectRoute, createTest);

testRouter.get("/attempts/by-test/:testId", protectRoute, getAttemptByTestId);
testRouter.post("/attempts/:testId", protectRoute, startAttempt);

testRouter.put("/attempts/:attemptId/answer", protectRoute, saveAnswer);
testRouter.delete("/attempts/:attemptId/answer", protectRoute, clearAnswer);

testRouter.get("/attempts/:attemptId", protectRoute, getAttemptById);

testRouter.put("/attempts/:attemptId/submit", protectRoute, submitAttempt);