import React from 'react'
import { useLocation } from 'react-router';
import Paypal from '../../CommonModule/Paypal';

const PaypalMobile = (props) => {
    // const { bookappointment, doctor, appointment } = props;
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    console.log({ searchParams });
    let userIdParams = searchParams.get("userId");
    let firstnameParams = searchParams.get("firstName");
    let lastnameParams = searchParams.get("lastName");
    let emailParams = searchParams.get("email");
    let appointmentIdParams = searchParams.get("id");
    let appointmentModeParams = searchParams.get("appointmentMode");
    let rateParams = searchParams.get("rate");
    let halfRateParams = searchParams.get("halfRate");


    console.log({ userIdParams })
    console.log({ firstnameParams })
    console.log({ lastnameParams })
    console.log({ emailParams })
    console.log({ appointmentIdParams })
    console.log({ appointmentModeParams })
    console.log({ rateParams })
    console.log({ halfRateParams })

    // let openVideoAndChat = searchParams.get("openVideoCall");

    return (
        <div className='container'>
            <h1>Reached Paypal Mobile Payment</h1>
            {/* <Paypal
                // appointment={appointment}
                appointmentId={appointment.id}
                appointmentMode={appointment.appointmentMode}
                bookappointment={bookappointment}
                // currentPatient={props.currentPatient}
                // doctor={doctor}
                firstName={props.currentPatient.firstName}
                lastName={props.currentPatient.lastName}
                email={props.currentPatient.email}
                userId={props.currentPatient.userId}
                rate={doctor.rate}
                halfRate={doctor.halfRate}
            /> */}
        </div>
    )
}

export default PaypalMobile