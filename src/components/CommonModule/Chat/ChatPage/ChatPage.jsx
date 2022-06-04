import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import ChatItems from './ChatItems';
import ChatDetails from './ChatDetails';
import './ChatPage.css';
import { APP_ID } from '../../../../util/configurations';
import useAgoraChat from '../ChatScreen/useAgoraChat';
import useAgoraVideo from '../ChatScreen/useAgoraVideo';
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router-dom';
import {
  generateRTMToken,
  handleAgoraAccessToken,
} from '../../../../service/agoratokenservice';
import {
  getInbox,
  getMessages,
  sendMessage,
} from '../../../../service/chatService';
import moment from 'moment';
import Meeting from '../../../video-call/pages/meeting';
import Notes from '../../../Doctor Module/NotesSection/Notes';

const ChatPage = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChatItem, setSelectedChatItem] = useState({});
  // const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const cookies = new Cookies();
  const location = useLocation();
  const [isAgoraLoggedIn, setAgoraLoggedIn] = useState(false);
  const [pIdState, setPIdState] = useState('');
  const [dIdState, setDIdState] = useState('');
  const [channelName, setChannelName] = useState('');
  const [agoraToken, setAgoraToken] = useState('');
  const endRef = useRef();

  const onConnectionChange = (e) => {
    console.log(e);
  };

  const onMessageChange = (e) => {
    console.log(e);
    // setMessages([...messages, getMessageObj(false, e[0].text)]);

    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let chatGroup = searchParams.get('chatgroup');

    if (chatGroup) {
      setPIdState(Number(chatGroup.split('_')[0].replace('P', '')));
      setDIdState(Number(chatGroup.split('_')[1].replace('D', '')));
    }

    getInboxDetails();
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
      getMessagesDetails();
    }
  }, [selectedChatItem]);

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

  const getInboxDetails = async () => {
    const result = await getInbox();
    setChatList(result.data.data);
    if (result.data.data.length) {
      setSelectedChatItem(result.data.data[0]);
    }
    console.log(result);
  };

  const getMessagesDetails = async () => {
    const result = await getMessages(selectedChatItem.id);
    if (result.data.data.length) {
      setMessages(result.data.data);
      if (endRef.current) {
        endRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  };

  const changeChatItem = (chatItem) => {
    setSelectedChatItem(chatItem);
  };

  const clearData = () => {
    setMessages([]);
    setMessage('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMsg = async () => {
    if (message) {
      try {
        const messageObj = getMessageObj(true, message);
        setMessages([...messages, messageObj]);

        await sendChannelMessage(message, channelName);
        if (endRef.current) {
          endRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          });
        }
        const messageData = {
          channelId: selectedChatItem.id,
          message: message,
        };
        await sendMessage(messageData);
        setMessage('');
      } catch (error) {}
    }
  };

  const messageDateFormat = (val) => {
    if (val) {
      const dateValue = new Date(val);
      return moment(dateValue).format('YYYYMMDD') ===
        moment().format('YYYYMMDD')
        ? moment(dateValue).format('HH:mm')
        : moment(dateValue).format('YYYY-MM-DD HH:mm');
    }
  };

  const onVideoClick = () => {
    getToken(pIdState, dIdState);
  };

  //NOTES CODE
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
            chat={chatList}
            selectedChatItem={selectedChatItem}
          />
        )}
        {openVideoCall && <Meeting onClose={() => setOpenVideoCall(false)} />}
      </div>
      <div className="chat-details-container">
        <ChatDetails
          messageDateFormat={messageDateFormat}
          selectedItem={selectedChatItem}
          messages={messages}
          messageState={message}
          onMessageChange={handleMessageChange}
          onSend={sendMsg}
          endRef={endRef}
          onVideoClick={onVideoClick}
          onNoteClick={handleNotesClick}
        />
        {notesClick && <Notes onClose={() => setNotesClick(false)} />}
      </div>
    </Container>
  );
};

export default ChatPage;

// Create a state here and a handle function for notes click
// Pass those as props to ChatDetails
// Notes Icon should be visible based on the state we have passed and role should be doctor
// On click of notes icon, trigger the handle function from props
// Handle function will update the notes state and set the notes icon to visible
// if notes state is true show notes component under ChatDetails component
