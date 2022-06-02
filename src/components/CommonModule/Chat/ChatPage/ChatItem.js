import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItemStyle from "./ChatItem.css";
import patientprof from "../../../../images/patientprof.png"

const ChatItem = ({item, onChatChange}) => {

    
  return (
    <div onClick={() => onChatChange(item)} className="chat_item-wrapper">
      <div className="chat_item">
        <div className="chat_item-left">
          <div className="chat_item-profile">
            <img src={item[item.userKey]?.picture || patientprof} alt="" />
          </div>
          <div className="chat_item-text-wrap">
            <div className="chat_item-name">{item[item.userKey]?.firstName} { item[item.userKey]?.lastName}</div>
            <div className="chat_item-message-wrap">
              <span className="chat_item-by">{item.lastMessage?.isMyMessage ? 'You' : ''}</span>
              <span className="chat_lastMessage">{item.lastMessage?.message || ""}</span>
            </div>
          </div>
        </div>
        <div className="chat_item-right">{item.lastMessage?.createdAt}</div>
      </div>
    </div>
  );
};

export default ChatItem;
