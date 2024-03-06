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
  useToast,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
  const SUCCESS = "Success."
  const COPIED = "This link copied"
  const INTSTAGRAM = "Instagram.com"
  const COPYLINK = "Copy link"
  const THREADS = "Threads"
  const REPLIES = "Replies"
  
  const toast = useToast();
  
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: SUCCESS,
        status: "success",
        description: COPIED,
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Test name
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>Test anme</Text>
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
            <Avatar name="name" src="/personal.png" size={{
              base: "md",
              md: "xl",
            }} />
          </Box>
        </Flex>
        <Text>what I am blablabla ~~~~~~~</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>2K followers</Text>
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
          <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
            <Text fontWeight={"bold"}>{THREADS}</Text>
          </Flex>
          <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
            <Text fontWeight={"bold"}>{REPLIES}</Text>
          </Flex>
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;
