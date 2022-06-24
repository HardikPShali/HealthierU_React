import React, { useState } from 'react'
import defaultImage from '../../../images/default_image.jpg'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import educationIcon from '../../../images/svg/education-icon.svg';
import experienceIcon from '../../../images/svg/experience-yellow-icon.svg';
import languageIcon from '../../../images/svg/languages-yellow-icon.svg';
import aboutIcon from '../../../images/svg/about-icon.svg';
import defaultDoctorImage from '../../../images/default_image.png';


const OurDoctorCard = ({ doctor }) => {

    const [openInfoDoctor, setOpenInfoDoctor] = useState(false);

    const openInfoDoctorHandler = () => {
        setOpenInfoDoctor(true);
    }

    const closeInfoDoctorHandler = () => {
        setOpenInfoDoctor(false);
    }


    return (
        <>
            <div className='our-doctor__card' onClick={() => openInfoDoctorHandler()}>
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
            <Dialog
                onClose={() => closeInfoDoctorHandler()}
                aria-labelledby="customized-dialog-title"
                open={openInfoDoctor}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={() => closeInfoDoctorHandler()}
                    className='text-center'
                >
                    Doctor Info
                </DialogTitle>
                <DialogContent>
                    {doctor && (
                        <div className="details-container">
                            <div className="details-wrapper">
                                <div className="details-content__doc-info">
                                    {
                                        doctor.picture ? (
                                            <img src={doctor.picture} alt="" />
                                        ) :
                                            (
                                                <img src={defaultDoctorImage} alt="" />
                                            )
                                    }

                                    <div className='doc-info__modal-header-wrapper'>
                                        <h2 className='doc-info__modal-header'>
                                            {doctor.firstName}{' '}
                                            {doctor.lastName || ""}
                                        </h2>
                                    </div>


                                    <span>
                                        <ul
                                            style={{ fontSize: 12, display: 'block' }}
                                            className="list--tags"
                                        >
                                            {doctor &&
                                                doctor.specialities &&
                                                doctor.specialities.map(
                                                    (speciality, index) => (
                                                        <li key={index}>{speciality.name} </li>
                                                    )
                                                )}
                                        </ul>
                                    </span>
                                </div>
                                <div className="details-body">
                                    <span>About</span>
                                    <div className="details-body__payment">
                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={educationIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="doctor-info-title">Education</div>
                                                <div className="doctor-info-value">
                                                    {doctor &&
                                                        doctor.specialities &&
                                                        doctor.specialities.map(
                                                            (speciality, index) => (
                                                                <li key={index}>{speciality.name} </li>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={experienceIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="doctor-info-title">Experience</div>
                                                <div className="doctor-info-value">
                                                    {doctor.experience}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="details-body__payment">
                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={languageIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="doctor-info-title">Languages</div>
                                                <div className="doctor-info-value">
                                                    {doctor &&
                                                        doctor.languages &&
                                                        doctor.languages.map(
                                                            (language, index) => (
                                                                <li key={index}>{language.name} </li>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        doctor.bio && (
                                            <div className="details-body__payment">
                                                <div className="d-flex align-items-center mb-3">
                                                    <img
                                                        src={aboutIcon}
                                                        alt="icons"
                                                        className="doctor-info-icon"
                                                    />
                                                    <div className="d-flex flex-column align-items-start">
                                                        <div className="doctor-info-title">About</div>
                                                        <div className="doctor-info-value">
                                                            {doctor.bio}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                                <hr />
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <button
                        autoFocus={false}
                        onClick={() => closeInfoDoctorHandler()}
                        className="btn btn-primary"
                        id="close-btn"
                        style={{
                            alignSelf: 'center',
                        }}
                    >
                        Ok
                    </button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OurDoctorCard

//picture url 