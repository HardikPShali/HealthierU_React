import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Avatar from 'react-avatar';
import moment from 'moment';
import chatButtonIcon from '../../../images/svg/chat-button-icon.svg';
import calendarIcon from '../../../images/svg/calendar-green.svg';
import timeBig from '../../../images/svg/time-big-icon.svg';
import rightIcon from '../../../images/svg/right-icon.svg';
import infoIcon from '../../../images/svg/info-i-icon.svg';
import helpSupportIcon from '../../../images/svg/help-support-icon.svg';
import rescheduleIcon from '../../../images/svg/reschedule-icon.svg';
import { Link } from 'react-router-dom';

const AppointmentDetailsModal = ({
    selectedAppointment,
    handleAppointmentInfoClose,
    openApptDetails,
    handleClickOpen,
    handleChat,
    setDoctorIdInSession,
    openMoreDoctorInfo,
    from = '',
}) => {
    return (
        <div>
            <Dialog
                onClose={handleAppointmentInfoClose}
                aria-labelledby="customized-dialog-title"
                open={openApptDetails}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleAppointmentInfoClose}
                    style={{ textAlign: 'center' }}
                >
                    Appointment Details
                </DialogTitle>
                <DialogContent dividers>
                    {selectedAppointment && selectedAppointment.doctor && (
                        <div className="details-container">
                            <div className="details-wrapper">
                                <div className="details-content">
                                    {selectedAppointment.doctor.picture ? (
                                        <div className="safari-helper">
                                            <img
                                                src={selectedAppointment.doctor.picture}
                                                alt={`${selectedAppointment.doctor.firstName}-image`}
                                                className="img-circle mt-3"
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
                                                className="my-appointments__modal-avatar"
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
                                            // style={{ fontSize: 12, display: 'block' }}
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
                                    <span>Appointment on</span>

                                    <div className="details-body__appointment">
                                        <div className="details-body__appointment-time-row">
                                            <img
                                                src={calendarIcon}
                                                className="details-body__appointment-time-row-image"
                                            />
                                            <span className="my-patient__common-span">
                                                {moment(selectedAppointment.startTime).format(
                                                    'DD/MM/YY'
                                                )}
                                            </span>
                                        </div>
                                        <div className="details-body__appointment-time-row">
                                            <img
                                                src={timeBig}
                                                className="details-body__appointment-time-row-image"
                                            />
                                            <span className="my-patient__common-span">
                                                {moment(selectedAppointment.startTime).format(
                                                    'hh:mm A'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div
                                    className="details-links"
                                    {...(from === 'upcomingAppointmentTab'
                                        && {
                                        onClick: () => {
                                            setDoctorIdInSession(selectedAppointment.doctor.id)
                                        }
                                    })}
                                >
                                    {from === 'upcomingAppointmentTab' && (
                                        <Link
                                            to={{
                                                pathname: `/patient/reschedule-appointment/${selectedAppointment.id
                                                    }/${selectedAppointment.appointmentMode
                                                        .toLowerCase()
                                                        .replace(' ', '-')}/${selectedAppointment.unifiedAppointment
                                                    }`,
                                            }}
                                        >
                                            <div className="firefox-helper">
                                                <div style={{ display: 'flex', alignItem: 'center' }}>
                                                    <div style={{ width: '100%' }}>
                                                        <img
                                                            width="30"
                                                            height="30"
                                                            src={rescheduleIcon}
                                                            alt=""
                                                            style={{ marginLeft: 15, marginRight: 15 }}
                                                        />
                                                        Reschedule Appointment
                                                    </div>
                                                    <img
                                                        src={rightIcon}
                                                        alt="right-icon"
                                                        style={{ marginLeft: 16, marginRight: 16 }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                    <div className="firefox-helper">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItem: 'center',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => openMoreDoctorInfo()}
                                        >
                                            <div style={{ width: '100%' }}>
                                                <img
                                                    width="30"
                                                    height="30"
                                                    src={infoIcon}
                                                    alt=""
                                                    style={{ marginLeft: 15, marginRight: 15 }}
                                                />
                                                <span>More Info about Doctor</span>
                                            </div>
                                            <img
                                                src={rightIcon}
                                                alt="right-icon"
                                                style={{ marginLeft: 16, marginRight: 16 }}
                                            />
                                        </div>
                                    </div>
                                    <Link
                                        to={{
                                            pathname: `/patient/help-and-support`,
                                            // state: SelectedPatient.patient,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItem: 'center' }}>
                                            <div style={{ width: '100%' }}>
                                                <img
                                                    width="30"
                                                    height="30"
                                                    src={helpSupportIcon}
                                                    // onClick='${pathname}'
                                                    alt=""
                                                    style={{ marginLeft: 15, marginRight: 15 }}
                                                />
                                                Help and Support
                                            </div>
                                            <img
                                                src={rightIcon}
                                                alt="right-icon"
                                                style={{ marginLeft: 16, marginRight: 16 }}
                                            />
                                        </div>
                                    </Link>
                                </div>
                                <hr />
                            </div>
                        </div>
                    )}
                </DialogContent>

                <DialogActions
                    id="chat-buttons"
                    onClose={handleAppointmentInfoClose}
                    aria-labelledby="customized-dialog-title"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    {/* <Link to={`/patient/chat?chatgroup=P${props.currentPatient.id}_D${selectedAppointment?.doctor?.id}`} title="Chat"> */}

                    <button
                        onClick={() => handleChat(selectedAppointment)}
                        className="btn btn-primary"
                        id="close-btn"
                    >
                        <img
                            src={chatButtonIcon}
                            alt="chat-button-icon"
                            style={{ marginRight: 5 }}
                        />
                        Chat
                    </button>
                    {
                        from === 'completedAndCancelledAppointmentTab' && (
                            <button
                                onClick={handleAppointmentInfoClose}
                                className="btn btn-primary"
                                id="close-btn"
                            >
                                OK
                            </button>
                        )
                    }
                    {
                        (from === 'upcomingAppointmentTab' || from === 'calendar') && (
                            <button
                                onClick={() => handleClickOpen(selectedAppointment)}
                                className="btn btn-primary"
                                id="close-btn"
                            >
                                Cancel Appointment
                            </button>
                        )
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AppointmentDetailsModal;
