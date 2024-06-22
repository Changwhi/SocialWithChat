import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes} from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./components/atoms/userAtom"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import ChatPage from "./pages/ChatPage"

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Box position={"relative"} w={"full"}>

    <Container maxW={{base:"620px", md:"960px"}}>
      <Header />
      <Routes>
        <Route path="/" element={user? <HomePage /> : <Navigate to='/auth' />}></Route>
        <Route path="/auth" element={!user ? <AuthPage />: <Navigate to='/'/>}></Route>
        <Route path="/update" element={user ? <UpdateProfilePage/>: <Navigate to='/auth'/>}></Route>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<PostPage/>}></Route>
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={'/auth'} />}></Route>
      </Routes>

    </Container>
    </Box>
  )
}

export default App
