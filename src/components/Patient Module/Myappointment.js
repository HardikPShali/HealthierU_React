import React, { useState, useEffect } from 'react';
// import Footer from './Footer'
import './patient.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
//import LocalStorageService from './../../util/LocalStorageService';
//import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
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
import calendarSmall from '../../images/svg/calender-beige.svg';
import calendarIcon from '../../images/svg/calendar-green.svg';
import timeSmall from '../../images/svg/time-teal.svg';
import timeBig from '../../images/svg/time-big-icon.svg';
import rightIcon from '../../images/svg/right-icon.svg';
import chatButtonIcon from '../../images/svg/chat-button-icon.svg';
import dollarIcon from '../../images/svg/dollar-icon.svg';
import creditCardIcon from '../../images/svg/credit-card-icon.svg';
import infoIcon from '../../images/svg/info-i-icon.svg';
import helpSupportIcon from '../../images/svg/help-support-icon.svg';
import educationIcon from '../../images/svg/education-icon.svg';
import experienceIcon from '../../images/svg/experience-yellow-icon.svg';
import languageIcon from '../../images/svg/languages-yellow-icon.svg';
import aboutIcon from '../../images/svg/about-icon.svg';
import rescheduleIcon from '../../images/svg/reschedule-icon.svg';
import defaultDoctorImage from '../../images/default_image.png';


//import { handleAgoraAccessToken } from '../../service/agoratokenservice';
import {
  deleteAppointment,
  getAppointmentListByPatientId,
  getAppointmentsTablistByStatus,
} from '../../service/frontendapiservices';
import momentTz from 'moment-timezone';
import { firestoreService } from '../../util';
import { Style } from '@material-ui/icons';

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
    padding: '10px',
  },
}));
const app = makeStyles(() => ({
  height: '4%',
  width: '145px',
}));

const Myappointment = (props) => {
  const [myAppointment, setMyAppoitment] = useState([]);
  const [UpcomingAppointment, setUpcomingAppointment] = useState([]);
  const [completedAppointment, setCompletedAppointment] = useState([]);
  const [cancelledAppointment, setCancelledAppointment] = useState([]);

  const [loading, setLoading] = useState(true);
  const localizer = momentLocalizer(moment);
  // const [currentPatient, setCurrentPatient] = useState({}); // no longer required delete future ady-delete
  const timeZone = momentTz.tz.guess();
  let history = useHistory()
  // state for selectAppointment for delete operation
  const [selectedAppointment, setSelectedAppointment] = useState();
  //console.log("selectedAppointment  ::", selectedAppointment)

  const [hourDifference, setHourDifference] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAppointmentInfo, setopenAppointmentInfo] = useState(false);
  const [
    openCancelledAndCompletedAppointmentInfo,
    setOpenCancelledAndCompletedAppointmentInfo,
  ] = useState(false);
  const [
    openUpcomingAppointmentInfo,
    setOpenUpcomingAppointmentInfo,
  ] = useState(false);
  const [moreDoctorInfo, setMoreDoctorInfo] = useState(false);

  const [openApptDetailsFromCalendar, setOpenApptDetailsFromCalendar] = useState(false)

  const handleClickOpen = (appointmentData) => {
    const now = new Date().getTime();
    const appointmentDate = new Date(appointmentData.startTime).getTime();
    diff_hours(now, appointmentDate);
    setSelectedAppointment(appointmentData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAppointmentInfoOpen = (eventData) => {
    setSelectedAppointment(eventData);
    setopenAppointmentInfo(true);
  };

  const handleAppointmentInfoFromCalendarClick = (eventData) => {
    setSelectedAppointment(eventData);
    setOpenApptDetailsFromCalendar(true);
  }

  const handleUpcomingAppointmentInfoOpen = (eventData) => {
    setSelectedAppointment(eventData);
    setOpenUpcomingAppointmentInfo(true);
  };

  const handleCancelledAndCompletedAppointmentInfoOpen = (eventData) => {
    setSelectedAppointment(eventData);
    setOpenCancelledAndCompletedAppointmentInfo(true);
  };

  const handleAppointmentInfoClose = () => {
    setopenAppointmentInfo(false);
    setOpenCancelledAndCompletedAppointmentInfo(false);
    setOpenApptDetailsFromCalendar(false);
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

  //chat
  const [confirmChat, setConfirmChat] = useState(false);
  const [alertChat, setAlertChat] = useState(false);

  const handleConfirmChat = () => {
    setConfirmChat(true);
  };
  const confirmChatClose = () => {
    setConfirmChat(false);
  };
  const handleAlertChat = () => {
    setAlertChat(true);
  };
  const alertChatClose = () => {
    setAlertChat(false);
  };

  const openMoreDoctorInfo = () => {
    setMoreDoctorInfo(true);
  };

  const closeMoreDoctorInfo = () => {
    setMoreDoctorInfo(false);
  };

  // const handleVideoCall = (appointmentStartTime) => {
  //     const AppointmnetBeforeTenMinutes = new Date(appointmentStartTime.getTime() - 2 * 60000);
  //     const AppointmnetAfter70Minutes = new Date(appointmentStartTime.getTime() + 70 * 60000);
  //     if (new Date().toISOString() >= AppointmnetBeforeTenMinutes.toISOString() && new Date().toISOString() <= AppointmnetAfter70Minutes.toISOString()) {
  // handleConfirmVideo();
  //     }
  //     else {
  //         handleAlertVideo();
  //     }
  // }

  //Chat
  const handleChat = (appointmentStartTime) => {
    const AppointmnetBeforeSixyMinutes = new Date(
      appointmentStartTime.getTime() - 7200000
    );
    // const AppointmnetAfter70Minutes = new Date(appointmentStartTime.getTime() + 4200000);
    if (new Date().getTime() >= AppointmnetBeforeSixyMinutes.getTime()) {
      handleConfirmChat();
    } else {
      handleAlertChat();
    }
    // const AppointmentBeforeTwoHours = new Date(appointmentStartTime.getTime() - 2 * 60000);
    // if (new Date().toISOString() <= AppointmentBeforeTwoHours.toISOString())
    // {
    //     handleConfirmChat();
    // }
    // else
    // {
    //     handleAlertChat();
    // }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    let color;
    let outline;
    var res = event.unifiedAppointment && event.unifiedAppointment.split('#');
    if (
      event.startTime >= new Date() &&
      event.status === 'ACCEPTED' &&
      res !== 'First Consultation'
    ) {
      backgroundColor = '#00d0cc';
      color = '#fff';
      outline = 'none';
    } else if (event.endTime <= new Date()) {
      backgroundColor = '#00d0cc';
      color = '#fff';
      // var borderColor = '#696969';
      var pointerEvents = 'none';
      outline = 'none';
    } else if (res === 'First Consultation') {
      backgroundColor = '#00d0cc';
      color = '#fff';
      outline = 'none';
    }
    var style = {
      backgroundColor: backgroundColor,
      color: color,
      // borderColor: borderColor,
      pointerEvents: pointerEvents,
      height: '25px',
      padding: '0px 7px',
      fontSize: '12.5px',
      marginLeft: '4.5px',
      outline: outline,
    };
    return {
      style: style,
    };
  };

  //const cookies = new Cookies();

  const classes = useStyles();

  useEffect(() => {
    props.currentPatient.id && getMyAppointmentList(props.currentPatient.id);
    props.currentPatient.id && getAppointmentsTabList(props.currentPatient.id);
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
      status: 'ACCEPTED',
    };
    const response = await getAppointmentListByPatientId(
      myAppointmentFilter
    ).catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });

    // console.log("AppointmentList", response);

    if (response.status === 200 || response.status === 201) {
      if (response && response.data) {
        //console.log("response.data ::: ", response.data)
        const updateArray = [];
        response.data.reverse();
        response.data.map((value, index) => {
          if (value.status === 'ACCEPTED') {
            if (
              value.unifiedAppointment ===
              (response.data[index + 1] &&
                response.data[index + 1].unifiedAppointment)
            ) {
              // Keeping the following comment, in future, if we have to display the appointment message with urgency and comments
              // `Dr. ${
              //     value?.doctor?.firstName
              //   } with ${
              //     value.urgency ? value.urgency : "no"
              //   } urgency, comments : ${
              //     value.remarks ? value.remarks : "no comments"
              //   }`
              updateArray.push({
                id: value.id,
                patientId: value.patientId,
                doctorId: value.doctorId,
                doctor: value.doctor,
                title: `Appointment with Dr. ${value?.doctor?.firstName}`,
                startTime: new Date(value.startTime),
                endTime: new Date(response.data[index + 1].endTime),
                remarks: value.remarks,
                status: value.status,
                appointmentId: value.appointmentId,
                unifiedAppointment: value.unifiedAppointment,
              });
            } else if (
              value.unifiedAppointment !==
              (response.data[index + 1] &&
                response.data[index + 1].unifiedAppointment) &&
              value.unifiedAppointment ===
              (response[index - 1] && response[index - 1].unifiedAppointment)
            ) {
              return false;
            } else if (
              value.unifiedAppointment !==
              (response.data[index + 1] &&
                response.data[index + 1].unifiedAppointment) &&
              value.unifiedAppointment !==
              (response.data[index - 1] &&
                response.data[index - 1].unifiedAppointment)
            ) {
              updateArray.push({
                id: value.id,
                patientId: value.patientId,
                doctorId: value.doctorId,
                doctor: value.doctor,
                startTime: new Date(value.startTime),
                endTime: new Date(value.endTime),
                remarks: value.remarks,
                status: value.status,
                appointmentId: value.appointmentId,
                unifiedAppointment: value.unifiedAppointment,
              });
            }
          } //
        });

        setMyAppoitment(updateArray);
        setTimeout(() => setLoading(false), 1000);
      }
    }
  };

  const getAppointmentsTabList = async (patientId) => {
    const response = await getAppointmentsTablistByStatus(patientId).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      }
    );

    // console.log({ response });

    if (response.status === 200 || response.status === 201) {
      if (response && response.data) {
        const upcomingArray = response.data.data.upcoming;
        console.log('upcomingArray', upcomingArray);
        setUpcomingAppointment(upcomingArray.reverse());

        const completedAppointmentsArray = response.data.data.completed;
        setCompletedAppointment(completedAppointmentsArray);
        // console.log('completedAppointmentsArray', completedAppointmentsArray);

        const cancelledAppointmentsArray = response.data.data.cancelled;
        // console.log({ cancelledAppointmentsArray });
        setCancelledAppointment(cancelledAppointmentsArray);
      }
    }
  };

  const handleDelete = async (selectedAppointment) => {
    const { currentPatient, doctorDetailsList } = props;
    setLoading(true);
    handleClose();
    // console.log({ selectedAppointment })
    const payload = {
      id: selectedAppointment.id,
      startTime: new Date(selectedAppointment.startTime).toISOString(),
      endTime: new Date(selectedAppointment.endTime).toISOString(),
      patientId: selectedAppointment.patientId,
      doctorId: selectedAppointment.doctorId,
      type: 'DR',
      status: 'CANCELLED_BY_PATIENT',
      unifiedAppointment: selectedAppointment.unifiedAppointment,
    };
    const res = await deleteAppointment(payload).catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    // console.log({ res });
    if (res?.status === 200 || res?.status === 201) {
      getMyAppointmentList(currentPatient.id);
      handleClose();
      toast.success("Appointment Cancelled");
      history.go(0)
    }
    //})
  };

  const diff_hours = (date1, date2) => {
    const diffHours = date2 - date1;
    const hours = diffHours / (1000 * 60 * 60);
    setHourDifference(hours);
  };

  const { currentPatient, doctorDetailsList } = props;

  // console.log("myAppointment ::::::::", myAppointment);
  return (
    <div>
      {loading && <Loader />}
      {!loading && (
        <>
          <br />
          <br />
          <Container>
            <Row>
              <Col>
                <div className="calender_container bg-white">
                  <Calendar
                    views={['month', 'week', 'day',]}
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
                    onSelectEvent={(event) => handleAppointmentInfoFromCalendarClick(event)}
                    messages={{ previous: "Previous", next: "Next", today: "Today" }}
                  />
                </div>
              </Col>
            </Row>
            <br />


            <Row className="mt-3 mx-1 calender_container bg-white">
              <Col md={12}></Col>
              {/* <Col md={3}></Col> */}
              <Col md={12}>
                <div>
                  <h3 className="mt-3 mb-3 text-center" style={{ color: "var(--primary)" }}>
                    LIST OF APPOINTMENTS
                  </h3>

                  <Tabs
                    defaultActiveKey="upcoming"
                    id="uncontrolled-tab-example"
                    className="record-tabs mb-3"
                  >
                    <Tab eventKey="upcoming" title="Upcoming">
                      <div className="my-appointments__card-box">
                        <div className="my-appointments__card-holder">
                          <div className="row">
                            {UpcomingAppointment &&
                              Array.isArray(UpcomingAppointment) &&
                              UpcomingAppointment.length > 0 &&
                              UpcomingAppointment.map((appointment, index) => {
                                if (
                                  appointment.status &&
                                  new Date(appointment.endTime) >= new Date() &&
                                  appointment.status === 'ACCEPTED'
                                ) {
                                  return (
                                    <div
                                      className="col-md-6 mb-2 mt-2"
                                      key={index}
                                    >
                                      {/* {console.log(appointment)} */}
                                      <div className="my-appointments-card">
                                        <div
                                          className="row align-items-start mb-2"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() =>
                                            handleAppointmentInfoOpen(
                                              appointment
                                            )
                                          }
                                        >
                                          <div className="col-md-3">
                                            {
                                              appointment.doctor.picture ? (
                                                <img
                                                  src={appointment.doctor.picture}
                                                  alt={`${appointment.doctor.firstName}-image`}
                                                  className="img-circle ml-3 mt-3"
                                                />
                                              ) : (
                                                <Avatar
                                                  round={true}
                                                  name={
                                                    appointment.doctor.firstName +
                                                    ' ' +
                                                    (appointment.doctor.lastName || "")
                                                  }
                                                  size={60}
                                                  className="my-appointments-avatar"
                                                />
                                              )
                                            }

                                          </div>
                                          <div className="col-md-9">
                                            <div className="my-appointments-card__card-details">
                                              <h5 className="my-appointments-card__doctor-name">
                                                {appointment.doctor.firstName +
                                                  ' ' +
                                                  (appointment.doctor.lastName || "")}
                                              </h5>
                                              <span className="my-appointments-card__specality">
                                                {appointment.doctor &&
                                                  appointment.doctor
                                                    .specialities.length &&
                                                  appointment.doctor
                                                    .specialities[0].name}
                                              </span>
                                              <div className="my-appointments-card__card-details--date-div">
                                                <div className="my-appointments-card__card-time-row">
                                                  <img src={calendarSmall} />
                                                  <span className="my-appointments-card__common-span">
                                                    {moment(
                                                      appointment.startTime
                                                    ).format('DD/MM/YY')}
                                                  </span>
                                                </div>
                                                <div className="my-appointments-card__card-time-row ml-4">
                                                  <img src={timeSmall} />
                                                  <span className="my-appointments-card__common-span">
                                                    {moment(
                                                      appointment.startTime
                                                    ).format('hh:mm A')}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            {myAppointment.length === 0 && (
                              <div className="col-12 ml-2 empty-message">
                                <h2
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                    color: '#f6ceb4'
                                  }}
                                >
                                  No Upcoming Appointments
                                </h2>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="completed" title="Completed">
                      <div className="my-appointments__card-box">
                        <div className="my-appointments__card-holder">
                          <div className="row">
                            {completedAppointment &&
                              Array.isArray(completedAppointment) &&
                              completedAppointment.length > 0 &&
                              completedAppointment.map((appointment, index) => {
                                return (
                                  <div
                                    className="col-md-6 mb-2 mt-2"
                                    key={index}
                                    onClick={
                                      () =>
                                        handleCancelledAndCompletedAppointmentInfoOpen(
                                          appointment
                                        )
                                      // handleAppointmentInfoOpen(appointment)
                                    }
                                  >
                                    <div className="my-appointments-card__completed">
                                      <div
                                        className="row align-items-start mb-2"
                                      // style={{ cursor: 'pointer' }}
                                      >
                                        <div className="col-md-3">
                                          {/* <img
                                            src={appointment.doctor.picture}
                                            alt={`${appointment.doctor.firstName}-image`}
                                            className="img-circle ml-3 mt-3"
                                          /> */}
                                          {
                                            appointment.doctor.picture ? (
                                              <img
                                                src={appointment.doctor.picture}
                                                alt={`${appointment.doctor.firstName}-image`}
                                                className="img-circle ml-3 mt-3"
                                              />
                                            ) : (
                                              <Avatar
                                                round={true}
                                                name={
                                                  appointment.doctor.firstName +
                                                  ' ' +
                                                  (appointment.doctor.lastName || "")
                                                }
                                                size={60}
                                                className="my-appointments-avatar"
                                              />
                                            )
                                          }
                                        </div>
                                        <div className="col-md-9">
                                          <div className="my-appointments-card__card-details">
                                            <h5 className="my-appointments-card__doctor-name">
                                              {appointment.doctor.firstName +
                                                ' ' +
                                                (appointment.doctor.lastName || "")}
                                            </h5>
                                            <span className="my-appointments-card__specality">
                                              {appointment.doctor &&
                                                appointment.doctor.specialities
                                                  .length &&
                                                appointment.doctor
                                                  .specialities[0].name}
                                            </span>
                                            <div className="my-appointments-card__card-details--date-div">
                                              <div className="my-appointments-card__card-time-row">
                                                <img src={calendarSmall} />
                                                <span className="my-appointments-card__common-span">
                                                  {moment(
                                                    appointment.startTime
                                                  ).format('DD/MM/YY')}
                                                </span>
                                              </div>
                                              <div className="my-appointments-card__card-time-row ml-4">
                                                <img src={timeSmall} />
                                                <span className="my-appointments-card__common-span">
                                                  {moment(
                                                    appointment.startTime
                                                  ).format('hh:mm A')}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            {completedAppointment.length === 0 && (
                              <div className="col-12 ml-2 empty-message">
                                <h2
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                  }}
                                >
                                  No Completed Appointments
                                </h2>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="cancelled" title="Cancelled">
                      <div className="my-appointments__card-box">
                        <div className="my-appointments__card-holder">
                          <div className="row">
                            {cancelledAppointment &&
                              Array.isArray(cancelledAppointment) &&
                              cancelledAppointment.length > 0 &&
                              cancelledAppointment.map((appointment, index) => {
                                return (
                                  <div
                                    className="col-md-6 mb-2 mt-2"
                                    key={index}
                                    onClick={() =>
                                      handleCancelledAndCompletedAppointmentInfoOpen(
                                        appointment
                                      )
                                    }
                                  >
                                    <div className="my-appointments-card__cancelled">
                                      <div
                                        className="row align-items-start mb-2"
                                      // style={{ cursor: 'pointer' }}
                                      >
                                        <div className="col-md-3">
                                          {/* <img
                                            src={appointment.doctor.picture}
                                            alt={`${appointment.doctor.firstName}-image`}
                                            className="img-circle ml-3 mt-3"
                                          /> */}
                                          {
                                            appointment.doctor.picture ? (
                                              <img
                                                src={appointment.doctor.picture}
                                                alt={`${appointment.doctor.firstName}-image`}
                                                className="img-circle ml-3 mt-3"
                                              />
                                            ) : (
                                              <Avatar
                                                round={true}
                                                name={
                                                  appointment.doctor.firstName +
                                                  ' ' +
                                                  (appointment.doctor.lastName || "")
                                                }
                                                size={60}
                                                className="my-appointments-avatar"
                                              />
                                            )
                                          }
                                        </div>
                                        <div className="col-md-9">
                                          <div className="my-appointments-card__card-details">
                                            <h5 className="my-appointments-card__doctor-name">
                                              {appointment.doctor.firstName +
                                                ' ' +
                                                (appointment.doctor.lastName || "")}
                                            </h5>
                                            <span className="my-appointments-card__specality">
                                              {appointment.doctor &&
                                                appointment.doctor.specialities
                                                  .length &&
                                                appointment.doctor
                                                  .specialities[0].name}
                                            </span>
                                            <div className="my-appointments-card__card-details--date-div">
                                              <div className="my-appointments-card__card-time-row">
                                                <img src={calendarSmall} />
                                                <span className="my-appointments-card__common-span">
                                                  {moment(
                                                    appointment.startTime
                                                  ).format('DD/MM/YY')}
                                                </span>
                                              </div>
                                              <div className="my-appointments-card__card-time-row ml-4">
                                                <img src={timeSmall} />
                                                <span className="my-appointments-card__common-span">
                                                  {moment(
                                                    appointment.startTime
                                                  ).format('hh:mm A')}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            {cancelledAppointment.length === 0 && (
                              <div className="col-12 ml-2 empty-message">
                                <h2
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                  }}
                                >
                                  No Cancelled Appointments
                                </h2>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Col>
              {/* <Col md={3}></Col> */}
            </Row>
          </Container>
          <br />
          <br />
          {/* <Footer /> */}

          {/* CANCEL APPOINTMENT DIALOG */}
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Are you sure you want to cancel?
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                {hourDifference < 24 && (
                  <span>
                    You are cancelling less then 24h prior the appointment start
                    time, unfortunately you will not be reimbursed
                  </span>
                )}
                {hourDifference > 24 && (
                  <span>
                    Your refund will come next week and 5% service fees will be
                    deducted
                  </span>
                )}
              </Typography>
            </DialogContent>
            <DialogActions>
              <button
                autoFocus
                onClick={() => handleDelete(selectedAppointment)}
                className="btn btn-primary"
              >
                Ok
              </button>
              <button
                autoFocus
                onClick={handleClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </DialogActions>
          </Dialog>

          {/* APPOINTMENT DETAILS FROM CALENDAR */}
          <Dialog
            onClose={handleAppointmentInfoClose}
            aria-labelledby="customized-dialog-title"
            open={openApptDetailsFromCalendar}
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
                      {/* {console.log(selectedAppointment)} */}
                      {/* <img src={selectedAppointment.doctor.picture} alt="" /> */}
                      {
                        selectedAppointment.doctor.picture ? (
                          <img
                            src={selectedAppointment.doctor.picture}
                            alt={`${selectedAppointment.doctor.firstName}-image`}
                            className="img-circle ml-3 mt-3"
                          />
                        ) : (
                          <Avatar
                            round={true}
                            name={
                              selectedAppointment.doctor.firstName +
                              ' ' +
                              (selectedAppointment.doctor.lastName || "")
                            }
                            size={60}
                            className="my-appointments-avatar"
                          />
                        )
                      }
                      <h2>
                        {selectedAppointment.doctor.firstName}{' '}
                        {(selectedAppointment.doctor.lastName || "")}
                      </h2>
                      <span>
                        <ul
                          style={{ fontSize: 12, display: 'block' }}
                          className="list--tags"
                        >
                          {selectedAppointment.doctor &&
                            selectedAppointment.doctor.specialities &&
                            selectedAppointment.doctor.specialities.map(
                              (speciality, index) => (
                                <li key={index}>{speciality.name} </li>
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
                          <span className="my-patient-card__common-span">
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
                          <span className="my-patient-card__common-span">
                            {moment(selectedAppointment.startTime).format(
                              'hh:mm A'
                            )}
                          </span>
                        </div>
                      </div>
                      <br />
                      <span>Appointment Fee and Payment method</span>

                      <div className="details-body__payment">
                        <div className="details-body__appointment-time-row">
                          <img
                            src={dollarIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.appointmentFee ? (selectedAppointment.appointmentFee) : (<span>-</span>)}
                          </span>
                        </div>
                        <div className="details-body__appointment-time-row">
                          <img
                            src={creditCardIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.paymentMethod ? (selectedAppointment.paymentMethod) : (<span>-</span>)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="details-links">
                      <br />
                      <div
                        style={{
                          display: 'flex',
                          alignItem: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={openMoreDoctorInfo}
                      >
                        <div style={{ width: '100%' }}>
                          <img
                            width="40"
                            height="40"
                            src={infoIcon}
                            alt=""
                            style={{ marginLeft: '5%', marginRight: '5%' }}
                          />
                          <span>More Info about Doctor</span>
                        </div>
                        <img
                          src={rightIcon}
                          alt="right-icon"
                          style={{ marginRight: '35px' }}
                        />
                      </div>
                      <br />
                      <Link
                        to={{
                          pathname: `/patient/help-and-support`,
                          // state: SelectedPatient.patient,
                        }}
                      >
                        <div style={{ display: 'flex', alignItem: 'center' }}>
                          <div style={{ width: '100%' }}>
                            <img
                              width="40"
                              height="40"
                              src={helpSupportIcon}
                              // onClick='${pathname}'
                              alt=""
                              style={{ marginLeft: '5%', marginRight: '5%' }}
                            />
                            Help and Support
                          </div>
                          <img
                            src={rightIcon}
                            alt="right-icon"
                            style={{ marginRight: '35px' }}
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
                autoFocus={false}
                onClick={() => handleClickOpen(selectedAppointment)}
                className="btn btn-primary"
                id="close-btn"
              >
                Cancel Appointment
              </button>
              <button
                autoFocus={false}
                onClick={() => handleChat(selectedAppointment.startTime)}
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
            </DialogActions>
          </Dialog>

          {/* APPOINTMENT DETAILS DIALOG */}
          <Dialog
            onClose={handleAppointmentInfoClose}
            aria-labelledby="customized-dialog-title"
            open={openAppointmentInfo}
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
                      {/* {console.log(selectedAppointment)} */}
                      {/* <img src={selectedAppointment.doctor.picture} alt="" /> */}
                      {
                        selectedAppointment.doctor.picture ? (
                          <img
                            src={selectedAppointment.doctor.picture}
                            alt={`${selectedAppointment.doctor.firstName}-image`}
                            className="img-circle ml-3 mt-3"
                          />
                        ) : (
                          <Avatar
                            round={true}
                            name={
                              selectedAppointment.doctor.firstName +
                              ' ' +
                              (selectedAppointment.doctor.lastName || "")
                            }
                            size={60}
                            className="my-appointments-avatar"
                          />
                          // <img
                          //   src={defaultDoctorImage}
                          //   alt={`${selectedAppointment.doctor.firstName}-image`}
                          //   className="img-circle ml-3 mt-3"
                          // />
                        )
                      }
                      <h2 className='my-appointments__header-names'>
                        {selectedAppointment.doctor.firstName}{' '}
                        {(selectedAppointment.doctor.lastName || "")}
                      </h2>
                      <span>
                        <ul
                          style={{ fontSize: 12, display: 'block' }}
                          className="list--tags"
                        >
                          {selectedAppointment.doctor &&
                            selectedAppointment.doctor.specialities &&
                            selectedAppointment.doctor.specialities.map(
                              (speciality, index) => (
                                <li key={index}>{speciality.name} </li>
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
                          <span className="my-patient-card__common-span">
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
                          <span className="my-patient-card__common-span">
                            {moment(selectedAppointment.startTime).format(
                              'hh:mm A'
                            )}
                          </span>
                        </div>
                      </div>
                      <br />
                      <span>Appointment Fee and Payment method</span>

                      <div className="details-body__payment">
                        <div className="details-body__appointment-time-row">
                          <img
                            src={dollarIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.appointmentFee ? (selectedAppointment.appointmentFee) : (<span>-</span>)}
                          </span>
                        </div>
                        <div className="details-body__appointment-time-row">
                          <img
                            src={creditCardIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.paymentMethod ? (selectedAppointment.paymentMethod) : (<span>-</span>)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="details-links">
                      <Link
                        to={{
                          pathname: `/patient/rescheduleappointment/${selectedAppointment.id}/${selectedAppointment.appointmentMode?.toLowerCase().replace(" ", "-")}`,


                        }}
                      >
                        <div style={{ display: 'flex', alignItem: 'center' }}>
                          <div style={{ width: '100%' }}>
                            <img
                              width="40"
                              height="40"
                              src={rescheduleIcon}
                              alt=""
                              style={{ marginLeft: '5%', marginRight: '5%' }}
                            />
                            Reschedule Appointment
                          </div>
                          <img
                            src={rightIcon}
                            alt="right-icon"
                            style={{ marginRight: '35px' }}
                          />
                        </div>
                      </Link>
                      <br />
                      <div
                        style={{
                          display: 'flex',
                          alignItem: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={openMoreDoctorInfo}
                      >
                        <div style={{ width: '100%' }}>
                          <img
                            width="40"
                            height="40"
                            src={infoIcon}
                            alt=""
                            style={{ marginLeft: '5%', marginRight: '5%' }}
                          />
                          <span>More Info about Doctor</span>
                        </div>
                        <img
                          src={rightIcon}
                          alt="right-icon"
                          style={{ marginRight: '35px' }}
                        />
                      </div>
                      <br />
                      <Link
                        to={{
                          pathname: `/patient/help-and-support`,
                          // state: SelectedPatient.patient,
                        }}
                      >
                        <div style={{ display: 'flex', alignItem: 'center' }}>
                          <div style={{ width: '100%' }}>
                            <img
                              width="40"
                              height="40"
                              src={helpSupportIcon}
                              // onClick='${pathname}'
                              alt=""
                              style={{ marginLeft: '5%', marginRight: '5%' }}
                            />
                            Help and Support
                          </div>
                          <img
                            src={rightIcon}
                            alt="right-icon"
                            style={{ marginRight: '35px' }}
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
                autoFocus={false}
                onClick={() => handleClickOpen(selectedAppointment)}
                className="btn btn-primary"
                id="close-btn"
              >
                Cancel Appointment
              </button>
              <button
                autoFocus={false}
                onClick={() => handleChat(selectedAppointment.startTime)}
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
            </DialogActions>
          </Dialog>

          {/* COMPLETD AND CANCELLED APPOINTMENTS DIALOG */}
          <Dialog
            onClose={handleAppointmentInfoClose}
            aria-labelledby="customized-dialog-title"
            open={openCancelledAndCompletedAppointmentInfo}
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
                      {/* {console.log(selectedAppointment)} */}
                      {/* <img src={selectedAppointment.doctor.picture} alt="" /> */}
                      {
                        selectedAppointment.doctor.picture ? (
                          <img
                            src={selectedAppointment.doctor.picture}
                            alt={`${selectedAppointment.doctor.firstName}-image`}
                            className="img-circle ml-3 mt-3"
                          />
                        ) : (
                          <Avatar
                            round={true}
                            name={
                              selectedAppointment.doctor.firstName +
                              ' ' +
                              (selectedAppointment.doctor.lastName || "")
                            }
                            size={60}
                            className="my-appointments-avatar"
                          />
                        )
                      }
                      <h2>
                        {selectedAppointment.doctor.firstName}{' '}
                        {selectedAppointment.doctor.lastName || ""}
                      </h2>
                      <span>
                        <ul
                          style={{ fontSize: 12, display: 'block' }}
                          className="list--tags"
                        >
                          {selectedAppointment.doctor &&
                            selectedAppointment.doctor.specialities &&
                            selectedAppointment.doctor.specialities.map(
                              (speciality, index) => (
                                <li key={index}>{speciality.name} </li>
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
                          <span className="my-patient-card__common-span">
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
                          <span className="my-patient-card__common-span">
                            {moment(selectedAppointment.startTime).format(
                              'hh:mm A'
                            )}
                          </span>
                        </div>
                      </div>
                      <br />
                      <span>Appointment Fee and Payment method</span>

                      <div className="details-body__payment">
                        <div className="details-body__appointment-time-row">
                          <img
                            src={dollarIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.appointmentFee ? (selectedAppointment.appointmentFee) : (<span>-</span>)}
                          </span>
                        </div>
                        <div className="details-body__appointment-time-row">
                          <img
                            src={creditCardIcon}
                            className="details-body__appointment-time-row-image"
                          />
                          <span className="my-patient-card__common-span">
                            {selectedAppointment.paymentMethod ? (selectedAppointment.paymentMethod) : (<span>-</span>)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="details-links">
                      <div
                        style={{
                          display: 'flex',
                          alignItem: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ width: '100%' }}>
                          <img
                            width="40"
                            height="40"
                            src={infoIcon}
                            onClick={openMoreDoctorInfo}
                            alt=""
                            style={{ marginLeft: '5%', marginRight: '5%' }}
                          />
                          <span>More Info about Doctor</span>
                        </div>
                        <img
                          src={rightIcon}
                          alt="right-icon"
                          style={{ marginRight: '35px' }}
                        />
                      </div>
                      <br />
                      <Link
                        to={{
                          pathname: `/patient/help-and-support`,
                          // state: SelectedPatient.patient,
                        }}
                      >
                        <div style={{ display: 'flex', alignItem: 'center' }}>
                          <div style={{ width: '100%' }}>
                            <img
                              width="40"
                              height="40"
                              src={helpSupportIcon}
                              // onClick='${pathname}'
                              alt=""
                              style={{ marginLeft: '5%', marginRight: '5%' }}
                            />
                            Help and Support
                          </div>
                          <img
                            src={rightIcon}
                            alt="right-icon"
                            style={{ marginRight: '35px' }}
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
                autoFocus={false}
                onClick={() => handleChat(selectedAppointment.startTime)}
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
              {/* </Link>  */}
              <button
                autoFocus={false}
                onClick={handleAppointmentInfoClose}
                className="btn btn-primary"
                id="close-btn"
              >
                Ok
              </button>
            </DialogActions>
          </Dialog>


          <Dialog
            onClose={confirmChatClose}
            aria-labelledby="customized-dialog-title"
            open={confirmChat}
          >
            {
              <DialogTitle
                id="customized-dialog-title"
                onClose={confirmChatClose}
              >
                Do you want to Start Chat
              </DialogTitle>
            }
            <DialogActions>
              <Link
                to={`/patient/chat?chatgroup=P${props.currentPatient.id}_D${selectedAppointment?.doctorId}&openVideoCall=true`}
                title="Chat"
              >
                <button
                  autoFocus
                  //onClick={() => handleAgoraAccessToken({name:`${selectedAppointment.doctorId}` + `${selectedAppointment.patientId}` + `${selectedAppointment.id}`, id: selectedAppointment.id})}
                  className="btn btn-primary"
                  id="close-btn"
                >
                  Yes
                </button>
              </Link>
              <button
                autoFocus
                onClick={confirmChatClose}
                className="btn btn-primary"
                id="close-btn"
              >
                No
              </button>
            </DialogActions>
          </Dialog>
          <Dialog
            onClose={alertVideoClose}
            aria-labelledby="customized-dialog-title"
            open={alertVideo}
          >
            <DialogTitle id="customized-dialog-title" onClose={alertVideoClose}>
              Video call is possible only starting 2 Minutes before the
              Appointment Time
            </DialogTitle>
            <DialogActions>
              <button
                autoFocus
                onClick={alertVideoClose}
                className="btn btn-primary"
                id="close-btn"
              >
                Ok
              </button>
            </DialogActions>
          </Dialog>
          <Dialog
            onClose={alertChatClose}
            aria-labelledby="customized-dialog-title"
            open={alertChat}
          >
            <DialogTitle id="customized-dialog-title" onClose={alertChatClose}>
              Chat is possible only 2 Hours before the Appointment Time
            </DialogTitle>
            <DialogActions>
              <button
                autoFocus
                onClick={alertChatClose}
                className="btn btn-primary"
                id="close-btn"
              >
                Ok
              </button>
            </DialogActions>
          </Dialog>


          <Dialog
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
                      {
                        selectedAppointment.doctor.picture ? (
                          <img src={selectedAppointment.doctor.picture} alt="" />
                        ) :
                          (
                            <img src={defaultDoctorImage} alt="" />
                          )
                      }

                      <h2>
                        {selectedAppointment.doctor.firstName}{' '}
                        {selectedAppointment.doctor.lastName || ""}
                      </h2>
                      <span>
                        <ul
                          style={{ fontSize: 12, display: 'block' }}
                          className="list--tags"
                        >
                          {selectedAppointment.doctor &&
                            selectedAppointment.doctor.specialities &&
                            selectedAppointment.doctor.specialities.map(
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
                              {selectedAppointment.doctor &&
                                selectedAppointment.doctor.specialities &&
                                selectedAppointment.doctor.specialities.map(
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
                              {selectedAppointment.doctor.experience}
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
                      </div>

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
                              {selectedAppointment.doctor.bio}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <button
                autoFocus={false}
                onClick={closeMoreDoctorInfo}
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
      )}
    </div>
  );
};

export default Myappointment;
