import React, { useState } from 'react';
import Avatar from 'react-avatar';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Paypal from '../../../CommonModule/Paypal';
import { Col } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import LocalStorageService from '../../../../util/LocalStorageService';
import axios from 'axios';
import { toast } from "react-toastify";
import rightIcon from '../../../../images/svg/right-icon.svg';
import { getAppointmentMode } from '../../../../util/appointmentModeUtil';
import { getUnreadNotificationsCount, putMarkAsReadFromNotificationMenu } from '../../../../service/frontendapiservices';


const NextAppointmentNotifications = ({ notification, index }) => {
    const [clickModal, setClickModal] = useState(false);
    const cookies = new Cookies();
    const currentPatient = cookies.get('profileDetails');

    const userId = currentPatient.userId;
    const firstName = currentPatient.firstName;
    const lastName = currentPatient.lastName;
    const email = currentPatient.email;
    const rate = notification.data.appointmentDetails.doctor.rate;
    const halfRate = notification.data.appointmentDetails.doctor.halfRate;
    const appointmentId = notification.data.appointmentDetails.id;
    const appointmentMode = notification.data.appointmentDetails.appointmentMode;
    const notificationIdForPayment = notification.id;
    const paymentStatus = notification.data.appointmentDetails.paymentStatus;

    const onClickPayNowModalHandler = () => {
        setClickModal(true);
    };

    const onPaymentStatusTrueHandler = () => {
        toast.error('Payment already done for this notification.', {
            toastId: 'paymentAlreadyDone',
        });
    }


    const onClickHandler = () => {
        if (paymentStatus === false) {
            onClickPayNowModalHandler();
        }
        else {
            onPaymentStatusTrueHandler();
        }
    }


    const setNextAppointmentHandler = async (orderData) => {
        let setNextAppointmentDataArray = {};
        setNextAppointmentDataArray = {
            id: appointmentId,
            type: getAppointmentMode(appointmentMode),
            paymentsAppointmentsDTO: orderData,
            notificationId: notificationIdForPayment
        };
        console.log({ setNextAppointmentDataArray });

        const setNextApptApi = {
            method: 'post',
            mode: 'no-cors',
            data: setNextAppointmentDataArray,
            url: `/api/v2/appointments/payment/bulk`,
            headers: {
                Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };

        try {
            // await api call
            const newPaymentResponse = await axios(setNextApptApi);
            // console.log({ newPaymentResponse });

            //success logic
            if (
                newPaymentResponse.status === 200 ||
                newPaymentResponse.status === 201
            ) {
                //   props.history.push('/patient/myappointment');
                setClickModal(false);
                // toast.success('Appointment has been set successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
        } catch (err) {
            //error logic
            // console.log({ err });
            const errorMessage = err.response.data.message;
            const errorStatus = err.response.status;

            if (errorStatus === 500 && errorMessage) {
                //   setLoading(false);
                // FOR MODAL
                // setPaymentErrorModal(true);

                // FOR TOAST
                setClickModal(false);
                toast.error(`${errorMessage}. Please try again.`);
            } else {
                //   setLoading(false);
                // FOR MODAL
                // setPaymentErrorModal(true);
                // FOR TOAST
                setClickModal(false);
                toast.error(`Payment failed. Please try again.`);
            }
        }
    };

    //MARK AS READ NOTIFICATION LOGIC
    const markAsReadFromNotificationMenuHandler = async () => {
        const notificationId = notification.id;
        const userId = notification.userId;

        const data = {
            id: notificationId,
        };

        const response = await putMarkAsReadFromNotificationMenu(
            data,
            userId
        ).catch((err) => console.log({ err }));
        console.log({ markAsReadFromNotificationMenuHandler: response });

        if (response.data.status === true) {
            //   setBadgeCount(0);
            //   toast.success("Notification marked as read successfully");
            await getUnreadNotificationsCount(userId);
        }
    };


    return (
        <div key={index} className='set-next-appt' >
            <div className="notif-section" onClick={() => {
                onClickHandler();
                markAsReadFromNotificationMenuHandler();
            }}>


                <div className="profile-img col-md-3">
                    {notification.data.appointmentDetails?.doctor?.picture ? (
                        <img
                            alt="profile"
                            src={notification.data.appointmentDetails?.doctor.picture}
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: '50%',
                            }}
                        />
                    ) : (
                        <Avatar
                            round={true}
                            name={notification.data.appointmentDetails?.doctor.firstName}
                            size={60}
                            className="notifications-avatar"
                        />
                    )}
                </div>
                <div className="notif-section__message">
                    <div className="message-notif">
                        <span>
                            Your next appointment is confirmed for{' '}
                            {moment(notification.data.appointmentDetails.startTime).format(
                                'DD-MM-YYYY HH:mm'
                            )} by {notification.data.appointmentDetails?.doctor.firstName}. Click here to pay now.
                        </span>
                        <span style={{
                            color: '#bfbfbf',
                            fontSize: 11,
                        }}>{moment(notification.createdAt).format('HH:mm')}</span>
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
            <Dialog
                onClose={() => setClickModal(false)}
                aria-labelledby="customized-dialog-title"
                open={clickModal}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={() => setClickModal(false)}
                    style={{ textAlign: 'center' }}
                >
                    Pay Now
                </DialogTitle>
                <DialogActions>
                    <Col md={12}>
                        <Paypal
                            // appointmentId={appointmentId}
                            appointmentMode={appointmentMode}
                            bookappointment={setNextAppointmentHandler}
                            firstName={firstName}
                            lastName={lastName}
                            email={email}
                            userId={userId}
                            rate={rate}
                            halfRate={halfRate}
                        />
                    </Col>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NextAppointmentNotifications;
