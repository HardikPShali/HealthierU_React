import React from 'react';
import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom';
import rightIcon from '../../../../images/svg/right-icon.svg';
import moment from 'moment';
import {
    getUnreadNotificationsCount,
    putMarkAsReadFromNotificationMenu,
} from '../../../../service/frontendapiservices';

const RescheduleByDoctorNotification = ({ notification, key }) => {
    const setDoctorIdInSession = (doctorId) => {
        // console.log({ doctorId });
        sessionStorage.setItem('doctorId', doctorId);
    };

    //MARK AS READ NOTIFICATION LOGIC
    const markAsReadFromNotificationMenuHandler = async () => {
        const notificationId = notification.id;
        const userId = notification.userId;

        const data = {
            id: notificationId,
        };

        const response = await putMarkAsReadFromNotificationMenu(
            data,
            userId
        ).catch((err) => console.log({ err }));
        console.log({ markAsReadFromNotificationMenuHandler: response });

        if (response.data.status === true) {
            //   setBadgeCount(0);
            //   toast.success("Notification marked as read successfully");
            await getUnreadNotificationsCount(userId);
        }
    };

    return (
        <div
            onClick={() => {
                setDoctorIdInSession(notification.data.appointmentDetails.doctor.id);
                markAsReadFromNotificationMenuHandler();
            }}
        >
            <NavLink
                to={`/patient/rescheduleappointment/${notification.data.appointmentDetails.id
                    }/${notification.data.appointmentDetails.appointmentMode
                        .toLowerCase()
                        .replace(' ', '-')}/${notification.data.appointmentDetails.unifiedAppointment
                    }`}
                className="d-flex flex-column text-dark navlink-hover"
                key={key}
                style={{ marginLeft: 0, marginTop: -16, fontWeight: 400 }}
            >
                <div key={key}>
                    <div className="notif-section">
                        <div className="profile-img col-md-3">
                            {notification.data.appointmentDetails.doctor?.picture ? (
                                <img
                                    alt="profile"
                                    src={notification.data.appointmentDetails.doctor.picture}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: '50%',
                                    }}
                                />
                            ) : (
                                <Avatar
                                    round={true}
                                    name={notification.data.appointmentDetails.doctor?.firstName}
                                    size={60}
                                    className="notifications-avatar"
                                />
                            )}
                        </div>
                        <div className="notif-section__message">
                            <div className="message-notif">
                                <span>
                                    Dr. {notification.data.appointmentDetails.doctor?.firstName}{' '}
                                    has requested to reschedule the appointment booked for{' '}
                                    {moment(
                                        notification.data.appointmentDetails.startTime
                                    ).format('DD-MM-YYYY HH:mm')}{' '}
                                    . Click here to reschedule
                                </span>
                                <span style={{
                                    color: '#bfbfbf',
                                    fontSize: 11,
                                }}>{moment(notification.createdAt).format('HH:mm')}</span>
                            </div>
                        </div>
                        <div className="notif-section__arrow">
                            <img
                                src={rightIcon}
                                alt="right-icon"
                                style={{ marginRight: '15px' }}
                                className="ml-2"
                            />
                        </div>
                    </div>
                </div>
            </NavLink>
            <hr />
        </div>
    );
};

export default RescheduleByDoctorNotification;
