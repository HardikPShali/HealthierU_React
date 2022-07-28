import React, { useState, useEffect } from 'react'; //useEffect, useState
import Cookies from 'universal-cookie';
import { pushNotificationsApi } from '../../../service/frontendapiservices';
import RescheduleAppointment from './NotificationTypes/RescheduleAppointment';
import StringNotifications from './NotificationTypes/StringAppointment';
import CancelledByPatient from './NotificationTypes/CancelledByPatient';
import moment from 'moment'
import AcceptedAppointment from './NotificationTypes/AcceptedAppointment';

const NotificationMenuDoctor = (props) => {

    const [notificationsData, setNotificationsData] = useState([]);

    const cookies = new Cookies();

    const getPushNotifications = async () => {
        const user = cookies.get('profileDetails');

        // console.log({ user })
        const userId = user.userId;

        // console.log({ userId })

        const page = 0;
        const limit = 10;

        const response = await pushNotificationsApi(
            userId,
            page,
            limit
        ).catch((err) => console.log({ err }));

        // console.log({ response });

        if (response.status === 200) {
            const notifications = response.data.data.notifications;
            // console.log({ notifications });
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

    // messageHandle();

    return (
        <>
            <div className="dropdown-title" style={{ paddingLeft: '10px' }}>
                Notifications
            </div>
            <hr />
            <div className="d-flex flex-column">
                {/* {console.log({ notificationsData })} */}
                {notificationsData.length > 0 ? (
                    <div>
                        {notificationsData.map((notification, index) => {

                            if (notification.type === 'APPT_AVAILABLE' && notification.data.appointmentDetails) {
                                return (
                                    <div key={index}>
                                        <RescheduleAppointment
                                            notification={notification}
                                            index={index}
                                        />
                                    </div>
                                );
                            }

                            if (notification.type === 'APPT_CANCELLED_BY_PATIENT') {
                                return (
                                    <div key={index}>
                                        <CancelledByPatient notification={notification} index={index} />
                                    </div>
                                );
                            }

                            if (notification.type === 'APPT_ACCEPTED') {
                                return (
                                    <div key={index}>
                                        <AcceptedAppointment notification={notification} index={index} />
                                    </div>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <div>
                        <p className='text-center'>No Notifications</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationMenuDoctor;
