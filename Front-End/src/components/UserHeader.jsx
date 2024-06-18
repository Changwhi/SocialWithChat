import {
  Avatar,
  Box,
  Flex,
  Link,
  MenuButton,
  Text,
  VStack,
  Portal,
  MenuItem,
  MenuList,
  Menu,
  Button,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useFollowAndUnFollow from "../hooks/useFollowAndUnFollow";

const UserHeader = ({ user }) => {
  const SUCCESS = "Success.";
  const COPIED = "This link copied";
  const INTSTAGRAM = "Instagram.com";
  const COPYLINK = "Copy link";
  const THREADS = "Threads";
  const REPLIES = "Replies";

  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom); // this is the logged in user
  const { followHandler, updating, following } = useFollowAndUnFollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast(SUCCESS, COPIED, "success");
    });
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user.username}</Text>
              <Text
                fontSize={"xs"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                Threads.next
              </Text>
            </Flex>
          </Box>
          <Box>
            {user.profilePic && (
              <Avatar
                name={user.name}
                src={user.profilePic}
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
            {!user.profilePic && (
              <Avatar
                name=" "
                src="https://bit.ly/broken-link"
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
          </Box>
        </Flex>
        <Text>{user.bio}</Text>
        {currentUser?._id === user._id && (
          <Link as={RouterLink} to="/update">
            <Button size={"sm"}>Update Profile</Button>
          </Link>
        )}
        {currentUser?._id !== user._id && (
          <Button onClick={followHandler} size={"sm"} isLoading={updating}>
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{user.followers.length} followers</Text>
            <Box w={"1"} h={"1"} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>{INTSTAGRAM}</Link>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyURL}>
                      {COPYLINK}
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={"1.5px solid white"}
            justifyContent={"center"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>{THREADS}</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={"1.5px solid gray"}
            justifyContent={"center"}
            color={"gray.light"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>{REPLIES}</Text>
          </Flex>
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;
