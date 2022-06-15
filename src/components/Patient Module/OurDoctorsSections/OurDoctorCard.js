import React from 'react'
import Avatar from 'react-calendar'

const OurDoctorCard = ({ doctor }) => {
    console.log({ doctor })
    return (
        <div className='our-doctor__card'>
            <div className='our-doctor__card__img-wrapper'>
                {/* <img src={doctor.picture} alt="nutrition" className='img-fluid our-doctor__image' /> */}
                {doctor.picture ? (
                    <img
                        src={doctor.picture}
                        alt="profile"
                        className='doctor__image'
                    />
                ) : (
                    <Avatar
                        round={true}
                        name={
                            doctor.firstName +
                            ' ' +
                            (doctor.lastName || "")
                        }
                        size={60}
                        className="my-appointment-avatar"
                    />
                )}
            </div>
            <div className='our-doctor__details'>
                <h5 className='our-doctor__name'>{doctor.firstName}</h5>
                <p className='our-doctor__speciality'>{doctor.specialities.length && doctor.specialities[0].name}</p>
            </div>
        </div>
    )
}

export default OurDoctorCard

//picture url 