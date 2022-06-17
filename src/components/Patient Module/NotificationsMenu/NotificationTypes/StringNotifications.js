import React from 'react'
import Avatar from 'react-avatar'
import rightIcon from '../../../../images/svg/right-icon.svg';


const StringNotifications = ({ notification, index }) => {
    return (

        <div key={index}>
            <div className="notif-section">
                <div className="profile-img col-md-3">
                    {notification.data.appointmentDetails?.doctor?.picture ? (
                        <img
                            alt="profile"
                            src={
                                notification.data.appointmentDetails?.doctor.picture
                            }
                            style={{
                                height: 40,
                                width: 40,
                                borderRadius: '50%',
                            }}
                        />
                    ) : (
                        <Avatar
                            round={true}
                            name={
                                notification.data.appointmentDetails?.doctor +
                                ' ' +
                                (notification.data.appointmentDetails?.doctor || '')
                            }
                            size={60}
                            className="notifications-avatar"
                        />
                    )}
                </div>
                <div className="notif-section__message">
                    <div className="message-notif">
                        <span>{notification.data.message}</span>
                        {/* <span>TIME</span> */}
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