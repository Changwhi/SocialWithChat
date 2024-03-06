import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"


const UserPage = () => {
    return (
        <>
        <UserHeader />
        <UserPost likes={1200} replies={481} postImg={"/pic1.png"} postTitle={"hey this is chagnwhi"} />
        <UserPost likes={100} replies={48} postImg={"/pic2.jpg"} postTitle={"hey TT"} />
        <UserPost likes={12} replies={1} postImg={"/pic3.jpg"} postTitle={"it's working?"} />
        </>
    )
}

export default UserPage