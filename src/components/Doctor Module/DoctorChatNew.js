import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom"; //useRouteMatch, useParams, useHistory,
import { Col, Container, Row } from 'react-bootstrap';
import "./doctor-chat.css";
import default_image from "../../images/default_image.png";
import { formatDate } from "../questionnaire/QuestionnaireService";
import { Button } from "react-bootstrap";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import IconButton from "@material-ui/core/IconButton";
import NoRecord from "./../CommonModule/noRecordTemplate/noRecord";
import { handleAgoraAccessToken } from "../../service/agoratokenservice";
import SmallLoader from "../Loader/smallLoader";
import Meeting from "../video-call/pages/meeting";

import moment from "moment";
import ChatRow from "../CommonModule/Chat/ChatRow/ChatRow";
import ChatMessage from "../CommonModule/Chat/ChatMessage/ChatMessage";
import notesIcon from '../../images/svg/notes-outline-icon.svg';
import backIcon from '../../images/svg/arrow-left.svg';
import { uploadNote } from "../../service/frontendapiservices";
import ChatScreen from "../CommonModule/Chat/ChatScreen/ChatScreen";


const DoctorChat = (props) => {
   // NOTES CODE

  return (
    <div className="bg-main-color">
      <ChatScreen />
      {/* <div className="main-section mt-5">
        <div className="head-section">
          <div className="headLeft-section">
            {!openVideoCall && (
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search..."
                onChange={(e) => setFilterText(e.target.value)}
              />
            )}
          </div>
          <div className="headRight-section">
            <div className="headRight-sub">
              <h4>{currentDoctorFullName}</h4>
            </div>
          </div>
        </div>
        <div className="body-section justify-content-between d-inline-flex">
          {openVideoCall ? (
            <Meeting onClose={() => setOpenVideoCall(false)} />
          ) : (
            <div
              className="left-section mCustomScrollbar bg-white"
              data-mcs-theme="minimal-dark"
              id="chat-room-list"
            >
              <ul>
                {memoizedChatGroupToShow ? (
                  memoizedChatGroupToShow.map((currentGroup) => {
                    return (
                      <ChatRow
                        key={currentGroup}
                        uniqueId={currentGroup}
                        onClick={(e) => openConversation(currentGroup)}
                        isSelected={currentGroup === currentSelectedGroup}
                        details={patientDetailsList[currentGroup]}
                        message={chatGroupList[currentGroup].lastMessageContent}
                        time={chatGroupList[currentGroup].lastMessageTimeStamp}
                        unReadCount={
                          unReadMessageList &&
                          unReadMessageList[currentGroup] &&
                          unReadMessageList[currentGroup].length
                        }
                      />
                    );
                  })
                ) : addedNewChatGroupListTrigger ? (
                  <NoRecord linkUrl="/doctor/appointment" />
                ) : (
                  <SmallLoader />
                )}
              </ul>
            </div>
          )}
          <div className="right-section">
            {!chatMessages.length && <SmallLoader />}
            {toggleNotes.notesArea === false && (
              <div
                className="message mCustomScrollbar bg-white"
                data-mcs-theme="minimal-dark"
                id="chat-list"
              >
                <ul>
                  {chatMessages.map((current) => {
                    return (
                      <ChatMessage
                        key={current.firebaseTimeStamp.toMillis()}
                        isMyMessage={current.fromUser === currentDoctor.email}
                        image={
                          current.fromUser === currentDoctor.email
                            ? currentDoctor.picture
                            : patientDetailsList[currentSelectedGroup]?.picture
                        }
                        message={
                          current.AppointmentStatus === "Booked" ||
                            current.AppointmentStatus === "Cancelled"
                            ? current.message +
                            " at Date/Time " +
                            moment(
                              new Date(current.firebaseTimeStamp.toMillis())
                            ).format("M/DD/YYYY h:mm a")
                            : current.message
                        }
                        isRead={current.isRead}
                        time={formatDate(current.firebaseTimeStamp.toMillis())}
                      />
                    );

                    // <li
                    //   className="msg-right"
                    //   key={current.firebaseTimeStamp.toMillis()}
                    // >
                    //   <div
                    //     className={`msg-left-sub ${
                    //       current.isRead ? "blue" : "brown"
                    //     }`}
                    //   >
                    //     {current.AppointmentStatus === "Booked" ||
                    //     current.AppointmentStatus === "Cancelled" ? (
                    //       <span></span>
                    //     ) : (
                    //       <img
                    //         src={currentDoctor.picture || default_image}
                    //         alt=""
                    //         className={current.isRead ? "blue" : "brown"}
                    //       />
                    //     )}

                    //     <div
                    //       className={
                    //         current.AppointmentStatus === "Booked"
                    //           ? "appointment-msg-desc"
                    //           : current.AppointmentStatus === "Cancelled"
                    //           ? "appointment-cancelled-msg-desc"
                    //           : "msg-desc"
                    //       }
                    //     >
                    //       {current.AppointmentStatus === "Booked" ||
                    //       current.AppointmentStatus === "Cancelled"
                    //         ? current.message +
                    //           " at Date/Time " +
                    //           moment(
                    //             new Date(current.firebaseTimeStamp.toMillis())
                    //           ).format("M/DD/YYYY h:mm a")
                    //         : current.message}
                    //     </div>
                    //     <small>
                    //       {formatDate(current.firebaseTimeStamp.toMillis())}
                    //     </small>
                    //   </div>
                    // </li>
                    // ) : (
                    // <li
                    //   className="msg-left"
                    //   key={current.firebaseTimeStamp?.toMillis()}
                    // >
                    //   <div className="msg-left-sub">
                    //     <img
                    //       src={
                    //         patientDetailsList[currentSelectedGroup]?.picture ||
                    //         default_image
                    //       }
                    //       alt=""
                    //     />
                    //     <div className="msg-desc">
                    //       {current.AppointmentStatus === "Booked" ||
                    //       current.AppointmentStatus === "Cancelled"
                    //         ? current.message +
                    //           " at Date/Time " +
                    //           moment(
                    //             new Date(current.firebaseTimeStamp.toMillis())
                    //           ).format("M/DD/YYYY h:mm a")
                    //         : current.message}
                    //     </div>
                    //     <small>
                    //       {formatDate(current.firebaseTimeStamp?.toMillis())}
                    //     </small>
                    //   </div>
                    // </li>
                    // );
                  })}
                </ul>
              </div>
            )}
            {toggleNotes.notesArea === true && (
              <div className="notes-section">
                <Container>
                  <Row>
                    <Col md={2}></Col>
                    <Col md={8} className='notes-column'>
                      <Button
                        variant="primary"
                        onClick={() => setToggleNotes({ ...toggleNotes, notesArea: false })}
                        style={{ borderRadius: '48%', marginBottom: '5px' }}
                      >
                        <img src={backIcon} alt='icon' />
                      </Button>

                      <form onSubmit={(e) => sendNotesDetails(e)}>
                        <div className="form-group">
                          <label htmlFor="chief-complaint">Chief Complaint</label>
                          <textarea
                            className="form-control"
                            id="chief-complaint"
                            rows="1"
                            name='chiefComplaint'
                            value={chiefComplaint}
                            onChange={(e) => handleInputChange(e)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="present-illness">Present Illness</label>
                          <textarea
                            className="form-control"
                            id="present-illness"
                            rows="3"
                            name='presentIllness'
                            value={presentIllness}
                            onChange={(e) => handleInputChange(e)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="vital-signs">Vital Signs</label>
                          <textarea
                            className="form-control"
                            id="vital-signs"
                            rows="2"
                            name='vitalSigns'
                            value={vitalSigns}
                            onChange={(e) => handleInputChange(e)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="physical-exam">Physical Exam</label>
                          <textarea
                            className="form-control"
                            id="physical-exam"
                            rows="2"
                            name='physicalExam'
                            value={physicalExam}
                            onChange={(e) => handleInputChange(e)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="plan-assessment">Plan/Assessment</label>
                          <textarea
                            className="form-control"
                            id="plan-assessment"
                            rows="3"
                            name='planAssessment'
                            value={planAssessment}
                            onChange={(e) => handleInputChange(e)}
                          ></textarea>
                        </div>
                        <input
                          className="btn btn-primary sign-btn"
                          type="submit"
                          value="ADD NOTE"
                        />
                      </form>
                    </Col>
                  </Row>

                </Container>
              </div>
            )}

            {toggleNotes.notesArea === false && (
              <div
                hidden={"appointmentStatus" === "Cancelled"}
                className={chatButton ? "row" : "row disabled-div-chat"}
              >

                <div className="col-sm-7">
                  <input
                    type="text"
                    ref={tempMessage}
                    className="form-control ml-5"
                    name="textMessage"
                    id="textMessage"
                    placeholder="Type here..."
                    onKeyDown={(e) => handleKeypress(e)}
                    disabled={!chatButton}
                  />
                </div>
                <div className="col-sm-1 video-button">
                  {videoButton && !openVideoCall && (
                    <IconButton
                      onClick={() => {
                        handleAgoraAccessToken(pIdState, dIdState, () =>
                          setOpenVideoCall(true)
                        );
                      }}
                    >
                      <VideocamIcon id="active-video-icon" />
                    </IconButton>
                  )}
                  {!videoButton && (
                    <IconButton id="inactive-video-button">
                      <VideocamOffIcon id="inactive-video-icon" />
                    </IconButton>
                  )}
                </div>
                <div className="col-sm-2">
                  <Button
                    variant="primary"
                    onClick={(e) => sendMessage(e)}
                    style={{ width: "90%" }}
                  >
                    Send
                  </Button>
                </div>
                <div className="col-sm-2">
                  <Button
                    variant="primary"
                    onClick={() => setToggleNotes({ ...toggleNotes, notesArea: true })}
                    style={{ borderRadius: '48%', marginTop: '-4px', marginLeft: '10px' }}
                  >
                    <img src={notesIcon} alt='icon' />
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div> */}
    </div >
  );
};

export default DoctorChat;
