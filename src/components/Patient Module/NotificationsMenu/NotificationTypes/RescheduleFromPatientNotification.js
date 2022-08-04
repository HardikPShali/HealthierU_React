import React from 'react';
import Avatar from 'react-avatar';
import rightIcon from '../../../../images/svg/right-icon.svg';
import moment from 'moment';

const RescheduleFromPatientNotification = ({ notification, key }) => {
    return (
        <div>
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

                                Appointment is rescheduled on{' '}
                                {moment(notification.data.appointmentDetails.startTimeAsString).format(
                                    'DD-MM-YYYY HH:mm'
                                )}{' '}
                            </span>
                            <span style={{
                                color: '#bfbfbf',
                                fontSize: 11,
                            }}>{moment(notification.createdAt).format('HH:mm')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default RescheduleFromPatientNotification