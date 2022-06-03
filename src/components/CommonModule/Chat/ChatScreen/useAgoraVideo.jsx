import { useEffect, useState } from "react";
import { handleAgoraAccessToken } from "../../../../service/agoratokenservice";

const useAgoraVideo = () => {
    const [openVideoCall, setOpenVideoCall] = useState(false);


    useEffect(() => {
       
    }, []);

    const getToken = (pId, dId) => {
        handleAgoraAccessToken(pId, dId, () => {
            setOpenVideoCall(true);
        });
    }

    return [openVideoCall, setOpenVideoCall, getToken];
};  

export default useAgoraVideo;