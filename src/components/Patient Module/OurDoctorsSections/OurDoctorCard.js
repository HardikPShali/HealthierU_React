import React from 'react'
import home2 from '../../../images/home-2.png'

const OurDoctorCard = () => {
    return (

        <div className='our-doctor__card'>
            <div className='our-doctor__card__img-wrapper'>
                <img src={home2} alt="nutrition" className='img-fluid our-doctor__image' />
            </div>
            <div className='our-doctor__details'>
                <h5 className='our-doctor__name'>Doctor Name</h5>
                <p className='our-doctor__speciality'>Doctor Speciality</p>
            </div>
        </div>

    )
}

export default OurDoctorCard