import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom.js";
import { WiMoonAltNew } from "react-icons/wi";

const Conversation = ({ conversation, isOnline }) => {
  const username = conversation.participants[0]
    ? conversation.participants[0].username
    : "Unknown";
  const uid = conversation.participants[0]
    ? conversation.participants[0]._id
    : "Unknown";
  const userAvatar = conversation.participants[0]
    ? conversation.participants[0].profilePic
    : "https://bit.ly/broken-link";
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();
  return (
    <>
      <Flex
        gap={4}
        alignItems={"center"}
        p={1}
        _hover={{
          curso: "pointer",
          bg: useColorModeValue("gray.600", "gray.dark"),
          color: "white",
        }}
        borderRadius={"md"}
        onClick={() =>
          setSelectedConversation({
            _id: conversation._id,
            userId: uid,
            username: username,
            userProfilePic: userAvatar,
            mock: conversation.mock,
          })
        }
        bg={
          (selectedConversation?._id === conversation._id
            ? (colorMode.colorMode === "light" ? "gray.400" : "gray.800")
            : "none")
        }
      >
        <WrapItem>
          <Avatar
            size={{
              base: "xs",
              sm: "sm",
              md: "md",
            }}
            src={userAvatar}
          >
            {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
          </Avatar>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
          <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
            {username} <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {currentUser._id === lastMessage.sender ? "": (lastMessage.seen ? "":<WiMoonAltNew />)}
            
            {lastMessage.sender.toString() === currentUser._id.toString()
              ? "Me: "
              : `${username}: `}
            {lastMessage.text.length > 15
              ? lastMessage.text.slice(0, 15) + "..."
              : lastMessage.text}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default Conversation;
