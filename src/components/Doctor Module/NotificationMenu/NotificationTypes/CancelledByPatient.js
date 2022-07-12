import React from 'react';
import Avatar from 'react-avatar';
import rightIcon from '../../../../images/svg/right-icon.svg';
import moment from 'moment';

const CancelledByPatient = ({ notification, index }) => {
    return (
        <div key={index}>
            <div className="notif-section">
                <div className="profile-img col-md-3">
                    {notification.data.appointmentDetails?.patient?.picture ? (
                        <img
                            alt="profile"
                            src={notification.data.appointmentDetails?.patient.picture}
                            style={{
                                height: 40,
                                width: 40,
                                borderRadius: '50%',
                            }}
                        />
                    ) : (
                        <Avatar
                            round={true}
                            name={notification.data.appointmentDetails?.patient.firstName}
                            size={60}
                            className="notifications-avatar"
                        />
                    )}
                </div>
                <div className="notif-section__message">
                    <div className="message-notif">
                        <span>
                            Your appointment with{' '}
                            {notification.data.appointmentDetails.patient?.firstName} is
                            cancelled for the time{' '}
                            {moment(notification.data.appointmentDetails.startTime).format(
                                'DD-MM-YYYY hh:mm'
                            )}
                        </span>
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
    );
};

export default CancelledByPatient;
