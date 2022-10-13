import React, { Fragment, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import {
  chatValidation,
  videoValiation,
} from "../../../../util/chatAndCallValidations";

const ChatDetails = ({
  selectedItem,
  messages,
  onMessageChange,
  onSend,
  messageState,
  endRef,
  onVideoClick,
  onNoteClick,
  loadMoreData,
  enableChat,
  enableVideo
}) => {
  // const [enableVideo, setEnableVideo] = useState(false);
  // const [enableChat, setEnableChat] = useState(false);
  const [roles] = useRole();
  let intervalId = null;

  const getAppointmentTime = (appointment) => {
    const currentTime = moment(new Date());
    const appointmentStartTime = moment(new Date(appointment.startTime));
    const appointmentEndTime = moment(
      new Date(selectedItem.latestAppointment.endTime)
    );

    return { currentTime, appointmentStartTime, appointmentEndTime };
  };

  const videoEnableCheck = (appointment) => {
    const {
      currentTime,
      appointmentStartTime,
      appointmentEndTime,
    } = getAppointmentTime(appointment);

    const videoEnableTime = appointmentStartTime.clone().subtract(5, "minutes");

    if (
      currentTime.isSameOrAfter(videoEnableTime) &&
      currentTime.isBefore(appointmentEndTime)
    ) {
      return true;
    }

    return false;
  };

  const chatEnableCheck = (appointment) => {
    const {
      currentTime,
      appointmentStartTime,
      appointmentEndTime,
    } = getAppointmentTime(appointment);

    const chatEnableTime = appointmentStartTime.clone().subtract(2, "days");

    const chatEndCondition = appointmentEndTime.clone().add(3, "days");

    if (
      currentTime.isSameOrAfter(chatEnableTime) &&
      currentTime.isBefore(chatEndCondition)
    ) {
      return true;
    }

    return false;
  };

  // const hideChatAndVideo = () => {
  //   setEnableChat(false);
  //   setEnableVideo(false);
  // };

  // useEffect(() => {
  //   if (intervalId != null) {
  //     clearInterval(intervalId);
  //   }

  //   if (selectedItem.id) {
  //     if (selectedItem.appointments.length) {

  //       const isVideoEnabled = videoValiation(selectedItem.appointments);
  //       setEnableVideo(isVideoEnabled);

  //       const isChatEnabled = chatValidation(selectedItem.appointments);
  //       setEnableChat(isChatEnabled);

  //       startPeriodicValidationCheck();
  //     } else {
  //       hideChatAndVideo();
  //     }
  //   } else {
  //     hideChatAndVideo();
  //   }
  // }, [selectedItem]);

  // const startPeriodicValidationCheck = () => {
  //   intervalId = setInterval(() => {
  //     const isVideoEnabled = videoValiation(selectedItem.appointments);
  //     setEnableVideo(isVideoEnabled);
  //   }, 60000);
  // };

  const handleVideo = () => {
    if (!enableVideo) return;
    onVideoClick();
  };

  const checkIfEmailInString = (text) => {
    const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  };

  const checkIfPhoneInString = (text) => {
    const re = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{6,15}\b/m;
    return re.test(text);
  };

  const handleSend = () => {
    if (!enableChat) return;

    // Email & ph. no. check in the message
    const emailCheck = checkIfEmailInString(messageState);
    const phoneCheck = checkIfPhoneInString(messageState);

    if (emailCheck === true || phoneCheck === true) {
      toast.error("Oops, you can't send a phone number or email address here");
      return;
    } else {
      onSend();
    }
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

  // console.log({ selectedItem });

  let channelId = selectedItem.id;
  // console.log({ channelId: channelId });

  // useEffect(() => {
  //   callUser();
  // }, [channelId]);

  return (
    <div className="chatDetails-wrapper">
      <h2 className="chating_with">
        {selectedItem[selectedItem.userKey] &&
          selectedItem[selectedItem.userKey]?.firstName +
          " " +
          (selectedItem[selectedItem.userKey]?.lastName || "")}
      </h2>
      <div className="chat-section">
        <div className="chat_detail-body">
          {/* <div className="today-date">Jan 12, 2022</div> */}
          <div
            onScroll={(e) => {
              if (e.target.scrollTop === 0) {
                loadMoreData();
              }
            }}
            className="chat_detail_received"
          >
            {messages.map((message, index) => {
              return (
                <Fragment key={message.id}>
                  {groupDateCalculation(index) && (
                    <div className="date-divider">
                      {moment(message.createdAt).format("DD MMM yyyy")}
                    </div>
                  )}
                  <div className="container">
                    <div className="row">
                      {!message.myMessage && (
                        <div

                          className="received_chat-msg-wrap my-2"
                        >
                          <div className="received_chat-msg">
                            <div className="chat-msg-text">
                              {message.message}
                            </div>
                            <div className="received_chat-time">
                              {moment(message.createdAt).format("HH:mm")}
                            </div>
                          </div>
                        </div>
                      )}
                      {message.myMessage && (
                        <div

                          className="sent_chat-msg-wrap my-2"
                        >
                          <div className="sent_chat-msg">
                            <span className="chat-msg-text">
                              {message.message}
                            </span>
                            <div className="sent_chat-time-tick-wrap">
                              <span className="sent_chat-time">
                                {moment(message.createdAt).format("HH:mm")}
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
                </Fragment>
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
              placeholder="Write your message here"
              disabled={!enableChat}
            />
          </div>
          {enableVideo && roles.some((role) => role === ROLES.ROLE_DOCTOR) && (
            <IconButton onClick={handleVideo}>
              <VideocamIcon id="active-video-icon" />
            </IconButton>
          )}
          {!enableVideo && roles.some((role) => role === ROLES.ROLE_DOCTOR) && (
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
          {enableVideo && roles.some((role) => role === ROLES.ROLE_DOCTOR) && (
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
