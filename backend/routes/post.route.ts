import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import { createPost } from "../controllers/post.controller"

export const postRouter = express.Router()

postRouter.post('/create', protectRoute, createPost)