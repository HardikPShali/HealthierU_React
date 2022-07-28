import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useRole from '../../../custom-hooks/useRole';
import './CustomCallToast.css';
import defaultImage from '../../../images/default_image.png';
import moment from 'moment';

const CustomPushNotifications = ({ payload, toastFromPayload }) => {
    const history = useHistory();
    const role = useRole();
    const [picture, setPicture] = useState('');

    const getRoleName = () => {
        return role[0].includes('ROLE_DOCTOR') ? 'doctor' : 'patient';
    };

    useEffect(() => {
        if (payload) {
            let profileImage =
                getRoleName() === 'doctor'
                    ? payload?.data?.patientPicture
                    : payload?.data?.doctorPicture;
            setPicture(profileImage);
        }
    }, [payload]);

    console.log({ topicFromPayload: payload.data.topic });

    const apptDetailsJson = JSON.parse(payload.data.appointmentDetails);
    console.log({ apptDetailsJson });

    const messageDisplayHandler = () => {
        switch (payload.data.topic) {
            case 'APPT_ACCEPTED':
                if (getRoleName() === 'doctor') {
                    return (
                        <span>
                            Your appointment with {apptDetailsJson.patient.firstName} is
                            successfully booked on{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            Your appointment with {apptDetailsJson.doctor.firstName} is
                            successfully booked on{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                }

            case 'APPT_CANCELLED_BY_PATIENT':
                if (getRoleName() === 'doctor') {
                    return (
                        <span>
                            Your appointment is cancelled by{' '}
                            {apptDetailsJson.patient.firstName} for time{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            Your appointment is cancelled by{' '}
                            {apptDetailsJson.doctor.firstName} for time{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                }


            case "APPT_RESCHEDULE_BY_DOCTOR":
                if (getRoleName() === 'doctor') {
                    return (
                        <span>
                            {payload.data.message}{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {payload.data.message}{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                }

            case "APPT_RESCHEDULE_BY_PATIENT":
                if (getRoleName() === 'doctor') {
                    return (
                        <span>
                            {payload.data.message}{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                } else {
                    return (
                        <span>
                            Appointment is rescheduled on{' '}
                            {moment(apptDetailsJson.startTimeAsString).format(
                                'DD-MM-YYYY HH:mm'
                            )}{' '}
                        </span>
                    );
                }
        }
    };

    return (
        <div
            onClick={() => {
                // chatNotifHandler();
            }}
            className="call-notification-bar justify-content-start"
        >
            <div className="caller-img-container">
                {picture ? (
                    <img src={picture} alt="profile picture" className="caller-img" />
                ) : (
                    <img
                        src={defaultImage}
                        alt="profile picture"
                        className="caller-img"
                    />
                )}
            </div>
            <div className="caller-name msg-name">
                <div className="name">{payload.data.title}</div>
                <div className="call-tag text-small msg-text">
                    {messageDisplayHandler()}
                </div>
            </div>
        </div>
    );
};

export default CustomPushNotifications;
