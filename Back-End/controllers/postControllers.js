import User from "../models/userModel.js";
import Post from "../models/PostModel.js";
const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "Postedby and text fileds are required." });
    }

    const user = await User.findById(postedBy);

    if (!user) return res.status(400).json({ message: "User are not found" });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in createPost: ", error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getPost: ", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post has been deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in deletePst: ", error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const didPushLikeButton = post.likes.includes(userId);
    if (didPushLikeButton) {
      //then make it unlike status
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).jason({ message: "Post unliked successfully" });
    } else {
      //then make it like status
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfilly" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in likePost: ", error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;
    const userProfilePic = req.user.userProfilePic;
    const username = req.user.username;
    if (!text) {
      return res.status(400).json({ message: "Text is requried" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Text not found" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json({ message: "Reply to a post successfilly" });

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in replyToPost: ", error.message);
  }
};

const getFeedPosts = async(req,res) => {
    try {
       const userId = req.user._id;
       const user = await User.findById(userId) ;
       if(!user) return res.status(404).json({message: "User can not found"})
       const following = user.following;

       const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1});
       res.status(200).json({feedPosts})
    } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getFeedPosts: ", error.message);
    }
}
export { createPost, getPost, deletePost, likePost, replyToPost, getFeedPosts};
