import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import {
    createTest,
    getTests,
    getTestDetail,
    updateTest,
    deleteTest
} from "../controllers/test.controller";

export const testRouter = express.Router();

testRouter.post("/", protectRoute, createTest);
testRouter.get("/", protectRoute, getTests);
testRouter.get("/:testId", protectRoute, getTestDetail);
testRouter.put("/:testId", protectRoute, updateTest);
testRouter.delete("/:testId", protectRoute, deleteTest);