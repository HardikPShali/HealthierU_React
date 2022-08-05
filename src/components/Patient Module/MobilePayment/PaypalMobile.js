import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router';
import Paypal from '../../CommonModule/Paypal';
import TransparentLoader from '../../Loader/transparentloader';

// const JSBridge = window.JSBridge;
// if (JSBridge) {
//     JSBridge.init();
// }

window.setPToken = (token) => {
    console.log('setBearerToken', token);
    window.ptoken = token;
}

const PaypalMobile = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // const sendDataToAndroid = (content) => {
    //     // JSBridge.sendOrderData(content);
    // }

    const searchParams = new URLSearchParams(location.search);

    let userIdParams = searchParams.get('uId');
    let firstnameParams = searchParams.get('fN');
    let lastnameParams = searchParams.get('lN');
    let emailParams = searchParams.get('em');
    let appointmentIdParams = searchParams.get('aId');
    let appointmentModeParams = searchParams.get('aM');
    let rateParams = searchParams.get('r');
    let halfRateParams = searchParams.get('hR');
    let notificationId = searchParams.get('nId');

    let os = searchParams.get('os');



    const bookAppointment = async (orderData) => {
        setLoading(true);

        const setAppointmentMode = (appMode) => {
            if (appMode === 'First Consultation' || appMode === 'FIRST_CONSULTATION') return "FIRST_CONSULTATION";
            return "FOLLOW_UP";
        }

        const orderObject = {
            id: appointmentIdParams,
            type: setAppointmentMode(appointmentModeParams),
            paymentsAppointmentsDTO: orderData,
        };

        if (notificationId) {
            orderObject.notificationId = notificationId;
        }

        const newPaymentData = {
            ...orderObject,
        };


        const newPaymentApi = {
            method: 'post',
            mode: 'no-cors',
            data: newPaymentData,
            url: `/api/v2/appointments/payment/bulk`,
            headers: {
                Authorization: window.ptoken,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };

        // Boolean for success
        //on success, send true in postmessage & sendorderData

        const successEventOnPayment = (data) => {
            if (os === 'ios') {
                console.log({ data: JSON.stringify(data) })
                window.webkit.messageHandlers.sendOrderData.postMessage(data);
            } else {
                console.log({ data: JSON.stringify(data) })
                window.android.sendOrderData(data);
            }
        };

        const apiResponseMessages = (response) => {
            if (os === 'ios') {
                console.log({ responseMessage: JSON.stringify(response) })
                window.webkit.messageHandlers.sendResponseMessages.postMessage(response);
            } else {
                console.log({ responseMessage: JSON.stringify(response) })
                window.android.sendResponseMessages(response);
            }
        }



        try {
            const response = await axios(newPaymentApi);
            console.log({ response: JSON.stringify(response) });
            if (response.status === 200 || response.status === 201) {
                console.log("PAYMENT SUCCESS", JSON.stringify(response))
                successEventOnPayment(true);
                setLoading(false);
                apiResponseMessages(response.data.message);
            } else {
                console.log("PAYMENT API FAILED", JSON.stringify(response))
                apiResponseMessages(response.data.message);
            }

        } catch (error) {
            console.log("PAYMENT API FAILED", JSON.stringify(error))
            const errorMessage = error.response.data.message;
            successEventOnPayment(false);
            setLoading(false);
            apiResponseMessages(errorMessage);
        }
    };

    return (
        <div className="container">
            {loading && (<TransparentLoader />)}
            <Container>
                <Row>
                    <Col md={12}>{/* <h3>Reached Paypal Mobile Payment</h3> */}</Col>
                </Row>
                <Row>
                    <Col md={12} className="mt-4 text-center">
                        <Paypal
                            // appointmentId={appointmentIdParams}
                            appointmentMode={appointmentModeParams}
                            bookappointment={bookAppointment}
                            firstName={firstnameParams}
                            lastName={lastnameParams}
                            email={emailParams}
                            userId={userIdParams}
                            rate={rateParams}
                            halfRate={halfRateParams}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PaypalMobile;
