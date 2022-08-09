import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItemsStyle from "./ChatItems.css";
import ChatItem from "./ChatItem";
import SearchIcon from "../../../../images/icons used/SearchIcon.png";
const ChatItems = ({
  chat,
  onChatChange,
  messageDateFormat,
  selectedChatItem,
  onSearch,
}) => {
  return (
    <div className="chatItems-wrapper">
      <div className="search_person-input">
        <input
          className="search_person"
          placeholder="Search person"
          type="text"
          onChange={onSearch}
        />{" "}
        <img src={SearchIcon}></img>
      </div>
      {chat.length > 0 ?
        (
          chat.map((item) => {
            return (
              <ChatItem
                messageDateFormat={messageDateFormat}
                onChatChange={onChatChange}
                key={item.id}
                item={item}
                selectedChatItem={selectedChatItem}
              />
            );
          })
        )
        :
        <div
          className="col-12 ml-2"
          style={{ textShadow: 'none', color: '#3e4543', padding: '20px' }}
        >
          No Data Found
        </div>
      }
    </div>
  );
};

export default ChatItems;
