import React, { useState, useEffect } from 'react';
import { getAppointmentsForHomepage } from '../../../service/frontendapiservices';
const AppoitmentCountsSection = () => {
    const starttime = new Date();
    starttime.setHours(0, 0, 0);
    console.log("starttime", starttime)
    const endtime = new Date();
    endtime.setHours(23, 59, 0);
    console.log("date", endtime);
    const [appointmentsCount, setAppointmentsCount] = useState(0);
    const getAppointmentsCount = async (startTime, endTime) => {
        const response = await getAppointmentsForHomepage(startTime = starttime.toISOString(), endTime = endtime.toISOString()).catch((err) => {
            console.log('err', err);
        });
        if (response.status === 200 || response.status === 201) {
            setAppointmentsCount(response.data.data);
        }

    }
    useEffect(() => {
        getAppointmentsCount();
    }, []);

    return (
        <div>
            <h3 className="appointment-card-header">Overview</h3>
            <section className="page-contain">

                <div className="data-card">
                    <div className='data-card__helper'>
                        <h3 className="appointment-count-h3">{appointmentsCount.totalAppointmentsForTheDay}</h3>
                        <h4 className="appointment-count-h4">Total Appointments</h4>

                    </div>
                </div>
                <div className="data-card1">
                    <div className='data-card__helper'>
                        <h3 className="appointment-count-h3">{appointmentsCount.pendingAppointments}</h3>
                        <h4 className="appointment-count-h4">Today's Pending Appointments</h4>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default AppoitmentCountsSection