import { Flex, Link, Text, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "./atoms/authAtom";
import { GrSun } from "react-icons/gr";
import { IoMoonSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  return (
    <>
      <Flex justifyContent={"space-between"} mt={6} mb={12}>
        {user && (
          <Link cursor={"pointer"} as={RouterLink} to={"/"}>
            <Text fontWeight={"bold"} fontSize={{ base: "large", md: "2xl" }}>
              Post & Chat
            </Text>
          </Link>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => setAuthScreen("login")}
            fontSize={"xl"}
          >
            Login
          </Link>
        )}
        {user && (
          <Flex alignItems={"center"} gap={{ base: 3, md: 6 }}>
            <Link cursor={"pointer"} as={RouterLink} to={"/"}>
              <Flex alignItems={"center"} gap={1}>
                <AiFillHome size={24} />
                <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                  Home
                </Text>
              </Flex>
            </Link>
            <Link as={RouterLink} to={`/${user.username}`}>
              <Flex alignItems={"center"} gap={1}>
                <RxAvatar size={24} />
                <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                  My Page
                </Text>
              </Flex>
            </Link>
            <Link as={RouterLink} to={`/chat`}>
              <Flex alignItems={"center"} gap={1}>
                <BsFillChatQuoteFill size={24} />
                <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                  Chat
                </Text>
              </Flex>
            </Link>
            <Link
              alignItems={"center"}
              cursor={"pointer"}
              gap={1}
              onClick={toggleColorMode}
            >
              <Flex alignItems={"center"} gap={1}>
                {colorMode === "dark" ? (
                  <GrSun size={24} />
                ) : (
                  <IoMoonSharp size={24} />
                )}
                {colorMode === "dark" ? (
                  <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                    Light Mode
                  </Text>
                ) : (
                  <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                    Dark Mode
                  </Text>
                )}
              </Flex>
            </Link>
            <Link size={"xs"} onClick={logout}>
              <Flex alignItems={"center"} gap={1}>
                <FiLogOut size={24} />
                <Text display={{ base: "none", md: "block" }} fontSize={"sm"}>
                  Logout
                </Text>
              </Flex>
            </Link>
          </Flex>
        )}

        {!user && (
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => {
              setAuthScreen("signup");
            }}
            fontSize={"xl"}
          >
            Sign up
          </Link>
        )}
      </Flex>
    </>
  );
};

export default Header;
