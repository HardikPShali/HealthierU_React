import React from "react";
import default_image from "../../../../images/default_image.png";
import "./ChatMessage.css"

const ChatMessage = ({ isMyMessage, image, message, time, isRead }) => {
  return (
    <li className={isMyMessage ? "msg-right" : "msg-left"}>
      <div
        className={
          isMyMessage
            ? `msg-right-sub ${isRead ? " blue" : " brown"}`
            : "msg-left-sub"
        }
      >
        <img src={image || default_image} alt="" className={isMyMessage && (isRead ? "blue" : "brown")}/>
        <div className="msg-desc">{message}</div>
        <small>{time}</small>
      </div>
    </li>
  );
};

export default ChatMessage;
