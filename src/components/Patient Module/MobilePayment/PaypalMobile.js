import axios from 'axios';
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router';
import LocalStorageService from '../../../util/LocalStorageService';
import Paypal from '../../CommonModule/Paypal';
import PaypalCheckoutButton from '../PaypalCheckout/PaypalCheckoutButton';

const PaypalMobile = (props) => {
    // const { bookappointment, doctor, appointment } = props;
    const location = useLocation();

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
    let slot1Id = searchParams.get('slot1Id');
    let slot2Id = searchParams.get('slot2Id');
    let slot1startTime = searchParams.get('s1Sd');
    let slot1endTime = searchParams.get('s1Ed');
    let slot2startTime = searchParams.get('s2Sd');
    let slot2endTime = searchParams.get('s2Ed');
    let userIdParams = searchParams.get('uId');
    let doctorId = searchParams.get('dId');
    let firstnameParams = searchParams.get('fN');
    let lastnameParams = searchParams.get('lN');
    let emailParams = searchParams.get('em');
    let appointmentIdParams = searchParams.get('aId');
    let appointmentModeParams = searchParams.get('aM');
    let rateParams = searchParams.get('r');
    let halfRateParams = searchParams.get('hR');

    const bookAppointment = async (orderData) => {
        const finalAppointmentArray = [];
        let slotConsultationId = '';
        if (appointmentModeParams === 'FIRST_CONSULTATION') {
            slotConsultationId = slot1Id + '-' + slot2Id;
            // !orderData.slot1Id && (orderData.appointmentIdParams = slotConsultationId);
            finalAppointmentArray.push(
                {
                    doctorId: doctorId,
                    endTime: slot1endTime,
                    startTime: slot1startTime,
                    type: 'DR',
                    patientId: userIdParams,
                    status: 'ACCEPTED',
                    appointmentMode: appointmentModeParams,
                    id: slot1Id,
                    unifiedAppointment: slotConsultationId + '#' + appointmentModeParams,
                },
                {
                    doctorId: doctorId,
                    endTime: slot2endTime,
                    startTime: slot2startTime,
                    type: 'DR',
                    patientId: userIdParams,
                    status: 'ACCEPTED',
                    appointmentMode: appointmentModeParams,
                    id: slot2Id,
                    unifiedAppointment: slotConsultationId + '#' + appointmentModeParams,
                }
            );
        }
        else if (appointmentModeParams === 'FOLLOW_UP') {
            slotConsultationId = slot1Id;
            !orderData.slot1Id && (orderData.aId = slotConsultationId);
            finalAppointmentArray.push(
                {
                    doctorId: doctorId,
                    endTime: slot1endTime,
                    startTime: slot1startTime,
                    type: 'DR',
                    patientId: userIdParams,
                    status: 'ACCEPTED',
                    appointmentMode: appointmentModeParams,
                    id: slot1Id,
                    unifiedAppointment: slotConsultationId + '#' + appointmentModeParams,
                }
            );
        }

        const bookAppointmentApiHeader = {
            method: 'put',
            mode: 'no-cors',
            data: JSON.stringify(finalAppointmentArray),
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
        // const bookingResponse = await axios(bookAppointmentApiHeader);
        // const storePaypalInfo = await axios(storePaypalTransitionInfo);

        console.log({ bookAppointmentApiHeader })
        console.log({ storePaypalTransitionInfo })
        // console.log({ storePaypalInfo })
    };

    useEffect(() => {
        // getAppointmentResopnse(appointmentIdParams);
        bookAppointment();
    }, []);

    // console.log({ slot1Id });
    // console.log({ slot2Id });
    // console.log({ slot1startTime });
    // console.log({ slot1endTime });
    // console.log({ slot2startTime });
    // console.log({ slot2endTime });
    // console.log({ userIdParams });
    // console.log({ firstnameParams });
    // console.log({ lastnameParams });
    // console.log({ emailParams });
    // console.log({ appointmentIdParams });
    // console.log({ appointmentModeParams });
    // console.log({ rateParams });
    // console.log({ halfRateParams });

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
