import React from 'react'
import UpcomingAppointmentCard from './UpcomingAppointmentCard'
import './UpcomingAppointments.css'

const UpcomingAppointments = () => {
    return (
        <div className='card-box scroller-cardlist'>
            <h3 className='upcoming-appointment--main-header'>Upcoming Appointments</h3>
            <div className="card-holder">
                <div className='upcoming-appointment-card'>
                    <UpcomingAppointmentCard />
                </div>
            </div>
        </div>
    )
}

export default UpcomingAppointments