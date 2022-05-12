import React, { useState, useEffect } from 'react'
import UpcomingAppointmentCard from './UpcomingAppointmentCard'
import './UpcomingAppointments.css'
import Cookies from 'universal-cookie'
import { getUpcomingAppointmentsForHomepage } from '../../../service/frontendapiservices'
import { getCurrentPatientInfo } from '../../../service/AccountService'

const UpcomingAppointments = () => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    const cookie = new Cookies();
    const currentUserFromCookie = cookie.get('currentUser');
    console.log('currentUserFromCookie', currentUserFromCookie);

    const getUpcomingAppointments = async () => {
        const patientId = currentUserFromCookie.userId;
        console.log("patientId", patientId);
        if (patientId) {
            const response = await getUpcomingAppointmentsForHomepage(patientId).catch(err => {
                console.log('err', err);
            });
            console.log('Upcoming Appointment response', response);
        }
    }

    useEffect(() => {
        getUpcomingAppointments();
    }, [])

    return (
        <div>
            <h3 className='upcoming-appointment--main-header mb-4 mt-4'>Upcoming Appointments</h3>
            <div className='upcoming-appointment__card-box scroller-cardlist'>

                <div className="card-holder">

                    <div className='row'>
                        <div className='col-md-6 mb-2'>
                            <div className='upcoming-appointment-card'>
                                <UpcomingAppointmentCard />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UpcomingAppointments