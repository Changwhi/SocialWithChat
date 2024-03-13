import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const singUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        //200 = successful requests that create
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signUpUser: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Login information" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      // 200 = successful requests that update or retrieve
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in loginUser: ", err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ messager: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in logoutUser: ", err.message);
  }
};

const followAndUnfollow = async (req, res) => {
  try {
    const {id} = req.params;
    const targetUser = await User.findById(id);
    const currentUser = await User.findById(req.user._id) 

    if(id===req.user._id.toString()) return res.status(400).json({message:"You can not follow/unfollow yourslef"});
    if(!targetUser || !currentUser) return res.status(400).json({message:"User not found"});

    const isFollowing = currentUser.following.includes(id);
    
    if(isFollowing){
        //Unfollow since they are already followed.
        // user A
        await User.findByIdAndUpdate(req.user._id, { $pull: {following: id}})
        // user B
        await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id}})
        res.status(200).json({message:"User unfollow successfilly"})
    } else{
        //Follow
        // user A
        await User.findByIdAndUpdate(req.user._id, { $push: {following: id}})
        // user B
        await User.findByIdAndUpdate(id, { $push: {followers: req.user._id}})
        res.status(200).json({message:"User follow successfully"})
    }
  } catch (err) {
    res.status(500).json({ error : err.message });
    console.log("Error in follow: ", err.message);
  }
};

const updateUser = async (req, res) =>{
    try {
        const { name, email, username, password, bio } = req.body;
        let {profilePic} = req.body;
        const userId = req.user._id;

        let user = await User.findById(userId);
        if (!user) return res.status(400).json({message:"User does not exist"});
        if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if(profilePic){
          if(user.profilePic){
            await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
          }
          const uploadedResponse = await cloudinary.uploader.upload(profilePic);
          profilePic = uploadedResponse.secure_url;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic= profilePic || user.profilePic
        user.bio = bio || user.bio;

        user = await user.save();

        //get rid of password to hide
        user.password = null;
        res.status(200).json(user)
        
    } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error updateUser: ", err.message);
    }
}

const getProfile = async(req, res) =>{
    try {
        //find user profile based on name or user id
        const {userinfo} = req.params;
        let user;

        if(mongoose.Types.ObjectId.isValid(userinfo)){
          user = await User.findOne({_id:userinfo}).select("-password").select("-updatedAt")
        } else{
          user = await User.findOne({username: userinfo}).select("-password").select("-updatedAt")
        }

        if(!user) return res.status(400).json({error:"User does not exist"})
        res.status(200).json(user)
    } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error getProfile: ", err.message);
    }
}

export { singUpUser, loginUser, logoutUser, followAndUnfollow, updateUser, getProfile};
