import express from "express"
import { createPost, deletePost, getPost, likePost, replyToPost,  getFeedPosts, getUserPosts } from "../controllers/postControllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();


router.get('/feed', protectRoute, getFeedPosts); //This route should come first before /:id 
router.get('/:id', getPost);                     //If this comes first, router will consdier "feed" as a id
router.delete('/:id', protectRoute,deletePost);
router.get('/user/:username', getUserPosts);
router.post('/create', protectRoute, createPost);
router.put('/like/:id', protectRoute, likePost);
router.put('/reply/:postId', protectRoute, replyToPost);

export default router;
