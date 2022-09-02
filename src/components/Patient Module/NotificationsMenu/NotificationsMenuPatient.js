import React, { useState, useEffect } from 'react'; //useEffect, useState
import Cookies from 'universal-cookie';
import { pushNotificationsApi } from '../../../service/frontendapiservices';
import AcceptedAppointmentsNotification from './NotificationTypes/AcceptedAppointmentsNotification';
import AppointmentExpiredNotification from './NotificationTypes/AppointmentExpiredNotification';
import CancelledByDoctorNotifications from './NotificationTypes/CancelledByDoctorNotifications';
import NextAppointmentNotifications from './NotificationTypes/NextAppointmentNotifications';
import RescheduleByDoctorNotification from './NotificationTypes/RescheduleByDoctorNotification';
import RescheduleNotification from './NotificationTypes/RescheduleByDoctorNotification';
import RescheduleFromPatientNotification from './NotificationTypes/RescheduleFromPatientNotification';
import StringNotifications from './NotificationTypes/StringNotifications';

const NotificationMenuPatient = () => {

    const [notificationsData, setNotificationsData] = useState([]);

    const cookies = new Cookies();

    const getPushNotifications = async () => {
        const user = cookies.get('profileDetails');
        const userId = user.userId;

        const response = await pushNotificationsApi(
            userId,

        ).catch((err) => console.log({ err }));

        if (response?.status === 200) {
            const notifications = response.data.data.notifications;
            setNotificationsData(notifications);
        }
    };


    useEffect(() => {
        getPushNotifications();
        const interval = setInterval(() => {
            getPushNotifications();
        }, 30000)

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="dropdown-title" style={{ paddingLeft: '10px' }}>
                Notifications
            </div>
            <hr />
            <div className="d-flex flex-column">
                {/* {console.log(notificationsData)} */}
                {notificationsData.length > 0 ? (
                    <div>
                        {notificationsData.map((notification, index) => {
                            if (notification.type === 'APPT_RESCHEDULE_BY_DOCTOR' && notification.data.appointmentDetails) {
                                return (
                                    <div key={index}>
                                        <RescheduleByDoctorNotification
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }

                            if (notification.type === 'APPT_RESCHEDULE_BY_PATIENT') {
                                return (
                                    <div key={index}>
                                        <RescheduleFromPatientNotification
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }

                            if (notification.type === 'STRING') {
                                return (
                                    <div key={index}>
                                        <StringNotifications
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }
                            if (notification.type === 'APPT_CANCELLED_BY_DOCTOR') {
                                return (
                                    <div key={index}>
                                        <CancelledByDoctorNotifications
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }
                            if (notification.type === 'APPT_CANCELLED_BY_DOCTOR_TOGGLE') {
                                return (
                                    <div key={index}>
                                        <CancelledByDoctorNotifications
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }
                            if (notification.type === 'APPT_ACCEPTED') {
                                return (
                                    <div key={index}>
                                        <AcceptedAppointmentsNotification
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }
                            if (notification.type === 'SET_NEXT_APPOINTMENT_BY_DR') {
                                return (
                                    <div key={index}>
                                        <NextAppointmentNotifications
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }

                            if (notification.type === 'APPT_EXPIRED') {
                                return (
                                    <div key={index}>
                                        <AppointmentExpiredNotification
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <div>
                        <p className="text-center">No Notifications</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationMenuPatient;
