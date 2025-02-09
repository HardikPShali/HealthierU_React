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
  getAppointmentsTablistByStatus,
  getPaymentInfoForDoctor,
  getGlobalAppointmentsSearchNew
} from "../../service/frontendapiservices";
import rightIcon from "../../images/svg/right-icon.svg";
import calendar from "../../images/icons used/Component 12.svg";
import conHistory from "../../images/icons used/Component 15.svg";
import HealthAssessment from "../../images/icons used/Component 16.svg";
import MedicalRecord from "../../images/icons used/Component 17.svg";
import calendarSmall from "../../images/svg/calendar-white.svg";
import timeSmall from "../../images/svg/time-white.svg";
import { useHistory } from "react-router";
import HealthAssestmentReport from "./HealthAssestmentReport/HealthAssestmentReport";
import { getInbox } from "../../service/chatService";
import { videoEnableCheck } from "../../util/chatAndCallValidations";
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
  const [openReschedule, setOpenReschedule] = useState(false);
  const [rescheduleID, setRescheduleID] = useState("");
  const handleRescheduleOpen = (id) => {
    setRescheduleID(id);
    setOpenReschedule(true);
  };
  const handleRescheduleClose = () => {
    setOpenReschedule(false);
  };
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

  const handleVideoCall = (selectedPatient) => {
    // const appointmentStartTime = new Date(startTime);
    // const AppointmnetBeforeTenMinutes = new Date(
    //   appointmentStartTime.getTime() - 5 * 60000
    // );
    // const AppointmnetAfter70Minutes = new Date(
    //   appointmentStartTime.getTime() + 70 * 60000
    // );

    const isVideoEnabled = videoEnableCheck(selectedPatient);

    if (
      isVideoEnabled
    ) {
      handleConfirmVideo();
    } else {
      handleAlertVideo();
    }
  };
  const [appointment, setAppointment] = useState([]);
  const [apptId, setApptId] = useState(0);
  useEffect(() => {
    // getCurrentDoctor();
    getGlobalAppointments();
    // console.log("props",props);
    getApptId()
  }, [apptId]);
  const getApptId = () => {
    setApptId(props.location.search.split("=")[1])
  }
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

  const handleConsultationClick = async (slot, slot1EndTime) => {
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

  const getPaymentInfo = async (data) => {
    const response = await getPaymentInfoForDoctor(data.id).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      if (response && response.data) {
        setAppointment(response.data.data)
      }
    }
  }
  const [autoselectAppointment, setAutoselectAppointment] = useState({})
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
      // patientName: search,
    };

    if (search && search !== "") {
      data.patientName = search
    }

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
    const responseTwo = await getGlobalAppointmentsSearchNew(data).catch((err) => {
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
          updateArray.push({
            id: value.id,
            patientId: value.patientId,
            doctorId: value.doctorId,
            doctor: value.doctor,
            // title: `Appointment booked with Dr. ${value?.doctor?.firstName
            //   } with ${value.urgency ? value.urgency : "no"
            //   } urgency, comments : ${value.remarks ? value.remarks : "no comments"
            //   }`,
            startTime: new Date(value.startTime),
            endTime: new Date(value.endTime),
            remarks: value.remarks,
            status: value.status,
            appointmentId: value.appointmentId,
            appointmentMode: value.appointmentMode,
            unifiedAppointment: value.unifiedAppointment,
            patient: value.patient,
          });
        });
        setAppointmentDets(updateArray.reverse());
        updateArray.find((app) => {
          if (apptId == app.id) {
            const birthDate = new Date(app.patient.dateOfBirth);
            const difference = Date.now() - birthDate.getTime();
            const age = new Date(difference);
            setAge(Math.abs(age.getUTCFullYear() - 1970));
            setSelectedPatient({
              id: app.id,
              patientId: app.patientId,
              doctorId: app.doctorId,
              doctor: app.doctor,
              startTime: new Date(app.startTime),
              endTime: new Date(app.endTime),
              remarks: app.remarks,
              status: app.status,
              appointmentMode: app.appointmentMode,
              appointmentId: app.appointmentId,
              unifiedAppointment: app.unifiedAppointment,
              patient: app.patient,
            })
            getPaymentInfo(app)
          }
        })
      }

    }
  };
  const handleSearchInputChange = async (searchValue) => {
    //console.log("searchValue :::::::", searchValue);
    if (searchValue === "") {
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
    handleRescheduleClose()
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
      toast.success("Update sent to patient for rescheduling.");
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

  //video call code
  let queryChannelId;

  const videoClickHandler = async (channelId = null) => {
    const result = await getInbox();
    const patientId = SelectedPatient.patientId;
    // console.log({ patientId })
    // console.log({ result });
    const inbox = result.data.data.filter((item) => {
      return item.patientInfo.id === patientId;
    })
    // console.log({ inbox })
    queryChannelId = inbox[0].id;
    // console.log({ queryChannelId })
    history.push(`/doctor/chat?channelId=${queryChannelId}&openVideo=${true}`);
  };

  const chatClickHandler = async (channelId = null) => {
    const result = await getInbox();
    const patientId = SelectedPatient.patientId;
    // console.log({ patientId })
    // console.log({ result });
    const inbox = result.data.data.filter((item) => {
      return item.patientInfo.id === patientId;
    })
    // console.log({ inbox })
    queryChannelId = inbox[0].id;
    // console.log({ queryChannelId })
    history.push(`/doctor/chat?channelId=${queryChannelId}`);
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
                                          <>
                                            {details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")}
                                          </>
                                        </h5>
                                        <span className="patient-list__common-span-consult">
                                          {details.appointmentMode}
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
                                      getPaymentInfo(details)
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
                                          <>
                                            {details.patient.firstName +
                                              " " +
                                              (details.patient.lastName || "")}
                                          </>
                                        </h5>
                                        <span className="patient-list__common-span-consult">
                                          {details.appointmentMode}
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
                                {SelectedPatient.appointmentMode}
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
                          <Col xs={3}>
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
                                  size="113"
                                  className="my-patient-avatar"
                                />
                              ))}
                          </Col>
                          <Col xs={9} style={{ textAlign: "center" }}>
                            <b>
                              <p className="pclass">Upcoming Appointment</p>
                            </b>

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
                          <Col xs={4}>
                            <div id="req-name">
                              <b className="pclass1">Fee & Payment Method</b>
                              <br />
                              {appointment.appointmentFee
                              } &nbsp;
                              {appointment.paymentMethod
                              }
                            </div>
                          </Col>

                          <Col
                            xs={4}
                            className="patient-video-button"
                          >

                            <IconButton onClick={() => chatClickHandler()}>


                              <ChatIcon id="active-video-icon" />


                            </IconButton>

                            <IconButton
                              onClick={() =>
                                handleVideoCall(SelectedPatient)
                              }
                            >
                              <VideocamIcon id="active-video-icon" />
                            </IconButton>
                          </Col>
                        </Row>
                      </div>
                      <div id="req-info">

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
                                fontWeight="300"
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

                      </div>
                      <Row>
                        <Col className="profile-btn">

                          {moment().isBefore(moment(SelectedPatient.startTime)) && <button
                            className="btn btn-primary view-btn"
                            onClick={() =>
                              handleRescheduleOpen(SelectedPatient.id)
                            }
                          >
                            Reschedule
                          </button>}
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
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
                        No Patient Data card Selected ...
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </Col>


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

          <button
            autoFocus
            onClick={() => videoClickHandler()}
            className="btn btn-primary"
            id="close-btn"
          >
            Yes
          </button>

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
          Video call is possible only 5 minutes before the appointment time and 10 minutes after the appointment end time.
        </DialogTitle>
        <DialogActions>
          <button
            autoFocus
            onClick={alertVideoClose}
            className="btn btn-primary"
            id="close-btn"
          >
            OK
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleRescheduleClose}
        aria-labelledby="customized-dialog-title"
        open={openReschedule}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleRescheduleClose}
        >
          Are you sure you want to reschedule this patient's slot?
        </DialogTitle>
        <DialogActions>
          <button
            className="btn btn-primary"
            onClick={(e) =>
              rescheduleAppointment(SelectedPatient.id)
            }
          >
            Reschedule
          </button>
          <button
            autoFocus
            onClick={handleRescheduleClose}
            className="btn btn-secondary"
            id="close-btn"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyAppointments;
