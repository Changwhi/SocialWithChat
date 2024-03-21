import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getConversations, getMessages, sendMessage } from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/conversations", protectRoute, getConversations);
router.get("/:anotherUserId", protectRoute, getMessages);
export default router;
