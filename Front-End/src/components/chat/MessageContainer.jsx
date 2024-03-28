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
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      setMessages([]);
      try {
        console.log("Messagecontainer" , selectedConversation.userId)
        const response = await fetch(
          `/api/messages/${selectedConversation.userId}`
        );
        const responseData = await response.json();
        if (responseData.error) {
          showToast("Error in try", responseData.error, "error");
          return;
        }
        console.log("messagecontainer2", responseData);
      setMessages(responseData);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getMessage();

  }, [showToast, selectedConversation.userId]);

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
            {selectedConversation.username}<Image src="/verified.png" w={4} h={4} ml={1} />
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
          {loading&&
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
          
            {!loading && (
              messages.map((message) => (
                <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender}/>
              ))
            )}
        </Flex>
        <MessageInput setMessages={setMessages} />
      </Flex>
    </>
  );
};

export default MessageContainer;
