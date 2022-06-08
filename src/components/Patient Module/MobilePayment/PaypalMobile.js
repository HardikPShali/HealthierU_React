import React from 'react'
import { useLocation } from 'react-router';
import Paypal from '../../CommonModule/Paypal';

const PaypalMobile = (props) => {
    const { bookappointment, doctor, appointment } = props; //
    const location = useLocation();

    const searchParams = new URLSearchParams(location);
    console.log({ searchParams });
    // let chatGroup = searchParams.get("chatgroup");
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