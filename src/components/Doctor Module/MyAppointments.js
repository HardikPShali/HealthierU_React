import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctor.css";
import { toast } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
import Cookies from "universal-cookie";
import Loader from "./../Loader/Loader";
import "react-tabs/style/react-tabs.css";
import moment from "moment";
import Avatar from "react-avatar";
import ChatIcon from "@material-ui/icons/Chat";
import VideocamIcon from "@material-ui/icons/Videocam";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import SearchBarComponent from "../CommonModule/SearchAndFilter/SearchBarComponent";
import FilterComponent from "../CommonModule/SearchAndFilter/FilterComponent";
import {
  getGlobalAppointmentsSearch,
  rescheduleAppointmentDoctor,
} from "../../service/frontendapiservices";
import rightIcon from "../../images/svg/right-icon.svg";
import calendar from "../../images/icons used/Component 12.svg";
import conHistory from "../../images/icons used/Component 15.svg";
import HealthAssessment from "../../images/icons used/Component 16.svg";
import MedicalRecord from "../../images/icons used/Component 17.svg";
import calendarSmall from "../../images/svg/calender-beige.svg";
import timeSmall from "../../images/svg/time-teal.svg";
import { useHistory } from "react-router";
import HealthAssestmentReport from "./HealthAssestmentReport/HealthAssestmentReport";
// import calendarSmall from "../../../images/svg/calendar-small.svg";
// import timeSmall from "../../../images/svg/time-small.svg";
const MyAppointments = (props) => {
  // const currentTimezone = props.timeZone;
  //const getMoment = (timezone) => {
  //    const m = (...args) => momentTz.tz(...args, timezone);
  //    m.localeData = momentTz.localeData;
  //    return m;
  //};
  let history = useHistory();
  //const moment = getMoment(currentTimezone);
  const [activeAppointments, setActiveAppointments] = useState([]);
  // const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const cookies = new Cookies();
  // const [chatRooms, setChatRooms] = useState([])

  const [SelectedPatient, setSelectedPatient] = useState();
  const [currentDoctor, setCurrentDoctor] = useState({
    doctorId: "",
  });
  const { doctorId } = currentDoctor;
  const [age, setAge] = useState(0);
  // const [chiefComplaint, setChiefComplaint] = useState({});
  // const [familyAndSocialHistory, setFamilyAndSocialHistory] = useState({});

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
    const AppointmnetBeforeTenMinutes = new Date(
      appointmentStartTime.getTime() - 5 * 60000
    );
    const AppointmnetAfter70Minutes = new Date(
      appointmentStartTime.getTime() + 70 * 60000
    );
    if (
      new Date().toISOString() >= AppointmnetBeforeTenMinutes.toISOString() &&
      new Date().toISOString() <= AppointmnetAfter70Minutes.toISOString()
    ) {
      handleConfirmVideo();
    } else {
      handleAlertVideo();
    }
  };

  useEffect(() => {
    // getCurrentDoctor();
    getGlobalAppointments();
  }, []);
  // const currentLoggedInUser = cookies.get('currentUser');
  // const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;

  // const getCurrentDoctor = async () => {
  //     // const res = await getDoctorByUserId(loggedInUserId);
  //     const currentDoctor = cookies.get('profileDetails');
  //     setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctor.id });
  //     // if (res && res.data) {
  //     //     res.data.doctors.map(async (value, index) => {
  //     //         if (value.userId === loggedInUserId) {
  //     // const currentDoctorId = value.id;
  //     // setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctorId })
  //     // const response = await getFireBaseChatRoom(currentDoctorId);
  //     // setChatRooms(response);
  //     loadPatient(currentDoctor.id);
  //     console.log('currentDoctor', currentDoctor);

  //     //     })
  //     //     // setCurrentDoctor({...currentDoctor, id: currentDoctorId });
  //     // }
  // };

  // const getChiefComplaintData = async (patientId) => {
  //     // const res = await getPatientChiefComplaint(patientId)
  //     // if (res && res.data) {
  //     //     setChiefComplaint(res.data[0]);
  //     // }
  // };
  // const getFamilyAndSocialHistoryData = async (patientId) => {
  //     // const res = await getPatientFamilyAndSocialHistoryData(patientId);
  //     // if (res && res.data) {
  //     //     setFamilyAndSocialHistory(res.data[0]);
  //     // }
  // };

  // const limit = 25;
  // const [activeOffset, setActiveOffset] = useState(0);
  // const [pastOffset, setPastOffset] = useState(0);
  // const loadPatient = async (selectedDoctorId) => {
  //     var objDate = new Date();
  //     var getCurrentHours = new Date().getHours();
  //     //console.log("new Date(objDate.setHours(getCurrentHours, 0, 0)).toISOString() ::::::", new Date(objDate.setHours(getCurrentHours, 0, 0)).toISOString());
  //     const getPatientList = {
  //         doctorId: selectedDoctorId,
  //         startTime: new Date(
  //             objDate.setHours(getCurrentHours, 0, 0)
  //         ).toISOString(),
  //         status: 'ACCEPTED',
  //     };
  //     const response = await loadActivePatient(
  //         getPatientList,
  //         activeOffset,
  //         limit
  //     ).catch((err) => {
  //         if (err.response.status === 500 || err.response.status === 504) {
  //             setLoading(false);
  //         }
  //         // console.log("loadActivePatient", response)
  //     });

  //     // console.log("response ::::::", response);
  //     if (response.status === 200 || response.status === 201) {
  //         console.log('loadActivePatient', response);
  //         setActiveOffset(activeOffset + 1);
  //         setTimeout(() => setLoading(false), 1000);
  //         setActiveAppointments(response.data);
  //         if (response.data[0] && response.data[0].patient) {
  //             // handleActivePastTab(
  //             //     response.data[0],
  //             //     response.data[1] && response.data[1]
  //             // );
  //             calculate_age(response.data[0].patient.dateOfBirth);
  //             getChiefComplaintData(response.data[0].patient.id);
  //             getFamilyAndSocialHistoryData(response.data[0].patient.id);
  //         }
  //     }
  // };

  // const loadPastPatientAppointment = async (selectedDoctorId) => {
  //     setDataLoading(true);
  //     const getPatientList = {
  //         doctorId: selectedDoctorId,
  //         endTime: new Date().toISOString(),
  //         status: 'ACCEPTED',
  //     };
  //     const response = await loadPastPatient(getPatientList);
  //     if (response.status === 200 || response.status === 201) {
  //         setPastOffset(1);
  //         setTimeout(() => setDataLoading(false), 1000);
  //         setPastAppointments(response.data);
  //         handleActivePastTab(
  //             response.data[0],
  //             response.data[1] && response.data[1]
  //         );
  //         if (response.data[0] && response.data[0].patient) {
  //             calculate_age(response.data[0].patient.dateOfBirth);
  //             getChiefComplaintData(response.data[0].patient.id);
  //             getFamilyAndSocialHistoryData(response.data[0].patient.id);
  //         }
  //     }
  // };

  // const redirectToChat = () => {
  //     window.location.assign('/doctor/chat');
  // }
  // const loadMoreActiveAppointment = async (selectedDoctorId) => {
  //     const getPatientList = {
  //         doctorId: selectedDoctorId,
  //         startTime: new Date().toISOString(),
  //         status: 'ACCEPTED',
  //     };
  //     const response = await loadActivePatient(
  //         getPatientList,
  //         activeOffset,
  //         limit
  //     );
  //     if (response.status === 200 || response.status === 201) {
  //         var existingActiveAppList = activeAppointments;
  //         response.data &&
  //             response.data.map((newData) => {
  //                 return existingActiveAppList.push(newData);
  //             });
  //         setActiveOffset(activeOffset + 1);
  //         setTimeout(() => setLoading(false), 1000);
  //         setActiveAppointments(existingActiveAppList);
  //     }
  // };

  // const loadMorePastAppointment = async (selectedDoctorId) => {
  //     const getPatientList = {
  //         doctorId: selectedDoctorId,
  //         endTime: new Date().toISOString(),
  //         status: 'ACCEPTED',
  //     };
  //     const response = await loadPastPatient(getPatientList, pastOffset, limit);
  //     if (response.status === 200 || response.status === 201) {
  //         var existingPastAppList = pastAppointments;
  //         response.data &&
  //             response.data.map((newData) => existingPastAppList.push(newData));
  //         setPastOffset(pastOffset + 1);
  //         setTimeout(() => setLoading(false), 1000);
  //         setPastAppointments(existingPastAppList);
  //     }
  // };

  const calculate_age = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference);

    setAge(Math.abs(age.getUTCFullYear() - 1970));
  };

  const handleConsultationClick = (slot, slot1EndTime) => {
    slot.endTime = slot1EndTime;
    setSelectedPatient(slot);
  };

  // const handleActivePastTab = (slot, slot1) => {
  //     if (
  //         slot &&
  //         slot.unifiedAppointment === (slot1 && slot1.unifiedAppointment)
  //     ) {
  //         slot.endTime = slot1.endTime;
  //         setSelectedPatient(slot);
  //     } else {
  //         setSelectedPatient(slot);
  //     }
  // };

  //NEW DESIGN CODE
  const [search, setSearch] = useState("");
  const [appointmentDets, setAppointmentDets] = useState([]);

  const getGlobalAppointments = async (search, filter = {}) => {
    const currentDoctor = cookies.get("profileDetails");
    setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctor.id });

    const starttime = new Date();
    // startTime.setHours(0, 0, 0).toISOString();
    // const endTime = new Date()
    // endTime().setHours(23, 59, 59).toISOString();
    const data = {
      doctorId: currentDoctor.id,
      status: "ACCEPTED",
      startTime: starttime.toISOString(),
      patientName: search,
    };
    if (filter.patientSlot && filter.patientSlot !== "") {
      data.unifiedAppointment = filter.patientSlot;
    }
    if (filter.patientStartTime && filter.patientStartTime !== "") {
      data.startTime = filter.patientStartTime;
    }
    if (filter.patientEndTime && filter.patientEndTime !== "") {
      const endtime = new Date(filter.patientEndTime);
      endtime.setHours(23, 59, 59);
      data.endTime = endtime.toISOString();
    }
    const responseTwo = await getGlobalAppointmentsSearch(data).catch((err) => {
      if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
        setLoading(false);
      }
    });
    if (responseTwo.status === 200 || responseTwo.status === 201) {
      if (responseTwo && responseTwo.data) {
        setLoading(false);
        const appointmentDetails = responseTwo.data.data;
        // console.log('appointmentDetails', appointmentDetails);
        const reversedAppointments = appointmentDetails.reverse();
        const updateArray = [];
        reversedAppointments.map((value, index) => {
          if (value.status === "ACCEPTED") {
            if (
              value.unifiedAppointment ===
              (reversedAppointments[index + 1] &&
                reversedAppointments[index + 1].unifiedAppointment)
            ) {
              updateArray.push({
                id: value.id,
                patientId: value.patientId,
                doctorId: value.doctorId,
                doctor: value.doctor,
                title: `Appointment booked with Dr. ${value?.doctor?.firstName
                  } with ${value.urgency ? value.urgency : "no"
                  } urgency, comments : ${value.remarks ? value.remarks : "no comments"
                  }`,
                startTime: new Date(value.startTime),
                endTime: new Date(reversedAppointments[index + 1].endTime),
                remarks: value.remarks,
                status: value.status,
                appointmentId: value.appointmentId,
                unifiedAppointment: value.unifiedAppointment,
                patient: value.patient,
              });
            } else if (
              value.unifiedAppointment !==
              (reversedAppointments[index + 1] &&
                reversedAppointments[index + 1].unifiedAppointment) &&
              value.unifiedAppointment ===
              (responseTwo[index - 1] &&
                responseTwo[index - 1].unifiedAppointment)
            ) {
              return false;
            } else if (
              value.unifiedAppointment !==
              (reversedAppointments[index + 1] &&
                reversedAppointments[index + 1].unifiedAppointment) &&
              value.unifiedAppointment !==
              (reversedAppointments[index - 1] &&
                reversedAppointments[index - 1].unifiedAppointment)
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
                patient: value.patient,
              });
            }
          }
        });
        console.log("updateArray | My Patient", updateArray);
        setAppointmentDets(updateArray);
      }
    }
  };

  const handleSearchInputChange = async (searchValue) => {
    //console.log("searchValue :::::::", searchValue);
    if (searchValue === "") {
      console.log("blank searchValue is | in SearchBarComponent", searchValue);
      // loadPatient(currentDoctor.id);
      getGlobalAppointments(searchValue);

      // setSearchText(searchValue);
    } else {
      // console.log("searchValue is | in SearchBarComponent", searchValue);
      // const response = await getAppointmentsByPatientName(searchValue);
      // setActiveAppointments(response.data);
      // setActiveOffset(0);
      // if (response.data[0] && response.data[0].patient) {
      //     handleActivePastTab(response.data[0], (response.data[1] && response.data[1]));
      //     calculate_age(response.data[0].patient.dateOfBirth);
      //     getChiefComplaintData(response.data[0].patient.id);
      //     getFamilyAndSocialHistoryData(response.data[0].patient.id);
      // }
      // // console.log("response is | in SearchBarComponent", response);
      // setSearch(response.data.map(item => item.patient));

      getGlobalAppointments(searchValue);
      setSearch(searchValue);
      // console.log("searchValue is | in SearchBarComponent", searchValue);
    }
  };

  const handleFilterChange = (filter) => {
    getGlobalAppointments(search, filter);
  };
  const rescheduleAppointment = async (id) => {
    // console.log('appointmentDets', appointmentDets)
    // console.log('patientID', id)
    // console.log('selectedPatID', SelectedPatient)
    const apID = id;
    let docID;
    let aID;
    appointmentDets.map((a, i) => {
      if (a.id == apID) {
        docID = a.doctorId;
        aID = a.id;
      }
    });
    const data = {
      id: aID,
      doctorId: docID,
    };
    const res = await rescheduleAppointmentDoctor(data).catch((err) => {
      if (err.res.status === 500 || err.res.status === 504) {
        setLoading(false);
      }
    });
    if (res) {
      toast.success("Appointment Rescheduled successfully.");
      history.go(0)
    }
  };
  const setNextAppointment = (id) => {
    const apID = id;
    let stateData = [];
    let aID;
    //console.log("appointmentDets",appointmentDets);
    appointmentDets.map((a, i) => {
      if (a.id == apID) {
        aID = a.id;
        stateData = a;

        setTimeout(
          () =>
            props.history.push({
              pathname: `/doctor/setNextAppointment`,
              state: stateData,
            }),
          500
        );
      }
    });
  };
  const consultationHistory = (id) => {
    setTimeout(
      () =>
        props.history.push({ pathname: `/doctor/consultationhistory/${id}` }),
      500
    );
  };
  return (
    <div className="bg-grey">
      {loading && <Loader />}
      <Container>
        <Row>
          <Col lg={6} md={6} id="col">
            <div id="patient-col-1">
              <div id="patient-heading">My Appointments</div>
              <div className="d-flex mt-2">
                <SearchBarComponent updatedSearch={handleSearchInputChange} />
                <FilterComponent updatedFilter={handleFilterChange} />
              </div>
              <div id="patient-list">
                <div className="patient-list__card-box scroller-cardlist">
                  <div className="patient-list__card-holder">
                    <div className="row">
                      {/* MAP HERE */}
                      {appointmentDets.length !== 0 ? (
                        appointmentDets.map((details, index) => {
                          if (
                            details.unifiedAppointment ===
                            (activeAppointments[index + 1] &&
                              activeAppointments[index + 1].unifiedAppointment)
                          ) {
                            if (details && details.patient) {
                              return (
                                <div
                                  className="col-md-12 mb-2 mt-2 cursor-pointer"
                                  key={index}
                                >
                                  <div
                                    className="patient-list__card"
                                    onClick={async () => {
                                      handleConsultationClick(
                                        details,
                                        activeAppointments[index + 1].endTime
                                      );
                                      Object.keys(details.patient).map(
                                        (patientData) => {
                                          return calculate_age(
                                            details.patient.dateOfBirth &&
                                            details.patient.dateOfBirth
                                          );
                                        }
                                      );
                                    }}
                                  >
                                    <div className="row align-items-start py-1">
                                      <div className="col-md-2  d-flex flex-column mt-3 ml-3">
                                        <h5 className="patient-list__common-date">
                                          <b>
                                            {moment(details.startTime).format(
                                              "DD"
                                            )}
                                          </b>
                                        </h5>
                                        <span className="patient-list__common-span">
                                          {moment(details.startTime).format(
                                            "hh:mm A"
                                          )}
                                        </span>
                                      </div>
                                      <div className="col-md-3  ml-3 mt-2 pb-2">
                                        {details.patient.picture ? (
                                          <img
                                            src={details.patient.picture}
                                            alt="profile"
                                            className="patient-list__img-circle "
                                          />
                                        ) : (
                                          <Avatar
                                            round={true}
                                            name={
                                              details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")
                                            }
                                            size={60}
                                            className="my-appointment-avatar"
                                          />
                                        )}
                                      </div>
                                      <div className="col-md-7  d-flex flex-column mt-3">
                                        <h5 className="patient-list__common-name">
                                          <b>
                                            {details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")}
                                          </b>
                                        </h5>
                                        <span className="patient-list__common-span-consult">
                                          {details.unifiedAppointment
                                            .split("#")[1]
                                            .replace("_", " ")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          } else if (
                            details.unifiedAppointment !==
                            (activeAppointments[index + 1] &&
                              activeAppointments[index + 1]
                                .unifiedAppointment) &&
                            details.unifiedAppointment ===
                            (activeAppointments[index - 1] &&
                              activeAppointments[index - 1]
                                .unifiedAppointment)
                          ) {
                            if (details && details.patient) {
                              return false;
                            }
                          } else if (
                            details.unifiedAppointment !==
                            (activeAppointments[index + 1] &&
                              activeAppointments[index + 1]
                                .unifiedAppointment) &&
                            details.unifiedAppointment !==
                            (activeAppointments[index - 1] &&
                              activeAppointments[index - 1]
                                .unifiedAppointment)
                          ) {
                            if (details && details.patient) {
                              return (
                                <div
                                  className="col-md-12 mb-2 mt-2 cursor-pointer"
                                  key={index}
                                >
                                  <div
                                    className="patient-list__card"
                                    onClick={async () => {
                                      setSelectedPatient(details);
                                      Object.keys(details.patient).map(
                                        (patientData) => {
                                          return calculate_age(
                                            details.patient.dateOfBirth &&
                                            details.patient.dateOfBirth
                                          );
                                        }
                                      );
                                    }}
                                  >
                                    <div className="row align-items-start py-1">
                                      <div className="col-md-2  d-flex flex-column mt-3 ml-3">
                                        <h5 className="patient-list__common-date">
                                          <b>
                                            {moment(details.startTime).format(
                                              "DD"
                                            )}
                                          </b>
                                        </h5>
                                        <span className="patient-list__common-span">
                                          {moment(details.startTime).format(
                                            "hh:mm A"
                                          )}
                                        </span>
                                      </div>
                                      <div className="col-md-2  ml-3 mt-2 pb-2">
                                        {details.patient.picture ? (
                                          <img
                                            src={details.patient.picture}
                                            alt="profile"
                                            className="patient-list__img-circle "
                                          />
                                        ) : (
                                          <Avatar
                                            round={true}
                                            name={
                                              details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")
                                            }
                                            size={60}
                                            className="my-appointment-avatar"
                                          />
                                        )}
                                      </div>
                                      <div className="col-md-7  d-flex flex-column mt-3">
                                        <h5 className="patient-list__common-name">
                                          <b>
                                            {details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")}
                                          </b>
                                        </h5>
                                        <span className="patient-list__common-span-consult">
                                          {details.unifiedAppointment &&
                                            details.unifiedAppointment
                                              .split("#")[1]
                                              .replace("_", " ")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                        })
                      ) : (
                        <div
                          className="col-12 ml-2"
                          style={{ textShadow: "none", color: "#3e4543" }}
                        >
                          No Upcoming Appointments
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <Link to="/doctor/appointment">
                            <button className="btn btn-primary calendar-btn">
                                My Calendar
                            </button>
                        </Link> */}
          </Col>
          <Col lg={6} md={6} id="col">
            {dataLoading && (
              <>
                <div
                  id="request-box"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p className="text-center">Loading ...</p>
                </div>
              </>
            )}
            {!dataLoading && (
              <>
                {SelectedPatient ? (
                  <>
                    <div id="request-box">
                      <div id="appointment-request">
                        <Row>
                          <Col xs={8}>
                            <div id="req-name">
                              <b style={{ fontSize: "16px" }}>
                                APID : {SelectedPatient.id} |{" "}
                                {SelectedPatient.unifiedAppointment &&
                                  SelectedPatient.unifiedAppointment
                                    .split("#")[1]
                                    .replace("_", " ")}
                              </b>
                            </div>
                          </Col>
                          <Col xs={4} className="text-right">
                            <button
                              className={
                                "btn btn-primary " + SelectedPatient.urgency
                              }
                            >
                              {SelectedPatient.urgency}
                            </button>
                            <br />
                            <br />
                          </Col>
                        </Row>
                        <Row style={{ alignItems: "center" }}>
                          <Col xs={4}>
                            {SelectedPatient &&
                              SelectedPatient.patient &&
                              (SelectedPatient.patient.picture ? (
                                <div
                                  className="img-box"
                                  style={{
                                    background: `url(${SelectedPatient.patient.picture})`,
                                  }}
                                >
                                  {/*<img src={SelectedPatient.patient.picture} alt="" style={{ width: "auto", height: 214, borderRadius: 10 }} />*/}
                                </div>
                              ) : (
                                <Avatar
                                  name={
                                    SelectedPatient.patient.firstName +
                                    " " +
                                    (SelectedPatient.patient.lastName || "")
                                  }
                                  size="140"
                                  className="my-patient-avatar"
                                />
                              ))}
                          </Col>
                          {/* <Col
                                                        xs={2}
                                                        style={{
                                                            paddingRight: '0',
                                                            paddingLeft: '80px',
                                                            paddingTop: '35px',
                                                        }}
                                                    >
                                                        <DateRangeOutlinedIcon />
                                                    </Col> */}
                          <Col xs={8} style={{ textAlign: "center" }}>
                            <b>
                              <p className="pclass">Upcoming Appointment</p>
                            </b>
                            {/* <div id="req-date" style={{ paddingRight: '5px' }}>
                                                            {moment(SelectedPatient.startTime).format(
                                                                'MMM DD, YYYY'
                                                            )}
                                                            <br />
                                                            {moment(SelectedPatient.startTime).format(
                                                                'h:mm A'
                                                            ) +
                                                                ' - ' +
                                                                moment(SelectedPatient.endTime).format(
                                                                    'h:mm A'
                                                                )}
                                                        </div> */}
                            <div className="my-patient-card__card-details--date-div">
                              <div className="my-patient-card__card-time-row">
                                <img src={calendarSmall} />
                                <span className="my-patient-card__common-span">
                                  {moment(SelectedPatient.startTime).format(
                                    "DD/MM/YY"
                                  )}
                                </span>
                              </div>
                              <div className="my-patient-card__card-time-row ml-4">
                                <img src={timeSmall} />
                                <span className="my-patient-card__common-span">
                                  {moment(SelectedPatient.startTime).format(
                                    "hh:mm A"
                                  )}
                                </span>
                              </div>
                            </div>
                          </Col>

                          {/* <Col
                                                        xs={2}
                                                        style={{
                                                            paddingRight: '0',
                                                            paddingLeft: '80px',
                                                            paddingTop: '35px',
                                                        }}
                                                    >
                                                        <DateRangeOutlinedIcon />
                                                    </Col>
                                                    <Col xs={3} style={{ textAlign: 'center' }}>
                                                        <b>
                                                            <p className="pclass">Current :</p>
                                                        </b>
                                                        <div id="req-date" style={{ paddingRight: '5px' }}>
                                                            {moment(SelectedPatient.startTime).format(
                                                                'MMM DD, YYYY'
                                                            )}
                                                            <br />
                                                            {moment(SelectedPatient.startTime).format(
                                                                'h:mm A'
                                                            ) +
                                                                ' - ' +
                                                                moment(SelectedPatient.endTime).format(
                                                                    'h:mm A'
                                                                )}
                                                        </div>
                                                    </Col> */}
                        </Row>
                        <Row style={{ alignItems: "center", marginTop: "5px" }}>
                          <Col xs={4} style={{ textAlign: "center" }}>
                            <div id="req-name">
                              <b>
                                {SelectedPatient &&
                                  SelectedPatient.patient &&
                                  SelectedPatient.patient.firstName +
                                  " " +
                                  (SelectedPatient.patient.lastName || "")}
                              </b>
                              <br />
                              {age} Years Old
                            </div>
                          </Col>
                          <Col xs={4} style={{ textAlign: "center" }}>
                            <div id="req-name">
                              <b className="pclass1">Fee & Payment Method</b>
                              <br />
                              $20 By Credit Card
                            </div>
                          </Col>
                          {/* <Col xs={1} style={{ alignItems: "center",paddingTop: '35px' }}><DateRangeOutlinedIcon /></Col>
                                                <Col xs={7} style={{ textAlign: 'right' }}><p className='pclass'>Appointment Fee & Payment Method</p><div id="req-date" style={{ paddingRight: '5px' }}>{moment(SelectedPatient.startTime).format("MMM DD, YYYY")}<br />{moment(SelectedPatient.startTime).format("h:mm A") + " - " + moment(SelectedPatient.endTime).format("h:mm A")}</div></Col> */}
                          <Col
                            xs={4}
                            className="patient-video-button"
                            style={{ textAlign: "center" }}
                          >
                            <IconButton>
                              <Link
                                to={`/doctor/chat?chatgroup=P${SelectedPatient?.patient?.id}_D${doctorId}`}
                                title="Chat"
                              >
                                <ChatIcon id="active-video-icon" />
                              </Link>
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleVideoCall(SelectedPatient.startTime)
                              }
                            >
                              <VideocamIcon id="active-video-icon" />
                            </IconButton>
                          </Col>
                        </Row>
                      </div>
                      <div id="req-info">
                        {/* <Link to={{
                                                    pathname: `/doctor/consulatationhistory`,
                                                    state: SelectedPatient.patient,
                                                }}> */}
                        <a
                          onClick={(e) =>
                            consultationHistory(SelectedPatient.patientId)
                          }
                        >
                          <div style={{ display: "flex", alignItem: "center" }}>
                            <div style={{ width: "100%" }}>
                              <img
                                width="40"
                                height="40"
                                font-weight="300"
                                src={conHistory}
                                // onClick='${pathname}'
                                alt=""
                                style={{ marginLeft: "5%", marginRight: "5%" }}
                              />
                              Consultation History
                            </div>
                            <img
                              src={rightIcon}
                              alt="right-icon"
                              style={{ marginRight: "35px" }}
                            />
                          </div>
                        </a>
                        {/* </Link> */}

                        <Link
                          to={{
                            pathname: `/doctor/healthassesment-report/${SelectedPatient.patientId}`,
                            state: SelectedPatient.patient,
                          }}
                        >
                          <div style={{ display: "flex", alignItem: "center" }}>
                            <div style={{ width: "100%" }}>
                              <img
                                width="40"
                                height="40"
                                src={HealthAssessment}
                                // onClick='${pathname}'
                                alt=""
                                style={{ marginLeft: "5%", marginRight: "5%" }}
                              />
                              Health Assessment Report
                            </div>
                            <img
                              src={rightIcon}
                              alt="right-icon"
                              style={{ marginRight: "35px" }}
                            />
                          </div>
                        </Link>

                        <Link
                          to={{
                            pathname: `/doctor/medicalrecord/${SelectedPatient.patientId}/${SelectedPatient.id}`

                          }}
                        >
                          <div style={{ display: 'flex', alignItem: 'center' }}>
                            <div style={{ width: '100%' }}>
                              <img
                                width="40"
                                height="40"
                                src={MedicalRecord}
                                // onClick='${pathname}'
                                alt=""
                                style={{ marginLeft: '5%', marginRight: '5%' }}
                              />
                              Medical Record
                            </div>
                            <img
                              src={rightIcon}
                              alt="right-icon"
                              style={{ marginRight: '35px' }}
                            />
                          </div>
                        </Link>

                        {/* <Link
                                                    to={{
                                                        // pathname: `/doctor/setNextAppointment/appointmentID=${appointmentDets.id}`,
                                                        // state: appointmentDets,
                                                        onClick={(e) => setNextAppointment(SelectedPatient.id)}
                                                    }}
                                                > */}
                        <a
                          onClick={(e) =>
                            setNextAppointment(SelectedPatient.id)
                          }
                          className="set-next"
                        >
                          <div style={{ display: "flex", alignItem: "center" }}>
                            <div style={{ width: "100%" }}>
                              <img
                                width="40"
                                height="40"
                                src={calendar}
                                // onClick='${pathname}'
                                alt=""
                                style={{ marginLeft: "5%", marginRight: "5%" }}
                              />
                              Set Next Appointment
                            </div>
                            <img
                              src={rightIcon}
                              alt="right-icon"
                              style={{ marginRight: "35px" }}
                            />
                          </div>
                          {/* </Link> */}
                        </a>
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
                          {/* <Link
                                                        to={{
                                                            pathname: `/doctor/health-assessment/${SelectedPatient.patientId}`,
                                                            state: SelectedPatient.patient,
                                                        }}
                                                    > */}
                          <button
                            className="btn btn-primary view-btn"
                            onClick={(e) =>
                              rescheduleAppointment(SelectedPatient.id)
                            }
                          >
                            Reschedule
                          </button>
                          {/* </Link> */}
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  //{SelectedPatient && SelectedPatient.length === 0 && (
                  <>
                    <div
                      id="request-box"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p className="text-center">
                        No Patient Datacard Selected ...
                      </p>
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
      <Dialog
        onClose={confirmVideoClose}
        aria-labelledby="customized-dialog-title"
        open={confirmVideo}
      >
        <DialogTitle id="customized-dialog-title" onClose={confirmVideoClose}>
          Do you want to Start Video Call
        </DialogTitle>
        <DialogActions>
          <Link
            to={`/doctor/chat?chatgroup=P${SelectedPatient?.patientId}_D${SelectedPatient?.doctorId}&openVideoCall=true`}
          >
            <button
              autoFocus
              //onClick={() => handleAgoraAccessToken({name:`${SelectedPatient.doctorId}` + `${SelectedPatient.patientId}` + `${SelectedPatient.id}`, id: SelectedPatient.id})}
              className="btn btn-primary"
              id="close-btn"
            >
              Yes
            </button>
          </Link>
          <button
            autoFocus
            onClick={confirmVideoClose}
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
          Video call is possible only starting 5 Minutes before the Appointment
          Time and 10 minutes after appointment end time.
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
    </div>
  );
};

export default MyAppointments;
