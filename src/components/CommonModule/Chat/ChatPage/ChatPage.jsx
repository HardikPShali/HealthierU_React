import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { Link, NavLink, useHistory } from "react-router-dom";
import ChatItems from "./ChatItems";
import ChatDetails from "./ChatDetails";
import "./ChatPage.css";
import { APP_ID, ROLES } from "../../../../util/configurations";
import useAgoraChat from "../ChatScreen/useAgoraChat";
import useAgoraVideo from "../ChatScreen/useAgoraVideo";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import {
  generateRTMToken,
  handleAgoraAccessToken,
} from "../../../../service/agoratokenservice";
import {
  getInbox,
  getMessages,
  sendMessage,
} from "../../../../service/chatService";
import moment from "moment";
import Meeting from "../../../video-call/pages/meeting";
import Notes from "../../../Doctor Module/NotesSection/Notes";
import {
  chatValidation,
  isVideoGoingToEnd,
  videoValiation,
} from "../../../../util/chatAndCallValidations";
import useRole from "../../../../custom-hooks/useRole";
import {
  callRejectApi,
  getCallUserApi,
} from "../../../../service/frontendapiservices";
import { toast } from "react-toastify";
import $ from "jquery";

const ChatPage = () => {
  const history = useHistory();
  const [chatList, setChatList] = useState([]);
  const [filteredChatList, setFilteredChatList] = useState(chatList);
  const [selectedChatItem, setSelectedChatItem] = useState({});
  // const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const cookies = new Cookies();
  const location = useLocation();
  const [isAgoraLoggedIn, setAgoraLoggedIn] = useState(false);
  const [pIdState, setPIdState] = useState("");
  const [dIdState, setDIdState] = useState("");
  const [enableVideo, setEnableVideo] = useState(false);
  const [enableChat, setEnableChat] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [agoraToken, setAgoraToken] = useState("");
  const [paginationConfig, setPaginationConfig] = useState({
    pageNo: 0,
    totalItems: 1,
    totalPages: 1,
  });
  const [videoCallEnding, setVideoCallEnding] = useState(false)

  const [roles] = useRole();

  const endRef = useRef();

  let intervalId = null;

  const onConnectionChange = (e) => {
    console.log(e);
  };

  const onMessageChange = (e) => {
    console.log(e);
    // setMessages([...messages, getMessageObj(false, e[0].text)]);
    reorderChatBoxOnMessageChange(e);
    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  const {
    login,
    logout,
    joinChannel,
    leaveChannel,
    sendChannelMessage,
    sendPeerMessage,
    messages,
    setMessages,
    getMessageObj,
  } = useAgoraChat(APP_ID, onMessageChange, onMessageChange);

  const [openVideoCall, setOpenVideoCall, getToken] = useAgoraVideo();

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    let chatGroup = searchParams.get("chatgroup");
    let queryChannelId = searchParams.get("channelId");

    if (chatGroup) {
      setPIdState(Number(chatGroup.split("_")[0].replace("P", "")));
      setDIdState(Number(chatGroup.split("_")[1].replace("D", "")));
    }

    getInboxDetails(queryChannelId);
  }, []);

  useEffect(() => {
    if (pIdState && dIdState) {
      agoraTrigger();
    }
  }, [pIdState, dIdState]);

  useEffect(() => {
    if (
      selectedChatItem.patientInfo &&
      selectedChatItem.patientInfo.id &&
      selectedChatItem.doctorInfo.id
    ) {
      clearData();
      setPIdState(Number(selectedChatItem.patientInfo.id));
      setDIdState(Number(selectedChatItem.doctorInfo.id));
      setPaginationConfig({
        pageNo: 0,
        totalItems: 1,
        totalPages: 1,
      });
      getMessagesDetails(0);
      chatAndCallAvailabilityCheck();

      if (searchParams.get("openVideo") === "true") {
        const isVideoEnabled = videoValiation(selectedChatItem.appointments);
        if (!isVideoEnabled) {
          removeQueryParamsAndDisableVideo();
          return;
        }

        if (roles.some((role) => role === ROLES.ROLE_DOCTOR)) {
          callUser(selectedChatItem.id);
        }

        getToken(
          Number(selectedChatItem.patientInfo.id),
          Number(selectedChatItem.doctorInfo.id)
        );
      }
    }

    return () => {
      if (intervalId != null) {
        clearInterval(intervalId);
      }
    };
  }, [selectedChatItem]);

  const chatAndCallAvailabilityCheck = () => {
    if (selectedChatItem.id) {
      if (selectedChatItem.appointments.length) {
        const isVideoEnabled = videoValiation(selectedChatItem.appointments);
        setEnableVideo(isVideoEnabled);

        const isChatEnabled = chatValidation(selectedChatItem.appointments);
        setEnableChat(isChatEnabled);

        startPeriodicValidationCheck();
      } else {
        hideChatAndVideo();
      }
    } else {
      hideChatAndVideo();
    }
  };

  const startPeriodicValidationCheck = () => {
    intervalId = setInterval(() => {
      const isVideoEnabled = videoValiation(selectedChatItem.appointments);
      console.log("VIDEO VALIDATION CHECK PERIODICALLY");
      setEnableVideo(isVideoEnabled);

      const isVideoEnding = isVideoGoingToEnd(selectedChatItem.appointments);
      setVideoCallEnding(isVideoEnding)
    

    }, 30000);
  };

  useEffect(() => {
    let timeout = null;
    if(videoCallEnding && openVideoCall) {
      toast.warn("Video call will end in 5 minutes", {
        autoClose: false,
        position: "top-right",
      });

      // if(!timeout) {
      //   timeout = setTimeout(() => {
      //     setVideoCallEnding(false);
      //     removeQueryParamsAndDisableVideo();
      //   }, 30000)
      // }
    }


  }, [enableVideo, videoCallEnding, openVideoCall])

  const hideChatAndVideo = () => {
    setEnableChat(false);
    setEnableVideo(false);
  };

  //CALL-TOPIC CODE
  const callUser = async (channelId) => {
    
    const response = await getCallUserApi(channelId).catch((err) =>
      console.log({ err })
    );
  };

  const removeQueryParamsAndDisableVideo = () => {
    searchParams.delete("openVideo");
    searchParams.delete("channelId");
    setOpenVideoCall(false);
    setVideoCallEnding(false);
    history.replace({
      search: searchParams.toString(),
    });

    
  };

  const agoraTrigger = async () => {
    try {
      const tokenResponse = await generateRTMToken(pIdState, dIdState);
      setChannelName(tokenResponse.data.data.channelName);
      setAgoraToken(tokenResponse.data.data.token);
      await login(
        tokenResponse.data.data.userName,
        tokenResponse.data.data.token
      );
      setAgoraLoggedIn(true);
      joinChannel(tokenResponse.data.data.channelName);
    } catch (error) {
      console.log(error);
    }
  };

  const getInboxDetails = async (channelId = null) => {
    const result = await getInbox();
    setChatList(result.data.data);
    setFilteredChatList(result.data.data);
    if (result.data.data.length) {
      if (!channelId) {
        setSelectedChatItem(result.data.data[0]);
      } else {
        const selectedChannel = result.data.data.find((c) => {
          return c.id == channelId;
        });
        setSelectedChatItem(selectedChannel);
      }
      // setSelectedChatItem(result.data.data[0]);
    }
    console.log(result);
  };

  const getMessagesDetails = async (pageNo) => {
    const result = await getMessages(selectedChatItem.id, pageNo, 20);
    if (result.data.data.messages.length) {
      setPaginationConfig({
        pageNo: pageNo,
        totalItems: result.data.data.totalItems,
        totalPages: result.data.data.totalPages,
      });
      const reversedMessages = result.data.data.messages.reverse();
      if (pageNo === 0) {
        setMessages(reversedMessages);
      } else {
        setMessages([...reversedMessages, ...messages]);
      }

      if (endRef.current && pageNo === 0) {
        endRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  };

  const changeChatItem = (chatItem) => {
    setSelectedChatItem(chatItem);
    removeQueryParamsAndDisableVideo();
  };

  const clearData = () => {
    setMessages([]);
    setMessage("");
    setVideoCallEnding(false);
    setOpenVideoCall(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMsg = async () => {
    if (message && message.trim()) {
      try {
        const msg = message;
        setMessage("");
        const messageObj = getMessageObj(true, msg);
        setMessages([...messages, messageObj]);
        reorderChatBoxOnMessageChange(messageObj);

        await sendChannelMessage(msg, channelName);
        if (endRef.current) {
          endRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
        const messageData = {
          channelId: selectedChatItem.id,
          message: msg,
        };
        await sendMessage(messageData);
      } catch (error) {}
    }
  };

  const messageDateFormat = (val) => {
    if (val) {
      const dateValue = new Date(val);
      return moment(dateValue).format("YYYYMMDD") ===
        moment().format("YYYYMMDD")
        ? moment(dateValue).format("HH:mm")
        : moment(dateValue).format("YYYY-MM-DD HH:mm");
    }
  };

  const onVideoClick = () => {
    if (roles.some((role) => role === ROLES.ROLE_DOCTOR)) {
      callUser(selectedChatItem.id);
    }
    getToken(pIdState, dIdState);
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      const searchedText = e.target.value.toLowerCase();
      const filteredChatList = chatList.filter((item) => {
        const person = item[item.userKey];

        return (
          person.firstName?.toLowerCase()?.includes(searchedText) ||
          person.lastName?.toLowerCase()?.includes(searchedText)
        );
      });

      setFilteredChatList(filteredChatList);
    } else {
      setFilteredChatList(chatList);
    }
  };

  const reorderChatBoxOnMessageChange = (msgObj) => {
    selectedChatItem.lastMessage = msgObj;

    const selectedChatIndex = chatList.findIndex(
      (item) => item.id === selectedChatItem.id
    );
    chatList.splice(selectedChatIndex, 1);
    chatList.unshift(selectedChatItem);
    setChatList(chatList);
    setFilteredChatList(chatList);
  };

  const loadMoreData = () => {
    if (paginationConfig.pageNo < paginationConfig.totalPages) {
      // setPaginationConfig({...paginationConfig, pageNo: paginationConfig.pageNo + 1})
      const pageNumber = paginationConfig.pageNo + 1;
      getMessagesDetails(pageNumber);
    }
  };

  const callRejectHandler = async (channelId, message = "call-reject") => {
    const rejectCallApiResponse = await callRejectApi(channelId, message).catch((err) =>
      console.log({ err })
    );
  };

  //NOTES CODE
  const [notes, setNotes] = useState({
    chiefComplaint: "",
    presentIllness: "",
    vitalSigns: "",
    physicalExam: "",
    planAssessment: "",
  });
  const [notesClick, setNotesClick] = useState(false);

  const handleNotesClick = (e) => {
    setNotesClick(!notesClick);
  };

  return (
    <Container className="chatPage-wrapper">
      <div className="chat-item-container">
        {!openVideoCall && (
          <ChatItems
            messageDateFormat={messageDateFormat}
            onChatChange={changeChatItem}
            chat={filteredChatList}
            selectedChatItem={selectedChatItem}
            onSearch={handleSearch}
          />
        )}
        {openVideoCall && (
          <Meeting
            onClose={() => {
              callRejectHandler(selectedChatItem.id, "call-end");
              removeQueryParamsAndDisableVideo();
            }}
          />
        )}
      </div>
      <div className="chat-details-container">
        <ChatDetails
          selectedItem={selectedChatItem}
          messages={messages}
          messageState={message}
          onMessageChange={handleMessageChange}
          onSend={sendMsg}
          endRef={endRef}
          onVideoClick={onVideoClick}
          onNoteClick={handleNotesClick}
          loadMoreData={loadMoreData}
          enableChat={enableChat}
          enableVideo={enableVideo}
          totalItems={paginationConfig.totalItems}
        />
        {notesClick && (
          <Notes
            onClose={() => setNotesClick(false)}
            selectedChatNote={selectedChatItem}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </div>
    </Container>
  );
};

export default ChatPage;
