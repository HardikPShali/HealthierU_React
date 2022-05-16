import React from 'react';


const AppoitmentCounts = [
    {
        numberOftotalAppointment: 10,
        total: 'Total Appointments'
    },
    {
        numberOfpendingAppointment: 0,
        pending: 'Pending Appointments'
    },
]


const AppoitmentCountsSection = () => {
    return (
        <div>
            <h3 className="appointment-card-header">Overview</h3>
            <section className="page-contain">

                <div className="data-card">
                    {AppoitmentCounts.map((item, index) => {
                        return (
                            <div>
                                <h3 className="appointment-count-h3">{item.numberOftotalAppointment}</h3>
                                <h4 className="appointment-count-h4">{item.total}</h4>

                            </div>
                        )
                    })}
                </div>



                <div className="data-card1">
                    {AppoitmentCounts.map((item, index) => {
                        return (
                            <div>
                                <h3 className="appointment-count-h3">{item.numberOfpendingAppointment}</h3>
                                <h4 className="appointment-count-h4">{item.pending}</h4>

                            </div>
                        )
                    })}
                </div>

            </section>

            {/* 

            <div className='appointmentcount'>
                <div className='container'>
                    <div className='row'>
                        {AppoitmentCounts.map((item, index) => {
                            return (
                                <div className='col-4 text-center' key={index}>
                                    <h6 className='appointmentcount-name'>{item.numberOftotalAppointment}</h6>
                                    <h6 className='appointmentcount-name'>{item.total}</h6>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div>
            <div className='appointmentcount'>
                <div className='container'>
                    <div className='row'>
                        {AppoitmentCounts.map((item, index) => {
                            return (
                                <div className='col-4 text-center' key={index}>
                                    <h6 className='appointmentcount-name'>{item.numberOfpendingAppointment}</h6>
                                    <h6 className='appointmentcount-name'>{item.pending}</h6>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default AppoitmentCountsSection