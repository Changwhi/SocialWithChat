import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../components/atoms/userAtom";
import Comment from "../components/Comment";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`/api/posts/${pid}`);
        const responseData = await response.json();
        if (responseData.error) {
          showToast("Error", responseData.error, "error");
          return;
        }
        console.log(responseData);
        setPost(responseData);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [pid, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  const deletePostHandler = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.error) {
        showToast("Error", response.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  if (!post) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="changwhi" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={"4"} h={"4"} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={deletePostHandler}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.500"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4}></Divider>
      {post.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === post.replies[post.replies.length - 1]._id}
        />
      ))}
    </>
  );
};

export default PostPage;
