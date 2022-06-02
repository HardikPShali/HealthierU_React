import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItemStyle from "./ChatItem.css";
import patientprof from "../../../../images/patientprof.png"

const ChatItem = (props) => {

    
  return (
    <div className="chat_item-wrapper">
      <div className="chat_item">
        <div className="chat_item-left">
          <div className="chat_item-profile">
            <img src={patientprof} alt="" />
          </div>
          <div className="chat_item-text-wrap">
            <div className="chat_item-name">{props.item?.patient?.firstName} { props.item?.patient?.lastName}</div>
            <div className="chat_item-message-wrap">
              <span className="chat_item-by">You:</span>
              <span className="chat_lastMessage">{props.item?.lastMessage?.message}</span>
            </div>
          </div>
        </div>
        <div className="chat_item-right">{props.item?.time}</div>
      </div>
    </div>
  );
};

export default ChatItem;
