import React from "react";
import { toast } from "react-toastify";


export const ToastNotification = (props) => {
  const { message } = props;
  return (
    <>
      <strong>Notification</strong>
      <p className="medium">{message}</p>
    </>
  );
}


export const AppointmentStatusToastify = (message, AppointmentStatus) => {
  const toastOptions = {
    delay: 0,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
    pauseOnHover: true,
    closeOnClick: true,
    newestOnTop: true,
    draggable: true,
    autoClose: "3000",
    className: "NotificationToast",
    showEasing: "swing",
    showMethod: "fadeIn",
    showDuration: "3000",
  };
  AppointmentStatus === "booked"
    ? toast(<ToastNotification message={message} />, toastOptions)
    : toast.dark(<ToastNotification message={message} />, toastOptions);
};
