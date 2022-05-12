import React from 'react'
import OurDoctorCard from './OurDoctorCard'
import './OurDoctors.css'
import '../patient.css'

const OurDoctors = () => {
    return (
        <div className="our-doctor__card-box scroller-cardlist">
            <h3 className="our-doctors--main-header">Our Doctors</h3>
            <div className='card-holder'>
                <div className='our-doctor-card'>
                    <div className='row'>
                        <div className='col-md-6 px-2 pb-3'>
                            <OurDoctorCard />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default OurDoctors