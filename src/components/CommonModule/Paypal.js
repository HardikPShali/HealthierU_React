import React, { useRef, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router';

const Paypal = (props) => {
  const { bookappointment, email, firstName, lastName, rate, halfRate, userId, appointmentId, appointmentMode } = props;
  console.log({ appointmentId })
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
  const history = useHistory()
  const [cancelSelect, setCancelSelect] = useState(false);

  const handleCancel = () => {
    setCancelSelect(true);
  }
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
            return actions.order.create({
              intent: 'CAPTURE',
              payer: {
                name: {
                  given_name: firstName,
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
            const order = await actions.order.capture();
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
          },
          onCancel: function (data) {
            // Show a cancel page, or return to MyDoctors
            console.log(data);
            handleCancel();
          },
          onError: (err, a) => {
            console.log(err);
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
            onClick={() => history.go(0)}
            className="btn btn-primary"
            id="close-btn"
          >
            Ok
          </button>
        </DialogActions>
      </Dialog>
      {/* ON CANCEL FALLBACK MODAL---- ENDS */}
    </div>
  );
};

export default Paypal;
