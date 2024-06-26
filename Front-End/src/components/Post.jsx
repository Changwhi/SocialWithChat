import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import postsAtom from "./atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const ERROR = "Error";
  const SUCCESS = "Success";

  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/users/profile/" + postedBy);
        const responseData = await response.json();
        if (responseData.error) {
          showToast(ERROR, responseData.error, "error");
          return;
        }
        setUser(responseData);
      } catch (error) {
        showToast(ERROR, error, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const deletePostHandler = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.error) {
        showToast(ERROR, response.error, "error");
        return;
      }
      showToast(SUCCESS, "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast(ERROR, error, "error");
    }
  };

  if (!user) return null;
  return (
    <>
      <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name={user?.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w={"1px"} h={"full"} bg={"gray.light"} my={3}></Box>
            <Box position={"relative"} w={"full"}>
              {post.replies.length === 0 && <Text textAlign={"center"}>🫥</Text>}
              {post.replies[0] && (
                <Avatar
                  size={"xs"}
                  name="Changwhi OH"
                  src={post.replies[0].userProfilePic}
                  position={"absolute"}
                  top={"0px"}
                  left={"15px"}
                  padding={"2px"}
                />
              )}

              {post.replies[1] && (
                <Avatar
                  size={"xs"}
                  name="Changwhi OH"
                  src={post.replies[1].userProfilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  right={"-5px"}
                  padding={"2px"}
                />
              )}

              {post.replies[2] && (
                <Avatar
                  size={"xs"}
                  name="Changwhi OH"
                  src={post.replies[2].userProfilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  left={"4px"}
                  padding={"2px"}
                />
              )}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
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
            <Text fontSize={"sm"}>{post.text}</Text>
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
            <Flex gap={3} my={1}>
              <Actions post={post}></Actions>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default Post;
