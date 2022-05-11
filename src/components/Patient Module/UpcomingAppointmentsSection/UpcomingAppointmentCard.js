import React from 'react'
import home2 from '../../../images/home-2.png'
import { Link } from 'react-router-dom'

const UpcomingAppointmentCard = () => {
    return (
        <div>
            <Link to="/patient/nutrition">
                <div className="card-holder">
                    <div className='upcoming-appointment-card'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='upcoming-appointment-card__img-wrapper'>
                                    <img src={home2} alt="nutrition" className='img-fluid' />
                                </div>
                            </div>
                            <div className='col-md-8'>
                                <div className='upcoming-appointment-card__card-details'>
                                    <h5 className='upcoming-appointment-card__doctor-name'>Doctor Name</h5>
                                    <span className='upcoming-appointment-card__common-span'>Doctor Specialities</span>
                                    <div className='upcoming-appointment-card__card-details--date-div'>
                                        <span className='upcoming-appointment-card__common-span'>Date</span>
                                        <span className='upcoming-appointment-card__common-span'>Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default UpcomingAppointmentCard