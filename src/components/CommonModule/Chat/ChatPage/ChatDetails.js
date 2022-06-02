import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatDetailsStyle from "./ChatDetails.css";
import blueTick from "../../../../images/icons used/blueTick.png";
import greyTick from "../../../../images/icons used/greyTick.png";

const ChatDetails = ({selectedItem, messages, onMessageChange, onSend, messageState, endRef}) => {
   
  return (
    <div className="chatDetails-wrapper">
      <h2 className="chating_with">{selectedItem[selectedItem.userKey] && selectedItem[selectedItem.userKey]?.firstName  + " " + selectedItem[selectedItem.userKey]?.lastName}</h2>
      <div className="chat-section">
        <div className="chat_detail-body">
          {/* <div className="today-date">Jan 12, 2022</div> */}
          <div className="chat_detail_received">
            {messages.map((message) => {
              return (
                <>
                  {!message.myMessage && (
                    <div key={message.id} className="received_chat-msg-wrap my-2">
                      <div className="received_chat-msg">
                        <div className="chat-msg-text">{message.message}</div>
                        <div className="received_chat-time">{message.createdAt}</div>
                      </div>
                    </div>
                  )}
                  {message.myMessage && (
                    <div key={message.id} className="sent_chat-msg-wrap my-2">
                      <div className="sent_chat-msg">
                        <span className="chat-msg-text">{message.message}</span>
                        <div className="sent_chat-time-tick-wrap">
                          <span className="sent_chat-time">{message.createdAt}</span>
                          <span className="sent_chat-seen">
                            <img src={blueTick} alt="" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
            <div style={{ float:"left", clear: "both" }}
             ref={endRef}>
        </div>
            {/* <div className="received_chat-first-msg-wrap">
            <span className="received_chat-userName">Hasib</span>
            <br></br>
            <span className="chat-msg-text">Hello, Krysia!</span>
          </div> */}
          </div>
        </div>
        <div className="send-msg-input-wrapper">
          <div className="send-msg-input">
            <input value={messageState} onChange={onMessageChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                onMessageChange(event)
              }
            }}
            type="text" placeholder="Write you message here" />
          </div>
          <button onClick={onSend} className="send-msg-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
