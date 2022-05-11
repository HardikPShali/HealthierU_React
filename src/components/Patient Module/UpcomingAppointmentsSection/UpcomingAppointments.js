import React from 'react'
import UpcomingAppointmentCard from './UpcomingAppointmentCard'
import './UpcomingAppointments.css'

const UpcomingAppointments = () => {
    return (
        <div className='card-box'>
            <h3 className='upcoming-appointment--main-header'>Upcoming Appointments</h3>
            <UpcomingAppointmentCard />
        </div>
    )
}

export default UpcomingAppointments