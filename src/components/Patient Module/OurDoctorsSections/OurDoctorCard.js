import React from 'react'
import defaultImage from '../../../images/default_image.jpg'

const OurDoctorCard = ({ doctor }) => {
    return (
        <div className='our-doctor__card'>
            <div className='our-doctor__card__img-wrapper'>
                {doctor.picture ? (
                    <img
                        src={doctor.picture}
                        alt="profile"
                        className='doctor__image'
                    />
                ) : (
                    <img
                        src={defaultImage}
                        alt="profile"
                        className='doctor__image'
                    />
                )}
            </div>
            <div className='our-doctor__details'>
                <h5 className='our-doctor__name'>{doctor.firstName}</h5>
                <p className='our-doctor__speciality'>{doctor.specialities.length ? doctor.specialities[0].name : "No Specialities Found"}</p>
            </div>
        </div>
    )
}

export default OurDoctorCard

//picture url 