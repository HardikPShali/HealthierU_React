import React from 'react'
import home2 from '../../../images/home-2.png'
import moment from 'moment';


const UpcomingAppointmentCard = ({ appointment }) => {


    return (
        // console.log('UA', appointments)
        < div className='row' >
            {/* {console.log('UA', appointment)} */}
            <div className='col-md-4'>
                <div className='upcoming-appointment-card__img-wrapper'>
                    <img src={home2} alt="nutrition" className='img-circle' />
                </div>
            </div>
            <div className='col-md-8'>
                <div className='upcoming-appointment-card__card-details'>
                    <h5 className='upcoming-appointment-card__doctor-name'>{appointment.doctor.firstName}</h5>
                    <span className='upcoming-appointment-card__common-span'>
                        Specialities
                    </span>
                    <div className='upcoming-appointment-card__card-details--date-div'>
                        <span className='upcoming-appointment-card__common-span'>{moment(appointment.startTime).format("DD/MM/YY")}</span>
                        <span className='upcoming-appointment-card__common-span'>{moment(appointment.startTime).format("hh:mm A")}</span>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default UpcomingAppointmentCard