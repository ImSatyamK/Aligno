import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import { createPost, deletePost, likeUnlikePost } from "../controllers/post.controller"

export const postRouter = express.Router()

postRouter.post('/create', protectRoute, createPost)
postRouter.delete('/:id', protectRoute, deletePost)
postRouter.post('/like/:postId', protectRoute, likeUnlikePost)