import React from "react";
import default_image from "../../../../images/default_image.png";
import "./ChatRow.css";

const ChatRow = ({
  uniqueId,
  details,
  message,
  time,
  unReadCount,
  isSelected = false,
  onClick,
}) => {
  return (
    <li
      id={uniqueId}
      onClick={(e) => onClick()}
      className={isSelected ? "chat-row chat-row-active border-bottom" : "chat-row border-bottom"}
    >
      <div className="chat-profile-pic">
        <i className="fa fa-circle"></i>
        <img src={details?.picture || default_image} alt="" />
      </div>
      <div className="desc">
        <div className="chat-name">
          {`${details?.firstName} ${details?.lastName || ""}`}

          <span className="chat-unread-message">
            {unReadCount > 0 && (
              <span className="badge badge-success ml-2">{unReadCount}</span>
            )}
          </span>
        </div>

        <div className="chat-time">{time}</div>

        <div className="chat-message">{message}</div>
      </div>
    </li>
  );
};

export default ChatRow;
