import React from 'react'
import Avatar from 'react-avatar'
import rightIcon from '../../../../images/svg/right-icon.svg';
import { getUnreadNotificationsCount, putMarkAsReadFromNotificationMenu } from '../../../../service/frontendapiservices';
import moment from 'moment';


const StringNotifications = ({ notification, index }) => {

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

        <div key={index} onClick={() => markAsReadFromNotificationMenuHandler()}>
            <div className="notif-section">
                <div className="profile-img col-md-3">
                    {notification.data.appointmentDetails?.doctor?.picture ? (
                        <img
                            alt="profile"
                            src={
                                notification.data.appointmentDetails?.doctor.picture
                            }
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: '50%',
                            }}
                        />
                    ) : (
                        <Avatar
                            round={true}
                            name={
                                notification.data.appointmentDetails?.doctor.firstName
                            }
                            size={60}
                            className="notifications-avatar"
                        />
                    )}
                </div>
                <div className="notif-section__message">
                    <div className="message-notif">
                        <span>{notification.data.message}</span>
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
            <hr />
        </div>

    )
}

export default StringNotifications