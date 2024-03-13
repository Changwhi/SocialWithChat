import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      console.log("useeffect")
      try {
        const response = await fetch(`/api/users/profile/${username}`);
        const responseData = await response.json();
        if (responseData.error) {
          showToast("Error", responseData.error, "error");
          return;
        }
        setUser(responseData);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);
  if(!user && loading) {
    return (
      <Flex justifyContent={"center"}>
      <Spinner size={"xl"} />
      </Flex>
    )
  }
  if (!user) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={481}
        postImg={"/pic1.png"}
        postTitle={"hey this is chagnwhi"}
      />
      <UserPost
        likes={100}
        replies={48}
        postImg={"/pic2.jpg"}
        postTitle={"hey TT"}
      />
      <UserPost
        likes={12}
        replies={1}
        postImg={"/pic3.jpg"}
        postTitle={"it's working?"}
      />
    </>
  );
};

export default UserPage;
