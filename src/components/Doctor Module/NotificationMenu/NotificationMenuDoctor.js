import React, { useState, useEffect } from 'react'; //useEffect, useState
import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom'; //Link
import Cookies from 'universal-cookie';
// import useRole from '../../custom-hooks/useRole';
import rightIcon from '../../../images/svg/right-icon.svg';
import { pushNotificationsApi } from '../../../service/frontendapiservices';
import moment from 'moment'

const NotificationMenuDoctor = (props) => {

    const [tokenFound, setTokenFound] = useState(false);

    const [notificationsData, setNotificationsData] = useState([]);

    const cookies = new Cookies();

    // const roles = useRole();

    // const role = roles[0]
    // console.log({ role })

    // const roleName = role.includes('ROLE_PATIENT')
    //   ? 'patient'
    //   : role.includes('ROLE_DOCTOR')
    //     ? 'doctor'
    //     : '';

    // console.log({ roleName });

    const getPushNotifications = async () => {
        const user = cookies.get('profileDetails');

        // console.log({ user })
        const userId = user.userId;

        // console.log({ userId })

        const page = 1;
        const limit = 2;

        const response = await pushNotificationsApi(
            userId,
            page,
            limit
        ).catch((err) => console.log({ err }));

        if (response.status === 200) {
            const notifications = response.data.data.notifications;
            console.log({ notifications });
            setNotificationsData(notifications);
        }
    };

    const fcmToken = localStorage.getItem('fcmToken');
    console.log({ fcmToken })

    useEffect(() => {
        getPushNotifications();

    }, []);

    // messageHandle();

    return (
        <>
            <div className="dropdown-title" style={{ paddingLeft: '10px' }}>
                Notifications
            </div>
            <hr />
            <div className="d-flex flex-column">
                {notificationsData.length > 0 ? (
                    <div>
                        {notificationsData.map((notification, index) => {
                            if (notification.type === 'RESCHEDULE') {
                                return (
                                    <div key={index}>
                                        <div className="notif-section">
                                            <div className="profile-img col-md-3">
                                                {notification.data.appointmentDTO.patient?.picture ? (
                                                    <img
                                                        alt="profile"
                                                        src={
                                                            notification.data.appointmentDTO.patient.picture
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
                                                            notification.data.appointmentDTO.patient +
                                                            ' ' +
                                                            (notification.data.appointmentDTO.patient || '')
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
                                );
                            }
                            if (notification.type === 'STRING') {
                                return (
                                    <div key={index}>
                                        <div className="notif-section">
                                            <div className="profile-img col-md-3">
                                                {notification.data.appointmentDetails?.patient?.picture ? (
                                                    <img
                                                        alt="profile"
                                                        src={
                                                            notification.data.appointmentDetails?.patient.picture
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
                                                            notification.data.appointmentDetails?.patient +
                                                            ' ' +
                                                            (notification.data.appointmentDetails?.patient || '')
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
                                );
                            }
                            if (notification.type === 'CANCELLED_BY_PATIENT') {
                                return (
                                    <div key={index}>
                                        <div className="notif-section">
                                            <div className="profile-img col-md-3">
                                                {notification.data.appointmentDetails?.patient?.picture ? (
                                                    <img
                                                        alt="profile"
                                                        src={
                                                            notification.data.appointmentDetails?.patient.picture
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
                                                            notification.data.appointmentDetails?.patient +
                                                            ' ' +
                                                            (notification.data.appointmentDetails?.patient || '')
                                                        }
                                                        size={60}
                                                        className="notifications-avatar"
                                                    />
                                                )}
                                            </div>
                                            <div className="notif-section__message">
                                                <div className="message-notif">
                                                    <span>Your appointment is cancelled for {moment(notification.data.appointmentDetails.startTime).format('DD-MM-YYYY hh:mm')}</span>
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
