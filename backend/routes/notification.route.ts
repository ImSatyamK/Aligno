import express from "express";

import { protectRoute } from "../middleware/protectRoute";
import { getAllNotifications, deleteNotifications } from "../controllers/notification.controller"

export const notificationRouter = express.Router()

notificationRouter.get('/all', protectRoute, getAllNotifications)
notificationRouter.delete('/', protectRoute, deleteNotifications)