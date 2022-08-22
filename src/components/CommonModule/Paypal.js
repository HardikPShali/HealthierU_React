import React, { useRef, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';

const Paypal = (props) => {
  const {
    bookappointment,
    email,
    firstName,
    rate,
    halfRate,
    userId,
    appointmentMode,
  } = props; //lastName,
  // const { appointmentMode, id: appointmentId } = appointment;
  // const {
  //   // address,
  //   email,
  //   firstName,
  //   lastName,
  //   middleName,
  //   // phone,
  //   userId,
  //   // countryName,
  // } = currentPatient;
  const paypalButton = useRef();

  // ON CANCEL FALLBACK---- STARTS
  const history = useHistory();
  const [cancelSelect, setCancelSelect] = useState(false);

  const handleCancel = () => {
    setCancelSelect(true);
  };
  // ON CANCEL FALLBACK---- ENDS

  useEffect(() => {
    if (window.paypal && window.paypal.Buttons) {
      window.paypal
        .Buttons({
          // style: {
          //   color: 'gold',
          //   layout: 'horizontal',
          //   height: 48,
          //   tagline: false,
          //   shape: 'pill',
          //   size: 'responsive',
          // },
          createOrder: function (data, actions, err) {
            console.log('CreateOrder accessed');
            return actions.order.create({
              intent: 'CAPTURE',
              payer: {
                name: {
                  given_name: firstName,
                  // surname: lastName,
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
                      appointmentMode === 'First Consultation' ||
                        appointmentMode === 'FIRST_CONSULTATION'
                        ? rate
                        : halfRate,
                  },
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          },
          onApprove: async (data, actions, a) => {
            console.log('OnApprove accessed');
            console.log('data', data);
            const order = await actions.order.capture().then(function (details) {
              console.log('details', details);
              return details;
            });
            const {
              id: paymentId,
              intent,
              status: state,
              purchase_units: [
                {
                  // payee: { merchant_id },
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
                name: { given_name },
                payer_id: payerId,
              },
            } = order;
            console.log('paymentmethod', paymentmethod);
            const orderData = {
              // appointmentId,
              appointmentMode,
              intent,
              payerId,
              paymentId,
              paymentmethod:
                paymentmethod === 'PAYPAL *JOHNDOESTES' ||
                  paymentmethod === 'PAYPAL *TEST STORE'
                  ? 'Card'
                  : 'paypal website',
              state,
              transactionAmount,
              transactionCurrency,
              transactionId,
              userName: `${given_name}`,
              userId,
            };
            console.log('paymentmethod', paymentmethod);
            bookappointment(orderData);
          },
          onCancel: (data) => {
            // Show a cancel page, or return to MyDoctors
            console.log(data);
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
          },
          onError: (err, a) => {
            console.log(err);
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
          },
        })
        .render(paypalButton.current);
    }
  }, []);

  return (
    <div>
      <div ref={paypalButton}></div>
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
          You have cancelled you payment. Press OK to go back.
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

export default Paypal;
