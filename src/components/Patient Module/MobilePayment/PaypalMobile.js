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

    let os = searchParams.get('os');



    const bookAppointment = async (orderData) => {
        setLoading(true);

        // window.android.onPaymentStatusChange(true);
        orderData.slotId = appointmentIdParams;

        // const data = JSON.stringify(orderData);

        //object for query params
        // const orderObject = {
        //     userIdParams,
        //     firstnameParams,
        //     lastnameParams,
        //     emailParams,
        //     // appointmentIdParams, Not needed
        //     appointmentModeParams,
        //     rateParams,
        //     halfRateParams,
        // }

        const orderObject = {
            id: appointmentIdParams,
            type: appointmentModeParams,
            paymentsAppointmentsDTO: orderData,
        };
        //Book appt api
        // const newPaymentData = {
        //     appointmentDTO: orderObject,
        //     paymentsAppointmentsDTO: orderData
        // }

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



        try {
            const response = await axios(newPaymentApi);
            console.log({ response: JSON.stringify(response) });
            if (response.status === 200 || response.status === 201) {
                successEventOnPayment(true);
                setLoading(false);
            }
        } catch (error) {
            console.log({ error: JSON.stringify(error) });
            successEventOnPayment(false);
            setLoading(false);
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
