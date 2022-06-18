import React, { useState, useEffect } from 'react';
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


const NextAppointmentNotifications = ({ notification, index }) => {
    const [clickModal, setClickModal] = useState(false);
    // const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const cookies = new Cookies();
    const currentPatient = cookies.get('profileDetails');

    const userId = currentPatient.userId;
    const firstName = currentPatient.firstName;
    const lastName = currentPatient.lastName;
    const email = currentPatient.email;
    const doctorId = notification.data.appointmentDetails.doctorId;
    const rate = notification.data.appointmentDetails.doctor.rate;
    const halfRate = notification.data.appointmentDetails.doctor.halfRate;
    const appointmentId = notification.data.appointmentDetails.id;
    const appointmentMode = notification.data.appointmentDetails.appointmentMode;

    const onClickPayNowModalHandler = () => {
        setClickModal(true);
    };

    const setNextAppointmentHandler = async (orderData) => {
        const setNextAppointmentDataArray = [];
        setNextAppointmentDataArray.push({
            doctorId: doctorId,
            endTime: notification.data.appointmentDetails.endTime,
            startTime: notification.data.appointmentDetails.startTime,
            type: 'DR',
            patientId: notification.data.appointmentDetails.patientId,
            status: 'ACCEPTED',
            remarks: notification.data.appointmentDetails.remarks,
            appointmentMode: appointmentMode,
            id: appointmentId,
            urgency: notification.data.appointmentDetails.urgency,
            unifiedAppointment:
                notification.data.appointmentDetails.unifiedAppointment,
        });
        console.log({ setNextAppointmentDataArray });

        const bookAppointmentApiHeader = {
            method: 'put',
            mode: 'no-cors',
            data: JSON.stringify(setNextAppointmentDataArray),
            url: `/api/v2/appointments/bulk`,
            headers: {
                Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };

        const storePaypalTransitionInfo = {
            method: 'post',
            mode: 'no-cors',
            data: JSON.stringify(orderData),
            url: `/api/paypal/transaction-info`,
            headers: {
                Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };

        console.log({ bookAppointmentApiHeader });
        console.log({ storePaypalTransitionInfo });

        const bookingResponse = await axios(bookAppointmentApiHeader);
        const storePaypalInfo = await axios(storePaypalTransitionInfo);

        if (bookingResponse.status === 200 || bookingResponse.status === 201) {
            // alert('Payment Successful');
            setClickModal(false);
            toast.success("Payment Successful");
            // setPaymentConfirmed(true);
        }
    };

    // useEffect(() => {
    //     setPaymentConfirmed(false);
    // }, [paymentConfirmed])

    return (
        <div key={index} className='set-next-appt' >
            <div className="notif-section" onClick={() => onClickPayNowModalHandler()}>
                <div className="profile-img col-md-3">
                    {notification.data.appointmentDetails?.doctor?.picture ? (
                        <img
                            alt="profile"
                            src={notification.data.appointmentDetails?.doctor.picture}
                            style={{
                                height: 40,
                                width: 40,
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
                                'DD-MM-YYYY hh:mm'
                            )} by {notification.data.appointmentDetails?.doctor.firstName}. Click here to pay now.
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
                    {/* {
                        paymentConfirmed ? ( */}
                    {/* <button
                        className="btn btn-primary set-next-notif__button"
                        onClick={() => onClickPayNowModalHandler()}
                    >
                        Pay Now
                    </button> */}
                    {/* ) : (
                            <button
                                className="btn btn-primary set-next-notif__button"
                                onClick={() => onClickPayNowModalHandler()}
                            >
                                Pay Nowwwwww
                            </button>
                        )
                    } */}

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
                            appointmentId={appointmentId}
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
