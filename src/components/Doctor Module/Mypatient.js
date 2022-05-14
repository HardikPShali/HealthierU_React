import React, { useEffect, useState } from 'react'
// import Footer from './Footer'
import { Link } from 'react-router-dom'
// import default_image from '../../images/default_image.png';
import './doctor.css'
import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
//import patientprofile from '../../images/patientprof.png';
//import appointmentreq from '../../images/appointmentreq.png';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
// import LocalStorageService from "./../../util/LocalStorageService";
import Cookies from 'universal-cookie';
import Loader from './../Loader/Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import Avatar from 'react-avatar';
//import { checkAccessToken } from '../../service/RefreshTokenService';
import ChatIcon from '@material-ui/icons/Chat';
import VideocamIcon from '@material-ui/icons/Videocam';
//import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// import { handleAgoraAccessToken } from '../../service/agoratokenservice';
// import { handleSignin } from '../../service/AccountService';
// import momentTz from 'moment-timezone';
import { getDoctorByUserId, getPatientChiefComplaint, getPatientFamilyAndSocialHistoryData, loadActivePatient, loadPastPatient } from '../../service/frontendapiservices';
import calendar from '../../images/icons used/Component 12.svg';
import time from '../../images/icons used/Component 11.svg';
import dollar from '../../images/icons used/Component 13.svg';
import payment from '../../images/icons used/Component 14.svg';
import conHistory from '../../images/icons used/Component 15.svg';
import HealthAssessment from '../../images/icons used/Component 16.svg';
import MedicalRecord from '../../images/icons used/Component 17.svg';
import HealthAssestmentReport from './HealthAssestmentReport/HealthAssestmentReport';
const Mypatient = (props) => {
    // const currentTimezone = props.timeZone;
    //const getMoment = (timezone) => {
    //    const m = (...args) => momentTz.tz(...args, timezone);
    //    m.localeData = momentTz.localeData;
    //    return m;
    //};

    //const moment = getMoment(currentTimezone);
    const [activeAppointments, setActiveAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const cookies = new Cookies();
    // const [chatRooms, setChatRooms] = useState([])

    const [SelectedPatient, setSelectedPatient] = useState();
    const [currentDoctor, setCurrentDoctor] = useState({
        doctorId: ''
    });
    const { doctorId } = currentDoctor;
    const [age, setAge] = useState(0);
    const [chiefComplaint, setChiefComplaint] = useState({});
    const [familyAndSocialHistory, setFamilyAndSocialHistory] = useState({});

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

    const handleVideoCall = (startTime) => {
        const appointmentStartTime = new Date(startTime);
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
        getCurrentDoctor();

    }, []);
    const currentLoggedInUser = cookies.get("currentUser");
    const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;

    const getCurrentDoctor = async () => {
        const res = await getDoctorByUserId(loggedInUserId);
        if (res && res.data) {
            res.data.doctors.map(async (value, index) => {
                if (value.userId === loggedInUserId) {
                    const currentDoctorId = value.id;
                    setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctorId })
                    // const response = await getFireBaseChatRoom(currentDoctorId);
                    // setChatRooms(response);
                    loadPatient(currentDoctorId);
                }
            })
            // setCurrentDoctor({...currentDoctor, id: currentDoctorId });
        }

    }

    const getChiefComplaintData = async (patientId) => {
        // const res = await getPatientChiefComplaint(patientId)
        // if (res && res.data) {
        //     setChiefComplaint(res.data[0]);
        // }
    }
    const getFamilyAndSocialHistoryData = async (patientId) => {
        // const res = await getPatientFamilyAndSocialHistoryData(patientId);
        // if (res && res.data) {
        //     setFamilyAndSocialHistory(res.data[0]);
        // }
    }

    const limit = 25;
    const [activeOffset, setActiveOffset] = useState(0);
    const [pastOffset, setPastOffset] = useState(0);
    const loadPatient = async (selectedDoctorId) => {
        var objDate = new Date();
        var getCurrentHours = new Date().getHours();
        //console.log("new Date(objDate.setHours(getCurrentHours, 0, 0)).toISOString() ::::::", new Date(objDate.setHours(getCurrentHours, 0, 0)).toISOString());
        const getPatientList = {
            doctorId: selectedDoctorId,
            startTime: new Date(objDate.setHours(getCurrentHours, 0, 0)).toISOString(),
            status: "ACCEPTED"
        }
        const response = await loadActivePatient(getPatientList, activeOffset, limit).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
            console.log("loadActivePatient", response)
        });
        if (response.status === 200 || response.status === 201) {
            console.log("loadActivePatient", response)
            setActiveOffset(activeOffset + 1);
            setTimeout(() => setLoading(false), 1000);
            setActiveAppointments(response.data);
            if (response.data[0] && response.data[0].patient) {
                handleActivePastTab(response.data[0], (response.data[1] && response.data[1]));
                calculate_age(response.data[0].patient.dateOfBirth);
                getChiefComplaintData(response.data[0].patient.id);
                getFamilyAndSocialHistoryData(response.data[0].patient.id);
            }
        }
    };

    const loadPastPatientAppointment = async (selectedDoctorId) => {
        setDataLoading(true);
        const getPatientList = {
            doctorId: selectedDoctorId,
            endTime: new Date().toISOString(),
            status: "ACCEPTED"
        }
        const response = await loadPastPatient(getPatientList);
        if (response.status === 200 || response.status === 201) {
            setPastOffset(1);
            setTimeout(() => setDataLoading(false), 1000);
            setPastAppointments(response.data);
            handleActivePastTab(response.data[0], (response.data[1] && response.data[1]));
            if (response.data[0] && response.data[0].patient) {
                calculate_age(response.data[0].patient.dateOfBirth);
                getChiefComplaintData(response.data[0].patient.id);
                getFamilyAndSocialHistoryData(response.data[0].patient.id);
            }
        }
    };

    // const redirectToChat = () => {
    //     window.location.assign('/doctor/chat');
    // }
    const loadMoreActiveAppointment = async (selectedDoctorId) => {
        const getPatientList = {
            doctorId: selectedDoctorId,
            startTime: new Date().toISOString(),
            status: "ACCEPTED"
        }
        const response = await loadActivePatient(getPatientList, activeOffset, limit);
        if (response.status === 200 || response.status === 201) {
            var existingActiveAppList = activeAppointments;
            response.data && response.data.map(newData => {
                return (existingActiveAppList.push(newData))
            })
            setActiveOffset(activeOffset + 1);
            setTimeout(() => setLoading(false), 1000);
            setActiveAppointments(existingActiveAppList);
        }
    };

    const loadMorePastAppointment = async (selectedDoctorId) => {
        const getPatientList = {
            doctorId: selectedDoctorId,
            endTime: new Date().toISOString(),
            status: "ACCEPTED"
        }
        const response = await loadPastPatient(getPatientList, pastOffset, limit);
        if (response.status === 200 || response.status === 201) {
            var existingPastAppList = pastAppointments;
            response.data && response.data.map(newData => (
                existingPastAppList.push(newData)
            ));
            setPastOffset(pastOffset + 1);
            setTimeout(() => setLoading(false), 1000);
            setPastAppointments(existingPastAppList);
        }
    };

    const calculate_age = dob => {
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const age = new Date(difference);

        setAge(Math.abs(age.getUTCFullYear() - 1970));
    }

    const handleConsultationClick = (slot, slot1EndTime) => {
        slot.endTime = slot1EndTime;
        setSelectedPatient(slot);
    };

    const handleActivePastTab = (slot, slot1) => {
        if (slot && slot.unifiedAppointment === (slot1 && slot1.unifiedAppointment)) {
            slot.endTime = slot1.endTime;
            setSelectedPatient(slot);

        }
        else {
            setSelectedPatient(slot);
        }
    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
            <Container>
                <Row>
                    <Col lg={6} md={6} id="col">
                        <div id="patient-col-1">
                            <div id="patient-heading">My Patients</div>
                            <Tabs style={{ margin: '10px' }} id="mypatient-tabs">
                                <TabList style={{ boxShadow: 'rgb(0 0 0 / 24%) 0px 0px 5px' }}>
                                    <Tab onClick={() => {
                                        setActiveOffset(1);
                                        handleActivePastTab(activeAppointments[0], activeAppointments[1] && activeAppointments[1]);
                                        if (activeAppointments[0] && activeAppointments[0].patientId) {
                                            getChiefComplaintData(activeAppointments[0].patientId);
                                            getFamilyAndSocialHistoryData(activeAppointments[0].patientId);
                                        }
                                        activeAppointments[0] && activeAppointments[0].patient && (
                                            Object.keys(activeAppointments[0].patient).map(patientData => {
                                                //if (activeAppointments[0].patient && activeAppointments[0].patient.dateOfBirth) {
                                                return (calculate_age(activeAppointments[0].patient.dateOfBirth && activeAppointments[0].patient.dateOfBirth))
                                                //}
                                            })
                                        );
                                    }}>Active Appointments</Tab>
                                    <Tab onClick={() => {
                                        setPastOffset(0);
                                        ////console.log("pastOffset :::::::::", pastOffset);
                                        loadPastPatientAppointment(doctorId);
                                    }}>Past Appointments</Tab>
                                </TabList>
                                <TabPanel>
                                    <div id="patient-list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th width="50"></th>
                                                    <th width="150">Name</th>
                                                    <th width="70">Gender</th>
                                                    <th width="100">Weight</th>
                                                    <th width="100">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeAppointments.map((user, index) => {
                                                    if (user.unifiedAppointment === (activeAppointments[index + 1] && activeAppointments[index + 1].unifiedAppointment)) {
                                                        if (user && user.patient) {
                                                            return (<>
                                                                <tr key={index}>
                                                                    <td width="50" style={{ cursor: "pointer" }} onClick={async () => {
                                                                        handleConsultationClick(user, activeAppointments[index + 1].endTime);
                                                                        if (user && user.patientId) {
                                                                            getChiefComplaintData(user.patientId);
                                                                            getFamilyAndSocialHistoryData(user.patientId);
                                                                        }
                                                                        Object.keys(user.patient).map(patientData => {
                                                                            //if (user.patient && user.patient.dateOfBirth) {
                                                                            return (calculate_age(user.patient.dateOfBirth && user.patient.dateOfBirth))
                                                                            //}
                                                                        })
                                                                    }}>{user.patient.picture ?
                                                                        (<img src={user.patient.picture} alt="" style={{ width: 45, height: 45, borderRadius: 5 }} />)
                                                                        :
                                                                        (<Avatar name={user.patient.firstName + " " + user.patient.lastName} size="45" />)}</td>
                                                                    <td width="150">{user.patient.firstName + " " + user.patient.lastName}</td>
                                                                    <td width="70">{user.patient.gender && user.patient.gender === "MALE" ? "Male"
                                                                        : user.patient.gender === "FEMALE" ? "Female" : ""}</td>
                                                                    <td width="100">{user.patient.weight}</td>
                                                                    <td width="100"><span title={moment(user.startTime).format("h:mm A") + " - " + moment(activeAppointments[index + 1].endTime).format("h:mm A")}>{moment(user.startTime).format("MMM DD, YYYY")}</span></td>
                                                                </tr>
                                                            </>)
                                                        }

                                                    }
                                                    else if ((user.unifiedAppointment !== (activeAppointments[index + 1] && activeAppointments[index + 1].unifiedAppointment)) && (user.unifiedAppointment === (activeAppointments[index - 1] && activeAppointments[index - 1].unifiedAppointment))) {
                                                        if (user && user.patient) {
                                                            return false;
                                                        }
                                                    }
                                                    else if (((user.unifiedAppointment !== (activeAppointments[index + 1] && activeAppointments[index + 1].unifiedAppointment)) &&
                                                        (user.unifiedAppointment !== (activeAppointments[index - 1] && activeAppointments[index - 1].unifiedAppointment)))) {
                                                        if (user && user.patient) {
                                                            return (<>
                                                                <tr key={index}>
                                                                    <td width="50" style={{ cursor: "pointer" }} onClick={async () => {
                                                                        setSelectedPatient(user);
                                                                        if (user && user.patientId) {
                                                                            getChiefComplaintData(user.patientId);
                                                                            getFamilyAndSocialHistoryData(user.patientId);
                                                                        }
                                                                        Object.keys(user.patient).map(patientData => {
                                                                            //if (user.patient && user.patient.dateOfBirth) {
                                                                            return (calculate_age(user.patient.dateOfBirth && user.patient.dateOfBirth))
                                                                            //}
                                                                        })
                                                                    }}>{user.patient.picture ?
                                                                        (<img src={user.patient.picture} alt="" style={{ width: 45, height: 45, borderRadius: 5 }} />)
                                                                        :
                                                                        (<Avatar name={user.patient.firstName + " " + user.patient.lastName} size="45" />)} </td>
                                                                    <td width="150">{user.patient.firstName + " " + user.patient.lastName}</td>
                                                                    <td width="70">{user.patient.gender && user.patient.gender === "MALE" ? "Male"
                                                                        : user.patient.gender === "FEMALE" ? "Female" : ""}</td>
                                                                    <td width="100">{user.patient.weight}</td>
                                                                    <td width="100"><span title={moment(user.startTime).format("h:mm A") + " - " + moment(user.endTime).format("h:mm A")}>{moment(user.startTime).format("MMM DD, YYYY")}</span></td>
                                                                </tr>
                                                            </>)
                                                        }
                                                    }
                                                    return activeAppointments;
                                                })}
                                                <tr>
                                                    <td colSpan={4} style={{ width: '100%' }}>
                                                        {activeAppointments.length > 24 && (
                                                            <div className="text-center">
                                                                <button className="btn btn-outline-secondary" onClick={() => loadMoreActiveAppointment(doctorId)}>Load More</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div id="patient-list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th width="50"></th>
                                                    <th width="150">Name</th>
                                                    <th width="70">Gender</th>
                                                    <th width="100">Weight</th>
                                                    <th width="100">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pastAppointments.map((user, index) => {
                                                    if (user.unifiedAppointment === (pastAppointments[index + 1] && pastAppointments[index + 1].unifiedAppointment)) {
                                                        if (user && user.patient) {
                                                            return (<>
                                                                <tr key={index}>
                                                                    <td width="50" style={{ cursor: "pointer" }} onClick={async () => {
                                                                        handleConsultationClick(user, pastAppointments[index + 1].endTime);
                                                                        if (user && user.patientId) {
                                                                            getChiefComplaintData(user.patientId);
                                                                            getFamilyAndSocialHistoryData(user.patientId);
                                                                        }
                                                                        Object.keys(user.patient).map(patientData => {
                                                                            //if (user.patient && user.patient.dateOfBirth) {
                                                                            return (calculate_age(user.patient.dateOfBirth && user.patient.dateOfBirth))
                                                                            //}
                                                                        })
                                                                    }}>{user.patient.picture ?
                                                                        (<img src={user.patient.picture} alt="" style={{ width: 45, height: 45, borderRadius: 5 }} />)
                                                                        :
                                                                        (<Avatar name={user.patient.firstName + " " + user.patient.lastName} size="45" />)} </td>
                                                                    <td width="150">{user.patient.firstName + " " + user.patient.lastName}</td>
                                                                    <td width="70">{user.patient.gender && user.patient.gender === "MALE" ? "Male"
                                                                        : user.patient.gender === "FEMALE" ? "Female" : ""}</td>
                                                                    <td width="100">{user.patient.weight}</td>
                                                                    <td width="100"><span title={moment(user.startTime).format("h:mm A") + " - " + moment(pastAppointments[index + 1].endTime).format("h:mm A")}>{moment(user.startTime).format("MMM DD, YYYY")}</span></td>
                                                                </tr>
                                                            </>)
                                                        }

                                                    }
                                                    else if ((user.unifiedAppointment !== (pastAppointments[index + 1] && pastAppointments[index + 1].unifiedAppointment)) && (user.unifiedAppointment === (pastAppointments[index - 1] && pastAppointments[index - 1].unifiedAppointment))) {
                                                        if (user && user.patient) {
                                                            return false;
                                                        }
                                                    }
                                                    else if (((user.unifiedAppointment !== (pastAppointments[index + 1] && pastAppointments[index + 1].unifiedAppointment)) &&
                                                        (user.unifiedAppointment !== (pastAppointments[index - 1] && pastAppointments[index - 1].unifiedAppointment)))) {
                                                        if (user && user.patient) {
                                                            return (<>
                                                                <tr key={index}>
                                                                    <td width="50" style={{ cursor: "pointer" }} onClick={async () => {
                                                                        setSelectedPatient(user);
                                                                        if (user && user.patientId) {
                                                                            getChiefComplaintData(user.patientId);
                                                                            getFamilyAndSocialHistoryData(user.patientId);
                                                                        }
                                                                        Object.keys(user.patient).map(patientData => {
                                                                            //if (user.patient && user.patient.dateOfBirth) {
                                                                            return (calculate_age(user.patient.dateOfBirth && user.patient.dateOfBirth))
                                                                            //}
                                                                        })
                                                                    }}>{user.patient.picture ?
                                                                        (<img src={user.patient.picture} alt="" style={{ width: 45, height: 45, borderRadius: 5 }} />)
                                                                        :
                                                                        (<Avatar name={user.patient.firstName + " " + user.patient.lastName} size="45" />)} </td>
                                                                    <td width="150">{user.patient.firstName + " " + user.patient.lastName}</td>
                                                                    <td width="70">{user.patient.gender && user.patient.gender === "MALE" ? "Male"
                                                                        : user.patient.gender === "FEMALE" ? "Female" : ""}</td>
                                                                    <td width="100">{user.patient.weight}</td>
                                                                    <td width="100"><span title={moment(user.startTime).format("h:mm A") + " - " + moment(user.endTime).format("h:mm A")}>{moment(user.startTime).format("MMM DD, YYYY")}</span></td>
                                                                </tr>
                                                            </>)
                                                        }
                                                    }
                                                    return pastAppointments;
                                                })}

                                                <tr>
                                                    <td colSpan={4} style={{ width: '100%' }}>
                                                        {pastAppointments.length > 24 && (
                                                            <div className="text-center">
                                                                <button className="btn btn-outline-secondary" onClick={() => loadMorePastAppointment(doctorId)}>Load More</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <Link to="/doctor/appointment"><button className="btn btn-primary calendar-btn">My Calendar</button></Link>
                    </Col>
                    <Col lg={6} md={6} id="col">
                        {dataLoading && (
                            <>
                                <div id="request-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p className="text-center">Loading ...</p>
                                </div>
                            </>
                        )}
                        {!dataLoading && (
                            <>
                                {SelectedPatient ? (<>
                                    <div id="request-box">
                                        <div id="appointment-request">
                                            <Row>
                                                {/* <Col xs={7}>
                                                    <b style={{ fontSize: '16px' }}>Appointment</b>
                                                    <br /><br />

                                                </Col> */}
                                                <Col xs={8}><div id="req-name"><b style={{ fontSize: '16px' }}>APID : {SelectedPatient.id} | {SelectedPatient.unifiedAppointment}</b></div></Col>
                                                <Col xs={4} className="text-right">

                                                    <button className={'btn btn-primary ' + SelectedPatient.urgency}>{SelectedPatient.urgency}</button><br />
                                                    <br />
                                                </Col>
                                            </Row>
                                            <Row style={{ alignItems: "center" }}>
                                                <Col xs={2}>{SelectedPatient && SelectedPatient.patient && (SelectedPatient.patient.picture ?
                                                    (<div className="img-box" style={{ background: `url(${SelectedPatient.patient.picture})` }}>
                                                        {/*<img src={SelectedPatient.patient.picture} alt="" style={{ width: "auto", height: 214, borderRadius: 10 }} />*/}
                                                    </div>)
                                                    :
                                                    (<Avatar name={SelectedPatient.patient.firstName + " " + SelectedPatient.patient.lastName} size="140" />)

                                                )}
                                                </Col>
                                               <Col xs={2} style={{ paddingRight: '0', paddingLeft: '80px', paddingTop: '35px' }}><DateRangeOutlinedIcon /></Col>
                                                    <Col xs={3} style={{ textAlign: 'center' }}><b><p className='pclass'>Upcoming :</p></b><div id="req-date" style={{ paddingRight: '5px' }}>{moment(SelectedPatient.startTime).format("MMM DD, YYYY")}<br />{moment(SelectedPatient.startTime).format("h:mm A") + " - " + moment(SelectedPatient.endTime).format("h:mm A")}</div></Col>



                                                <Col xs={2} style={{ paddingRight: '0', paddingLeft: '80px', paddingTop: '35px' }}><DateRangeOutlinedIcon /></Col>
                                                <Col xs={3} style={{ textAlign: 'center' }}><b><p className='pclass'>Current :</p></b><div id="req-date" style={{ paddingRight: '5px' }}>{moment(SelectedPatient.startTime).format("MMM DD, YYYY")}<br />{moment(SelectedPatient.startTime).format("h:mm A") + " - " + moment(SelectedPatient.endTime).format("h:mm A")}</div>
                                                </Col>


                                            </Row>
                                            <Row style={{ alignItems: "center", marginTop: "5px" }}>

                                                <Col xs={4}><div id="req-name"><b>{SelectedPatient && SelectedPatient.patient && (SelectedPatient.patient.firstName + " " + SelectedPatient.patient.lastName)}</b><br />{age} Years Old</div></Col>
                                                <Col xs={4}><div id="req-name"><b className="pclass1">Fee & Payment Method</b><br />$20 By Credit Card</div></Col>
                                                {/* <Col xs={1} style={{ alignItems: "center",paddingTop: '35px' }}><DateRangeOutlinedIcon /></Col>
                                                <Col xs={7} style={{ textAlign: 'right' }}><p className='pclass'>Appointment Fee & Payment Method</p><div id="req-date" style={{ paddingRight: '5px' }}>{moment(SelectedPatient.startTime).format("MMM DD, YYYY")}<br />{moment(SelectedPatient.startTime).format("h:mm A") + " - " + moment(SelectedPatient.endTime).format("h:mm A")}</div></Col> */}
                                                <Col xs={4} className="patient-video-button" style={{ textAlign: 'right' }}>
                                                    <IconButton>
                                                        <Link to={`/doctor/chat?chatgroup=P${SelectedPatient?.patient?.id}_D${doctorId}`} title="Chat"><ChatIcon id="active-video-icon" /></Link>
                                                    </IconButton>
                                                    <IconButton onClick={() => handleVideoCall(SelectedPatient.startTime)}>
                                                        <VideocamIcon id="active-video-icon" />
                                                    </IconButton>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div id="req-info">
                                            <Link
                                                to={{ pathname: `/doctor/consulatationhistory` }}
                                            >

                                                <img
                                                    width="40"
                                                    height="40"
                                                    src={conHistory}
                                                    onClick='${pathname}'
                                                    alt=""
                                                    style={{ marginLeft: "5%", marginRight: "5%" }
                                                    }
                                                />
                                                Consulatation History
                                            </Link>
                                            <br />
                                            <br />

                                            <Link
                                                to={{ pathname: `/doctor/healthassesment-report` }}
                                            >

                                                <img
                                                    width="40"
                                                    height="40"
                                                    src={HealthAssessment}
                                                    onClick='${pathname}'
                                                    alt=""
                                                    style={{ marginLeft: "5%", marginRight: "5%" }
                                                    }
                                                />
                                                Health Assestment Report
                                            </Link>
                                            <br />
                                            <br />
                                            <Link
                                                to={{ pathname: `/doctor/medicalrecord/${SelectedPatient.patientId}`, state: SelectedPatient.patient }}
                                            >

                                                <img
                                                    width="40"
                                                    height="40"
                                                    src={MedicalRecord}
                                                    onClick='${pathname}'
                                                    alt=""
                                                    style={{ marginLeft: "5%", marginRight: "5%" }
                                                    }
                                                />
                                                Medical Record
                                            </Link>
                                            <br />
                                            <br />
                                            <Link
                                                to={{ pathname: `/doctor/setnextappointment` }}
                                            >

                                                <img
                                                    width="40"
                                                    height="40"
                                                    src={calendar}
                                                    onClick='${pathname}'
                                                    alt=""
                                                    style={{ marginLeft: "5%", marginRight: "5%" }
                                                    }
                                                />
                                                Set Next Appointment
                                            </Link>
                                            {/* <span id="info-title">Diseases</span><br />
                                    <p>Hypertension Medium</p>
                                    <br /> */}
                                            {/* <span id="info-title">Comment</span><br />
                                            <p>{SelectedPatient.remarks}</p>
                                            <br />
                                            <span id="info-title">Chief Complaint</span><br />
                                            <p>

                                                {chiefComplaint && chiefComplaint.questionSubTopics && chiefComplaint.questionSubTopics.map((item, index) =>

                                                    <span key={index}>
                                                        {chiefComplaint.questionSubTopics[index].title === "Chief Complaint##1" && chiefComplaint.questionSubTopics[index].questions.map((question, subIndex) =>
                                                            question.answer
                                                        )}
                                                    </span>
                                                )}
                                            </p>
                                            <br />
                                            <span id="info-title" style={{ fontSize: '16' }}>Health Behaviour</span><br />
                                            <span id="info-title">Family History</span><br />
                                            <div>{familyAndSocialHistory && familyAndSocialHistory.questionSubTopics && familyAndSocialHistory.questionSubTopics.map((item, index) =>

                                                <span key={index}>
                                                    <ul style={{ fontSize: '12px' }} className="list--tags">
                                                        {familyAndSocialHistory.questionSubTopics[index].title === "Family History##4" && familyAndSocialHistory.questionSubTopics[index].questions.map((question, subIndex) =>

                                                            question.answer === "Y" && (
                                                                <li key={subIndex}>{question.question}</li>
                                                            )
                                                        )}
                                                    </ul>
                                                </span>
                                            )}</div>
                                            <span id="info-title">Social History</span><br />
                                            <div>{familyAndSocialHistory && familyAndSocialHistory.questionSubTopics && familyAndSocialHistory.questionSubTopics.map((item, index) =>

                                                <span key={index}>
                                                    <ul style={{ fontSize: '12px', margin: '0px' }} className="list--tags">
                                                        {familyAndSocialHistory.questionSubTopics[index].title === "Social history##4" && familyAndSocialHistory.questionSubTopics[index].questions.map((question, subIndex) =>

                                                            question.answer === "Y" && (
                                                                <li key={subIndex}>{question.question}</li>
                                                            )
                                                        )}
                                                    </ul>
                                                </span>
                                            )}</div> */}
                                        </div>
                                        <Row>
                                            <Col className="profile-btn">
                                                <Link to={{ pathname: `/doctor/health-assessment/${SelectedPatient.patientId}`, state: SelectedPatient.patient }}><button className="btn btn-primary view-btn">Reschedule</button></Link>
                                            </Col>
                                        </Row>
                                    </div>
                                </>) : (
                                    //{SelectedPatient && SelectedPatient.length === 0 && (
                                    <>
                                        <div id="request-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <p className="text-center">No Data Available ...</p>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Col>
                    {/* <Col lg={3} md={6} id="col">
                        <div id="chat-box">
                            <div id="chat-heading">Recent Messages</div>
                            <div id="chat-area">
                                {chatRooms.map((chatRoom, index) => {
                                    return <Row id="chat-head" key={chatRoom[1].Key} onClick={() => redirectToChat()}>
                                        <Col xs={8}>
                                            <Row style={{ alignItems: "center" }}>
                                                <Col xs={4}><img src={default_image} alt="" style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                                <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>{chatRoom[1].ReceiverName}</b><br />{chatRoom[1].LastMessage}</div></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">{formatDate(chatRoom[1].LastMessageDate)}</span></Col>
                                    </Row>
                                })
                                }


                            </div>
                        </div>
                    </Col> */}
                </Row>
            </Container>
            {/* <Footer /> */}
            <Dialog onClose={confirmVideoClose} aria-labelledby="customized-dialog-title" open={confirmVideo}>
                <DialogTitle id="customized-dialog-title" onClose={confirmVideoClose}>
                    Do you want to Start Video Call
                </DialogTitle>
                <DialogActions>
                    <Link to={`/doctor/chat?chatgroup=P${SelectedPatient?.patientId}_D${SelectedPatient?.doctorId}&openVideoCall=true`}><button autoFocus
                        //onClick={() => handleAgoraAccessToken({name:`${SelectedPatient.doctorId}` + `${SelectedPatient.patientId}` + `${SelectedPatient.id}`, id: SelectedPatient.id})} 
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
                    Video call is possible only starting 2 Minutes before the Appointment Time and 10 minutes after appointment end time.
                </DialogTitle>
                <DialogActions>
                    <button autoFocus onClick={alertVideoClose} className="btn btn-primary" id="close-btn">
                        Ok
                    </button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default Mypatient;
