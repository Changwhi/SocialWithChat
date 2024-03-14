import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const Actions = ({ post: post_ }) => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [liked, setLiked] = useState(post_.likes.includes(user?._id));
  const [post, setPost] = useState(post_);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reply, setReply] = useState("");

  const replyHandler = async () => {
    if(isLoading) return;
    setIsLoading(true);
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    try {
      const response = await fetch(`/api/posts/reply/${post._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const responseData = await response.json();
      if (responseData.error) {
        return showToast("Error", responseData.error, "error");
      }
      setPost({ ...post, replies: [...post.replies, responseData.reply] });
      showToast("Succes", "Reply posted successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false)
    }
  };

  const likeHandler = async () => {
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts/like/" + post._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (responseData.error)
        return showToast("Error", responseData.error, "error");
      if (!liked) {
        setPost({ ...post, likes: [...post.likes, user._id] });
      } else {
        setPost({ ...post, likes: post.likes.filter((id) => id !== user._id) });
      }

      setLiked((prev) => !prev);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={likeHandler}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} likes
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" size="sm" mr={3} onClick={replyHandler} isLoading={isLoading}>
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;
