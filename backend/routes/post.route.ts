import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import {

    createPost,
    deletePost,
    likeUnlikePost,
    commentOnPost,
    getAllPosts,
    getLikedPosts,
    getUserPosts,
    getFollowingPosts

}
from "../controllers/post.controller"

export const postRouter = express.Router()

postRouter.post('/create', protectRoute, createPost)
postRouter.delete('/:id', protectRoute, deletePost)
postRouter.post('/like/:postId', protectRoute, likeUnlikePost)
postRouter.post('/comment/:postId', protectRoute, commentOnPost)

postRouter.get('/all', protectRoute, getAllPosts)
postRouter.get('/likedPosts/:userId', protectRoute, getLikedPosts)
postRouter.get('/userPosts/:userId', protectRoute, getUserPosts)
postRouter.get('/following', protectRoute, getFollowingPosts)