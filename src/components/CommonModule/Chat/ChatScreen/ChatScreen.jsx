import React, { useEffect, useState } from "react";
import "./ChatScreen.css";
import ChatPage from "../ChatPage/ChatPage";

const ChatScreen = () => {
 
  return (
    <section className="chat-screen-container">
      <ChatPage />
    </section>
  );
};

export default ChatScreen;
