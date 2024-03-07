import express from 'express'
import {loginUser, logoutUser, singUpUser, followAndUnfollow, updateUser, getProfile} from '../controllers/userControllers.js'
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/profile/:username", getProfile)
router.post("/signup", singUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)
router.post("/follow/:id", protectRoute, followAndUnfollow);
router.post("/update/", protectRoute, updateUser)


export default router;