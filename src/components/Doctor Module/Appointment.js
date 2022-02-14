import React, { useState, useEffect } from 'react'
// import Footer from './Footer'
//import { Link } from 'react-router-dom'
import './doctor.css'
import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
// import LocalStorageService from './../../util/LocalStorageService';
import Cookies from 'universal-cookie';
import Loader from './../Loader/Loader';
import TransparentLoader from './../Loader/transparentloader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// import { updateApprovedDoctorRRate } from '../../service/adminbackendservices';
import Avatar from 'react-avatar';
import VideocamIcon from '@material-ui/icons/Videocam';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
// import { handleAgoraAccessToken } from '../../service/agoratokenservice';
import {
    createAppointment,
    deleteAvailableAppointment,
    deleteBookedAppointment,
    getDoctorAppointment,
    // getDoctorByUserId
} from '../../service/frontendapiservices';
import momentTz from 'moment-timezone';
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
// import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import { firestoreService } from '../../util';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
        padding: '10px'
    },
}));

const Myappointment = (props) => {

    const [open, setOpen] = useState(false);
    const timeZone = momentTz.tz.guess();
    const { timeZone: currentTimezone, currentDoctor } = props;
    console.log(currentTimezone)
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const eventStyleGetter = (event) => {
        let backgroundColor;
        let color;
        var res = event.unifiedAppointment && event.unifiedAppointment.split("#");
        if (event.startTime >= new Date(moment(new Date()).subtract(25, "minutes")) && event.status === "AVAILABLE") {
            backgroundColor = '#00D1CD';
            color = '#fff';
        }
        else if (event.startTime >= new Date() && event.status === "ACCEPTED" && res[1] !== "CONSULTATION") {
            backgroundColor = '#4f80e2';
            color = '#fff';
        }
        else if (event.startTime <= new Date(moment(new Date()).subtract(25, "minutes"))) {
            backgroundColor = '#a5a5a5';
            color = '#fff';
            var borderColor = '#696969';
            var pointerEvents = 'none';
        }
        else if (res && res[1] === "CONSULTATION") {
            backgroundColor = '#3157a3';
            color = '#fff';
        }
        var style = {
            backgroundColor: backgroundColor,
            color: color,
            borderColor: borderColor,
            pointerEvents: pointerEvents,
            height: '25px',
            padding: '0px 5px'
        };
        return {
            style: style
        };
    }

    const slotStyleGetter = (slot) => {
        let cursor;
        let title;
        let slotClass;
        if (slot >= new Date(moment(new Date()).subtract(25, "minutes"))) {
            cursor = "pointer";
            slotClass = "active";
        }
        if (slot <= new Date(moment(new Date()).subtract(25, "minutes"))) {
            cursor = "default";
            title = "You cannot book an appointment on past time.";
        }
        var style = {
            cursor: cursor
        }
        var className = slotClass;
        var slotTitle = title
        return {
            style: style,
            className: className,
            title: slotTitle
        }
    }
    // const eventStyleGetter = (event) => {
    //     let backgroundColor;
    //     let color;
    //     var res = event.unifiedAppointment && event.unifiedAppointment.split("#");
    //     if (event.startTime >= new Date() && event.status === "AVAILABLE") {
    //         backgroundColor = '#00D1CD';
    //         color = '#fff';
    //     }
    //     else if (event.startTime >= new Date() && event.status === "ACCEPTED" && res[1] !== "CONSULTATION") {
    //         backgroundColor = '#4f80e2';
    //         color = '#fff';
    //     }
    //     else if (event.endTime <= new Date()) {
    //         backgroundColor = '#a5a5a5';
    //         color = '#fff';
    //         var borderColor = '#696969';
    //         var pointerEvents = 'none';
    //     }
    //     else if (res && res[1] === "CONSULTATION") {
    //         backgroundColor = '#3157a3';
    //         color = '#fff';
    //     }
    //     var style = {
    //         backgroundColor: backgroundColor,
    //         color: color,
    //         borderColor: borderColor,
    //         pointerEvents: pointerEvents,
    //         height: '25px',
    //         padding: '0px 5px'
    //     };
    //     return {
    //         style: style
    //     };
    // }

    // const slotStyleGetter = (slot) => {
    //     let cursor;
    //     let title
    //     if (slot >= new Date()) {
    //         cursor = "pointer";
    //         var slotClass = "active";
    //     }
    //     if (slot <= new Date()) {
    //         cursor = "default";
    //         title = "You cannot book an appointment on past time.";
    //     }
    //     var style = {
    //         cursor: cursor
    //     }
    //     var className = slotClass;
    //     var slotTitle = title
    //     return {
    //         style: style,
    //         className: className,
    //         title: slotTitle
    //     }
    // }


    const classes = useStyles();

    //const localizer = momentLocalizer(moment);
    const cookies = new Cookies();

    const [state, setState] = useState([]);
    //const { data } = state;

    const [warningMsg, setWarningMsg] = useState({
        message: ''
    });
    const { message } = warningMsg;

    const [loading, setLoading] = useState(true);
    const [transparentLoading, setTransparentLoading] = useState(false);
    const [serverError] = useState(false); //setServerError
    const [acceptedAppointment, setAcceptedAppointment] = useState([]);

    const [selectedAppointment, setSelectedAppointment] = useState();
    const [openAppointmentInfo, setopenAppointmentInfo] = useState(false);
    //console.log("selectedAppoinment :: ", selectedAppointment)

    const handleAppointmentInfoOpen = (eventData, eventEndTime) => {
        if (eventEndTime) {
            eventData.endTime = eventEndTime;
            setSelectedAppointment(eventData);
            setopenAppointmentInfo(true);
        }
        else {
            setSelectedAppointment(eventData);
            setopenAppointmentInfo(true);
        }
    }

    const handleAppointmentInfoClose = () => {
        setopenAppointmentInfo(false);
    }

    // Dialog for Delete Booked operation
    const [openDelete, setOpenDelete] = useState(false);
    const handleDeleteOpen = (selectedAppointmentData) => {
        setSelectedAppointment(selectedAppointmentData);
        setOpenDelete(true);
    };
    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    // Dialog for Delete Available operation
    const [openAvailableDelete, setOpenAvailableDelete] = useState(false);
    const handleAvailableDeleteOpen = (selectedAppointmentData) => {
        setSelectedAppointment(selectedAppointmentData);
        setOpenAvailableDelete(true);
    };
    const handleAvailableDeleteClose = () => {
        setOpenAvailableDelete(false);
    };

    const [confirmVideo, setConfirmVideo] = useState(false);
    const [alertVideo, setAlertVideo] = useState(false);

    const handleConfirmVideo = () => {
        setConfirmVideo(true);
    };
    const confirmVideoClose = () => {
        setConfirmVideo(false);
    };
    const handleAlertVideo = () => {
        setAlertVideo(true);
    };
    const alertVideoClose = () => {
        setAlertVideo(false);
    };

    const handleVideoCall = (appointmentStartTime) => {
        const AppointmnetBeforeTenMinutes = new Date(appointmentStartTime.getTime() - 2 * 60000);
        const AppointmnetAfter70Minutes = new Date(appointmentStartTime.getTime() + 70 * 60000);
        if (new Date().toISOString() >= AppointmnetBeforeTenMinutes.toISOString() && new Date().toISOString() <= AppointmnetAfter70Minutes.toISOString()) {
            handleConfirmVideo();
        }
        else {
            handleAlertVideo();
        }
    }



    useEffect(() => {
        const { id } = currentDoctor
        id && loadAppointment(id);
    }, [currentDoctor]);

    const newStartDate = new Date().setDate(new Date().getDate() - 30);
    const newEndDate = new Date().setDate(new Date().getDate() + 25);
    const loadAppointment = async (doctorId) => {
        //setLoading(true);


        const dataForSelectedDay = {
            startTime: new Date(newStartDate).toISOString(),
            endTime: new Date(newEndDate).toISOString(),
            doctorId: doctorId,
            status: null
        }
        const res = await getDoctorAppointment(dataForSelectedDay).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
                setTransparentLoading(false);
            }
        });
        if (res && res.data) {
            //setLoading(false);
            const updateArray = [];
            const acceptedArray = [];
            res.data.reverse();
            //console.log("res.data : ", res.data);
            res.data.map((value, index) => {
                if (value.status === "ACCEPTED" || value.status === "AVAILABLE") {
                    updateArray.push({ id: value.id, startTime: new Date(value.startTime), endTime: new Date(value.endTime), title: value.status === "AVAILABLE" ? "Slot Available" : `This is ${value?.patient?.firstName} have ${value.urgency ? value.urgency : "no"} urgency, comments : ${value.remarks ? value.remarks : "no comments"}`, remarks: value.remarks, status: value.status, doctorId: value.doctorId, patientId: value.patientId, patientFirstName: value && value.patient && value.patient.firstName, patientLastName: value && value.patient && value.patient.lastName, unifiedAppointment: value.unifiedAppointment, patient: value?.patient && value.patient })
                }
                if (value.status === "ACCEPTED" && new Date(value.endTime) >= new Date()) {
                    acceptedArray.push({ id: value.id, startTime: new Date(value.startTime), endTime: new Date(value.endTime), remarks: value.remarks, status: value.status, doctorId: value.doctorId, patientId: value.patientId, patient: value.patient, unifiedAppointment: value.unifiedAppointment })
                }
                return value;
            })
            //setState({ ...state, data: updateArray });
            setState(updateArray);
            setAcceptedAppointment(acceptedArray);
            setTimeout(() => setLoading(false), 1000);
            setTimeout(() => setTransparentLoading(false), 1000);
            const tourState = cookies.get("appointmentTour");
            if (!tourState) {
                setIsTourOpen(true)
            }
        }
    }

    ////console.log("UTC string :::", new Date(new Date().toUTCString()).toISOString())
    ////console.log("ISO string :::", new Date().toISOString())

    // const handleSelect = async (start, end) => {
    //     const slotTime = moment(new Date()).subtract(25, "minutes");
    //     if (new Date(start) >= new Date(slotTime)) {
    //         var duplicateFlag = 0;
    //         state && state.map(existingEvnts => {
    //             if (existingEvnts.startTime.toISOString() === start.toISOString()) {
    //                 duplicateFlag = 1;
    //                 setWarningMsg({ ...warningMsg, message: 'You cannot create the slots twice for the same time!' });
    //             }
    //         })
    //         if (start.toISOString() > new Date(new Date().setDate(new Date().getDate() + 21)).toISOString()) {
    //             duplicateFlag = 1;
    //             setWarningMsg({ ...warningMsg, message: 'You cannot make the slots available for booking more than 21 days from current day!' })
    //         }
    //         if (duplicateFlag === 0) {
    //             setTransparentLoading(true);
    //             const payload = {
    //                 doctorId: currentDoctor.id,
    //                 type: "DR",
    //                 status: "AVAILABLE",
    //                 remarks: null,
    //                 startTime: new Date(start).toISOString(),
    //                 endTime: new Date(end).toISOString(),
    //                 timeZone: timeZone
    //             }
    //             const res = await createAppointment(payload).catch(err => {
    //                 if (err.response?.status === 400) {
    //                     setTransparentLoading(false)
    //                     setWarningMsg({ ...warningMsg, message: 'You cannot create the slots twice for the same time!' });
    //                     handleClickOpen();
    //                 }
    //                 if (err.response?.status === 500 || err.response.status === 504) {
    //                     setTransparentLoading(false);
    //                 }
    //             })
    //             ////console.log(res);
    //             if (res && (res.status === 200 || res.status === 201)) {
    //                 //setLoading(true);
    //                 duplicateFlag = 0;
    //                 loadAppointment(currentDoctor.id);
    //             }
    //             //})
    //         }
    //         else if (duplicateFlag === 1) {
    //             handleClickOpen();
    //         }
    //     }
    // }

    // https://dev.healthieru.ae/doctor/chat?chatgroup=P83_D84

    const handleSelect = async ({ slots }) => {
        let slotStartTime;
        let slotEndTime;
        if (slots.length === 2) {
            slotStartTime = slots[0];
            slotEndTime = slots[1];
        }
        else if (slots.length === 1) {
            slotStartTime = slots[0];
            slotEndTime = new Date(moment(slots[0]).add(30, "minutes"));
        }
        console.log("slots ::", slotStartTime, slotEndTime);
        const slotTime = moment(new Date()).subtract(25, "minutes");
        if (new Date(slots[0]) >= new Date(slotTime)) {
            var duplicateFlag = 0;
            state && state.map(existingEvnts => {
                if (existingEvnts.startTime.toISOString() === slots[0].toISOString()) {
                    duplicateFlag = 1;
                    setWarningMsg({ ...warningMsg, message: 'You cannot create the slots twice for the same time!' });
                }
                return existingEvnts;
            })
            if (slots[0].toISOString() > new Date(new Date().setDate(new Date().getDate() + 21)).toISOString()) {
                duplicateFlag = 1;
                setWarningMsg({ ...warningMsg, message: 'You cannot make the slots available for booking more than 21 days from current day!' })
            }
            if (duplicateFlag === 0) {
                setTransparentLoading(true);
                const payload = {
                    doctorId: currentDoctor.id,
                    type: "DR",
                    status: "AVAILABLE",
                    remarks: null,
                    startTime: new Date(slotStartTime).toISOString(),
                    endTime: new Date(slotEndTime).toISOString(),
                    timeZone: timeZone
                }
                const res = await createAppointment(payload).catch(err => {
                    if (err.response?.status === 400) {
                        setTransparentLoading(false)
                        setWarningMsg({ ...warningMsg, message: 'You cannot create the slots twice for the same time!' });
                        handleClickOpen();
                    }
                    if (err.response?.status === 500 || err.response.status === 504) {
                        setTransparentLoading(false);
                    }
                })
                ////console.log(res);
                if (res && (res.status === 200 || res.status === 201)) {
                    //setLoading(true);
                    duplicateFlag = 0;
                    loadAppointment(currentDoctor.id);
                }
                //})
            }
            else if (duplicateFlag === 1) {
                handleClickOpen();
            }
        }
    }
    //console.log("acceptedAppointment ::", acceptedAppointment);
    // Deletion of Available Appointments
    const deleteAvailableAppointments = async (selectedAppointmentData) => {
        setLoading(true);
        handleAvailableDeleteClose();
        const payload = {
            id: selectedAppointmentData.id,
            doctorId: currentDoctor.id,
            type: "DR",
            status: "UNAVAILABLE",
            remarks: selectedAppointmentData.remarks,
            startTime: new Date(selectedAppointmentData.startTime).toISOString(),
            endTime: new Date(selectedAppointmentData.endTime).toISOString(),
            timeZone: timeZone
        };
        const res = await deleteAvailableAppointment(payload).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res.status === 200 || res.status === 201) {
            loadAppointment(currentDoctor.id);
        }
    };

    // Deletion of Booked Appointments
    const handleDelete = async (selectedAppointmentData) => {
        setLoading(true);
        handleDeleteClose();
        const payload = {
            id: selectedAppointmentData.id,
            patientId: selectedAppointmentData.patientId,
            doctorId: currentDoctor.id,
            type: "DR",
            status: "CANCELLED_BY_DOCTOR",
            remarks: selectedAppointmentData.remarks,
            startTime: new Date(selectedAppointmentData.startTime).toISOString(),
            endTime: new Date(selectedAppointmentData.endTime).toISOString(),
            timeZone: timeZone
        }
        const res = await deleteBookedAppointment(payload).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res.status === 200 || res.status === 201) {
            loadAppointment(currentDoctor.id);
            //selectedAppointmentData.doctorId = currentDoctor.id;
            //console.log("selectedAppointmentData on Appointment.js :: ", payload);
            firestoreService.sendCancelAppointmentToFirestoreMessage(selectedAppointmentData, 'doctor', currentDoctor);
        }
    };


    //const newStartDate = new Date().setDate(new Date().getDate() - 30);
    //const newEndDate = new Date().setDate(new Date().getDate() + 21);

    const handleSlotInfo = (event) => {
        if (event.status === "ACCEPTED") {
            handleAppointmentInfoOpen(event);
        }
    }

    //const getMoment = (timezone) => {
    //    const m = (...args) => momentTz.tz(...args, timezone);
    //    m.localeData = momentTz.localeData;
    //    return m;
    //};

    //const moment     = getMoment(currentTimezone);
    const localizer = momentLocalizer(moment);

    // React Tour code

    const [isTourOpen, setIsTourOpen] = useState(false);

    const disableBody = target => disableBodyScroll(target);
    const enableBody = target => enableBodyScroll(target);

    const closeTour = () => {
        cookies.set("appointmentTour", false);
        setIsTourOpen(false);
        window.scrollTo(0, 0);
    };

    // const accentColor = "#5cb7b7";

    const tourConfig = [
        {
            selector: '.rbc-calendar',
            content: `This Calendar is used to create appointment slots for patients.`
        },
        {
            selector: '.rbc-today .rbc-time-slot:nth-child(1)',
            content: `Click here to create a appointment slot for patient as per your current time.`
        },
        {
            selector: '.rbc-toolbar',
            content: `Navigate the Calendar as per your requirement, change the view and check your agenda for the week, month etc.`
        },
        {
            selector: '.calendar-color',
            content: `These color combinations used for displaying appointment types on calendar.`
        },
        {
            selector: '.available',
            content: `Here, you can see the list of appointment slots which are avilable for booking.`
        },
        {
            selector: '.booked',
            content: () => (
                <div>
                    <p>Here, you can see the list of appointment slots which are booked as Followup or Consultation.</p>
                    <button className="btn btn-primary" onClick={() => closeTour()}>Got it</button>
                </div>
            )
        }
    ]

    if (isTourOpen) {
        document.body.style.color = "#00000080";
    }
    else {
        document.body.style.color = "unset";
    }


    const TouchCellWrapper = ({ children, value, handleSelect }) =>
        React.cloneElement(React.Children.only(children), {
            onTouchEnd: () => handleSelect({ slots: [value] })
        });


    return (
        <div>
            {loading && (
                <Loader />
            )}
            {transparentLoading && (
                <TransparentLoader />
            )}
            {serverError && (
                <>
                    <center>
                        <h2>Something went wrong. Try again after some time!</h2>
                        <p>You will be redirected to HomePage in 5 sec.</p>
                    </center>
                </>
            )}
            {!loading && (<>
                <br />
                <br />
                <Container>
                    <Row>
                        <Col>
                            <Tooltip title="Take a appointment calendar tour again." arrow>
                                <button onClick={() => setIsTourOpen(true)} className="howToBtn">
                                    <span>How to?</span>
                                </button>
                            </Tooltip>
                            <br />
                            <Calendar
                                components={{
                                    dateCellWrapper: (props) => (
                                        <TouchCellWrapper onSelectSlot={handleSelect} {...props} />
                                    ),
                                }}
                                selectable={true}
                                localizer={localizer}
                                events={state}
                                defaultView={Views.WEEK}
                                startAccessor="startTime"
                                endAccessor="endTime"
                                titleAccessor="title"
                                style={{ height: 500 }}
                                // min={new Date(new Date().setHours(0,0,0))}
                                // max={new Date(new Date().setHours(23,59,59))}
                                timeslots={1}
                                step={30}
                                onSelecting={slot => false}
                                onSelectEvent={event => handleSlotInfo(event)}
                                onSelectSlot={handleSelect}
                                eventPropGetter={(event) => eventStyleGetter(event)}
                                slotPropGetter={(event) => slotStyleGetter(event)}
                            />
                        </Col>
                    </Row>
                    <br />
                    <div className="calendar-color">
                        <span className="followupColor">Follow up Appointment</span>
                        <span className="consultationColor">Consultation Appointment</span>
                        <span className="availableColor">Available Appointment</span><br />
                    </div>
                    <hr />
                    <Row className="mt-3">
                        <Col md={12}><h2 className="mt-3 mb-3 text-center">List of Appointments</h2></Col>
                        <Col md={6}>
                            <div className="appointment-slot-list booked">
                                <h3 className="mb-3 text-center">Booked Appointments</h3>
                                {acceptedAppointment && (
                                    <div className={classes.root}>
                                        {acceptedAppointment.map((appointment, index) => {
                                            if (appointment.status && new Date(appointment.endTime) >= new Date() && appointment.status === "ACCEPTED") {

                                                if (appointment.unifiedAppointment === (acceptedAppointment[index + 1] && acceptedAppointment[index + 1].unifiedAppointment)) {
                                                    return (<Chip key={index} label={moment(appointment.startTime).format("MMM, DD YYYY") + "  ( " + moment(appointment.startTime).format("h:mm A") + " - " + moment(acceptedAppointment[index + 1].endTime).format("h:mm A") + " )  "}
                                                        clickable
                                                        className="consultation"
                                                        onClick={() => handleAppointmentInfoOpen(appointment, acceptedAppointment[index + 1].endTime)}
                                                        onDelete={() => handleDeleteOpen(appointment)}
                                                        deleteIcon={<CancelIcon />} />)
                                                }
                                                else if ((appointment.unifiedAppointment !== (acceptedAppointment[index + 1] && acceptedAppointment[index + 1].unifiedAppointment)) && (appointment.unifiedAppointment === (acceptedAppointment[index - 1] && acceptedAppointment[index - 1].unifiedAppointment))) {
                                                    return false;
                                                }
                                                else if (((appointment.unifiedAppointment !== (acceptedAppointment[index + 1] && acceptedAppointment[index + 1].unifiedAppointment)) &&
                                                    (appointment.unifiedAppointment !== (acceptedAppointment[index - 1] && acceptedAppointment[index - 1].unifiedAppointment)))) {
                                                    return (<Chip key={index} label={moment(appointment.startTime).format("MMM, DD YYYY") + "  ( " + moment(appointment.startTime).format("h:mm A") + " - " + moment(appointment.endTime).format("h:mm A") + " )  "}
                                                        clickable
                                                        className="followup"
                                                        onClick={() => handleAppointmentInfoOpen(appointment)}
                                                        onDelete={() => handleDeleteOpen(appointment)}
                                                        deleteIcon={<CancelIcon />} />)
                                                }
                                            }
                                            return appointment;
                                        })}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="appointment-slot-list available">
                                <h3 className="mb-3 text-center">Available Appointments</h3>
                                {state && (
                                    <div className={classes.root}>
                                        {state.map((appointment, index) => {
                                            ////console.log("appointment :::::::::",appointment);
                                            if (appointment.status && new Date(appointment.startTime) >= new Date(moment(new Date()).subtract(25, "minutes")) && appointment.status === "AVAILABLE") {
                                                return (<Chip key={index} label={moment(appointment.startTime).format("MMM, DD YYYY") + "  ( " + moment(appointment.startTime).format("h:mm A") + " - " + moment(appointment.endTime).format("h:mm A") + " )  "}
                                                    clickable
                                                    className="available"
                                                    onDelete={() => handleAvailableDeleteOpen(appointment)}
                                                    deleteIcon={<CancelIcon />} />)
                                            }

                                        })}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Tour
                        onRequestClose={() => closeTour()}
                        startAt={0}
                        steps={tourConfig}
                        isOpen={isTourOpen}
                        maskClassName="mask"
                        className="helper"
                        rounded={5}
                        //accentColor={accentColor}
                        onAfterOpen={disableBody}
                        onBeforeClose={enableBody}
                    />
                </Container>
                <br />
                <br />
                {/* <Footer /> */}
                <Dialog onClose={handleAppointmentInfoClose} aria-labelledby="customized-dialog-title" open={openAppointmentInfo}>
                    <DialogTitle id="customized-dialog-title" onClose={handleAppointmentInfoClose}>
                        Appointment Information!
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedAppointment && selectedAppointment.patient && (
                            <div>
                                <Row id="doc-row">
                                    <Col xs={5}>
                                        <div className="doc-img" style={{ width: '140px' }}>
                                            {selectedAppointment.patient.picture ? (<img src={selectedAppointment.patient.picture} alt="" />)
                                                : (<Avatar name={selectedAppointment.patient.firstName + " " + selectedAppointment.patient.lastName} />)}
                                        </div>
                                    </Col>
                                    <Col xs={7} id="doc-details">
                                        <div>
                                            <b className="doc-name">{selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}</b><br />
                                            <span>Country Of Residence: <br /><b>{selectedAppointment.patient.country.name}</b></span><br />
                                        </div>
                                    </Col>
                                </Row><br />
                                <div className="mr-4 ml-4">
                                    <b>Date/Time: </b>{moment(selectedAppointment.startTime).format("MMM, DD YYYY") + "  ( " + moment(selectedAppointment.startTime).format("h:mm A") + " - " + moment(selectedAppointment.endTime).format("h:mm A") + " ) "}
                                    <br />
                                    <b>Comments: </b>{selectedAppointment.remarks}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions id="chat-buttons">
                        <Link to={`/doctor/chat?chatgroup=P${selectedAppointment?.patient?.id}_D${currentDoctor.id}`} title="Chat">
                            <IconButton>
                                <ChatIcon id="active-video-icon" />
                            </IconButton>
                        </Link>
                        <IconButton onClick={() => handleVideoCall(selectedAppointment.startTime)}>
                            <VideocamIcon id="active-video-icon" />
                        </IconButton>
                        <button autoFocus onClick={handleAppointmentInfoClose} className="btn btn-primary">
                            Ok
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {message}
                    </DialogTitle>
                    <DialogActions>
                        <button autoFocus onClick={handleClose} className="btn btn-primary" id="close-btn">
                            Ok
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={handleDeleteClose} aria-labelledby="customized-dialog-title" open={openDelete}>
                    <DialogTitle id="customized-dialog-title" onClose={handleDeleteClose}>
                        Are you sure to cancel the booked appointment!
                    </DialogTitle>
                    <DialogActions>
                        <button autoFocus onClick={() => handleDelete(selectedAppointment)} className="btn btn-primary" id="close-btn">
                            Ok
                        </button>
                        <button autoFocus onClick={handleDeleteClose} className="btn btn-secondary" id="close-btn">
                            Close
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={handleAvailableDeleteClose} aria-labelledby="customized-dialog-title" open={openAvailableDelete}>
                    <DialogTitle id="customized-dialog-title" onClose={handleAvailableDeleteClose}>
                        Are you sure you want to remove this slot ?
                    </DialogTitle>
                    <DialogActions>
                        <button autoFocus onClick={() => deleteAvailableAppointments(selectedAppointment)} className="btn btn-primary" id="close-btn">
                            Ok
                        </button>
                        <button autoFocus onClick={handleAvailableDeleteClose} className="btn btn-secondary" id="close-btn">
                            Close
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={confirmVideoClose} aria-labelledby="customized-dialog-title" open={confirmVideo}>
                    <DialogTitle id="customized-dialog-title" onClose={confirmVideoClose}>
                        Do you want to Start Video Call
                    </DialogTitle>
                    <DialogActions>
                        <Link to={`/doctor/chat?chatgroup=P${selectedAppointment?.patientId}_D${selectedAppointment?.doctorId}&openVideoCall=true`}><button autoFocus
                            //onClick={() => handleAgoraAccessToken({ name: "" + selectedAppointment.doctorId + "" + selectedAppointment.patientId + "" + selectedAppointment.id + "", id: selectedAppointment.id })} 
                            className="btn btn-primary" id="close-btn">
                            Yes
                        </button></Link>
                        <button autoFocus onClick={confirmVideoClose} className="btn btn-primary" id="close-btn">
                            No
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={alertVideoClose} aria-labelledby="customized-dialog-title" open={alertVideo}>
                    <DialogTitle id="customized-dialog-title" onClose={alertVideoClose}>
                        Video call is possible only starting 2 Minutes before the Appointment Time
                    </DialogTitle>
                    <DialogActions>
                        <button autoFocus onClick={alertVideoClose} className="btn btn-primary" id="close-btn">
                            Ok
                        </button>
                    </DialogActions>
                </Dialog>
            </>)}
        </div>
    );
}
export default Myappointment;