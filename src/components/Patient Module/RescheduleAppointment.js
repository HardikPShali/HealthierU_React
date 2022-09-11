import React, { useState, useEffect, useRef } from 'react';
//import Footer from "./Footer";
import { getAppointmentMode, getAppointmentModeToDisplayAsLabel } from './../../util/appointmentModeUtil';
import { useLocation, useParams } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import LocalStorageService from './../../util/LocalStorageService';
import Cookies from 'universal-cookie';
import Loader from './../Loader/Loader';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Avatar from 'react-avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paypal from '../CommonModule/Paypal';
import TransparentLoader from '../Loader/transparentloader';
import 'react-toastify/dist/ReactToastify.css';
//import SearchIcon from "@material-ui/icons/Search";
import {
  getLoggedInUserDataByUserId,
  getLikedDoctorByPatientId,
  getDoctorListByPatientId,
  getMoreDoctors,
  getMoreLikedDoctorByPatientId,
  postLikedDoctor,
  postUnlikedDoctor,
  getFilteredAppointmentData,
  getInvalidDates,
  getFilteredDoctors,
  getSearchData,
  setNextAppointmentDoctor,
  getAvailableSlotsForMyDoctors,
  rescheduleAppointmentPatient,
  getAvailableSlots,
  getNonPaginatedDoctorListByPatientId,
  getAvailableSlotTimings,
} from '../../service/frontendapiservices';

import './patient.css';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { doctorListLimitNonPaginated } from '../../util/configurations';
import { getAppointmentModeForAvailabilitySlotsDisplay } from '../../util/appointmentModeUtil';
import { toast } from 'react-toastify'
// import Footer from "./Footer";
// import SearchIcon from "@material-ui/icons/Search";

const rightArrow = <FontAwesomeIcon icon={faChevronRight} />;

const RescheduleAppointment = (props) => {
  let history = useHistory();

  const [users, setUser] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const cookies = new Cookies();

  const [doctor, setdoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({});

  const [appointment, setAppointment] = useState({
    type: 'DR',
    status: 'ACCEPTED',
    urgency: 'Low',
    remarks: '',
    doctorId: '',
    patientId: '',
    appointmentMode: '',
  });
  const [availableSlotsDisplay, setAvailableSlotsDisplay] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const currentLoggedInUser = cookies.get('currentUser');
  const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;

  const getCurrentPatient = async () => {

    const res = await getLoggedInUserDataByUserId(loggedInUserId);
    console.log('res1', res);
    if (res && res.data) {
      res.data.map((value, index) => {
        if (value.userId === loggedInUserId) {
          const currentPatientId = value.id;
          setCurrentPatient({ ...currentPatient, id: currentPatientId });
          loadUsers(currentPatientId);
        }
      });
    }

  };

  let doctorIdForReschedule = sessionStorage.getItem('doctorId');
  // console.log({ doctorIdForReschedule });

  const loadUsers = async (patientId) => {

    const result = await getNonPaginatedDoctorListByPatientId(
      patientId,
      doctorListLimitNonPaginated
    ).catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    if (
      result &&
      result.data &&
      result.data.doctors &&
      result.data.doctors.length > 0
    ) {
      setUser(result.data.doctors);
      const selectedDoctorForReschedule = result.data.doctors.map((value) => {
        if (value.id == doctorIdForReschedule) {
          setdoctor(value);
        }
      });
      const docId = result.data.doctors[0]?.id;
      setAppointment({
        ...appointment,
        patientId: patientId,
        doctorId: docId,
      });
      setTimeout(() => setLoading(false), 1000);
      if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state === 'sports medicine'
      ) {
        const text = props.location.state;
        var element = document.getElementById('doctor-search');
        var trigger = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        trigger.call(element, text);
        var event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
        document.querySelector('.searchForwardIcon').click();
        history.replace({ state: null });
      } else if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state !== 'sports medicine'
      ) {
        const user = props.location.state;
        setdoctor(user);
        const docId = user.id;
        setAppointment({
          ...appointment,
          patientId: patientId,
          doctorId: docId,
        });
        history.replace({ state: null });
      }
      setTransparentLoading(false);
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
    // loadMore();
  };

  useEffect(() => {
    getCurrentPatient();

    return (() => {
      sessionStorage.clear();
    })
  }, []);

  useEffect(() => {
    getAvailableSlotsOfDoctors();
  }, [appointment]);
  // useEffect(() => {
  //     getAvailableSlotsBasedOnType();
  // }, [appointment])

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const [Availability, setAvailability] = useState([]);
  const [appointmentSlot, setAppointmentSlot] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState();

  const handleAppoitnmentType = (e) => {
    setSlotError('');
    setSelectedSlotId('0');
    setAppointment({ ...appointment, appointmentMode: e.target.value });
    const user = doctor;
    // console.log({ user });
    getAvailableSlotsOfDoctors(
      user.id,
      getAppointmentModeForAvailabilitySlotsDisplay(e.target.value)
    );
    console.log(e.target.value);
    // console.log({ appointment })
    if (Availability && Availability.length > 0) {
      if (e.target.value === 'First Consultation') {
        const consultationSlots = createConsultationSlots(Availability);
        if (consultationSlots && consultationSlots.length > 0) {
          setAppointmentSlot(consultationSlots);
          // console.log({ consultationSlots });
          document.querySelector('#calendar-list').scrollTo(0, 500);
          setDisplayCalendar(false);
          setDisplaySlot(true);
          //getInValidAppointments(user.id);
          getAvailableSlotsOfDoctors(user.id, e.target.value);
        } else {
          setAppointmentSlot([]);
          setDisplayCalendar(false);
          setDisplaySlot(true);
        }
      } else if (e.target.value === 'Follow Up') {
        setAppointmentSlot(Availability);
        // console.log({ Availability });
        document.querySelector('#calendar-list').scrollTo(0, 500);
        setDisplayCalendar(false);
        setDisplaySlot(true);
        //getInValidAppointments(user.id);
        getAvailableSlotsOfDoctors(user.id, e.target.value);
      } else if (e.target.value === '') {
        setAppointmentSlot([]);
      }
      setDisable({ ...disable, continue: true });
    }
  };

  // startTime, endTime
  const [combinedSlots, setCombinedSlots] = useState([]);

  //console.log("combinedSlots :: ", combinedSlots);
  const createConsultationSlots = (slots) => {
    console.log(slots, 'in slots');
    const updatedArray = [];
    const combinedArray = [];
    if (slots && slots.length > 0) {
      slots.map((slot, i) => {
        if (slots[i + 1] && slots[i + 1].startTime === slot.endTime) {
          updatedArray.push({
            startTime: slot.startTime,
            endTime: slots[i + 1].endTime,
            type: slot.type,
            status: slot.status,
            doctorId: slot.doctorId,
            remarks: slot.remarks,
            slotId: slot.id + slots[i + 1].id,
          });
          combinedArray.push({
            slot1: slot,
            slot2: slots[i + 1],
            slotId: slot.id + slots[i + 1].id,
          });
        }
        return slots;
      });
    }
    setCombinedSlots(combinedArray);
    return updatedArray;
  };

  // //console.log("Selected Doctor ::::  ", doctor);
  const onDaySelect = async (slectedDate, doctorId, type) => {
    setTransparentLoading(true);
    setSlotError('');
    setCurrentDate(slectedDate);
    const dataForSelectedDay = {
      startTime: new Date(slectedDate).toISOString(),
      endTime: new Date(slectedDate.setHours(23, 59, 59)).toISOString(),
      status: 'AVAILABLE',
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);

    const apptType = getAppointmentModeForAvailabilitySlotsDisplay(type);

    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const newRes = await getAvailableSlotTimings(dataForSelectedDay, apptType).catch(err => console.log({ err }))
    // console.log({ newRes })

    if (newRes.status === 200) {
      setTransparentLoading(false);
      const slotsDisplayed = newRes.data.data.map(slot => {
        return slot;
      });
      // console.log({ slotsDisplayed })
      // console.log({ apptType })
      setAppointmentSlot(slotsDisplayed);
      if (apptType === "FOLLOW_UP") setAppointmentSlot(slotsDisplayed.reverse())
      setDisplayCalendar(false);
      setDisplaySlot(true);
    }
  };

  const [combinedSlotId, setCombinedSlotId] = useState();
  //console.log("combinedSlotId : ", combinedSlotId)
  const onAvailabilitySelected = (slot, index) => {
    setSlotError('');
    setSelectedSlotId(slot.id);
    if (appointment.appointmentMode === 'First Consultation') {
      setCombinedSlotId(slot.slotId);
    }
    setAppointment({
      ...appointment,
      startTime: slot.startTime,
      endTime: slot.endTime,
      id: appointmentSlot[index].id,
    });
    console.log('appointment', appointmentSlot[index].id);
    setDisable({ ...disable, continue: false });
  };

  let params = useParams();
  const [oldAppointmentID, setOldAppointmentID] = useState(0);
  useEffect(() => {
    console.log('oldAppointmentID', oldAppointmentID);
  }, [oldAppointmentID]);

  const bookappointment = async (orderData) => {
    setLoading(true);
    // let oldAppID = 0;
    // oldAppID = params.id;
    setOldAppointmentID(params.id);
    // let tempSlotConsultationId = '';
    const finalAppointmentDataArray = [];
    if (appointment.appointmentMode === 'First Consultation') {
      finalAppointmentDataArray.push({
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        id: appointment.id,
        unifiedAppointment:
          params.unifiedAppt +
          '#' +
          getAppointmentMode(appointment.appointmentMode),
      });
    } else if (appointment.appointmentMode === 'Follow Up') {
      finalAppointmentDataArray.push({
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        id: appointment.id,
        unifiedAppointment:
          params.unifiedAppt +
          '#' +
          getAppointmentMode(appointment.appointmentMode), //unifiedAppointment: "2145#Follow Up"
      });
    }

    let rescheduleData = [];
    {
      finalAppointmentDataArray.map((f) => {
        rescheduleData = f;
      });
    }
    const getOldAppointmentMode = (appMode) => {
      if (appMode === 'First Consultation') return 'FIRST_CONSULTATION';
      return 'FOLLOW_UP';
    };
    const rescheduleAppointmentApiHeader = {
      method: 'put',
      mode: 'no-cors',
      data: rescheduleData,
      url: `/api/v2/appointment/patient/reschedule/confirm?type=${getOldAppointmentMode(
        appointment.appointmentMode
      )}`,
      headers: {
        Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    try {
      const rescheduleResponse = await axios(rescheduleAppointmentApiHeader);
      if (
        rescheduleResponse.status === 200 ||
        rescheduleResponse.status === 201
      ) {
        toast.success(rescheduleResponse.message);
        props.history.push('/patient/myappointment');
      }
    } catch (err) {
      const errorStatus = err.response.status;
      if (errorStatus === 500) {
        setLoading(false);
        toast.error('You have already rescheduled this apopointment.');

        setTimeout(() => {
          props.history.push('/patient');
        }, 5000);
      }
    }
  };
  const [display, setDisplay] = useState({
    doctor: 'block',
    appointment: 'none',
    like: 'none',
    unlike: 'block',
    suggestion: 'none',
  });
  const [disable, setDisable] = useState({
    continue: true,
    payment: true,
  });


  const [slotError, setSlotError] = useState('');

  const checkSlot = () => {
    const startTime = appointment.startTime;
    //console.log(new Date(startTime), new Date(moment(new Date()).subtract(25, "minutes")))
    if (
      new Date(startTime) > new Date(moment(new Date()).subtract(25, 'minutes'))
    ) {
      setDisplay({ ...display, doctor: 'none', appointment: 'block' });
    } else {
      setSlotError(
        'Time for booking this slot has been elapsed. Please select another slot!'
      );
    }
  };

  const [displayCalendar, setDisplayCalendar] = useState(true);
  const [displaySlot, setDisplaySlot] = useState(false);

  // AVAILABLE SLOTS OF A DOCTOR
  const [enableDates, setEnableDates] = useState([]);
  const [rescheduleMode, setRescheduleMode] = useState('');
  const getAvailableSlotsOfDoctors = async (id, type) => {
    const state = params.type;
    console.log('state', state);
    setRescheduleMode(state);
    if (id) {
      const response = await getAvailableSlotsForMyDoctors(
        id,
        type
      ).catch((err) => console.log({ err }));
      // console.log({ response })
      setAvailableSlotsDisplay(response.data);
      console.log('availableSlotsDisplay', { availableSlotsDisplay });

      const enableDatesFromRes = response.data.data?.map((n) => {
        return new Date(n.instantDate);
      });

      setEnableDates(enableDatesFromRes);
    }
    return null;
  };

  const disabledCalendarDates = (date) => {
    return (
      enableDates &&
      !enableDates.some((enabledDate) => {
        const eD =
          date.getFullYear() === enabledDate.getFullYear() &&
          date.getMonth() === enabledDate.getMonth() &&
          date.getDate() === enabledDate.getDate();
        // console.log({ date: date, enabledDate: enabledDate, ed: eD });
        return eD;
      })
    );
  };
  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Container className="my-doctor">
        <Row>


          <Col md={6} lg={8} style={{ display: display.doctor }}>
            <div id="dorctor-list" className="doctor-list-new">
              {doctor && doctor.activated ? (
                <>
                  <Row id="doc-row">
                    <Col xs={12}>
                      <div className="doc-img">
                        {doctor.picture ? (
                          <img src={doctor.picture} alt="" />
                        ) : (
                          <Avatar
                            name={doctor.firstName + ' ' + doctor.lastName}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} id="doc-details">
                      <div>
                        <p className="doc-name">
                          {doctor.salutation}{' '}{doctor.firstName} {doctor.lastName}
                        </p>
                        <ul
                          style={{
                            fontSize: 14,
                            display: 'block',
                            textAlign: 'center',
                          }}
                          className="list--tags"
                        >
                          {doctor &&
                            doctor.specialities &&
                            doctor.specialities.map((speciality, index) => (
                              <li key={index}>{speciality.name} </li>
                            ))}
                        </ul>
                        <p
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: '400',
                          }}
                        >
                          {doctor.experience} years of experience
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  {availableSlotsDisplay &&
                    appointment.appointmentMode !== '' &&
                    availableSlotsDisplay.data &&
                    availableSlotsDisplay.data.length > 0 && (
                      <>
                        <div className="row">
                          <div className="col-12 ml-4">
                            <span>Availability</span>
                            {/* {console.log({ doctor })} */}
                            <div className="availability-card-holder">
                              {/* MAP HERE */}
                              {availableSlotsDisplay.data &&
                                availableSlotsDisplay.data.length > 0 &&
                                availableSlotsDisplay.data.map(
                                  (slot, index) => (
                                    <div
                                      className="availability-card"
                                      key={index}
                                    >
                                      <span>
                                        {moment(slot.instantDate).format(
                                          'DD/MM/YY'
                                        )}
                                      </span>
                                      <span>
                                        {slot.count} slots available
                                      </span>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                        <hr />
                      </>
                    )}
                  <div className="mr-4 ml-4">
                    <div className="row">
                      <div className="col-12">
                        <span style={{ fontSize: 14 }}>
                          <b>Nationality</b>: {doctor.countryName}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <b><span style={{ fontSize: 14 }}>Education</span></b>
                        <br />

                        {doctor &&
                          doctor.educationalQualifications &&
                          doctor.educationalQualifications.map(
                            (x, index) => (
                              <li key={index} className='list-font'>
                                {x.educationalQualification}{' '}
                              </li>
                            )
                          )}

                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <b><span style={{ fontSize: 14 }}>Institution</span></b>
                        <br />

                        {doctor &&
                          doctor.educationalQualifications &&
                          doctor.educationalQualifications.map(
                            (x, index) => (
                              <li key={index} className='list-font'>{x.institution} </li>
                            )
                          )}

                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <b><span style={{ fontSize: 14 }}>Languange</span></b>
                        <br />

                        {doctor &&
                          doctor.languages &&
                          doctor.languages.map((lang, index) => (
                            <li key={index} className='list-font'>{lang.name} </li>
                          ))}

                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* <h5>About</h5> */}
                  <div className="ml-4">
                    {
                      doctor.bio && <b><p style={{ fontSize: 14, margin: "0 auto" }}>About</p></b>
                    }
                    <p style={{ fontSize: 14 }}>
                      {
                        doctor.bio && <span>{doctor.bio}</span>
                      }
                      <br />

                      {doctor.awards && (
                        <>
                          <span>
                            <b>Awards : </b>
                          </span>
                          <br />
                          <span>{doctor.awards}</span>
                        </>
                      )}
                      <br />
                      {doctor.certificates && (
                        <>
                          <span>
                            <b>Certificates : </b>
                          </span>
                          <br />
                          <span>{doctor.certificates}</span>
                        </>
                      )}
                      <br />
                      {doctor.experience && (
                        <>
                          <span>
                            <b>Experience : </b>
                          </span>
                          <br />
                          <span>{doctor.experience} yrs</span>
                        </>
                      )}
                    </p>
                    <div className="mx-0">
                      <div className="row">
                        <div className="col-12">
                          <span className="price">
                            $
                            {appointment.appointmentMode ===
                              'First Consultation' ||
                              appointment.appointmentMode === ''
                              ? doctor.rate
                              : appointment.appointmentMode === 'Follow Up'
                                ? doctor.halfRate
                                : ''}
                          </span>
                          <br />
                          <span>
                            USD /{' '}
                            {appointment.appointmentMode ===
                              'First Consultation' ||
                              appointment.appointmentMode === ''
                              ? 'First Consultation'
                              : appointment.appointmentMode === 'Follow Up'
                                ? 'Follow up'
                                : ''}
                          </span>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-result">
                  <center>No Doctor Found ...</center>
                </div>
              )}
            </div>
          </Col>


          <Col
            md={6}
            lg={4}
            className="p-0"
            style={{ display: display.doctor }}
          >
            <div id="dorctor-list">
              <div style={{ height: 470 }} id="calendar-list">
                <div className="dateGroup">
                  {displayCalendar && (
                    <>
                      <div className="appointment-type">
                        <p>Appointment Type</p>
                        <FormControl>
                          <Select
                            id="demo-controlled-open-select"
                            variant="outlined"
                            name="appointmentType"
                            value={appointment.appointmentMode}
                            displayEmpty
                            onChange={(e) => handleAppoitnmentType(e)}
                          >
                            <MenuItem value="">
                              <em>Select</em>
                            </MenuItem>
                            {rescheduleMode === 'follow-up' ? (
                              <MenuItem value="Follow Up">
                                Follow up(30 Mins)
                              </MenuItem>
                            ) : (
                              <MenuItem value="First Consultation">
                                Consultation(1 Hr)
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </div>
                      <Calendar
                        onChange={(e) =>
                          onDaySelect(new Date(e), doctor && doctor.id, appointment.appointmentMode)
                        }
                        value={currentDate}
                        minDate={new Date()} //to disable past days
                        maxDate={
                          new Date(
                            new Date().setDate(new Date().getDate() + 180)
                          )
                        } // next 3week condition
                        // Temporarily commented to enable calendar click functionality for appointment.
                        tileDisabled={({ activeStartDate, date, view }) =>
                          disabledCalendarDates(date)
                        } // greyout dates
                      />
                    </>
                  )}

                  {displaySlot && (
                    <>
                      <IconButton
                        style={{
                          background: '#F6CEB4',
                          color: '#00d0cc',
                          marginRight: '10px',
                        }}
                        onClick={() => {
                          setDisplaySlot(false);
                          setDisplayCalendar(true);
                        }}
                      >
                        <KeyboardBackspaceIcon />{' '}
                      </IconButton>{' '}
                      Back to calendar
                      <p className="mt-3">
                        Available {getAppointmentModeToDisplayAsLabel(appointment.appointmentMode)} Slots For{' '}
                        {moment(currentDate).format('DD, MMM YYYY')}
                      </p>
                      <div className="slot-display">
                        {appointmentSlot && appointmentSlot.length > 0 ? (
                          appointmentSlot.map((current, i) => (
                            <div className="inputGroup" key={i}>
                              <input
                                id={`selectedId${i}`}
                                name="selectedId"
                                className="choseSlotInput"
                                type="radio"
                                value={current.id}
                                onChange={() =>
                                  onAvailabilitySelected(current, i)
                                }
                                checked={
                                  selectedSlotId &&
                                  parseInt(selectedSlotId) === current.id
                                }
                              />
                              <label
                                htmlFor={`selectedId${i}`}
                                className="choseSlotLable"
                              >
                                <b>
                                  {moment(current.startTime).format(
                                    'hh:mm A'
                                  )}{' '}
                                  {/* -{' '}
                                    {moment(current.endTime).format('hh:mm A')}{' '} */}
                                </b>
                              </label>
                            </div>
                          ))
                        ) : appointmentSlot.length === 0 &&
                          appointment.appointmentMode ===
                          'First Consultation' ? (
                          <div
                            style={{ textAlign: 'center', marginTop: '50%' }}
                          >
                            Only Follow Up Consultation is Available.
                          </div>
                        ) : (
                          <div
                            style={{ textAlign: 'center', marginTop: '50%' }}
                          >
                            No slots available.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <label
                  style={{
                    fontSize: 12,
                    color: '#ff9393',
                    marginBottom: '10px',
                    marginTop: '10px',
                  }}
                  className="left"
                >
                  {slotError}
                </label>
              </div>
              <button
                className="btn btn-primary continue-btn"
                onClick={async () => {
                  checkSlot();
                }}
                disabled={disable.continue}
              >
                Continue
              </button>
            </div>
          </Col>



          <Col md={7} style={{ display: display.appointment }}>
            <div id="dorctor-list" className="doctor-list-new">
              <IconButton
                style={{ background: '#F6CEB4', color: '#00d0cc' }}
                onClick={() => {
                  setDisplay({
                    ...display,
                    doctor: 'block',
                    appointment: 'none',
                  });
                  setDisable({ ...disable, payment: true });
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <p className="blue ml-2 text-center">Confirm your booking</p>
              <Row id="doc-row">
                <Col xs={12}>
                  <div className="doc-img">
                    {doctor.picture ? (
                      <img src={doctor.picture} alt="" />
                    ) : (
                      <Avatar
                        name={doctor.firstName + ' ' + doctor.lastName}
                      />
                    )}
                  </div>
                </Col>
                <Col xs={12} id="doc-details">
                  <div>
                    <p className="doc-name">
                      {doctor.salutation}{' '}{doctor.firstName} {doctor.lastName}
                    </p>
                    <ul
                      style={{
                        fontSize: 12,
                        display: 'block',
                        textAlign: 'center',
                      }}
                      className="list--tags"
                    >
                      {doctor &&
                        doctor.specialities &&
                        doctor.specialities.map((speciality, index) => (
                          <li key={index}>{speciality.name} </li>
                        ))}
                    </ul>
                    <p
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        fontWeight: '600',
                      }}
                    >
                      {doctor.experience} years of experience
                    </p>
                  </div>
                </Col>
              </Row>
              <div className="mr-4 ml-4">
                <div className="row">
                  <div className="col-12">
                    <span style={{ fontSize: 12 }}>
                      <b>Nationality:</b> {doctor.countryName}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <span style={{ fontSize: 12 }}>Education</span>
                    <br />
                    <b>
                      {doctor &&
                        doctor.educationalQualifications &&
                        doctor.educationalQualifications.map((x, index) => (
                          <li key={index}>{x.educationalQualification} </li>
                        ))}
                    </b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <span style={{ fontSize: 12 }}>Institution</span>
                    <br />
                    <b>
                      {doctor &&
                        doctor.educationalQualifications &&
                        doctor.educationalQualifications.map((x, index) => (
                          <li key={index}>{x.institution} </li>
                        ))}
                    </b>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <span style={{ fontSize: 12 }}>Languange</span>
                    <br />
                    <b>
                      {doctor &&
                        doctor.languages &&
                        doctor.languages.map((lang, index) => (
                          <li key={index}>{lang.name} </li>
                        ))}
                    </b>
                  </div>
                </div>
                <hr style={{ borderColor: 'black' }} />
                <h5 className="blue">
                  Date: {moment(appointment.startTime).format('MMMM DD')}
                </h5>
                <h5 className="blue">
                  Time:{' '}
                  {moment(appointment.startTime).format('LT') +
                    '-' +
                    moment(appointment.endTime).format('LT')}
                </h5>
                <hr style={{ borderColor: 'black' }} />
                <div className="m-3">
                  <div className="row">
                    <div className="col-12">
                      <span className="price mr-1">
                        $
                        {appointment.appointmentMode ===
                          'First Consultation' ||
                          appointment.appointmentMode === ''
                          ? doctor && doctor.rate
                          : appointment.appointmentMode === 'Follow Up'
                            ? doctor && doctor.halfRate
                            : ''}
                      </span>
                      <span>
                        USD /{' '}
                        {appointment.appointmentMode ===
                          'First Consultation' ||
                          appointment.appointmentMode === ''
                          ? 'First Consultation'
                          : appointment.appointmentMode === 'Follow Up'
                            ? 'Follow Up'
                            : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col md={5} style={{ display: display.appointment }}>
            <div id="dorctor-list" className="doctor-list-new">
              <p style={{ fontSize: 12 }}>
                Your total for this Primary Care visit.
              </p>
              <div id="calendar-list">
                <div id="price-box">
                  <span className="price">
                    $
                    {appointment.appointmentMode === 'First Consultation' ||
                      appointment.appointmentMode === ''
                      ? doctor && doctor.rate
                      : appointment.appointmentMode === 'Follow Up'
                        ? doctor && doctor.halfRate
                        : ''}
                  </span>
                  <br />
                  <span>
                    USD /{' '}
                    {appointment.appointmentMode === 'First Consultation' ||
                      appointment.appointmentMode === ''
                      ? 'First Consultation'
                      : appointment.appointmentMode === 'Follow Up'
                        ? 'Follow Up'
                        : ''}
                  </span>
                  <br />
                  <span style={{ fontSize: 12 }}>
                    100% Satisfaction Guaranteed
                  </span>
                </div>
                <br />

                {/* <span id="promo-code">Have a promo code?</span><br /><br /> */}
                <div id="payment-form" style={{ marginLeft: '15px' }}>


                  <Row>
                    {/* <Col md={1}></Col> */}
                    {/* <Col md={5} style={{ paddingLeft: 0 }}><button type="button" className="btn btn-primary continue-btn" onClick={bookappointment}>Pay by PayPal</button></Col> */}

                    {disable.payment && (
                      <Col md={12} style={{ paddingLeft: 0 }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          onClick={(e) => bookappointment()}
                        >
                          Reschedule Now
                        </button>
                      </Col>
                    )}

                    {!disable.payment && (
                      <Col md={12} style={{ paddingLeft: 0 }}>
                        <Paypal
                          appointment={appointment}
                          bookappointment={bookappointment}
                          currentPatient={props.currentPatient}
                          doctor={doctor}
                        />
                      </Col>
                    )}
                    {/* 1, Create component called mobile payment and add a route to this mobile payment
                      2. Add Paypal component inside mobile payment */}
                  </Row>

                </div>
              </div>
            </div>
            <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Appointment is Booked!
              </DialogTitle>
              <DialogActions>
                <Link to="/patient/myappointment">
                  <button
                    autoFocus
                    onClick={handleClose}
                    className="btn btn-primary sign-btn"
                    id="close-btn"
                  >
                    OK
                  </button>
                </Link>
              </DialogActions>
            </Dialog>
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
    </div>
  );
};

export default RescheduleAppointment;
