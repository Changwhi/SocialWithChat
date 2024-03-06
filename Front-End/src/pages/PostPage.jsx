import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState();

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/personal.png" size={"md"} name="changwhi" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              changwho Oh
            </Text>
            <Image src="/verified.png" w={"4"} h={"4"} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots></BsThreeDots>
        </Flex>
      </Flex>
      <Text my={3}>let&apos;s talk about</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.500"}
      >
        <Image src={"/pic1.png"} w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          235 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4}></Divider>
      <Comment comment={"Looks good"} createAt={"2d"} likes={200} userName={"changwhi"} userAvater="https://bit.ly/dan-abramov"></Comment>
      <Comment comment={"good"} createAt={"2d"} likes={200} userName={"changwhi"} userAvater="https://bit.ly/dan-abramov"></Comment>
      <Comment comment={"dddddgood"} createAt={"10d"} likes={200} userName={"changwhi"} userAvater="https://bit.ly/dan-abramov"></Comment>
      <Comment comment={"testest good"} createAt={"2d"} likes={200} userName={"changwhi"} userAvater="https://bit.ly/dan-abramov"></Comment>
    </>
  );
};

export default PostPage;
