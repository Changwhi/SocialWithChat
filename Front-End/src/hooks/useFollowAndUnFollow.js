import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../components/atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowAndUnFollow = (user) => {
  const ERROR = "Error.";
  const NOT_LOGIN = "Please login first";
  const SUCCESS = "Success.";

  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const followHandler = async () => {
    if (!currentUser) {
      showToast(ERROR, NOT_LOGIN, "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const response = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      if (responseData.error) {
        showToast(ERROR, responseData.error, "error");
        return;
      }
      if (following) {
        showToast(SUCCESS, `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast(SUCCESS, `followed ${user.name}`, "success");
        user.followers.push(currentUser?._id);
      }
      setFollowing((follow) => !follow);
    } catch (error) {
      showToast(ERROR, error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return { followHandler, updating, following };
};

export default useFollowAndUnFollow;
