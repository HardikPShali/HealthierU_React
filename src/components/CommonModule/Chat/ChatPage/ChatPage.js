import React from "react";
import {Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ChatItems from './ChatItems';
import ChatDetails from './ChatDetails';
import ChatPageStyle from './ChatPage.css';


const ChatPage = () => {
  const chatList = [
    {
      lastMessage: {
        message: "See you there.",
      },
      time: "11.20 PM",
      patient: {
        picture: "url",
        firstName: "MC ",
        lastName: "Malina",
      },
      doctor: {
        picture: "url",
        firstName: "Curt",
        lastName: "Bastek",
      },
      id: "1",
    },
    {
      lastMessage: {
        message: "are you there?",
      },
      time: "11.20 PM",
      patient: {
        picture: "url",
        firstName: "Ram",
        lastName: "Mohan",
      },
      doctor: {
        picture: "url",
        firstName: "sham",
        lastName: "guru",
      },
      id: "1",
    },
    {
      lastMessage: {
        message: "WHat happend",
      },
      time: "11.20 PM",
      patient: {
        picture: "url",
        firstName: "shanker",
        lastName: "raman",
      },
      doctor: {
        picture: "url",
        firstName: "Shek",
        lastName: "Mohamad",
      },
      id: "1",
    },
    {
      lastMessage: {
        message: "Ok byee",
      },
      time: "11.20 PM",
      patient: {
        picture: "url",
        firstName: "Krysia ",
        lastName: "Eurydy",
      },
      doctor: {
        picture: "url",
        firstName: "Andrew",
        lastName: "Parker",
      },
      id: "1",
    },
    {
      lastMessage: {
        message: "hey come tomorw",
      },
      time: "11.20 PM",
      patient: {
        picture: "url",
        firstName: "Odeuz",
        lastName: "Piotro",
      },
      doctor: {
        picture: "url",
        firstName: "Karen",
        lastName: "Castillo",
      },
      id: "1",
    },
  ];

  const messages = [
    {
      message: "see yaaa!",
      id: "2",
      time: "11.20 PM",
      parentMessage: "",
      sentBy: "Doctor",
    },
    {
      message: "remind me tomorrow",
      id: "2",
      time: "11.23 PM",
      parentMessage: "",
      sentBy: "Patient",
    },
  ];

  return (
    <Container className="chatPage-wrapper">
      <div className="chat-item-container">
        <ChatItems chat={chatList} />
      </div>
      <div className="chat-details-container">
        <ChatDetails chat={chatList} messages={messages} />
      </div>
    </Container>
  );
};

export default ChatPage;
