import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItemStyle from "./ChatItem.css";
import patientprof from "../../../../images/patientprof.png"

const ChatItem = ({item, onChatChange, messageDateFormat, selectedChatItem}) => {

    
  return (
    <div onClick={() => onChatChange(item)} 
    className={`chat_item-wrapper ${selectedChatItem && selectedChatItem.id === item.id && 'selected-chat-item'}`}>
      <div className="chat_item">
        <div className="chat_item-left">
          <div className="chat_item-profile">
            <img src={item[item.userKey]?.picture || patientprof} alt="" />
          </div>
          <div className="chat_item-text-wrap">
            <div className="chat_item-name">{item[item.userKey]?.firstName} { item[item.userKey]?.lastName}</div>
            <div className="chat_item-message-wrap">
              {item.lastMessage?.isMyMessage && <span className="chat_item-by">You</span>}
              <span className="chat_lastMessage">{item.lastMessage?.message || ""}</span>
            </div>
          </div>
        </div>
        <div className="chat_item-right">{messageDateFormat(item.lastMessage?.createdAt)}</div>
      </div>
    </div>
  );
};

export default ChatItem;
