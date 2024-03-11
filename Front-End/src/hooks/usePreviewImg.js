import { useState } from "react";
import useShowToast from "./useShowToast";


const usePreviewImg = () => {
    const showToast = useShowToast();
    const [imgUrl, setImgUrl] = useState(null);
    const imageChangeHandler = (e) => {
        const file = e.target.files[0];
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            showToast("Error", "Invalid file type", "error")
            setImgUrl(null);
        }
    } 
    return {imageChangeHandler, imgUrl}
}

export default usePreviewImg;