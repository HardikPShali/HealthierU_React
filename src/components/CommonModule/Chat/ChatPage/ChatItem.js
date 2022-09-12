import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItemStyle from "./ChatItem.css";
import default_image from "../../../../images/default_image.jpg"
import Avatar from 'react-avatar';

const ChatItem = ({ item, onChatChange, messageDateFormat, selectedChatItem }) => {

  const avatarPic = (
    <Avatar
      round={true}
      name={
        item[item.userKey]?.firstName
      }
      size={50}
      className="chat-avatar"
    />
  )

  return (
    <div onClick={() => onChatChange(item)}
      className={`chat_item-wrapper ${selectedChatItem && selectedChatItem.id === item.id && 'selected-chat-item'}`}>
      <div className="chat_item">
        <div className="chat_item-left">
          <div className="chat_item-profile">
            {
              item[item.userKey]?.picture ? (
                <img src={item[item.userKey]?.picture} alt="profile" />
              ) :
                (
                  <div>
                    {avatarPic}
                  </div>

                )
            }
            {/* <img src={item[item.userKey]?.picture} alt="" /> */}
          </div>
          <div className="chat_item-text-wrap">
            <div className="chat_item-name">{item[item.userKey]?.firstName}</div>
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
