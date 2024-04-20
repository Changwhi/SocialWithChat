import {  Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../components/atoms/postsAtom";

const HomePage = () => {
  const ERROR = "Error";
  const NO_POSTS = "No posts can be found.";

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const response = await fetch("/api/posts/feed");
        const responseData = await response.json();
        if (!responseData) {
          showToast(ERROR, responseData.error, "error");
          return;
        }
        setPosts(responseData);
      } catch (error) {
        showToast(ERROR, error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      {!loading && posts.length === 0 && <h1>{NO_POSTS}</h1>}
      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post)=>(
          <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
