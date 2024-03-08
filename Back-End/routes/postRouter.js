import express from "express"
import { createPost, deletePost, getPost, likePost, replyToPost,  getFeedPosts } from "../controllers/postControllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();


router.get('/feed', protectRoute, getFeedPosts); //This route should come first before /:id 
router.get('/:id', getPost);                     //If this comes first, router will consdier "feed" as a id
router.post('/create', protectRoute, createPost);
router.delete('/:id', protectRoute,deletePost);
router.post('/like/:id', protectRoute, likePost);
router.post('/reply/:postId', protectRoute, replyToPost);

export default router;
