import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Link to={"/changwhi"}>
        <Button> GO to </Button>
      </Link>
    </>
  );
};

export default HomePage;
