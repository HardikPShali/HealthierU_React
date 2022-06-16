import React, { useState, useEffect } from 'react'; //useEffect, useState
import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom'; //Link
import Cookies from 'universal-cookie';
// import useRole from '../../custom-hooks/useRole';
import rightIcon from '../../../images/svg/right-icon.svg';
import { pushNotificationsApi } from '../../../service/frontendapiservices';
// import { getFirebaseToken } from "../../util/firebaseCloudMessages";
import { getFirebaseToken, getPermissions } from '../../../util';

const NotificationMenuDoctor = (props) => {
    // const { unReadMessageList, detailsList, module } = props;
    const [tokenFound, setTokenFound] = useState(false);

    const [notificationsData, setNotificationsData] = useState([]);

    // console.log({ tokenFound });

    // const staticResponse = {
    //   "status": true,
    //   "message": "List of PushNotifications",
    //   "data": {
    //     "totalItems": 16,
    //     "notifications": [
    //       {
    //         "id": 17,
    //         "userId": 443,
    //         "data": {
    //           "title": "string",
    //           "message": "new one",
    //           "topic": "STRING",
    //           "token": "",
    //           "appointmentDTO": {
    //             "id": null,
    //             "startTime": null,
    //             "endTime": null,
    //             "type": null,
    //             "status": null,
    //             "doctorId": null,
    //             "patientId": null,
    //             "remarks": null,
    //             "urgency": null,
    //             "patient": null,
    //             "doctor": null,
    //             "patientName": null,
    //             "doctorName": null,
    //             "unifiedAppointment": null,
    //             "appointmentMode": null,
    //             "paymentMethod": null,
    //             "appointmentFee": null,
    //             "recurId": null,
    //             "toggleStatus": null,
    //             "timeZone": null,
    //             "appointmentBookedTime": null,
    //             "appointmentExpireTime": null
    //           }
    //         },
    //         "createdAt": "2022-06-15T07:28:09Z",
    //         "type": "STRING" //Notification-type if string don't navigate to any page
    //       },
    //       {
    //         "id": 13,
    //         "userId": 443,
    //         "data": {
    //           "title": "string",
    //           "message": "new one",
    //           "topic": "STRING",
    //           "token": "",
    //           "appointmentDTO": {
    //             "id": 1,
    //             "startTime": "2022-04-13T12:00:00Z",
    //             "endTime": "2022-04-13T12:30:00Z",
    //             "type": "DR",
    //             "status": "ACCEPTED",
    //             "doctorId": 1,
    //             "patientId": 1,
    //             "remarks": "",
    //             "urgency": "",
    //             "patient": {
    //               "id": 1,
    //               "firstName": "test123",
    //               "middleName": null,
    //               "lastName": "user",
    //               "lowBp": "70",
    //               "highBp": "120",
    //               "dateOfBirth": "2022-04-01T00:00:00Z",
    //               "height": 180,
    //               "weight": 80,
    //               "gender": "MALE",
    //               "maritalStatus": "SINGLE",
    //               "bloodGroup": "OPOS",
    //               "email": "mailto:testhp@accubits.com",
    //               "phone": "1454445555",
    //               "address": "Test Address to update",
    //               "picture": "https://healthieru-dev.s3.amazonaws.com/patient-profile-pics/dGVzdGhwQGFjY3ViaXRzLmNvbTViNjU0ZTM3LTVjOGUtNGVmNS1hYTc1LTJlZGEzMzE4YTQwNQ%3D%3D.png",
    //               "languages": null,
    //               "userId": 7,
    //               "contacts": null,
    //               "country": {
    //                 "id": 6,
    //                 "name": "AndorrA",
    //                 "code": "AD"
    //               },
    //               "answers": null,
    //               "patientTimeZone": "Asia/Calcutta",
    //               "createTime": "2022-04-13T10:55:56Z",
    //               "updateTime": "2022-06-06T10:56:27Z",
    //               "firebasePwd": "dGVzdGhwQGFjY3ViaXRzLmNvbQ==",
    //               "allergies": "abcd,xyz"
    //             },
    //             "doctor": {
    //               "id": 1,
    //               "firstName": "Test Doctor",
    //               "middleName": null,
    //               "lastName": "Justin",
    //               "dateOfBirth": "2022-05-20T00:00:00Z",
    //               "gender": "MALE",
    //               "email": "mailto:srikanth.s@accubits.com",
    //               "phone": "+9112344223",
    //               "address": "test address",
    //               "rate": 1,
    //               "halfRate": 1,
    //               "bio": "About Info string",
    //               "userId": 10,
    //               "education": "test",
    //               "picture": "https://healthyudev.blob.core.windows.net/profile-pics/c3Jpa2FudGguc0BhY2N1Yml0cy5jb20%3D.jpg",
    //               "startTime": "2022-05-10T02:46:21Z",
    //               "endTime": "2022-05-10T02:46:21Z",
    //               "experience": 14,
    //               "certificates": "test",
    //               "awards": "test",
    //               "contacts": [],
    //               "country": {
    //                 "id": 21,
    //                 "name": "Belarus",
    //                 "code": "BY"
    //               },
    //               "specialities": [
    //                 {
    //                   "id": 1,
    //                   "name": "Cardiology",
    //                   "keywordss": []
    //                 },
    //                 {
    //                   "id": 5,
    //                   "name": "Endocrinology",
    //                   "keywordss": []
    //                 },
    //                 {
    //                   "id": 13,
    //                   "name": "Ophthalmology",
    //                   "keywordss": []
    //                 }
    //               ],
    //               "languages": [
    //                 {
    //                   "name": "English"
    //                 },
    //                 {
    //                   "name": "Malayalam"
    //                 },
    //                 {
    //                   "name": "Arabic"
    //                 },
    //                 {
    //                   "name": "Chinese"
    //                 }
    //               ],
    //               "doctorTimeZone": "Asia/Calcutta",
    //               "createTime": "2022-04-13T11:00:00Z",
    //               "updateTime": "2022-06-06T09:14:52Z",
    //               "activated": true,
    //               "firebasePwd": "c3Jpa2FudGguc0BhY2N1Yml0cy5jb20=",
    //               "approved": true,
    //               "modeOfEmployment": "Self - Employed",
    //               "affiliation": "12",
    //               "educationalQualifications": "[{\"educationalQualification\":\"MD\",\"institution\":\"XYZ Uni\"}, {\"educationalQualification\":\"test\",\"institution\":\"test institutuion\"}]"
    //             },
    //             "patientName": "test123",
    //             "doctorName": "Test Doctor",
    //             "unifiedAppointment": "1#FOLLOW_UP",
    //             "appointmentMode": "Follow Up",
    //             "paymentMethod": null,
    //             "appointmentFee": null,
    //             "timeZone": null,
    //             "appointmentBookedTime": "2022-06-01T13:52:36Z",
    //             "appointmentExpireTime": "2022-06-03T13:52:36Z"
    //           }
    //         },
    //         "createdAt": "2022-06-14T23:24:58Z",
    //         "type": "STRING"
    //       }
    //     ],
    //     "totalPages": 8,
    //     "currentPage": 1
    //   }
    // }

    // const responseData = staticResponse.data;
    // // console.log({ responseData })

    // const notificationsDatum = responseData.notifications;
    // console.log({ notificationsDatum })

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
        // let data;
        // const tokenFunction = async () => {
        //     data = await getFirebaseToken(setTokenFound);
        //     if (data) {
        //         console.log({ data });
        //     }
        //     return data;
        // };

        // const getPermission = async () => {
        //     const permission = await getPermissions();
        //     if (permission === 'granted') {
        //         tokenFunction();
        //     }
        // };
        // getPermission();
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
