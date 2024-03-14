import { useSetRecoilState } from "recoil";
import userAtom from "../components/atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
 const setUser = useSetRecoilState(userAtom);
 const showToast=useShowToast();

 const logout = async () => {
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
  return logout
}

export default useLogout;