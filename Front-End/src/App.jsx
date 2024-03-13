import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./components/atoms/userAtom"
import LogoutButton from "./components/auth/LogoutButton"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW='800px'>
      <Header />
      <Routes>
        <Route path="/" element={user? <HomePage /> : <Navigate to='/auth' />}></Route>
        <Route path="/auth" element={!user ? <AuthPage />: <Navigate to='/'/>}></Route>
        <Route path="/update" element={user ? <UpdateProfilePage/>: <Navigate to='/auth'/>}></Route>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<PostPage/>}></Route>
      </Routes>
      {user && <LogoutButton />} 
      {user && <CreatePost/>} 
    </Container>
  )
}

export default App
