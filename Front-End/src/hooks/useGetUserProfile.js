import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast.js";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("usergetuserprofile");
        setLoading(true);
        const response = await fetch(`/api/users/profile/${username}`);
        const responseData = await response.json();
        if (responseData.error) {
          showToast("Error", responseData.error, "error");
          return;
        }
        setUser(responseData);
      } catch (error) {
        showToast("Error",error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
