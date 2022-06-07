import React, { useRef, useEffect } from 'react';

const Paypal = (props) => {
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
  const paypalButton = useRef();

  useEffect(() => {
    if (window.paypal && window.paypal.Buttons) {
      window.paypal
        .Buttons({
          style: {
            color: 'gold',
            layout: 'horizontal',
            height: 48,
            tagline: false,
            shape: 'pill',
            size: 'responsive',
          },
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
            // Show a cancel page, or return to cart
            console.log(data);
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
    </div>
  );
};

export default Paypal;
