import React, { useState, useEffect } from "react";  //useEffect, useState 
import { NavLink } from "react-router-dom"; //Link
import rightIcon from "../../images/svg/right-icon.svg";
// import { getFirebaseToken } from "../../util/firebaseCloudMessages";
import { getFirebaseToken, getPermissions } from "../../util";


const NotificationMenu = (props) => {
  const { unReadMessageList, detailsList, module } = props;
  const [tokenFound, setTokenFound] = useState(false);

  console.log({ tokenFound });

  useEffect(() => {
    let data;
    const tokenFunction = async () => {
      data = await getFirebaseToken(setTokenFound);
      if (data) {
        console.log({ data });
      }
      return data;
    }

    const getPermission = async () => {
      const permission = await getPermissions();
      if (permission === 'granted') {
        tokenFunction();
      }
    }
    getPermission()


  }, [])

  const totalUnreadMessage = () =>
    Object.values(unReadMessageList).length &&
    Object.values(unReadMessageList).reduce(
      (count, current) => count + current.length,
      0
    );

  const ProgressBar = (width, index) => {
    const color = [
      "bg-success text-white",
      "bg-info text-white",
      "bg-warning text-white",
      "bg-danger text-white",
      "bg-secondary text-white",
      "bg-dark text-white",
      "bg-light text-dark",
    ];

    return (
      <div
        className={`position-relative d-flex flex-row w-full text-center text-xs align-items-center h-1`}
      >
        <div
          style={{ width: `${width}%`, height: "4px" }}
          className={` ${color[index > 6 ? index % 6 : index]}`}
        ></div>
      </div>
    );
  };

  // messageHandle();

  return (
    <>
      <div className="dropdown-title" style={{ paddingLeft: "10px" }}>
        Notifications
      </div>
      <hr />
      <div className="d-flex flex-column">
        {/* {Object.keys(unReadMessageList).map((key, i) => (
          <NavLink
            to={`/${module}/chat?chatgroup=${key}`}
            className="d-flex flex-column p-2 text-dark align-items-stretch"
            key={i}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="text-sm font-weight-bold">
                {`${detailsList[key]?.firstName} ${detailsList[key]?.lastName}`}
                {unReadMessageList[key].new === "Booked" && (
                  <span className="badge ml-1 badge-success">New</span>
                )}
                {unReadMessageList[key].new === "Cancelled" && (
                  <span className="badge ml-1 badge-danger">Cancelled</span>
                )}
              </div>
              <div className="text-xs whitespace-nowrap">
                {unReadMessageList[key].length}
              </div>
            </div>
            {ProgressBar(
              parseInt(
                (unReadMessageList[key].length * 100) /
                totalUnreadMessage()
              ),
              i
            )}
          </NavLink>
        ))} */}
        {
          Object.keys(unReadMessageList).map((key, i) => (
            <NavLink
              to={`/${module}/chat?chatgroup=${key}`}
              className="d-flex flex-column text-dark"
              key={i}
            >
              <div className="notif-section">
                <div className='profile-img col-md-3'>
                  <img src={detailsList[key]?.picture} alt='profile' style={{
                    height: 40,
                    width: 40,
                    borderRadius: "50%"
                  }} />
                </div>
                <div className="notif-section__message">
                  <div className="message-notif">
                    <span>You have an appointment with {`${detailsList[key]?.firstName} ${detailsList[key]?.lastName}`}.</span>
                    <span>TIME</span>
                  </div>
                </div>
                <div className="notif-section__arrow">
                  <img
                    src={rightIcon}
                    alt="right-icon"
                    style={{ marginRight: "15px" }}
                    className='ml-2'
                  />
                </div>
              </div>
            </NavLink>
          ))
        }

      </div>
    </>
  );
};

export default NotificationMenu;
