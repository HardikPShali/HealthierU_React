import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router';
import Paypal from '../../CommonModule/Paypal';
import TransparentLoader from '../../Loader/transparentloader';
import '../patient.css';
import PromoCodeForPatient from '../PromoCodeForPatient/PromoCodeForPatient';

// const JSBridge = window.JSBridge;
// if (JSBridge) {
//     JSBridge.init();
// }

window.setPToken = (token) => {
    console.log('setBearerToken', token);
    window.ptoken = token;
};

const PaypalMobile = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [promoCodeObject, setPromoCodeObject] = useState({});

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

    let doctorId = searchParams.get('dId');
    let patientId = searchParams.get('pId');

    let os = searchParams.get('os');

    //promo-code states
    const [promoCodeApplied, setPromoCodeApplied] = useState(false);
    const [couponIdState, setCouponIdState] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [promoCodeEntered, setPromoCodeEntered] = useState('');

    const handlePromoCodeStates = (promoCodeData) => {
        if (!promoCodeData) {
            setPromoCodeApplied(false);
        } else {
            setPromoCodeApplied(true);
            setCouponIdState(promoCodeData.couponId);
            setDiscountApplied(promoCodeData.discountApplied);
            setPromoCodeEntered(promoCodeData.promoCodeTextEntered);
        }
    };

    const paymentApiCallhandler = async (paymentData, paymentUrl) => {
        console.log('paymentData', paymentData);
        console.log('paymentUrl', paymentUrl);

        const newPaymentApi = {
            method: 'post',
            mode: 'no-cors',
            data: paymentData,
            url: paymentUrl,
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
                console.log({ data: JSON.stringify(data) });
                window.webkit.messageHandlers.sendOrderData.postMessage(data);
            } else {
                console.log({ data: JSON.stringify(data) });
                window.android.sendOrderData(data);
            }
        };

        const apiResponseMessages = (response) => {
            if (os === 'ios') {
                console.log({ responseMessage: JSON.stringify(response) });
                window.webkit.messageHandlers.sendResponseMessages.postMessage(
                    response
                );
            } else {
                console.log({ responseMessage: JSON.stringify(response) });
                window.android.sendResponseMessages(response);
            }
        };

        try {
            const response = await axios(newPaymentApi);
            console.log({ response: JSON.stringify(response) });
            if (response.status === 200 || response.status === 201) {
                console.log('PAYMENT SUCCESS', JSON.stringify(response));
                successEventOnPayment(true);
                setLoading(false);
                apiResponseMessages(response.data.message);
            } else {
                console.log('PAYMENT API FAILED', JSON.stringify(response));
                apiResponseMessages(response.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log('PAYMENT API FAILED', JSON.stringify(error));
            const errorMessage = error.response.data.message;
            successEventOnPayment(false);
            setLoading(false);
            apiResponseMessages(errorMessage);
        }
    };

    const handleFreeCouponTransactions = async () => {
        setLoading(true);
        let finalAppointmentDataArray = {};
        if (
            promoCodeApplied === true &&
            promoCodeEntered === 'HEALTHIERUAE' &&
            (appointmentModeParams === 'First Consultation' ||
                appointmentModeParams === 'FIRST_CONSULTATION')
        ) {
            finalAppointmentDataArray = {
                id: appointmentIdParams,
                type: 'FIRST_CONSULTATION',
                paymentsAppointmentsDTO: {
                    appointmentMode: 'First Consultation',
                    intent: 'CAPTURE',
                    payerId: '44MRCR555FJEA',
                    paymentId: '8CY307745J947952L',
                    paymentmethod: 'paypal website',
                    state: 'COMPLETED',
                    transactionAmount: '0.00',
                    transactionCurrency: 'USD',
                    transactionId:
                        '100%DISCOUNT_COUPON' + Math.floor(Math.random() * 1000000),
                    userName: 'John Doe',
                    userId: 1478,
                },
                couponId: couponIdState,
            };
        } else if (
            promoCodeApplied === true &&
            promoCodeEntered === 'HEALTHIERUAE' &&
            (appointmentModeParams === 'Follow Up' ||
                appointmentModeParams === 'FOLLOW_UP')
        ) {
            finalAppointmentDataArray = {
                id: appointmentIdParams,
                type: 'FOLLOW_UP',
                paymentsAppointmentsDTO: {
                    appointmentMode: 'Follow Up',
                    intent: 'CAPTURE',
                    payerId: '44MRCR555FJEA',
                    paymentId: '8CY307745J947952L',
                    paymentmethod: 'paypal website',
                    state: 'COMPLETED',
                    transactionAmount: '0.00',
                    transactionCurrency: 'USD',
                    transactionId:
                        '100%DISCOUNT_COUPON' + Math.floor(Math.random() * 1000000),
                    userName: 'John Doe',
                    userId: 1478,
                },
                couponId: couponIdState,
            };
        }
        console.log({ finalAppointmentDataArray });

        const freePaymentPayload = {
            ...finalAppointmentDataArray,
        };

        const paymentUrlToBeUsed = () => {
            if (promoCodeApplied === true) {
                return '/api/v2/appointments/payment/bulk/coupon';
            } else {
                return '/api/v2/appointments/payment/bulk';
            }
        };

        const paymentUrl = paymentUrlToBeUsed();

        paymentApiCallhandler(freePaymentPayload, paymentUrl);
    };

    const bookAppointment = async (orderData) => {
        setLoading(true);

        const setAppointmentMode = (appMode) => {
            if (appMode === 'First Consultation' || appMode === 'FIRST_CONSULTATION')
                return 'FIRST_CONSULTATION';
            return 'FOLLOW_UP';
        };

        const orderObject = {
            id: appointmentIdParams,
            type: setAppointmentMode(appointmentModeParams),
            paymentsAppointmentsDTO: orderData,
        };

        if (notificationId) {
            orderObject.notificationId = notificationId;
        }

        if (promoCodeApplied === true) {
            orderObject.couponId = couponIdState;
        }

        const newPaymentData = {
            ...orderObject,
        };

        const paymentUrlToBeUsed = () => {
            if (promoCodeApplied === true) {
                return '/api/v2/appointments/payment/bulk/coupon';
            } else {
                return '/api/v2/appointments/payment/bulk';
            }
        };

        const paymentUrl = paymentUrlToBeUsed();
        paymentApiCallhandler(newPaymentData, paymentUrl);
    };

    useEffect(() => {
        if (appointmentModeParams !== '') {
            setPromoCodeObject({
                doctorId: doctorId,
                patientId: patientId,
                rate: rateParams,
                halfRate: halfRateParams,
                apptMode: appointmentModeParams,
            });
        }
    }, [doctorId, patientId, appointmentModeParams]);

    return (
        <div className="container">
            {loading && <TransparentLoader />}
            <Container>
                <Row>
                    <Col md={12}>
                        <div
                            style={{
                                margin: '10% 0% 5% 0%',
                            }}
                        >
                            <div id="price-box">
                                {promoCodeApplied ? (
                                    <span className="price">
                                        $
                                        {appointmentModeParams === 'First Consultation' ||
                                            appointmentModeParams === 'FIRST_CONSULTATION' ||
                                            appointmentModeParams === ''
                                            ? discountApplied
                                            : appointmentModeParams === 'Follow Up' ||
                                                appointmentModeParams === 'FOLLOW_UP'
                                                ? discountApplied
                                                : ''}
                                    </span>
                                ) : (
                                    <span className="price">
                                        $
                                        {appointmentModeParams === 'First Consultation' ||
                                            appointmentModeParams === 'FIRST_CONSULTATION' ||
                                            appointmentModeParams === ''
                                            ? rateParams
                                            : appointmentModeParams === 'Follow Up' ||
                                                appointmentModeParams === 'FOLLOW_UP'
                                                ? rateParams
                                                : ''}
                                    </span>
                                )}

                                <br />
                                <span>
                                    USD /{' '}
                                    {appointmentModeParams === 'First Consultation' ||
                                        appointmentModeParams === 'FIRST_CONSULTATION' ||
                                        appointmentModeParams === ''
                                        ? 'First Consultation'
                                        : appointmentModeParams === 'Follow Up' ||
                                            appointmentModeParams === 'FOLLOW_UP'
                                            ? 'Follow Up'
                                            : ''}
                                </span>
                                <br />
                                <span style={{ fontSize: 12 }}>
                                    100% Satisfaction Guaranteed
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {Object.keys(promoCodeObject).length > 0 && (
                            <PromoCodeForPatient
                                onPromoCodeChange={handlePromoCodeStates}
                                promoCodeData={promoCodeObject}
                            />
                        )}
                    </Col>
                </Row>
                {promoCodeEntered === 'HEALTHIERUAE' ? (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                            if (promoCodeEntered === 'HEALTHIERUAE') {
                                handleFreeCouponTransactions();
                            }
                        }}
                    >
                        Pay Now
                    </button>
                ) : (
                    <Row>
                        <Col md={12} className="mt-4 text-center">
                            <Paypal
                                // appointmentId={appointmentIdParams}
                                appointmentMode={appointmentModeParams}
                                bookappointment={bookAppointment}
                                firstName={firstnameParams}
                                // lastName={lastnameParams}
                                email={emailParams}
                                userId={userIdParams}
                                rate={rateParams}
                                halfRate={halfRateParams}
                            />
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default PaypalMobile;
