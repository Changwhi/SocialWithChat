import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";

const MessageInput = ({ setMessages }) => {
  const [text, setText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const showToast = useShowToast();
  const sendingHanlder = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          recipientId: selectedConversation.userId,
        }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        showToast("Error", responseData.error, "error");
        return;
      }
      setText("");
      setMessages((messages) => [...messages, responseData]);
      setConversations((prevConversations) => {
        const updatedConversation = prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: text,
                sender: responseData.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <form onSubmit={sendingHanlder}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <InputRightElement onClick={sendingHanlder} cursor={"pointer"}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  );
};

export default MessageInput;
