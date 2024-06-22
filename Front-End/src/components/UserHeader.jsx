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
  useColorModeValue,
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useFollowAndUnFollow from "../hooks/useFollowAndUnFollow";
import CreatePost from "./CreatePost";

const UserHeader = ({ user }) => {
  const SUCCESS = "Success.";
  const COPIED = "This link copied";
  const COPYLINK = "Copy link";
  const THREADS = "Threads";
  const FOLLOWERS = "Followers";

  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom); // this is the logged in user
  const { followHandler, updating, following } = useFollowAndUnFollow(user);
  const buttonColor = useColorModeValue("gray.300", "gray.dark");

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast(SUCCESS, COPIED, "success");
    });
  };

  return (
    <>
      <VStack pb={10} gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Hi👋, {user.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text
                fontSize={"md"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={2}
                borderRadius={"full"}
              >
                {user.username}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems={"center"} flexDirection={"column"}>
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
                  bg={"gray.300"}
                />
              )}
            </Flex>
          </Box>
        </Flex>
        <Text>{user.bio}</Text>
        <Flex alignContent={"space-between"} w={"full"} gap={4}>
          {currentUser?._id === user._id && <CreatePost />}
          {currentUser?._id === user._id && (
            <Link as={RouterLink} to="/update">
              <Button bg={buttonColor} size={{ base: "sm", sm: "md" }}>
                Update Profile
              </Button>
            </Link>
          )}
        </Flex>
        {currentUser?._id !== user._id && (
          <Button onClick={followHandler} size={"sm"} isLoading={updating}>
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>
              {user.followers.length} {FOLLOWERS}
            </Text>
          </Flex>
          <Flex>
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
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;
