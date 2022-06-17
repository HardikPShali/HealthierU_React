import React from 'react'
import Avatar from 'react-avatar'
import { NavLink } from 'react-router-dom'
import rightIcon from '../../../../images/svg/right-icon.svg';

const RescheduleNotification = ({ notification, key }) => {
    return (
        <div>
            <NavLink
                to={`patient/rescheduleappointment/${notification.data.appointmentDetails.id}/${notification.data.appointmentDetails.appointmentMode}`}
                className="d-flex flex-column text-dark"
                key={key}
                style={{ marginLeft: 0 }}
            >
                <div key={key}>
                    <div className="notif-section">
                        <div className="profile-img col-md-3">
                            {notification.data.appointmentDetails.doctor?.picture ? (
                                <img
                                    alt="profile"
                                    src={
                                        notification.data.appointmentDetails.doctor.picture
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
                                        notification.data.appointmentDetails.doctor +
                                        ' ' +
                                        (notification.data.appointmentDetails.doctor || '')
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
            </NavLink>

        </div>
    )
}

export default RescheduleNotification