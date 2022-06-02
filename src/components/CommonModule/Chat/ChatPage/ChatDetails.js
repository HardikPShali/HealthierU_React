import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatDetailsStyle from "./ChatDetails.css";
import blueTick from "../../../../images/icons used/blueTick.png";
import greyTick from "../../../../images/icons used/greyTick.png";

const ChatDetails = (props) => {
  return (
    <div className="chatDetails-wrapper">
      <h2 className="chating_with">Suganya patel</h2>
      <div className="chat-section">
        <div className="chat_detail-body">
          <div className="today-date">Jan 12, 2022</div>
          <div className="chat_detail_received">
            {props.messages.map((message) => {
              return (
                <>
                  {message.sentBy == "Patient" && (
                    <div className="received_chat-msg-wrap">
                      <div className="received_chat-msg">
                        <div className="chat-msg-text">Heloo Hasib</div>
                        <div className="received_chat-time">10:18 PM</div>
                      </div>
                    </div>
                  )}
                  {message.sentBy == "Doctor" && (
                    <div className="sent_chat-msg-wrap">
                      <div className="sent_chat-msg">
                        <span className="chat-msg-text">Hello, Krysia!</span>
                        <div className="sent_chat-time-tick-wrap">
                          <span className="sent_chat-time">10:15 PM</span>
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
            {/* <div className="received_chat-first-msg-wrap">
            <span className="received_chat-userName">Hasib</span>
            <br></br>
            <span className="chat-msg-text">Hello, Krysia!</span>
          </div> */}
          </div>
        </div>
        <div className="send-msg-input-wrapper">
          <div className="send-msg-input">
            <input type="text" placeholder="Write you message here" />
          </div>
          <button className="send-msg-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
