import express from "express";
import {
  getSuggestedUsers,
  loginUser,
  logoutUser,
  singUpUser,
  followAndUnfollow,
  updateUser,
  getProfile,
} from "../controllers/userControllers.js";
import protectRoute from "../middlewares/protectRoute.js";
import useGetUserProfile from "../../Front-End/src/hooks/useGetUserProfile.js";

const router = express.Router();

router.get("/profile/:userinfo", getProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", singUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followAndUnfollow);
router.put("/update/:id", protectRoute, updateUser);

export default router;
