import express from 'express';
import { protectRoute } from '../middleware/protectRoute'
import { startAttempt, getAttempt, saveAnswer, clearAnswer, submitAttempt } from '../controllers/attempt.controller';
import { verifyDuration } from '../middleware/verifyDuration';

export const attemptRouter = express.Router()

attemptRouter.post('/:testId', protectRoute, startAttempt)
attemptRouter.get("/:id", protectRoute, verifyDuration, getAttempt)
attemptRouter.put("/:id", protectRoute, verifyDuration, saveAnswer)
attemptRouter.delete("/:id", protectRoute, verifyDuration, clearAnswer)
attemptRouter.put("/:id/submit", protectRoute, submitAttempt)