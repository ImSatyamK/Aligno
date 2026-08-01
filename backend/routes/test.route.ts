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

testRouter.get("/", protectRoute, getMyTests); // DONE
testRouter.post("/", protectRoute, createTest); // DONE

testRouter.get("/attempts/by-test/:testId", protectRoute, getAttemptByTestId); // DONE
testRouter.post("/attempts/:testId", protectRoute, startAttempt); // DONE

testRouter.put("/attempts/:attemptId/answer", protectRoute, saveAnswer); // DONE
testRouter.delete("/attempts/:attemptId/answer", protectRoute, clearAnswer); // DONE

testRouter.get("/attempts/:attemptId", protectRoute, getAttemptById); // DONE


testRouter.put("/attempts/:attemptId/submit", protectRoute, submitAttempt);