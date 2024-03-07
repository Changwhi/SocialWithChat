import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const singUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in signUpUser: ", error.message);
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
      return res.status(400).json({ message: "Invalid Login information" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      // 200 = successful requests that update or retrieve
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ messager: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in logoutUser: ", error.message);
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
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in follow: ", error.message);
  }
};

const updateUser = async (req, res) =>{
    try {
        const { name, email, username, password, profilePic, bio } = req.body;
        const userId = req.user._id;

        let user = await User.findById(userId);
        if (!user) return res.status(400).json({message:"User does not exist"});
        
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic= profilePic || user.profilePic
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({message:"Profile updated successfully"})
        
    } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error updateUser: ", error.message);
    }
}

const getProfile = async(req, res) =>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username}).select("-updatedAt").select("-password")
        if(!user) return res.status(400).json({message:"User does not exist"})
        res.status(200).json(user)
    } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error getProfile: ", error.message);
    }
}

export { singUpUser, loginUser, logoutUser, followAndUnfollow, updateUser, getProfile};
