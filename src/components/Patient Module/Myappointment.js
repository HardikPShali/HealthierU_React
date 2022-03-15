import React, { useState, useEffect } from 'react'
//import Footer from './Footer'
import './patient.css'
import { Container, Row, Col } from 'react-bootstrap'
import moment from 'moment';
//import LocalStorageService from './../../util/LocalStorageService';
//import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Loader from './../Loader/Loader';
import CancelIcon from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Avatar from 'react-avatar';
import VideocamIcon from '@material-ui/icons/Videocam';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
//import { handleAgoraAccessToken } from '../../service/agoratokenservice';
import { deleteAppointment, getAppointmentListByPatientId } from '../../service/frontendapiservices';
import momentTz from 'moment-timezone';
import { firestoreService } from '../../util';
// import { handleAgoraAccessToken } from '../../service/agoratokenservice';
//import { checkAccessToken } from '../../service/RefreshTokenService';
// import Cookies from 'universal-cookie';
// import Footer from './Footer'
// import LocalStorageService from './../../util/LocalStorageService';
// import axios from 'axios';

//const docprofile = './src/images/doctor/'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
        padding: '10px'
    },
}));
const app = makeStyles(() => ({
    height:'4%',
    width: '145px'
}));

const Myappointment = (props) => {
    const [myAppointment, setMyAppoitment] = useState([]);
    const [loading, setLoading] = useState(true);
    const localizer = momentLocalizer(moment);
    // const [currentPatient, setCurrentPatient] = useState({}); // no longer required delete future ady-delete
    const timeZone = momentTz.tz.guess();

    // state for selectAppointment for delete operation
    const [selectedAppointment, setSelectedAppointment] = useState();
    //console.log("selectedAppointment  ::", selectedAppointment)

    const [hourDifference, setHourDifference] = useState(0);

    const [open, setOpen] = useState(false);
    const [openAppointmentInfo, setopenAppointmentInfo] = useState(false);
    const handleClickOpen = (appointmentData) => {
        const now = new Date().getTime();
        const appointmentDate = new Date(appointmentData.startTime).getTime();
        diff_hours(now, appointmentDate);
        setSelectedAppointment(appointmentData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleAppointmentInfoOpen = (eventData) => {
        setSelectedAppointment(eventData);
        setopenAppointmentInfo(true);
    }

    const handleAppointmentInfoClose = () => {
        setopenAppointmentInfo(false);
    }

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

    const eventStyleGetter = (event) => {
        let backgroundColor;
        let color;
        var res = event.unifiedAppointment && event.unifiedAppointment.split("#");
        if (event.startTime >= new Date() && event.status === "ACCEPTED" && res[1] !== "CONSULTATION") {
            backgroundColor = '#4f80e2';
            color = '#fff';
        }
        else if (event.endTime <= new Date()) {
            backgroundColor = '#a5a5a5';
            color = '#fff';
            var borderColor = '#696969';
            var pointerEvents = 'none';
        }
        else if (res[1] === "CONSULTATION") {
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

    //const cookies = new Cookies();

    const classes = useStyles();
    useEffect(() => {
        props.currentPatient.id && getMyAppointmentList(props.currentPatient.id);
    }, [props.currentPatient]);
    
    // current patient is comming from props delete in future ady-delete
    // const currentLoggedInUser = cookies.get("currentUser");
    // const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
    // const getCurrentPatient = async () => {
    //     function setData(res) {
    //         if (res && res.data) {

    //             res.data.map((value, index) => {
    //                 if (value.userId === loggedInUserId) {
    //                     const currentPatientId = value.id;
    //                     setCurrentPatient({ ...currentPatient, id: currentPatientId });
    //                     getMyAppointmentList(currentPatientId);
    //                 }
    //             })
    //         }
    //     }
    //     const res = await getLoggedInUserDataByUserId(loggedInUserId).catch(err => {
    //         if (err.response.status === 500 || err.response.status === 504) {
    //             setLoading(false);
    //         }
    //     });
    //     if (res) {
    //         setData(res)
    //     }
    // }

    const getMyAppointmentList = async (patientId) => {
        const newStartDate = new Date().setDate(new Date().getDate() - 30);
        const newEndDate = new Date().setDate(new Date().getDate() + 21);

        const myAppointmentFilter = {
            //startTime: new Date(newStartDate).toISOString(),
            endTime: new Date(newEndDate).toISOString(),
            patientId: patientId,
            status: "ACCEPTED"
            
            
        }
        const response = await getAppointmentListByPatientId(myAppointmentFilter).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
       
        if (response.status === 200 || response.status === 201) {
            if (response && response.data) {
                //console.log("response.data ::: ", response.data)
                const updateArray = [];
                response.data.reverse();
                response.data.map((value, index) => {
                    
                    if (value.status === "ACCEPTED") {
                        if (value.unifiedAppointment === (response.data[index + 1] && response.data[index + 1].unifiedAppointment)) {
                       
                   
                            updateArray.push( 
                                { id: value.id, patientId: value.patientId, doctorId: value.doctorId, doctor: value.doctor, title: `Appointment booked with Dr. ${value?.doctor?.firstName} with ${value.urgency ? value.urgency : "no"} urgency, comments : ${value.remarks ? value.remarks : "no comments"}`, startTime: new Date(value.startTime), endTime: new Date(response.data[index + 1].endTime), remarks: value.remarks, status: value.status, appointmentId: value.appointmentId, unifiedAppointment: value.unifiedAppointment}
                                );
                           
                        }
                        else if ((value.unifiedAppointment !== (response.data[index + 1] && response.data[index + 1].unifiedAppointment)) &&
                            (value.unifiedAppointment === (response[index - 1] && response[index - 1].unifiedAppointment))) {
                            return false;
                        }
                        else if (((value.unifiedAppointment !== (response.data[index + 1] && response.data[index + 1].unifiedAppointment)) &&
                            (value.unifiedAppointment !== (response.data[index - 1] && response.data[index - 1].unifiedAppointment)))) {
                            updateArray.push({ id: value.id, patientId: value.patientId, doctorId: value.doctorId, doctor: value.doctor, startTime: new Date(value.startTime), endTime: new Date(value.endTime), remarks: value.remarks, status: value.status, appointmentId: value.appointmentId, unifiedAppointment: value.unifiedAppointment });
                           
                        }
                    } //  
                    
                })
             
                setMyAppoitment(updateArray);
                setTimeout(() => setLoading(false), 1000);
            }

        } 
        

    }

    const handleDelete = async (selectedAppointment) => {
        const {currentPatient,doctorDetailsList}=props;
        setLoading(true);
        handleClose();
        const payload = {
            id: selectedAppointment.id,
            patientId: selectedAppointment.patientId,
            doctorId: selectedAppointment.doctorId,
            type: "DR",
            status: "CANCELLED_BY_PATIENT",
            remarks: selectedAppointment.remarks,
            startTime: new Date(selectedAppointment.startTime).toISOString(),
            endTime: new Date(selectedAppointment.endTime).toISOString(),
            timeZone: timeZone
        }
        const res = await deleteAppointment(payload).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res?.status === 200 || res?.status === 201) {
            firestoreService.sendCancelAppointmentToFirestoreMessage(selectedAppointment, 'patient',currentPatient,doctorDetailsList);
            getMyAppointmentList(currentPatient.id);
            handleClose();

        }
        //})
    };

    const diff_hours = (date1, date2) => {
        const diffHours = date2 - date1;
        const hours = diffHours / (1000 * 60 * 60);
        setHourDifference(hours);
    }

    const {currentPatient,doctorDetailsList}=props;

    //console.log("myAppointment ::::::::", myAppointment);
    return (
        <div>
            {loading && (
                <Loader />
            )}
            {!loading && (<>
                <br />
                <br />
                <Container>
                    <Row>
                        <Col>
                            <Calendar
                                selectable={true}
                                localizer={localizer}
                                events={myAppointment}
                                defaultView={Views.WEEK}
                                startAccessor="startTime"
                                endAccessor="endTime"
                                titleAccessor="title"
                                eventPropGetter={(event) => eventStyleGetter(event)}
                                style={{ height: 500 }}
                                //min={new Date(new Date(newStartDate).setHours(6,0))}
                                //max={new Date(new Date(newEndDate).setHours(21,0))}
                                timeslots={1}
                                step={60}
                                onSelectEvent={event => handleAppointmentInfoOpen(event)}
                            />
                        </Col>
                    </Row>
                    <br />
                    <hr />
                    <Row className="mt-3">
                        <Col md={12}><h2 className="mt-3 mb-3 text-center font-weight-bold"><u>List of Appointments</u></h2></Col>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <div style={{ padding: '10px 0', border: '2px solid #e4e4e4', background: '#efef', }}>
                                <h5 className="mb-3 text-center font-weight-bold"><u>Booked Appointments</u></h5>
                                {myAppointment && Array.isArray(myAppointment) && myAppointment.length > 0 && (
                                    <div className={classes.root}>
                                        {myAppointment.map((appointment, index) => {
                                            if (appointment.status && new Date(appointment.endTime) >= new Date() && appointment.status === "ACCEPTED") {
                                                var res = appointment.unifiedAppointment.split("#");
                                                return (<Chip key={index} label={moment(appointment.startTime).format("MMM, DD YYYY") + "  ( " + moment(appointment.startTime).format("h:mm A") + " - " + moment(appointment.endTime).format("h:mm A") + " )  "}
                                                    clickable
                                                    className={res[1] === "CONSULTATION" ? 'consultation' : 'followup'}
                                                    onClick={() => handleAppointmentInfoOpen(appointment)}
                                                    onDelete={() => handleClickOpen(appointment)}
                                                    deleteIcon={<CancelIcon />} />)
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                </Container>
                <br />
                <br />
                {/* <Footer /> */}
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Are you sure you want to cancel?
                </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            {hourDifference < 24 && (<span>You are cancelling less then 24h prior the appointment start time, unfortunately you will not be reimbursed</span>)}
                            {hourDifference > 24 && (<span>Your refund will come next week and 5% service fees will be deducted</span>)}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <button autoFocus onClick={() => handleDelete(selectedAppointment)} className="btn btn-primary">
                            Ok
                    </button>
                        <button autoFocus onClick={handleClose} className="btn btn-secondary">
                            Cancel
                    </button>
                    </DialogActions>
                </Dialog>

                <Dialog onClose={handleAppointmentInfoClose} aria-labelledby="customized-dialog-title" open={openAppointmentInfo}>
                    <DialogTitle id="customized-dialog-title" onClose={handleAppointmentInfoClose}>
                        Appointment Information!
                </DialogTitle>
                    <DialogContent dividers>
                        {selectedAppointment && selectedAppointment.doctor && (
                            <div>
                                <Row id="doc-row">
                                    <Col xs={5}>
                                        <div className="doc-img" style={{ width: '140px' }}>
                                            {selectedAppointment.doctor.picture ? (<img src={selectedAppointment.doctor.picture} alt="" />)
                                                : (<Avatar name={selectedAppointment.doctor.firstName + " " + selectedAppointment.doctor.lastName} />)}
                                        </div>
                                    </Col>
                                    <Col xs={7} id="doc-details">
                                        <div>
                                            <b className="doc-name">{selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}</b><br />
                                            <ul style={{ fontSize: 12, display: "block" }} className="list--tags">
                                                {selectedAppointment.doctor && selectedAppointment.doctor.specialities && selectedAppointment.doctor.specialities.map((speciality, index) =>
                                                    (<li key={index}>{speciality.name} </li>)
                                                )}
                                            </ul>
                                            <span>Country Of Residence: <br /><b>{selectedAppointment.doctor.country.name}</b></span><br />
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
                        <Link to={`/patient/chat?chatgroup=P${props.currentPatient.id}_D${selectedAppointment?.doctor?.id}`} title="Chat">
                            <IconButton>
                                <ChatIcon id="active-video-icon" />
                            </IconButton>
                        </Link>
                        {/* <IconButton onClick={() => handleVideoCall(selectedAppointment.startTime)}>
                            <VideocamIcon id="active-video-icon" />
                        </IconButton> */}
                        <button autoFocus onClick={handleAppointmentInfoClose} className="btn btn-primary">
                            Ok
                    </button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={confirmVideoClose} aria-labelledby="customized-dialog-title" open={confirmVideo}>
                    {/* <DialogTitle id="customized-dialog-title" onClose={confirmVideoClose}>
                        Do you want to Start Video Call
                </DialogTitle> */}
                    <DialogActions>
                    <Link to={`/patient/chat?chatgroup=P${props.currentPatient.id}_D${selectedAppointment?.doctorId}&openVideoCall=true`} title="Chat"><button autoFocus 
                        //onClick={() => handleAgoraAccessToken({name:`${selectedAppointment.doctorId}` + `${selectedAppointment.patientId}` + `${selectedAppointment.id}`, id: selectedAppointment.id})} 
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
    )
}

export default Myappointment
