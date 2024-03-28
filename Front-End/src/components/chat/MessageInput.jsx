import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const MessageInput = ({ setMessage }) => {
  const [text, setText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const showToast = useShowToast();
  const sendingHanlder = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      const response = fetch("/api/messages", {
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

      setMessage((messages) => [...messages, responseData]);
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
