import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatDetailsStyle from "./ChatDetails.css";
import blueTick from "../../../../images/icons used/blueTick.png";
import greyTick from "../../../../images/icons used/greyTick.png";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import useRole from "../../../../custom-hooks/useRole";
import { ROLES } from "../../../../util/configurations";
import ChatIcon from "../../../../images/svg/notes-outline-icon.svg";
import { getCallUserApi } from "../../../../service/frontendapiservices";

const ChatDetails = ({
  selectedItem,
  messages,
  onMessageChange,
  onSend,
  messageState,
  endRef,
  onVideoClick,
  onNoteClick,
  loadMoreData
}) => {
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableChat, setEnableChat] = useState(false);
  const [roles] = useRole();

  useEffect(() => {
    if (selectedItem.id) {
      const currentTime = moment(new Date());
      const appointmentStartTime = moment(
        new Date(selectedItem.latestAppointment.startTime)
      );
      const appointmentEndTime = moment(
        new Date(selectedItem.latestAppointment.endTime)
      );
      const chatEnableTime = appointmentStartTime.clone().subtract(2, "days");
      const videoEnableTime = appointmentStartTime
        .clone()
        .subtract(5, "minutes");
      const chatEndCondition = appointmentEndTime.clone().add(3, "days");

      const chatCondition = currentTime.clone().subtract(2, "days");
      const videoCondition = currentTime.clone().subtract(5, "minuts");

      if (
        currentTime.isSameOrAfter(appointmentStartTime) &&
        currentTime.isBefore(appointmentEndTime)
      ) {
        setEnableVideo(true);
      }

      if (
        currentTime.isSameOrAfter(chatEnableTime) &&
        currentTime.isBefore(chatEndCondition)
      ) {
        console.log("CHAT ENABLED");
        setEnableChat(true);
      }
    }
  }, [selectedItem]);

  const handleVideo = () => {
    if (!enableVideo) return;
    
    if(roles.some((role) => role === ROLES.ROLE_DOCTOR)) {
      callUser();
    }

    onVideoClick();
  };

  const handleSend = () => {
    if (!enableChat) return;
    onSend();
  };

  const handleNoteToggle = () => {
    // if (!enableChat) return;
    onNoteClick();
  };

  const groupDateCalculation = (index) => {
    let currentMessageDate = messages[index];

    if (index === 0) {
      return true;
    }

    if (index !== messages.length - 1) {
      let prevMessageDate = messages[index - 1];
      return !moment(currentMessageDate.createdAt).isSame(
        moment(prevMessageDate.createdAt),
        "day"
      );
    }

    return false;
  };

  console.log({ selectedItem });



  let channelId = selectedItem.id;
  console.log({ channelId: channelId });


  //CALL-TOPIC CODE
  const callUser = async () => {
    // console.log({ selectedItem });
    // const channelId = selectedItem.id;
    console.log({ channelId });
    const response = await getCallUserApi(channelId).catch(err => console.log({ err }))
    console.log({ response })
  };

  // useEffect(() => {
  //   callUser();
  // }, [channelId]);

  return (
    <div className="chatDetails-wrapper">
      <h2 className="chating_with">
        {selectedItem[selectedItem.userKey] &&
          selectedItem[selectedItem.userKey]?.firstName +
          " " +
          selectedItem[selectedItem.userKey]?.lastName}
      </h2>
      <div className="chat-section">
        <div className="chat_detail-body">
          {/* <div className="today-date">Jan 12, 2022</div> */}
          <div onScroll={(e) => {
            if (e.target.scrollTop === 0) {
              loadMoreData()
            }
          }} className="chat_detail_received">
            {messages.map((message, index) => {
              return (
                <>
                  {groupDateCalculation(index) && (
                    <div className="date-divider">
                      {moment(message.createdAt).format("DD MMM yyyy")}
                    </div>
                  )}
                  <div className="container">
                    <div className="row">
                      {!message.myMessage && (
                        <div
                          key={message.id}
                          className="received_chat-msg-wrap my-2"
                        >
                          <div className="received_chat-msg">
                            <div className="chat-msg-text">{message.message}</div>
                            <div className="received_chat-time">
                              {moment(message.createdAt).format('HH:mm')}
                            </div>
                          </div>
                        </div>
                      )}
                      {message.myMessage && (
                        <div key={message.id} className="sent_chat-msg-wrap my-2">
                          <div className="sent_chat-msg">
                            <span className="chat-msg-text">
                              {message.message}
                            </span>
                            <div className="sent_chat-time-tick-wrap">
                              <span className="sent_chat-time">
                                {moment(message.createdAt).format('HH:mm')}
                              </span>
                              {/* <span className="sent_chat-seen">
                            <img src={blueTick} alt="" />
                          </span> */}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </>
              );
            })}
            <div style={{ float: "left", clear: "both" }} ref={endRef}></div>
          </div>
        </div>
        <div className="send-msg-input-wrapper">
          <div className="send-msg-input">
            <input
              value={messageState}
              onChange={onMessageChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              type="text"
              placeholder="Write you message here"
              disabled={!enableChat}
            />
          </div>
          {enableVideo && (
            <IconButton onClick={handleVideo}>
              <VideocamIcon id="active-video-icon" />
            </IconButton>
          )}
          {!enableVideo && (
            <IconButton id="inactive-video-button">
              <VideocamOffIcon id="inactive-video-icon" />
            </IconButton>
          )}
          <button
            onClick={handleSend}
            className="send-msg-btn"
            disabled={!enableChat}
          >
            Send
          </button>
          {roles.some((role) => role === ROLES.ROLE_DOCTOR) && (
            <button
              onClick={handleNoteToggle}
              className="notes-btn"
            // disabled={!enableChat}
            >
              <img src={ChatIcon} alt="chat-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
