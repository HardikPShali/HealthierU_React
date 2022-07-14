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


const NextAppointmentNotifications = ({ notification, index }) => {
    const [clickModal, setClickModal] = useState(false);
    // const [paymentConfirmed, setPaymentConfirmed] = useState(false);
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

    const onClickPayNowModalHandler = () => {
        setClickModal(true);
    };

    const setNextAppointmentHandler = async (orderData) => {
        let setNextAppointmentDataArray = {};
        setNextAppointmentDataArray = {
            id: appointmentId,
            type: getAppointmentMode(appointmentMode),
            paymentsAppointmentsDTO: orderData,
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
            console.log({ newPaymentResponse });

            //success logic
            if (
                newPaymentResponse.status === 200 ||
                newPaymentResponse.status === 201
            ) {
                //   props.history.push('/patient/myappointment');
                setClickModal(false);
                toast.success('Appointment has been set successfully');
            }
        } catch (err) {
            //error logic
            console.log({ err });
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

    // useEffect(() => {
    //     setPaymentConfirmed(false);
    // }, [paymentConfirmed])

    return (
        <div key={index} className='set-next-appt' >
            <div className="notif-section" onClick={() => {
                onClickPayNowModalHandler();
            }}>
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
