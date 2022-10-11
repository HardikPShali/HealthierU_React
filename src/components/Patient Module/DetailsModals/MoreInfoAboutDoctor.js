import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Avatar from 'react-avatar';
import educationIcon from '../../../images/svg/education-icon.svg';
import experienceIcon from '../../../images/svg/experience-yellow-icon.svg';
import languageIcon from '../../../images/svg/languages-yellow-icon.svg';
import aboutIcon from '../../../images/svg/about-icon.svg';

const MoreInfoAboutDoctor = ({
    closeMoreDoctorInfo,
    moreDoctorInfo,
    selectedAppointment
}) => {
    return (
        <div><Dialog
            onClose={closeMoreDoctorInfo}
            aria-labelledby="customized-dialog-title"
            open={moreDoctorInfo}
        >
            <DialogTitle
                id="customized-dialog-title"
                onClose={closeMoreDoctorInfo}
            >
                Doctor Info
            </DialogTitle>
            <DialogContent>
                {selectedAppointment && selectedAppointment.doctor && (
                    <div className="details-container">
                        <div className="details-wrapper">
                            <div className="details-content__doc-info">
                                {/* {console.log("selectedAPP", selectedAppointment)} */}
                                {selectedAppointment.doctor.picture ? (
                                    <div className="safari-helper">
                                        <img
                                            src={selectedAppointment.doctor.picture}
                                            alt=""
                                        />
                                    </div>
                                ) : (
                                    <div className="safari-helper">
                                        <Avatar
                                            round={true}
                                            name={
                                                selectedAppointment.doctor.firstName +
                                                ' ' +
                                                (selectedAppointment.doctor.lastName || '')
                                            }
                                            size={60}
                                            className="doctor-info-avatar"
                                        />
                                    </div>
                                )}

                                <h2 className="my-appointments__header-names">
                                    {selectedAppointment.doctor.salutation}{' '}
                                    {selectedAppointment.doctor.firstName}{' '}
                                    {selectedAppointment.doctor.lastName || ''}
                                </h2>
                                <span>
                                    <ul
                                        //style={{ fontSize: 12, display: 'block' }}
                                        className="list--tags-speciality ul-helper"
                                    >
                                        {selectedAppointment.doctor &&
                                            selectedAppointment.doctor.specialities &&
                                            selectedAppointment.doctor.specialities.map(
                                                (speciality, index) => (
                                                    <li className="specialitiesTags" key={index}>
                                                        {speciality.name}{' '}
                                                    </li>
                                                )
                                            )}
                                    </ul>
                                </span>
                            </div>
                            <div className="details-body">
                                <span>About</span>
                                <div className="details-body__payment">
                                    <div className="d-flex align-items-start flex-column mb-3">
                                        <div className="doctor-info-icon-title">
                                            <img
                                                src={educationIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="doctor-info-title">Education</div>
                                        </div>

                                        {/* <div className="d-flex flex-column align-items-start"> */}
                                        <div className="doctor-info-value">
                                            {selectedAppointment.doctor &&
                                                selectedAppointment.doctor.specialities &&
                                                selectedAppointment.doctor.specialities.map(
                                                    (speciality, index) => (
                                                        <li key={index}>{speciality.name} </li>
                                                    )
                                                )}
                                        </div>
                                        {/* </div> */}
                                    </div>

                                    <div className="d-flex align-items-start flex-column mb-3">
                                        <div className="doctor-info-icon-title">
                                            <img
                                                src={experienceIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="doctor-info-title">Experience</div>
                                        </div>

                                        {/* <div className="d-flex flex-column align-items-start"> */}
                                        <div className="doctor-info-value">
                                            {selectedAppointment.doctor.experienceWithMonths}
                                        </div>
                                        {/* </div> */}
                                    </div>
                                </div>

                                <div className="details-body__payment">
                                    <div className="d-flex align-items-start flex-column mb-3">
                                        <div className="doctor-info-icon-title">
                                            <img
                                                src={languageIcon}
                                                alt="icons"
                                                className="doctor-info-icon"
                                            />
                                            <div className="doctor-info-title">Languages</div>
                                        </div>

                                        <div className="doctor-info-value">
                                            {selectedAppointment.doctor &&
                                                selectedAppointment.doctor.languages &&
                                                selectedAppointment.doctor.languages.map(
                                                    (language, index) => (
                                                        <li key={index}>{language.name} </li>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {
                                    selectedAppointment.doctor.bio && (
                                        <div className="details-body__payment">
                                            <div className="d-flex align-items-start flex-column mb-3">
                                                <div className="doctor-info-icon-title">
                                                    <img
                                                        src={aboutIcon}
                                                        alt="icons"
                                                        className="doctor-info-icon"
                                                    />
                                                    <div className="doctor-info-title">About</div>
                                                </div>

                                                <div className="doctor-info-value">
                                                    {selectedAppointment.doctor.bio}
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
                    onClick={closeMoreDoctorInfo}
                    className="btn btn-primary"
                    id="close-btn"
                    style={{
                        alignSelf: 'center',
                    }}
                >
                    OK
                </button>
            </DialogActions>
        </Dialog></div>
    )
}

export default MoreInfoAboutDoctor