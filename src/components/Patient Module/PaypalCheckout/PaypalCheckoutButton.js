import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PaypalCheckoutButton = (props) => {
    const { appointment, bookappointment, currentPatient, doctor } = props;
    const { appointmentMode, id: appointmentId } = appointment;
    const {
        // address,
        email,
        firstName,
        lastName,
        middleName,
        // phone,
        userId,
        // countryName,
    } = currentPatient;

    return (
        <div>
            <PayPalButtons
                style={{
                    color: 'gold',
                    layout: 'horizontal',
                    height: 48,
                    tagline: false,
                    shape: 'pill',
                    size: 'responsive',
                }}
                onClick={(data, actions) => {
                    console.log('data', data);
                    return actions.resolve();
                }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        payer: {
                            name: {
                                given_name: firstName,
                                middle_name: middleName,
                                surname: lastName,
                            },
                            email_address: email,
                            // address: {
                            //   address_line_1: "abudhabi",
                            //   address_line_2: "23",
                            //   admin_area_2: countryName,
                            //   admin_area_1: address,
                            //   country_code: "AE",
                            // },
                            phone_with_type: {
                                phone_type: 'MOBILE',
                            },
                        },

                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value:
                                        appointmentMode === 'CONSULTATION'
                                            ? doctor.rate
                                            : doctor.halfRate,
                                },
                            },
                        ],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING',
                        },
                    });
                }}
                onShippingChange={(data, actions) => {
                    console.log('onShippingChange', data, actions);
                }}
                onApprove={async (actions) => {
                    const order = await actions.order.capture();
                    const {
                        id: paymentId,
                        intent,
                        status: state,
                        purchase_units: [
                            {
                                soft_descriptor: paymentmethod,
                                payments: {
                                    captures: [
                                        {
                                            id: transactionId,
                                            amount: {
                                                currency_code: transactionCurrency,
                                                value: transactionAmount,
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        payer: {
                            name: { given_name, surname },
                            payer_id: payerId,
                        },
                    } = order;
                    const orderData = {
                        appointmentId,
                        appointmentMode,
                        intent,
                        payerId,
                        paymentId,
                        paymentmethod: paymentmethod || 'paypal website',
                        state,
                        transactionAmount,
                        transactionCurrency,
                        transactionId,
                        userName: `${given_name} ${surname}`,
                        userId,
                    };
                    bookappointment(orderData);
                }}
                onCancel={(data) => {
                    console.log(data);
                }}
                onError={(err) => {
                    console.log(err);
                }}
            />
        </div>
    );
};

export default PaypalCheckoutButton;
