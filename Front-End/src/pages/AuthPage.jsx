import { useRecoilValue } from "recoil";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SingUpCard"
import authScreenAtom from "../components/atoms/authAtom";

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
    
    return (
        <>
        {authScreenState === 'login' ? <LoginCard /> : <SignupCard /> }
        </>
    )
}

export default AuthPage;