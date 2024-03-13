import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("")
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  const logInHandler = async() => {
      setLoading(true);
      try {
          const info = {
              username: id,
              password: password,
            }

          const res = await fetch("/api/users/login", {
            method:"POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(info)
              })
          const responseData = await res.json();
          if (responseData.error){
            showToast("Error", responseData.error, 'error')
            return
          }
          
          localStorage.setItem("user-project0", JSON.stringify(responseData));
          setUser(responseData);
      } catch (error) {
        showToast("Error", error, 'error');
      } finally {
        setLoading(false);
      }
  }
  return (
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
           Log In
          </Heading>
          
        </Stack>
        <Box
        w={{sm:"400px", base:"full" }}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl  isRequired>
              <FormLabel>User Name</FormLabel>
              <Input type="text"
                  value={id}
                  onChange={(e) => {setId(e.target.value)}}
               />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={logInHandler}
                isLoading={loading}
                >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link color={'blue.400'} onClick={() => { setAuthScreen("signup")}}>Sign Up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}