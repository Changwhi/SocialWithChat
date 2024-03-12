import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import {FiLogOut} from "react-icons/fi";
const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-project0");
      setUser(null);
    } catch (err) {
        showToast("Error", err, 'error');
    }
  };
  return (
    <>
      <Button
        onClick={logoutHandler}
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
      >
        <FiLogOut size={20}/>
      </Button>
    </>
  );
};

export default LogoutButton;