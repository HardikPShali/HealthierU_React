import React, { useEffect, useState } from "react";
import { APP_ID } from "../../../../util/configurations";
import "./ChatScreen.css";
import useAgoraChat from "./useAgoraChat";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import { generateRTMToken, handleAgoraAccessToken } from "../../../../service/agoratokenservice";

const ChatScreen = () => {
  const cookies = new Cookies();
  const location = useLocation();
  const [isAgoraLoggedIn, setAgoraLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [pIdState, setPIdState] = useState("");
  const [dIdState, setDIdState] = useState("");
  const [channelName, setChannelName] = useState("");
  const [agoraToken, setAgoraToken] = useState("");

  const onConnectionChange = (e) => {
    console.log(e);
  };

  const onMessageChange = (e) => {
    console.log(e);
  };
  const {
    login,
    logout,
    joinChannel,
    leaveChannel,
    sendChannelMessage,
    sendPeerMessage,
  } = useAgoraChat(APP_ID, onMessageChange, onMessageChange);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let chatGroup = searchParams.get("chatgroup");

    if (chatGroup) {
      setPIdState(Number(chatGroup.split("_")[0].replace("P", "")));
      setDIdState(Number(chatGroup.split("_")[1].replace("D", "")));
    }
  }, []);

  useEffect(() => {
    if (pIdState && dIdState) {
      const agoraTrigger = async () => {
        try {
          const tokenResponse = await generateRTMToken(pIdState, dIdState);
          setChannelName(tokenResponse.data.data.channelName);
          setAgoraToken(tokenResponse.data.data.token);
          await login(
            tokenResponse.data.data.userName,
            tokenResponse.data.data.token
          );
          setAgoraLoggedIn(true);
          joinChannel(tokenResponse.data.data.channelName);
        } catch (error) {
          console.log(error);
        }
      };

      agoraTrigger();
    }
  }, [pIdState, dIdState]);

  const handleMessageChange = (e) => {
    console.log(e);
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    await sendChannelMessage(message, channelName);
  };

  return (
    <section className="chat-screen-container">
      <input
        type="text"
        name="head"
        value={message}
        onChange={handleMessageChange}
      />
      <button onClick={sendMessage}>Send</button>
    </section>
  );
};

export default ChatScreen;
