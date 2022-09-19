import React, { useState, useEffect } from 'react';
import '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments.css';
import './patient.css';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { makeStyles } from '@material-ui/core/styles';
import Loader from './../Loader/Loader';
import {
  deleteAppointment,
  getAppointmentListByPatientId,
  getAppointmentsTablistByStatus,
} from '../../service/frontendapiservices';
import momentTz from 'moment-timezone';
import { getInbox } from '../../service/chatService';
import UpcomingAppointmentCard from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointmentCard';
import AppointmentDetailsModal from './DetailsModals/AppointmentDetailsModal';
import MoreInfoAboutDoctor from './DetailsModals/MoreInfoAboutDoctor';
import { AlertChatDialog, ConfirmChatDialog } from './DetailsModals/ChatModals';
import ConfirmCancelModal from './DetailsModals/ConfirmCancelModal';

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
  let history = useHistory();
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

  const [
    openApptDetailsFromCalendar,
    setOpenApptDetailsFromCalendar,
  ] = useState(false);

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
    UpcomingAppointment.forEach((u) => {
      if (eventData.id === u.id) {
        setSelectedAppointment(u);
      }
    });
    setOpenApptDetailsFromCalendar(true);
  };

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
  let queryChannelId;

  const chatClickHandler = async (channelId = null) => {
    const result = await getInbox();
    const docId = selectedAppointment.doctorId;
    // console.log({ docId })
    // console.log({ result });
    const inbox = result.data.data.filter((item) => {
      return item.doctorInfo.id === docId;
    });
    // console.log({ inbox })
    queryChannelId = inbox[0].id;
    // console.log({ queryChannelId })
    history.push(`/patient/chat?channelId=${queryChannelId}`);
  };

  const handleChat = (selectedAppointment) => {
    const currentTime = moment(new Date());

    const appointmentStartTime = moment(
      new Date(selectedAppointment.startTime)
    );

    const appointmentEndTime = moment(new Date(selectedAppointment.endTime));

    const chatEnableTime = appointmentStartTime.clone().subtract(2, 'days');

    const chatDisableTime = appointmentEndTime.clone().add(3, 'days');

    if (
      currentTime.isSameOrAfter(chatEnableTime) &&
      currentTime.isBefore(chatDisableTime)
    ) {
      console.log('CHAT ENABLED');
      handleConfirmChat();
    } else {
      console.log('CHAT DISABLED');
      handleAlertChat();
    }
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
      marginLeft: '1.5px',
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

    console.log('AppointmentList', response);

    if (response?.status === 200 || response?.status === 201) {
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

  const [appointmentTabLoading, setAppointmentTabLoading] = useState(true);
  const getAppointmentsTabList = async (patientId) => {
    setAppointmentTabLoading(true);
    const response = await getAppointmentsTablistByStatus(patientId).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
          setAppointmentTabLoading(false);
        }
      }
    );

    console.log({ response });

    if (response?.status === 200 || response?.status === 201) {
      if (response && response.data) {
        setAppointmentTabLoading(false);
        const upcomingArray = response.data.data.upcoming;

        setUpcomingAppointment(upcomingArray);

        const completedAppointmentsArray = response.data.data.completed;
        setCompletedAppointment(completedAppointmentsArray.reverse());
        // console.log('completedAppointmentsArray', completedAppointmentsArray);

        const cancelledAppointmentsArray = response.data.data.cancelled;
        // console.log({ cancelledAppointmentsArray });
        setCancelledAppointment(cancelledAppointmentsArray.reverse());
      }
    }
    setAppointmentTabLoading(false);
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
      toast.success('Appointment Cancelled');
      history.go(0);
    }
    //})
  };

  const diff_hours = (date1, date2) => {
    const diffHours = date2 - date1;
    const hours = diffHours / (1000 * 60 * 60);
    setHourDifference(hours);
  };

  const { currentPatient, doctorDetailsList } = props;

  const setDoctorIdInSession = (doctorId) => {
    sessionStorage.setItem('doctorId', doctorId);
  };

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
                    views={['month', 'week', 'day']}
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
                    onSelectEvent={(event) =>
                      handleAppointmentInfoFromCalendarClick(event)
                    }
                    messages={{
                      previous: 'Previous',
                      next: 'Next',
                      today: 'Today',
                    }}
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
                  <h3
                    className="mt-3 mb-3 text-center"
                    style={{ color: 'var(--primary)' }}
                  >
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
                            {appointmentTabLoading && (
                              <div className="col-12 ml-2 empty-message">
                                <span
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                    color: '#000000',
                                    fontSize: 20,
                                  }}
                                >
                                  Loading...
                                </span>
                              </div>
                            )}
                            {UpcomingAppointment &&
                              Array.isArray(UpcomingAppointment) &&
                              UpcomingAppointment.length > 0 &&
                              UpcomingAppointment.map((appointment, index) => (
                                <div
                                  className="col-md-4 mb-2 mt-2"
                                  key={index}
                                  onClick={() =>
                                    handleAppointmentInfoOpen(appointment)
                                  }
                                >
                                  <div className="upcoming-appointment-card">
                                    <UpcomingAppointmentCard
                                      appointment={appointment}
                                    />
                                  </div>
                                </div>
                              ))}
                            {UpcomingAppointment.length === 0 &&
                              appointmentTabLoading === false && (
                                <div className="col-12 ml-2 empty-message">
                                  <h2
                                    style={{
                                      textAlign: 'center',
                                      textShadow: 'none',
                                      color: '#f6ceb4',
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
                            {appointmentTabLoading && (
                              <div className="col-12 ml-2 empty-message">
                                <span
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                    color: '#000000',
                                    fontSize: 20,
                                  }}
                                >
                                  Loading...
                                </span>
                              </div>
                            )}
                            {completedAppointment &&
                              Array.isArray(completedAppointment) &&
                              completedAppointment.length > 0 &&
                              completedAppointment.map((appointment, index) => (
                                <div
                                  className="col-md-4 mb-2 mt-2"
                                  key={index}
                                  onClick={() =>
                                    handleCancelledAndCompletedAppointmentInfoOpen(
                                      appointment
                                    )
                                  }
                                >
                                  <div className="upcoming-appointment-card__completed">
                                    <UpcomingAppointmentCard
                                      appointment={appointment}
                                    />
                                  </div>
                                </div>
                              ))}
                            {completedAppointment.length === 0 &&
                              appointmentTabLoading === false && (
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
                            {appointmentTabLoading && (
                              <div className="col-12 ml-2 empty-message">
                                <span
                                  style={{
                                    textAlign: 'center',
                                    textShadow: 'none',
                                    color: '#000000',
                                    fontSize: 20,
                                  }}
                                >
                                  Loading...
                                </span>
                              </div>
                            )}
                            {cancelledAppointment &&
                              Array.isArray(cancelledAppointment) &&
                              cancelledAppointment.length > 0 &&
                              cancelledAppointment.map((appointment, index) => (
                                <div
                                  className="col-md-4 mb-2 mt-2"
                                  key={index}
                                  onClick={() =>
                                    handleCancelledAndCompletedAppointmentInfoOpen(
                                      appointment
                                    )
                                  }
                                >
                                  <div className="upcoming-appointment-card__cancelled">
                                    <UpcomingAppointmentCard
                                      appointment={appointment}
                                    />
                                  </div>
                                </div>
                              ))}
                            {cancelledAppointment.length === 0 &&
                              appointmentTabLoading === false && (
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

          {/* APPOINTMENT DETAILS FROM CALENDAR */}
          <AppointmentDetailsModal
            selectedAppointment={selectedAppointment}
            handleAppointmentInfoClose={handleAppointmentInfoClose}
            openApptDetails={openApptDetailsFromCalendar}
            handleClickOpen={handleClickOpen}
            handleChat={handleChat}
            openMoreDoctorInfo={openMoreDoctorInfo}
            from='calendar'
          />

          {/* APPOINTMENT DETAILS DIALOG */}
          <AppointmentDetailsModal
            selectedAppointment={selectedAppointment}
            handleAppointmentInfoClose={handleAppointmentInfoClose}
            openApptDetails={openAppointmentInfo}
            handleClickOpen={handleClickOpen}
            handleChat={handleChat}
            from='upcomingAppointmentTab'
            openMoreDoctorInfo={openMoreDoctorInfo}
            setDoctorIdInSession={setDoctorIdInSession}
          />

          {/* COMPLETD AND CANCELLED APPOINTMENTS DIALOG */}
          <AppointmentDetailsModal
            selectedAppointment={selectedAppointment}
            handleAppointmentInfoClose={handleAppointmentInfoClose}
            openApptDetails={openCancelledAndCompletedAppointmentInfo}
            handleClickOpen={handleClickOpen}
            handleChat={handleChat}
            openMoreDoctorInfo={openMoreDoctorInfo}
            from='completedAndCancelledAppointmentTab'
          />

          {/* MORE INFO ABOUT DOCTOR DIALOG */}
          <MoreInfoAboutDoctor
            selectedAppointment={selectedAppointment}
            moreDoctorInfo={moreDoctorInfo}
            closeMoreDoctorInfo={closeMoreDoctorInfo}
          />

          {/* CONFIRM CHAT DIALOG */}
          <ConfirmChatDialog
            confirmChatClose={confirmChatClose}
            confirmChat={confirmChat}
            chatClickHandler={chatClickHandler}
          />

          {/* ALERT CHAT DIALOG */}
          <AlertChatDialog
            alertChatClose={alertChatClose}
            alertChat={alertChat}
          />

          {/* CANCEL APPOINTMENT DIALOG */}
          <ConfirmCancelModal
            selectedAppointment={selectedAppointment}
            handleClose={handleClose}
            open={open}
            hourDifference={hourDifference}
            handleDelete={handleDelete}
          />

        </>
      )}
    </div>
  );
};

export default Myappointment;
