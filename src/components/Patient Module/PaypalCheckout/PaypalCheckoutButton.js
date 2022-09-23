import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router';


const PaypalCheckoutButton = (props) => {

    const { bookappointment, email, firstName, lastName, rate, halfRate, userId, appointmentId, appointmentMode } = props;

    // ON CANCEL FALLBACK---- STARTS
    const history = useHistory();
    const [cancelSelect, setCancelSelect] = useState(false);

    const handleCancel = () => {
        setCancelSelect(true);
    };
    // ON CANCEL FALLBACK---- ENDS

    return (
        <div>
            <PayPalButtons
                style={{
                    color: 'gold',
                    layout: 'vertical',
                    height: 48,
                    tagline: false,
                    shape: 'rect',
                    size: 'responsive',
                }}
                // onClick={(data, actions) => {
                //     return actions.resolve();
                // }}
                createOrder={(data, actions) => {

                    return actions.order.create({
                        intent: 'CAPTURE',

                        payer: {
                            name: {
                                given_name: firstName,
                                surname: lastName,
                            },
                            email_address: email,
                            phone_with_type: {
                                phone_type: 'MOBILE',
                            },
                        },

                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value:
                                        appointmentMode === 'First Consultation'
                                            ? rate
                                            : halfRate,
                                },
                            },
                        ],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING',
                        },
                    });
                }}
                onApprove={async (data, actions) => {
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
                    // Show a cancel page, or return to MyDoctors
                    handleCancel();
                    if (window.android) {
                        window.android.onPaymentStatusChange(false);
                        window.android.sendOrderData(false);
                    }
                    if (window.webkit) {
                        window.webkit.messageHandlers.onPaymentStatusChange.postMessage(
                            false
                        );
                        window.webkit.messageHandlers.sendOrderData.postMessage(false);
                    }
                }}
                onError={(err) => {
                    console.log(err);
                }}
            />

            {/* ON CANCEL FALLBACK MODAL---- STARTS */}
            <Dialog
                onClose={() => setCancelSelect(true)}
                aria-labelledby="customized-dialog-title"
                open={cancelSelect}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={() => setCancelSelect(true)}
                >
                    You have cancelled your payment. Press OK to go back.
                </DialogTitle>
                <DialogActions>
                    <button
                        autoFocus={false}
                        onClick={() => {
                            if (window.android) {
                                window.android.onPaymentStatusChange(false);
                                window.android.sendOrderData(false);
                            } else if (window.webkit) {
                                window.webkit.messageHandlers.onPaymentStatusChange.postMessage(
                                    false
                                );
                                window.webkit.messageHandlers.sendOrderData.postMessage(false);
                            } else {
                                history.go(0);
                            }
                        }}
                        className="btn btn-primary"
                        id="close-btn"
                    >
                        OK
                    </button>
                </DialogActions>
            </Dialog>
            {/* ON CANCEL FALLBACK MODAL---- ENDS */}
        </div>
    );
};

export default PaypalCheckoutButton;
