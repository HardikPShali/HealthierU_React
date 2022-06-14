import axios from 'axios';
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router';
import LocalStorageService from '../../../util/LocalStorageService';
import Paypal from '../../CommonModule/Paypal';
import PaypalCheckoutButton from '../PaypalCheckout/PaypalCheckoutButton';

const JSBridge = window.JSBridge;
if (JSBridge) {
    JSBridge.init();
}


const PaypalMobile = (props) => {
    // const { bookappointment, doctor, appointment } = props;
    const location = useLocation();

    const sendDataToAndroid = (content) => {
        JSBridge.sendOrderData(content);
    }

    // const appointmentService = async (id) => {
    //     var payload = {
    //         method: 'get',
    //         mode: 'no-cors',
    //         url: `/api/v2/appointments/${id}`,
    //         headers: {
    //             'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         }
    //     };
    //     const response = await axios(payload);
    //     return response;
    // }

    // const getAppointmentResopnse = async (id) => {
    //     const response = await appointmentService(id);
    //     console.log({ response })
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

    const bookAppointment = async (orderData) => {
        alert('Book Appointment accessed')
        console.log('Book Appointment accessed')

        if (JSBridge) {
            sendDataToAndroid(orderData);
        }
        else {
            alert('JSBridge Not Found')
        }

    };

    return (
        <div className="container">
            <Container>
                <Row>
                    <Col md={12}>
                        {/* <h3>Reached Paypal Mobile Payment</h3> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='mt-4 text-center'>
                        <Paypal
                            appointmentId={appointmentIdParams}
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
