import React from 'react';
import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom';
import rightIcon from '../../../../images/svg/right-icon.svg';
import moment from 'moment'

const RescheduleNotification = ({ notification, key }) => {
    // console.log("notification", notification)
    return (
        <div>

            <NavLink
                to={`patient/rescheduleappointment/${notification.data.appointmentDetails.id}/${notification.data.appointmentDetails.appointmentMode.toLowerCase().replace(" ", "-")}/${notification.data.appointmentDetails.unifiedAppointment}`}
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
                                    ).format('DD-MM-YYYY hh:mm')}{' '}. Click here to reschedule
                                </span>
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

                </div>

            </NavLink>
            <hr />
        </div>
    );
};

export default RescheduleNotification;
