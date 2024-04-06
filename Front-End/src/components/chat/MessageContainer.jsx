import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../../context/SocketContext.jsx";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { socket } = useSocket();
  const latestMessageRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      if (selectedConversation._id === data.conversationId) {
        setMessages((prev) => [...prev, data]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === data.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: data.text,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOherUser) {
    console.log("lastMessageIsFromOherUser", lastMessageIsFromOherUser)
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [currentUser._id, messages, selectedConversation, socket]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;

        const response = await fetch(
          `/api/messages/${selectedConversation.userId}`
        );
        const responseData = await response.json();
        if (responseData.error) {
          showToast("Error in try", responseData.error, "error");
          return;
        }
        setMessages(responseData);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getMessage();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  return (
    <>
      <Flex
        flex="70"
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={"md"}
        flexDirection={"column"}
        p={2}
      >
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
          <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation.username}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Divider />
        <Flex
          flexDir={"column"}
          p={2}
          gap={4}
          my={4}
          height={"400px"}
          overflowY={"auto"}
        >
          {loading &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={"column"} gap={2}>
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))}

          {!loading &&
            messages.map((message) => (
              <Flex
                key={message._id}
                direction={"column"}
                ref={
                  messages.length - 1 === messages.indexOf(message)
                    ? latestMessageRef
                    : null
                }
              >
                <Message
                  message={message}
                  ownMessage={currentUser._id === message.sender}
                />
              </Flex>
            ))}
        </Flex>
        <MessageInput setMessages={setMessages} />
      </Flex>
    </>
  );
};

export default MessageContainer;
