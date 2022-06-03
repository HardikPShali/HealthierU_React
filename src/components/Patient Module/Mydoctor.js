import React, { useState, useEffect, useRef } from "react";
//import Footer from "./Footer";
import { Container, Row, Col } from "react-bootstrap";
import FavoriteIcon from "@material-ui/icons/Favorite";
import TuneIcon from "@material-ui/icons/Tune";
import axios from "axios";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import SearchBar from "material-ui-search-bar";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LocalStorageService from "./../../util/LocalStorageService";
import Cookies from "universal-cookie";
import Loader from "./../Loader/Loader";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "react-avatar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Paypal from "../CommonModule/Paypal";
import TransparentLoader from "../Loader/transparentloader";
import { ToastContainer, toast } from 'react-toastify';
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
} from "../../service/frontendapiservices";
import {
  getSpecialityList,
  getCountryList,
  getLanguageList,
} from "../../service/adminbackendservices";
import "./patient.css";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from "@material-ui/core/Slider";
import { Multiselect } from "multiselect-react-dropdown";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { searchFilterForDoctor } from "../../service/searchfilter";
import { firestoreService } from "../../util";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { doctorListLimit } from "../../util/configurations";
import { Button, Modal } from "react-bootstrap";
// import Footer from "./Footer";
// import SearchIcon from "@material-ui/icons/Search";



const rightArrow = <FontAwesomeIcon icon={faChevronRight} />;

const MyDoctor = (props) => {
  let history = useHistory();
  const ref = useRef();

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

  const [searchText, setSearchText] = useState("");
  const [filterData, setFilterData] = useState(users);
  const [specialityArray, setSpecialityArray] = useState({
    name: [],
  });
  const { name } = specialityArray;
  // //console.log("speciality :::", name)

  // const [diseasesList, setDiseasesList] = useState({g
  //     diseasesOptions: [{ name: "Diabetes" }]
  // });

  // const { diseasesOptions } = diseasesList

  const [appointment, setAppointment] = useState({
    type: "DR",
    status: "ACCEPTED",
    urgency: "Low",
    remarks: "",
    doctorId: "",
    patientId: "",
    appointmentMode: "",
  });


  const [finalAppointmentData, setFinalAppointmentData] = useState([]);
  const { remarks, urgency } = appointment;
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentLoggedInUser = cookies.get("currentUser");
  const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
  const profilepID = cookies.get("profileDetails");
  console.log("profileDetails", profilepID);
  const pID = profilepID && profilepID.userId;
  // console.log("currentUser", loggedInUserId);
  // console.log("pID", pID);
  // const stateData = props.location.state;
  const [nextAppDetails, setNextAppDetails] = useState(null);
  const getCurrentPatient = async () => {
    if (profilepID.activated) {
      setNextAppDetails(props.location.state)
      const patientInfo = props.location.state;
      console.log("stateData", patientInfo);
      if (patientInfo) {
        setCurrentPatient({ ...currentPatient, id: patientInfo.patient.id });
        loadUsers(patientInfo.patient.id);
      }
    }
    else {
      const res = await getLoggedInUserDataByUserId(loggedInUserId);
      console.log("res1", res);
      if (res && res.data) {
        res.data.map((value, index) => {
          if (value.userId === loggedInUserId) {
            const currentPatientId = value.id;
            setCurrentPatient({ ...currentPatient, id: currentPatientId });
            loadUsers(currentPatientId);
          }
        });
      }
    }



  };

  const getAllLikedDoctors = async () => {
    setTransparentLoading(true);
    setDisplay({ ...display, like: "block", unlike: "none" });
    const res = await getLikedDoctorByPatientId(currentPatient, 0).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setTransparentLoading(false);
        }
      }
    );
    if (res && res.data) {
      const doctorArray = [];
      res.data.length > 0 &&
        res.data.map((value, index) => {
          if (value.doctor) {
            doctorArray.push(value.doctor);
          }
        });
      setFilterData(doctorArray);
      setdoctor(doctorArray.length > 0 && doctorArray[0]);
      setLikedOffset(likedOffset + 1);
      //const currentSelectedDate = new Date();
      //onDaySelect(currentSelectedDate, res.data.length > 0 && res.data[0].doctorId);
      const docId = doctorArray.length > 0 && doctorArray[0].id;
      getInValidAppointments(docId);
      setTransparentLoading(false);
    }
  };
  const allDoctorData = () => {
    // history.go(0);
    if (history.go(0) === true) {
      setFilterData(users);
      setdoctor(users[0]);
      const docId = users[0].id;
      getInValidAppointments(docId);
      setLikedOffset(0);
      setDisplay({ ...display, like: "none", unlike: "block" });
    }
  };

  const [offset, setOffset] = useState(0);
  const [likedOffset, setLikedOffset] = useState(0);

  const loadUsers = async (patientId) => {
    if (!profilepID.activated) {
      const result = await getDoctorListByPatientId(
        patientId,
        doctorListLimit
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
        setOffset(1);
        setUser(result.data.doctors);
        setdoctor(result.data.doctors[0]);
        //const currentSelectedDate = new Date();
        //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
        const docId = result.data.doctors[0]?.id;
        setAppointment({ ...appointment, patientId: patientId, doctorId: docId });
        getInValidAppointments(docId);
        setFilterData(result.data.doctors);
        //setTimeout(() => searchNutritionDoctor(), 3000);
        setTimeout(() => setLoading(false), 1000);
        const tourState = cookies.get("tour");
        if (!tourState) {
          setIsTourOpen(true);
        }

        if (
          props &&
          props.location &&
          props.location.state &&
          props.location.state === "sports medicine"
        ) {
          const text = props.location.state;
          var element = document.getElementById("doctor-search");
          var trigger = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;
          trigger.call(element, text);
          var event = new Event("change", { bubbles: true });
          element.dispatchEvent(event);
          document.querySelector(".searchForwardIcon").click();
          setSearchText(text);
          handleSearchData();
          history.replace({ state: null });
        } else if (
          props &&
          props.location &&
          props.location.state &&
          props.location.state !== "sports medicine"
        ) {
          const user = props.location.state;
          //console.log("User from props:::", user);
          setdoctor(user);
          //const currentSelectedDate = new Date();
          //onDaySelect(currentSelectedDate, user?.id);
          const docId = user.id;
          setAppointment({
            ...appointment,
            patientId: patientId,
            doctorId: docId,
          });
          getInValidAppointments(docId);
          history.replace({ state: null });
        }
        setTransparentLoading(false);
      } else {
        setTimeout(() => setLoading(false), 1000);
      }
    }
    else {
      setOffset(1);
      const doctorInfo = profilepID;
      console.log("doctorInfo", doctorInfo);
      setUser(doctorInfo.id);
      setdoctor(doctorInfo.id);
      //const currentSelectedDate = new Date();
      //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
      const docId = doctorInfo.id?.id;
      setAppointment({ ...appointment, patientId: patientId, doctorId: docId });
      getInValidAppointments(docId);
      setFilterData(doctorInfo);
      //setTimeout(() => searchNutritionDoctor(), 3000);
      setTimeout(() => setLoading(false), 1000);
      const tourState = cookies.get("tour");
      if (!tourState) {
        setIsTourOpen(false);
      }

      if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state === "sports medicine"
      ) {
        const text = props.location.state;
        var element = document.getElementById("doctor-search");
        var trigger = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        trigger.call(element, text);
        var event = new Event("change", { bubbles: true });
        element.dispatchEvent(event);
        document.querySelector(".searchForwardIcon").click();
        setSearchText(text);
        handleSearchData();
        history.replace({ state: null });
      } else if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state !== "sports medicine"
      ) {
        const user = cookies.get("profileDetails");
        //console.log("User from props:::", user);
        setdoctor(user);
        //const currentSelectedDate = new Date();
        //onDaySelect(currentSelectedDate, user?.id);
        const docId = user.id;
        setAppointment({
          ...appointment,
          patientId: patientId,
          doctorId: docId,
        });
        getInValidAppointments(docId);
        history.replace({ state: null });
      }
      setTransparentLoading(false);
      // } else {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };

  const loadMore = async () => {
    if (searchText) {
      setTransparentLoading(true);
      const res = await getSearchData(searchText, offset, doctorListLimit);
      if (
        res.status === 200 &&
        res.data?.doctors &&
        res.data?.doctors.length > 0
      ) {
        var existingUsersList = filterData;
        res.data &&
          res.data.doctors.map((newData) => {
            existingUsersList.push(newData);
            return newData;
          });
        setOffset(offset + 1);
        setFilterData(existingUsersList);
        setTransparentLoading(false);
      } else if (res.status === 204) {
        setTransparentLoading(false);
      }
    } else {
      const result = await getMoreDoctors(
        currentPatient,
        doctorListLimit,
        offset
      );
      if (result && result.data) {
        // var existingUsersList = [];
        var existingUsersList = users;
        result.data &&
          result.data.doctors.map((newData) => {
            existingUsersList.push(newData);
            return newData;
          });
        setOffset(offset + 1);
        setUser(existingUsersList);
        setFilterData(existingUsersList);
      }
    }
  };


  // Load more Liked Doctors
  const loadMoreLike = async () => {
    const result = await getMoreLikedDoctorByPatientId(
      currentPatient,
      likedOffset
    );
    if (result && result.data) {
      // var existingUsersList = [];
      var existingUsersList = filterData;
      result.data &&
        result.data.doctors.map((newData) => {
          existingUsersList.push(newData);
          return existingUsersList;
        });
      setLikedOffset(likedOffset + 1);
      setFilterData(existingUsersList);
    }
  };

  const createLikedDoctor = async (doctorId) => {
    setTransparentLoading(true);
    const likedData = {
      patientId: currentPatient.id,
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const response = await postLikedDoctor(likedData);
    // //console.log(response.status);
    if (response.status === 200 || response.status === 201) {
      loadUsers(currentPatient.id);
    }
  };

  const createUnlikedDoctor = async (likeId) => {
    setTransparentLoading(true);
    setLikedOffset(0);
    const response = await postUnlikedDoctor(likeId);
    // //console.log(response.status);
    if (response.status === 200 || response.status === 204) {
      getAllLikedDoctors();
      //loadUsers(currentPatient.id);
    }
  };
  const loadSpeciality = async () => {
    const res = await getSpecialityList();
    console.log('Res speciality', res);
    if (res && res.data.data) {
      res.data.data.map((specialityName) => {
        name.push(specialityName.name);
        return specialityName;
      });
      setSpeciality({ ...speciality, specialityOptions: res.data.data });
    }
  };

  useEffect(() => {
    getCurrentPatient();
    loadSpeciality();
    loadCountry();
    loadLanguage();
  }, []);

  const handleSearchInputChange = (searchValue) => {
    //console.log("searchValue :::::::", searchValue);
    if (searchValue === "") {
      setSearchText("");
      setFilterData(users);
      setdoctor(users[0]);
      //const currentSelectedDate = new Date();
      //onDaySelect(currentSelectedDate, users[0] && users[0].id);
      setAvailability([]);
      setAppointmentSlot([]);
      getInValidAppointments(users[0].id);
      setOffset(1);
      setDisplay({ ...display, suggestion: "none" });
    } else {
      setSearchText(searchValue);
      setTimeout(() => setDisplay({ ...display, suggestion: "block" }), 1500);
      //searchData(searchValue);
    }
  };

  const handleSearchData = async (showToast = false) => {
    if (searchText !== "") {
      setTransparentLoading(true);
      const res = await getSearchData(searchText, 0, doctorListLimit);
      if (res.status === 200 && res.data?.doctors.length > 0) {
        setFilterData(res.data.doctors);
        setdoctor(res.data.doctors[0]);
        setAvailability([]);
        setAppointmentSlot([]);
        getInValidAppointments(res.data.doctors[0].id);
        setTransparentLoading(false);
      } else if (res.status === 204) {
        setFilterData([]);
        setdoctor("");
        setTransparentLoading(false);
      }
    }
    if (showToast) {
      handleToast();
    }
  };

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const [Availability, setAvailability] = useState([]);
  const [appointmentSlot, setAppointmentSlot] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState();

  const handleAppoitnmentType = (e) => {
    setSlotError("");
    setSelectedSlotId("0");
    setAppointment({ ...appointment, appointmentMode: e.target.value });
    if (Availability && Availability.length > 0) {
      if (e.target.value === "CONSULTATION") {
        const consultationSlots = createConsultationSlots(Availability);
        if (consultationSlots && consultationSlots.length > 0) {
          setAppointmentSlot(consultationSlots);
          document.querySelector("#calendar-list").scrollTo(0, 500);
          setDisplayCalendar(false);
          setDisplaySlot(true);
        } else {
          setAppointmentSlot([]);
          setDisplayCalendar(false);
          setDisplaySlot(true);
        }
      } else if (e.target.value === "FOLLOW_UP") {
        setAppointmentSlot(Availability);
        document.querySelector("#calendar-list").scrollTo(0, 500);
        setDisplayCalendar(false);
        setDisplaySlot(true);
      } else if (e.target.value === "") {
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
  const onDaySelect = async (slectedDate, doctorId) => {
    setTransparentLoading(true);
    setSlotError("");
    setCurrentDate(slectedDate);
    const dataForSelectedDay = {
      startTime: new Date(slectedDate.setHours(0, 0, 0)).toISOString(),
      endTime: new Date(slectedDate.setHours(23, 59, 59)).toISOString(),
      status: "AVAILABLE",
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const response = await getFilteredAppointmentData(dataForSelectedDay);
    // //console.log(response.status);
    if (response.status === 200 || response.status === 201) {
      console.log(response.data, 'in response');
      const arraySlot = [];
      response.data &&
        response.data.map((value) => {
          if (
            new Date(value.startTime) >=
            new Date(moment(new Date()).subtract(25, "minutes"))
          ) {
            arraySlot.push(value);
          } else {
            arraySlot.push(value);
          }
        });
      setAvailability(arraySlot);
      setDisplayCalendar(true);
      setDisplaySlot(false);
      setTransparentLoading(false);
      if (appointment.appointmentMode) {
        if (appointment.appointmentMode === "CONSULTATION") {
          const consultationSlots = createConsultationSlots(arraySlot);
          //console.log("consultationSlots :: ", consultationSlots);
          if (consultationSlots && consultationSlots.length > 0) {
            setAppointmentSlot(consultationSlots);
            document.querySelector("#calendar-list").scrollTo(0, 500);
            setDisplayCalendar(false);
            setDisplaySlot(true);
          } else {
            setAppointmentSlot([]);
            setDisplayCalendar(false);
            setDisplaySlot(true);
          }
        } else if (appointment.appointmentMode === "FOLLOW_UP") {
          setAppointmentSlot(arraySlot);
          document.querySelector("#calendar-list").scrollTo(0, 500);
          setDisplayCalendar(false);
          setDisplaySlot(true);
        }
      } else {
        setIsAppointmentTourOpen(true);
      }
    }
  };

  const [disabledDates, setDisabledDates] = useState([]);

  const getInValidAppointments = async (doctorId) => {
    setDisabledDates([]);
    const inValidAppointmentFilter = {
      startTime: new Date(new Date().setHours(0, 0, 0)).toISOString(),
      endTime: new Date(
        new Date().setDate(new Date().getDate() + 22)
      ).toISOString(),
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const response = await getInvalidDates(inValidAppointmentFilter);
    // //console.log(response.status);
    if (response.status === 200 || response.status === 201) {
      const datesArray = [];
      response.data.map((inValidDates) => {
        datesArray.push(new Date(inValidDates));
        return inValidDates;
      });
      if (datesArray) {
        setDisabledDates(datesArray);
        setTransparentLoading(false);
      }
    }
  };

  const [combinedSlotId, setCombinedSlotId] = useState();
  //console.log("combinedSlotId : ", combinedSlotId)
  const onAvailabilitySelected = (slot, index) => {
    setSlotError("");
    setSelectedSlotId(slot.id);
    if (appointment.appointmentMode === "CONSULTATION") {
      setCombinedSlotId(slot.slotId);
    }
    setAppointment({
      ...appointment,
      startTime: slot.startTime,
      endTime: slot.endTime,
      id: appointmentSlot[index].id,
    });
    console.log("appointment", appointment);
    setDisable({ ...disable, continue: false });
  };

  const bookappointment = async (orderData) => {
    setLoading(true);
    let tempSlotConsultationId = "";
    const finalAppointmentDataArray = [];
    if (appointment.appointmentMode === "CONSULTATION") {
      combinedSlots &&
        combinedSlots.map((slotData) => {
          if (combinedSlotId === slotData.slotId) {
            tempSlotConsultationId =
              slotData.slot1.id + "-" + slotData.slot2.id;
            !orderData.appointmentId &&
              (orderData.appointmentId = tempSlotConsultationId);
            finalAppointmentDataArray.push(
              {
                doctorId: appointment.doctorId,
                endTime: slotData.slot1.endTime,
                startTime: slotData.slot1.startTime,
                type: "DR",
                patientId: appointment.patientId,
                status: "ACCEPTED",
                remarks: remarks,
                appointmentMode: appointment.appointmentMode,
                id: slotData.slot1.id,
                urgency: urgency,
                unifiedAppointment:
                  tempSlotConsultationId + "#" + appointment.appointmentMode,
              },
              {
                doctorId: appointment.doctorId,
                endTime: slotData.slot2.endTime,
                startTime: slotData.slot2.startTime,
                type: "DR",
                patientId: appointment.patientId,
                status: "ACCEPTED",
                remarks: remarks,
                appointmentMode: appointment.appointmentMode,
                id: slotData.slot2.id,
                urgency: urgency,
                unifiedAppointment:
                  tempSlotConsultationId + "#" + appointment.appointmentMode,
              }
            );
          }
        });
    } else if (appointment.appointmentMode === "FOLLOW_UP") {
      finalAppointmentDataArray.push({
        doctorId: appointment.doctorId,
        endTime: appointment.endTime,
        startTime: appointment.startTime,
        type: "DR",
        patientId: appointment.patientId,
        status: "ACCEPTED",
        remarks: remarks,
        appointmentMode: appointment.appointmentMode,
        id: appointment.id,
        urgency: urgency,
        unifiedAppointment: appointment.id + "#" + appointment.appointmentMode, //unifiedAppointment: "2145#FOLLOW_UP"
      });
    }

    const bookAppointmentApiHeader = {
      method: "put",
      mode: "no-cors",
      data: JSON.stringify(finalAppointmentDataArray),
      url: `/api/appointments/bulk`,
      headers: {
        Authorization: "Bearer " + LocalStorageService.getAccessToken(),
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    const storePaypalTransitionInfo = {
      method: "post",
      mode: "no-cors",
      data: JSON.stringify(orderData),
      url: `/api/paypal/transaction-info`,
      headers: {
        Authorization: "Bearer " + LocalStorageService.getAccessToken(),
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    const bookingResponse = await axios(bookAppointmentApiHeader);
    const storePaypalInfo = await axios(storePaypalTransitionInfo);

    if (bookingResponse.status === 200 || bookingResponse.status === 201) {
      firestoreService.newAppointmentBookingMessageToFirestore(
        appointment,
        tempSlotConsultationId,
        doctor,
        props
      );
      props.history.push("/patient/myappointment");
    }
  };
  const [display, setDisplay] = useState({
    doctor: "block",
    appointment: "none",
    like: "none",
    unlike: "block",
    suggestion: "none",
  });
  const [disable, setDisable] = useState({
    continue: true,
    payment: true,


  });
  //for payment waiting modal
  const [show, setShow] = useState(false);

  const handleClosemodal = () => setShow(false);
  const handleShowmodal = () => setShow(true);

  const [slotError, setSlotError] = useState("");

  const checkSlot = () => {
    const startTime = appointment.startTime;
    //console.log(new Date(startTime), new Date(moment(new Date()).subtract(25, "minutes")))
    if (
      new Date(startTime) > new Date(moment(new Date()).subtract(25, "minutes"))
    ) {
      setDisplay({ ...display, doctor: "none", appointment: "block" });
    } else {
      setSlotError(
        "Time for booking this slot has been elapsed. Please select another slot!"
      );
    }
  };

  const [displayCalendar, setDisplayCalendar] = useState(true);
  const [displaySlot, setDisplaySlot] = useState(false);

  // React Tour code

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAppointmentTourOpen, setIsAppointmentTourOpen] = useState(false);

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  const closeTour = () => {
    cookies.set("tour", false);
    setIsTourOpen(false);
  };

  const closeAppointmentTour = () => {
    setIsAppointmentTourOpen(false);
  };

  const accentColor = "#5cb7b7";

  const tourConfig = [
    {
      selector: "li.MuiGridListTile-root:nth-child(2)",
      content: `Select your doctor.`,
    },
    {
      selector: ".appointment-type",
      content: `Select the appointment type either FollowUp or Consultation.`,
    },
    {
      selector: ".react-calendar",
      content: `Select a date from Calendar to see the available slots.`,
    },
    {
      selector: ".MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded",
      content: () => (
        <div>
          <p>Search your doctor from here by typing speciality.</p>
          <button className="btn btn-primary" onClick={() => closeTour()}>
            Got it
          </button>
        </div>
      ),
    },
  ];

  const appointmentTypeTour = [
    {
      selector: ".appointment-type",
      content: () => (
        <div>
          <p>
            Please select appointment type either Follow Up or Consultation to
            see available slots.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => closeAppointmentTour()}
          >
            Got it
          </button>
        </div>
      ),
    },
  ];

  if (isTourOpen || isAppointmentTourOpen) {
    document.body.style.color = "#00000080";
  } else {
    document.body.style.color = "unset";
  }

  // Filter Box Code

  const [filter, setFilter] = useState(false);

  const [filterValues, setFilterValues] = useState({
    specialityFilter: [],
    languageFilter: [],
    genderFilter: "",
    docStartTime: "",
    docEndTime: "",
    locationFilter: "",
    insuranceFilter: "",
    countryFilter: "",
    feesFilter: [0, 1000],
    sortFilter: "",
  });

  const {
    specialityFilter,
    languageFilter,
    genderFilter,
    docStartTime,
    docEndTime,
    locationFilter,
    insuranceFilter,
    countryFilter,
    feesFilter,
    sortFilter,
  } = filterValues;

  const toggleFilterBox = () => {
    setFilter(filter ? false : true);
  };

  const clearFilter = () => {
    setTransparentLoading(true);
    setFilterData(users);
    setFilterValues({
      ...filterValues,
      specialityFilter: [],
      languageFilter: [],
      genderFilter: "",
      docStartTime: "",
      docEndTime: "",
      locationFilter: "",
      insuranceFilter: "",
      countryFilter: "",
      feesFilter: [0, 1000],
      sortFilter: "",
    });
    setSelectedFilter({
      ...selectedFilter,
      selectedSpeciality: [],
      selectedLanguage: [],
    });
    setdoctor(users[0]);
    setTransparentLoading(false);
  };

  const handleCheckbox = (checked) => {
    if (checked === false) {
      setFilterValues({ ...filterValues, docEndTime: "" });
      setEndTimeChecked(checked);
    } else {
      setEndTimeChecked(checked);
    }
  };

  const [countryList, setCountryList] = useState([]);
  const [speciality, setSpeciality] = useState({
    specialityOptions: [],
  });
  const { specialityOptions } = speciality;

  const [language, setLanguage] = useState({
    languageOptions: [],
  });
  const { languageOptions } = language;

  const [selectedFilter, setSelectedFilter] = useState({
    selectedSpeciality: [],
    selectedLanguage: [],
  });
  const { selectedSpeciality, selectedLanguage } = selectedFilter;

  const handleSpecialities = (selectedList, selectedItem) => {
    // e.preventDefault()
    var array = specialityFilter;
    var array1 = selectedSpeciality;
    array.push(selectedItem.id);
    array1.push(selectedItem);
    setFilterValues({ ...filterValues, specialityFilter: array });
    setSelectedFilter({ ...selectedFilter, selectedSpeciality: array1 });
  };

  const removeSpecialities = (selectedList, removedItem) => {
    var array = specialityFilter;
    var array1 = selectedSpeciality;
    var index = array.indexOf(removedItem); // Let's say it's Bob.
    var index1 = array1.indexOf(removedItem); // Let's say it's Bob.
    array.splice(index, 1);
    array1.splice(index1, 1);
    setFilterValues({ ...filterValues, specialityFilter: array });
    setSelectedFilter({ ...selectedFilter, selectedSpeciality: array1 });
  };

  const handleLanguages = (selectedList, selectedItem) => {
    // e.preventDefault()
    var array = languageFilter;
    var array1 = selectedLanguage;
    array.push(selectedItem.name);
    array1.push(selectedItem);
    setFilterValues({ ...filterValues, languageFilter: array });
    setSelectedFilter({ ...selectedFilter, selectedLanguage: array1 });
  };

  const removeLanguages = (selectedList, removedItem) => {
    var array = languageFilter;
    var array1 = selectedLanguage;
    var index = array.indexOf(removedItem); // Let's say it's Bob.
    var index1 = array1.indexOf(removedItem); // Let's say it's Bob.
    array.splice(index, 1);
    array1.splice(index1, 1);
    setFilterValues({ ...filterValues, languageFilter: array });
    setSelectedFilter({ ...selectedFilter, selectedLanguage: array1 });
  };

  const loadLanguage = async () => {
    const res = await getLanguageList().catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    if (res && res.data.data) {
      setLanguage({ languageOptions: res.data.data });
    }
  };

  const loadCountry = async () => {
    const res = await getCountryList().catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    console.log('Country List', res);
    if (res && res.data.data) {
      setCountryList(res.data.data);
    }
  };

  const getAvalabilityTime = () => {
    let startTime;
    let endTime;
    const newStartTime = new Date(docStartTime);
    const newEndTime = new Date(docEndTime);
    if (docStartTime !== "" && docEndTime === "") {
      startTime = new Date(newStartTime.setHours(0, 0, 0)).toISOString();
      endTime = new Date(newStartTime.setHours(23, 59, 59)).toISOString();
    } else if (docStartTime !== "" && docEndTime !== "") {
      startTime = new Date(newStartTime.setHours(0, 0, 0)).toISOString();
      endTime = new Date(newEndTime.setHours(23, 59, 59)).toISOString();
    }
    return startTime + "," + endTime;
  };

  const handleFilter = async () => {
    setTransparentLoading(true);
    setFilter(false);
    const availabilityFilter = getAvalabilityTime();
    const splitStr = availabilityFilter?.split(",");
    const startTime = splitStr[0];
    const endTime = splitStr[1];
    if (
      genderFilter === "" &&
      feesFilter[0] === 0 &&
      feesFilter[1] === 1000 &&
      countryFilter === "" &&
      docStartTime === "" &&
      specialityFilter.length === 0 &&
      languageFilter.length === 0
    ) {
      loadUsers(currentPatient.id);
    } else {
      let url = searchFilterForDoctor(
        genderFilter,
        feesFilter,
        countryFilter,
        docStartTime,
        specialityFilter,
        languageFilter,
        startTime,
        endTime
      );

      const result = await getFilteredDoctors(url).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      });
      if (result && (result.status === 200 || result.status === 204)) {
        if (
          result.data &&
          result.data.doctors &&
          result.data.doctors.length > 0
        ) {
          setOffset(1);
          setdoctor(result.data.doctors[0]);
          //const currentSelectedDate = new Date();
          //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
          setAvailability([]);
          setAppointmentSlot([]);
          const docId = result.data.doctors[0]?.id;
          setAppointment({
            ...appointment,
            patientId: currentPatient.id,
            doctorId: docId,
          });
          getInValidAppointments(docId);
          setFilterData(result.data.doctors);
          setTransparentLoading(false);
        } else {
          setdoctor(null);
          setFilterData([]);
          setTransparentLoading(false);
        }
      }
    }
  };

  const [endtimeChecked, setEndTimeChecked] = useState(false);

  const handleToast = () => {
    toast.success('Please select a doctor before proceeding to appointment selection', {
      position: 'top-right',
      autoClose: 7000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const setNextAppointment = async () => {
    const stateData = [];
    stateData.push(nextAppDetails)
    const app = [];
    app.push(appointment)
    console.log("app", app);
    const data1 = [];
    const data2 = [];
    {
      stateData.map((n) => {
        {
          data1.push({
            id: n.id,
            type: "DR",
            status: "PENDING",
            doctorId: n.doctorId,
            patientId: n.patientId,
            unifiedAppointment: n.id + "#" + "FOLLOW_UP",
            appointmentMode: "FOLLOW_UP",
            remarks: null,
            urgency: null,
            patient: null,
            patientName: null,
            timeZone: null,
            appointmentBookedTime: null,
            appointmentExpireTime: null
          })
        };
      })
    }
    console.log("data1", data1);
    {
      app.map((a) => {
        data2.push({
          startTime: a.startTime,
          endTime: a.endTime,
        })
      })
    }
    console.log("data2", data2);
    const data = {
      ...data1[0],
      ...data2[0]
    }
    const res = await setNextAppointmentDoctor(data).catch((err) => {
      if (err.res.status === 500 || err.res.status === 504) {
        setLoading(false);
      }
    })
    if (res) {
      toast.success("Notification sent to patient successfully.");
      props.history.push({ pathname: `/doctor/mypatient` })
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Container className="my-doctor">

        <Row>
          {!profilepID.activated &&
            <Col md={6} lg={4} style={{ display: display.doctor }}>
              <div id="dorctor-list">
                <div className="Togglebar">
                  <div id="toggle-icons">
                    <IconButton
                      onClick={() => toggleFilterBox()}
                      style={{
                        backgroundColor: `${specialityFilter.length > 0 ||
                          languageFilter.length > 0 ||
                          genderFilter ||
                          feesFilter[0] > 0 ||
                          feesFilter[1] < 1000 ||
                          docStartTime ||
                          countryFilter
                          ? "#F6CEB4"
                          : ""
                          }`,
                        color: `${specialityFilter.length > 0 ||
                          languageFilter.length > 0 ||
                          genderFilter ||
                          feesFilter[0] > 0 ||
                          feesFilter[1] < 1000 ||
                          docStartTime ||
                          countryFilter
                          ? "#00d0cc"
                          : ""
                          }`,
                      }}
                    >
                      <TuneIcon />
                    </IconButton>
                    <IconButton
                      style={{ display: display.unlike }}
                      onClick={() => getAllLikedDoctors()}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton
                      style={{ display: display.like }}
                      onClick={() => allDoctorData()}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </div>
                  <SearchBar
                    type="text"
                    value={searchText}
                    id="doctor-search"
                    autoComplete='off'
                    onChange={(value) => handleSearchInputChange(value)}
                    onCancelSearch={() => handleSearchInputChange("")}
                    onRequestSearch={() => handleSearchData(false)}
                    cancelOnEscape={true}
                    onKeyDown={(e) => e.keyCode === 13 ? handleSearchData(true) : ""}

                  />
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                  {searchText !== "" && (
                    <IconButton
                      onClick={() => handleSearchData(true)}
                      className="searchForwardIcon"
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  )}
                  {/* <Link to="/patient/search"><div className="suggestion-text" style={{ display: display.suggestion }}><SearchIcon /> Did'nt find doctor, Do global search</div></Link> */}
                  {/* Filter box start */}
                  {filter && (
                    <div className="filter-box" ref={ref}>
                      <ValidatorForm
                        onSubmit={() => handleFilter()}
                        onError={(error) => console.log(error)}
                      >
                        <div className="filter-body" >
                          <div className="row m-0">
                            <div className="col-md-12 col-xs-12">
                              <FormControl>
                                <div className="filter-multiselect">
                                  <Multiselect
                                    options={specialityOptions}
                                    onSelect={handleSpecialities}
                                    onRemove={removeSpecialities}
                                    selectedValues={selectedSpeciality}
                                    placeholder="Select Specialities"
                                    displayValue="name"
                                  />
                                </div>
                              </FormControl>
                              <FormControl>
                                <div className="filter-multiselect">
                                  <Multiselect
                                    options={languageOptions}
                                    onSelect={handleLanguages}
                                    onRemove={removeLanguages}
                                    selectedValues={selectedLanguage}
                                    placeholder="Select Language"
                                    displayValue="name"
                                  />
                                </div>
                              </FormControl>
                              <FormControl>
                                <Select
                                  id="demo-controlled-open-select"
                                  variant="filled"
                                  name="genderFilter"
                                  value={genderFilter}
                                  displayEmpty
                                  onChange={(e) =>
                                    setFilterValues({
                                      ...filterValues,
                                      genderFilter: e.target.value,
                                    })
                                  }
                                >
                                  <MenuItem value="">
                                    <em>Gender</em>
                                  </MenuItem>
                                  <MenuItem value="MALE">Male</MenuItem>
                                  <MenuItem value="FEMALE">Female</MenuItem>
                                </Select>
                              </FormControl>
                              <br />
                              <hr />
                              <p>Availability:</p>
                              <div className="row">
                                <div className="col-md-6 col-xs-6 pr-1">
                                  <TextField
                                    type="date"
                                    onChange={(e) =>
                                      setFilterValues({
                                        ...filterValues,
                                        docStartTime:
                                          e.target.value === ""
                                            ? ""
                                            : new Date(e.target.value),
                                      })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                      min: moment(new Date()).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    value={moment(new Date(docStartTime)).format(
                                      "YYYY-MM-DD"
                                    )}
                                    variant="filled"
                                    onKeyDown={(e) => e.preventDefault()}
                                  />
                                </div>
                                <div className="col-md-6 col-xs-6 pl-1">
                                  <TextField
                                    type="date"
                                    onChange={(e) =>
                                      setFilterValues({
                                        ...filterValues,
                                        docEndTime:
                                          e.target.value === ""
                                            ? ""
                                            : new Date(e.target.value),
                                      })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                      min: moment(new Date(docStartTime)).format(
                                        "YYYY-MM-DD"
                                      ),
                                    }}
                                    value={moment(new Date(docEndTime)).format(
                                      "YYYY-MM-DD"
                                    )}
                                    variant="filled"
                                    disabled={endtimeChecked ? false : true}
                                    onKeyDown={(e) => e.preventDefault()}
                                  />
                                </div>
                                <div className="col-md-12 col-xs-12">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color="primary"
                                        checked={endtimeChecked}
                                        disabled={docStartTime ? false : true}
                                        onChange={(e) =>
                                          handleCheckbox(e.target.checked)
                                        }
                                        name="checkedA"
                                      />
                                    }
                                    label="Include EndTime."
                                  />
                                </div>
                              </div>
                              <hr />
                              <FormControl>
                                <Select
                                  id="demo-controlled-open-select"
                                  variant="filled"
                                  name="countryFilter"
                                  value={countryFilter}
                                  displayEmpty
                                  onChange={(e) =>
                                    setFilterValues({
                                      ...filterValues,
                                      countryFilter: e.target.value,
                                    })
                                  }
                                >
                                  <MenuItem value="">
                                    <em>Nationality</em>
                                  </MenuItem>
                                  {countryList &&
                                    countryList.map((option, index) => (
                                      <MenuItem value={option.id} key={index}>
                                        {option.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              <hr />
                              <p>Consultation fees: </p>
                              <div className="row">
                                <div className="col-md-12 col-xs-12">
                                  <Slider
                                    value={feesFilter}
                                    onChange={(e, val) =>
                                      setFilterValues({
                                        ...filterValues,
                                        feesFilter: val,
                                      })
                                    }
                                    min={0}
                                    step={25}
                                    max={1000}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                  />
                                  <br />
                                  <b>
                                    Min: {feesFilter[0]} - Max: {feesFilter[1]}
                                  </b>
                                </div>
                              </div>
                              <hr />
                            </div>
                          </div>
                        </div>
                        <div className="filter-action">
                          <div className="row m-0">
                            <div className="col-md-6 col-6">
                              <button
                                type="button"
                                onClick={() => clearFilter()}
                                className="btn btn-primary reset-btn"
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="col-md-6 col-6">
                              <button
                                type="submit"
                                className="btn btn-primary apply-btn"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </ValidatorForm>
                    </div>
                  )}
                  {/* Filter box end */}
                </div>
                <br />
                <div>
                  <Link to="/patient/myappointment" id="menuLinks">
                    <div id="card" className="card">
                      <div className="card-body">
                        My Appointments <span id="arrowright">{rightArrow}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <br />
                <div id="card-list" className="scroller-cardlist">
                  {filterData &&
                    filterData.length > 0 &&
                    filterData[0] !== null ? (
                    <GridList cellHeight={220}>
                      <GridListTile
                        key="Subheader"
                        cols={2}
                        style={{ height: "auto" }}
                      ></GridListTile>
                      {filterData.map(
                        (user, index) =>
                          user &&
                          user.activated && (
                            <GridListTile key={index}>
                              {!user.liked && (
                                <FavoriteBorderIcon
                                  id="fav-icon"
                                  onClick={() => createLikedDoctor(user.id)}
                                />

                              )}
                              console.log(user.liked)

                              {user.liked && (
                                <FavoriteIcon
                                  id="fav-icon"
                                  onClick={() => createUnlikedDoctor(user.likeId)}
                                />
                              )}
                              {user.picture ? (
                                <img src={user.picture} alt="" />
                              ) : (
                                <Avatar
                                  name={user.firstName + " " + user.lastName}
                                />
                              )}
                              <GridListTileBar
                                style={{ cursor: "pointer" }}
                                title={
                                  <span>
                                    Dr. {user.firstName} {user.lastName}
                                  </span>
                                }
                                subtitle={
                                  <ul className="list--tags">
                                    {user.specialities &&
                                      user.specialities.map(
                                        (speciality, index) => (
                                          <li key={index}>{speciality.name}</li>
                                        )
                                      )}
                                  </ul>
                                }
                                onClick={async () => {
                                  setdoctor(user);
                                  setAppointment({
                                    ...appointment,
                                    doctorId: user.id,
                                  });
                                  setDisplay({
                                    ...display,
                                    doctor: "block",
                                    appointment: "none",
                                  });
                                  setDisable({ ...disable, continue: true });
                                  //const currentSelectedDate = new Date();
                                  //onDaySelect(currentSelectedDate, user.id);
                                  setAvailability([]);
                                  setAppointmentSlot([]);
                                  getInValidAppointments(user.id);
                                }}
                              />
                            </GridListTile>
                          )
                      )}
                    </GridList>
                  ) : (
                    <div>
                      <center>No Doctor Found ...</center>
                    </div>
                  )}
                  {filterData && filterData.length > doctorListLimit - 1 && (
                    <>
                      <div
                        className="text-center"
                        style={{ display: display.unlike }}
                      >
                        <button
                          className="btn btn-outline-secondary"
                          onClick={loadMore}
                        >
                          Load More
                        </button>
                      </div>
                      <div
                        className="text-center"
                        style={{ display: display.like }}
                      >
                        <button
                          className="btn btn-outline-secondary"
                          onClick={loadMoreLike}
                        >
                          Load More
                        </button>
                      </div>
                    </>
                  )}
                  {/* {searchText && filterData && (<>
                                    <div className="text-center" style={{ display: display.unlike }}>
                                        <button className="btn btn-outline-secondary" onClick={loadMore}>Load More</button>
                                    </div>
                                    <div className="text-center" style={{ display: display.like }}>
                                        <button className="btn btn-outline-secondary" onClick={loadMoreLike}>Load More</button>
                                    </div>
                                </>)} */}
                </div>
              </div>
            </Col>
          }
          {!profilepID.activated ?
            <Col md={6} lg={4} style={{ display: display.doctor }}>
              <div id="dorctor-list" className="doctor-list-new">
                {doctor && doctor.activated ? (
                  <>
                    <Row id="doc-row">
                      <Col xs={6}>
                        <div className="doc-img">
                          {doctor.picture ? (
                            <img src={doctor.picture} alt="" />
                          ) : (
                            <Avatar
                              name={doctor.firstName + " " + doctor.lastName}
                            />
                          )}
                        </div>
                      </Col>
                      <Col xs={6} id="doc-details">
                        <div>
                          <b className="doc-name">
                            {doctor.firstName} {doctor.lastName}
                          </b>
                          <br />
                          <ul
                            style={{ fontSize: 12, display: "block" }}
                            className="list--tags"
                          >
                            {doctor &&
                              doctor.specialities &&
                              doctor.specialities.map((speciality, index) => (
                                <li key={index}>{speciality.name} </li>
                              ))}
                          </ul>
                          <span>
                            Country Of Residence: <b>{doctor.countryName}</b>
                          </span>
                          <br />
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <div className="mr-4 ml-4">
                      <div className="row">
                        <div className="col-4">
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
                        <div className="col-4">
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
                        <div className="col-4">
                          <span style={{ fontSize: 12 }}>Languange</span>
                          <br />
                          <b>
                            {doctor &&
                              doctor.languages &&
                              doctor.languages.map((lang, index) => (
                                <span key={index}>{lang.name} </span>
                              ))}
                          </b>
                        </div>
                      </div>
                      <hr style={{ borderColor: "black" }} />
                      {/* <h5>About</h5> */}
                      <p style={{ fontSize: 12 }}>
                        {/* <span><b>Bio : </b></span><br/> */}
                        <span>{doctor.bio}</span>
                        <br /><br />
                        <span>
                          <b>Awards : </b>
                        </span>
                        <br />
                        <span>{doctor.awards}</span>
                        <br />
                        <span>
                          <b>Certificates : </b>
                        </span>
                        <br />
                        <span>{doctor.certificates}</span>
                        <br />
                        <span>
                          <b>Experience : </b>
                        </span>
                        <br />
                        <span>{doctor.experience} yrs</span>
                      </p>
                      <br />
                      <div className="mx-0">
                        <div className="row">
                          <div className="col-12">
                            <span className="price">
                              $

                              {appointment.appointmentMode === "CONSULTATION" ||
                                appointment.appointmentMode === ""
                                ? doctor.rate
                                : appointment.appointmentMode === "FOLLOW_UP"
                                  ? doctor.halfRate
                                  : ""}

                            </span>
                            <br />
                            <span>
                              USD /{" "}
                              {appointment.appointmentMode === "CONSULTATION" ||
                                appointment.appointmentMode === ""
                                ? "Consultation"
                                : appointment.appointmentMode === "FOLLOW_UP"
                                  ? "Follow up"
                                  : ""}
                            </span>
                          </div>
                        </div>
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
            :
            <Col md={6} lg={8} style={{ display: display.doctor }}>
              <div id="dorctor-list" className="doctor-list-new">
                {doctor && doctor.activated ? (
                  <>
                    <Row id="doc-row">
                      <Col xs={4}>
                        <div className="doc-img">
                          {doctor.picture ? (
                            <img src={doctor.picture} alt="" />
                          ) : (
                            <Avatar
                              name={doctor.firstName + " " + doctor.lastName}
                            />
                          )}
                        </div>
                      </Col>
                      <Col xs={8} id="doc-details">
                        <div>
                          <b className="doc-name">
                            {doctor.firstName} {doctor.lastName}
                          </b>
                          <br />
                          <ul
                            style={{ fontSize: 12, display: "block" }}
                            className="list--tags"
                          >
                            {doctor &&
                              doctor.specialities &&
                              doctor.specialities.map((speciality, index) => (
                                <li key={index}>{speciality.name} </li>
                              ))}
                          </ul>
                          <span>
                            Country Of Residence: <b>{doctor.countryName}</b>
                          </span>
                          <br />
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <div className="mr-4 ml-4">
                      <div className="row">
                        <div className="col-4">
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
                        <div className="col-4">
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
                        <div className="col-4">
                          <span style={{ fontSize: 12 }}>Languange</span>
                          <br />
                          <b>
                            {doctor &&
                              doctor.languages &&
                              doctor.languages.map((lang, index) => (
                                <span key={index}>{lang.name} </span>
                              ))}
                          </b>
                        </div>
                      </div>
                      <hr style={{ borderColor: "black" }} />
                      {/* <h5>About</h5> */}
                      <p style={{ fontSize: 12 }}>
                        {/* <span><b>Bio : </b></span><br/> */}
                        <span>{doctor.bio}</span>
                        <br /><br />
                        <span>
                          <b>Awards : </b>
                        </span>
                        <br />
                        <span>{doctor.awards}</span>
                        <br />
                        <span>
                          <b>Certificates : </b>
                        </span>
                        <br />
                        <span>{doctor.certificates}</span>
                        <br />
                        <span>
                          <b>Experience : </b>
                        </span>
                        <br />
                        <span>{doctor.experience} yrs</span>
                      </p>
                      <br />
                      <div className="mx-0">
                        <div className="row">
                          <div className="col-12">
                            <span className="price">
                              $

                              {appointment.appointmentMode === "CONSULTATION" ||
                                appointment.appointmentMode === ""
                                ? doctor.rate
                                : appointment.appointmentMode === "FOLLOW_UP"
                                  ? doctor.halfRate
                                  : ""}

                            </span>
                            <br />
                            <span>
                              USD /{" "}
                              {appointment.appointmentMode === "CONSULTATION" ||
                                appointment.appointmentMode === ""
                                ? "Consultation"
                                : appointment.appointmentMode === "FOLLOW_UP"
                                  ? "Follow up"
                                  : ""}
                            </span>
                          </div>
                        </div>
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
          }
          {!profilepID.activated ?
            <Col
              md={6}
              lg={4}
              className="p-0"
              style={{ display: display.doctor }}
            >
              <Tooltip title="Take a Booking appointment tour again." arrow>
                <button onClick={() => setIsTourOpen(true)} className="howToBtn">
                  How to?
                </button>
              </Tooltip>
              <div id="dorctor-list">
                <div
                  style={{ height: 470 }}
                  id="calendar-list"
                >
                  <div className="dateGroup">
                    {/* <p>Select Date</p>
                                    <TextField
                                        type="date"
                                        onChange={(e) => onDaySelect(new Date(e.target.value), doctor && doctor.id)}
                                        className="appointmentDate"
                                        inputProps={{ min: moment(new Date()).format("YYYY-MM-DD") }}
                                        value={moment(currentDate).format("YYYY-MM-DD")}
                                        variant="filled"
                                    />
                                    <br />
                                    <br /> */}
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
                              <MenuItem value="CONSULTATION">
                                Consultation(1 Hr)
                              </MenuItem>
                              <MenuItem value="FOLLOW_UP">
                                Follow up(30 Mins)
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <Calendar
                          onChange={(e) =>
                            onDaySelect(new Date(e), doctor && doctor.id)
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
                            activeStartDate.getDate() === date.getDate() &&
                            disabledDates &&
                            disabledDates.some(
                              (disabledDate) =>
                                // console.log("date.getFullYear() === disabledDate.getFullYear() ::::1:::", disabledDate)
                                date.getFullYear() ===
                                disabledDate.getFullYear() &&
                                date.getMonth() === disabledDate.getMonth() &&
                                date.getDate() === disabledDate.getDate()
                            )
                          } // greyout dates
                        />
                      </>
                    )}

                    {displaySlot && (
                      <>
                        <IconButton
                          style={{
                            background: "#F6CEB4",
                            color: "#00d0cc",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setDisplaySlot(false);
                            setDisplayCalendar(true);
                          }}
                        >
                          <KeyboardBackspaceIcon />{" "}
                        </IconButton>{" "}
                        Back to calendar
                        <p className="mt-3">
                          Available Slots For{" "}
                          {moment(currentDate).format("DD, MMM YYYY")}
                        </p>
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
                                  {moment(current.startTime).format("hh:mm A")} -{" "}
                                  {moment(current.endTime).format("hh:mm A")}{" "}
                                </b>
                              </label>
                            </div>
                          ))
                        ) : appointmentSlot.length === 0 &&
                          appointment.appointmentMode === "CONSULTATION" ? (
                          <div style={{ textAlign: "center", marginTop: "50%" }}>
                            No slots available for consultation.
                          </div>
                        ) : (
                          <div style={{ textAlign: "center", marginTop: "50%" }}>
                            No slots available.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* <br />
                                <Row style={{ margin: '0px' }}>
                                    {Availability && Availability.map((avail, index) => (
                                        new Date(availappoi.startTime) >= new Date() && (
                                            <Col xs={6} className="text-center" style={{ padding: '0px' }} key={index}>
                                                <button className="btn timeSlot" onClick={() => onAvailabilitySelected(avail.startTime, avail.endTime, index)}>
                                                    {moment(new Date(avail.startTime)).format("h:mm A")} - {moment(new Date(avail.endTime)).format("h:mm A")}
                                                </button>
                                            </Col>
                                        )
                                    ))}
                                </Row> */}
                  <label
                    style={{
                      fontSize: 12,
                      color: "#ff9393",
                      marginBottom: "10px",
                      marginTop: "10px",
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
            :
            <Col
              md={6}
              lg={4}
              className="p-0"
              style={{ display: display.doctor }}
            >
              {/* <Tooltip title="Take a Booking appointment tour again." arrow>
                <button onClick={() => setIsTourOpen(true)} className="howToBtn">
                  How to?
                </button>
              </Tooltip> */}
              <div id="dorctor-list">
                <div
                  style={{ height: 470 }}
                  id="calendar-list"
                >
                  <div className="dateGroup">
                    {/* <p>Select Date</p>
                                    <TextField
                                        type="date"
                                        onChange={(e) => onDaySelect(new Date(e.target.value), doctor && doctor.id)}
                                        className="appointmentDate"
                                        inputProps={{ min: moment(new Date()).format("YYYY-MM-DD") }}
                                        value={moment(currentDate).format("YYYY-MM-DD")}
                                        variant="filled"
                                    />
                                    <br />
                                    <br /> */}
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
                              {/* <MenuItem value="CONSULTATION">
                                Consultation(1 Hr)
                              </MenuItem> */}
                              <MenuItem value="FOLLOW_UP">
                                Follow up(30 Mins)
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <Calendar

                          onChange={(e) =>
                            onDaySelect(new Date(e), doctor && doctor.id)
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
                            activeStartDate.getDate() === date.getDate() &&
                            disabledDates &&
                            disabledDates.some(
                              (disabledDate) =>
                                // console.log("date.getFullYear() === disabledDate.getFullYear() ::::1:::", disabledDate)
                                date.getFullYear() ===
                                disabledDate.getFullYear() &&
                                date.getMonth() === disabledDate.getMonth() &&
                                date.getDate() === disabledDate.getDate()
                            )
                          } // greyout dates
                        />
                      </>
                    )}

                    {displaySlot && (
                      <>
                        <IconButton
                          style={{
                            background: "#F6CEB4",
                            color: "#00d0cc",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setDisplaySlot(false);
                            setDisplayCalendar(true);
                          }}
                        >
                          <KeyboardBackspaceIcon />{" "}
                        </IconButton>{" "}
                        Back to calendar
                        <p className="mt-3">
                          Available Slots For{" "}
                          {moment(currentDate).format("DD, MMM YYYY")}
                        </p>
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
                                  {moment(current.startTime).format("hh:mm A")} -{" "}
                                  {moment(current.endTime).format("hh:mm A")}{" "}
                                </b>
                              </label>
                            </div>
                          ))
                        ) : appointmentSlot.length === 0 &&
                          appointment.appointmentMode === "CONSULTATION" ? (
                          <div style={{ textAlign: "center", marginTop: "50%" }}>
                            No slots available for consultation.
                          </div>
                        ) : (
                          <div style={{ textAlign: "center", marginTop: "50%" }}>
                            No slots available.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* <br />
                                <Row style={{ margin: '0px' }}>
                                    {Availability && Availability.map((avail, index) => (
                                        new Date(availappoi.startTime) >= new Date() && (
                                            <Col xs={6} className="text-center" style={{ padding: '0px' }} key={index}>
                                                <button className="btn timeSlot" onClick={() => onAvailabilitySelected(avail.startTime, avail.endTime, index)}>
                                                    {moment(new Date(avail.startTime)).format("h:mm A")} - {moment(new Date(avail.endTime)).format("h:mm A")}
                                                </button>
                                            </Col>
                                        )
                                    ))}
                                </Row> */}
                  <label
                    style={{
                      fontSize: 12,
                      color: "#ff9393",
                      marginBottom: "10px",
                      marginTop: "10px",
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
          }
          {!profilepID.activated &&
            <Col md={4} style={{ display: display.appointment }}>
              <div id="dorctor-list">
                <IconButton
                  style={{ background: "#F6CEB4", color: "#00d0cc" }}
                  onClick={() => {
                    setDisplay({
                      ...display,
                      doctor: "block",
                      appointment: "none",
                    });
                    setDisable({ ...disable, payment: true });
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <br />
                <br />

                <div className="appointment-box">
                  <ValidatorForm onSubmit={() => console.log("Form submitted")}>
                    <p>Urgency</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="urgency"
                        value={urgency}
                        displayEmpty
                        onChange={(e) => handleInputChange(e)}
                      >
                        {/* <MenuItem value="">
                                                    <em>Select</em>
                                                </MenuItem> */}
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                    <br />
                    <br />
                    {/* <p>Diseases</p>
                                    <FormControl>
                                        <div className="multiselect">
                                            <Multiselect
                                                options={diseasesOptions}                                                
                                                // onSelect={handleDiseases}
                                                // onRemove={removeDiseases}
                                                displayValue="name"
                                            />
                                        </div>
                                    </FormControl>
                                    <br />
                                    <br /> */}

                    <p>Comments</p>
                    <TextValidator
                      id="standard-basic"
                      type="textarea"
                      name="remarks"
                      onChange={(e) => handleInputChange(e)}
                      value={remarks}
                      variant="filled"
                      multiline
                      rows={4}
                    />
                    <br />
                  </ValidatorForm>
                </div>


                <br />
              </div>
            </Col>
          }
          {!profilepID.activated ?
            <Col md={4} style={{ display: display.appointment }}>
              <div id="dorctor-list">
                <b className="blue ml-3">Confirm your booking</b> <br />
                <Row id="doc-row">
                  <Col xs={6}>
                    <div className="doc-img">
                      {doctor && doctor.picture ? (
                        <img src={doctor.picture} alt="" />
                      ) : (
                        <Avatar
                          name={
                            doctor &&
                            doctor.firstName + " " + doctor &&
                            doctor.lastName
                          }
                        />
                      )}
                    </div>
                  </Col>
                  <Col xs={6} id="doc-details">
                    <div>
                      <b className="doc-name">
                        {doctor && doctor.firstName} {doctor && doctor.lastName}
                      </b>
                      <br />
                      <span style={{ fontSize: 12, display: "block" }}>
                        {doctor &&
                          doctor.specialities &&
                          doctor.specialities.map((speciality, index) => (
                            <span key={index}>{speciality.name} </span>
                          ))}
                      </span>
                      <span>
                        Country Of Residence:{" "}
                        <b>{doctor && doctor.countryName}</b>
                      </span>
                      <br />
                    </div>
                  </Col>
                </Row>
                <br />
                <div className="mr-4 ml-4">
                  <div className="row">
                    <div className="col-4">
                      <span style={{ fontSize: 12 }}>Experience</span>
                      <br />
                      <b>{doctor && doctor.experience} yrs</b>
                    </div>
                    <div className="col-4">
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
                    <div className="col-4">
                      <span style={{ fontSize: 12 }}>Languange</span>
                      <br />
                      <b>
                        {doctor &&
                          doctor.languages &&
                          doctor.languages.map((lang, index) => (
                            <span key={index}>{lang.name} </span>
                          ))}
                      </b>
                    </div>
                  </div>
                  <hr style={{ borderColor: "black" }} />
                  <h5 className="blue">
                    Date: {moment(appointment.startTime).format("MMMM DD")}
                  </h5>
                  <h5 className="blue">
                    Time:{" "}
                    {moment(appointment.startTime).format("LT") +
                      "-" +
                      moment(appointment.endTime).format("LT")}
                  </h5>
                  <hr style={{ borderColor: "black" }} />
                  <br />
                  <div className="m-3">
                    <div className="row">
                      <div className="col-12">
                        <span className="price">
                          $

                          {appointment.appointmentMode === "CONSULTATION" ||
                            appointment.appointmentMode === ""
                            ? doctor && doctor.rate
                            : appointment.appointmentMode === "FOLLOW_UP"
                              ? doctor && doctor.halfRate
                              : ""}

                        </span>
                        <br />
                        <span>
                          USD /{" "}
                          {appointment.appointmentMode === "CONSULTATION" ||
                            appointment.appointmentMode === ""
                            ? "Consultation"
                            : appointment.appointmentMode === "FOLLOW_UP"
                              ? "Follow up"
                              : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            :
            <>
              <Col md={8} style={{ display: display.appointment }}>

                <div id="dorctor-list">
                  <IconButton
                    style={{ background: "#F6CEB4", color: "#00d0cc" }}
                    onClick={() => {
                      setDisplay({
                        ...display,
                        doctor: "block",
                        appointment: "none",
                      });
                      setDisable({ ...disable, payment: true });
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <b className="blue ml-3">Confirm your booking</b> <br />

                  <Row id="doc-row">
                    <Col xs={6}>
                      <div className="doc-img">
                        {doctor && doctor.picture ? (
                          <img src={doctor.picture} alt="" />
                        ) : (
                          <Avatar
                            name={
                              doctor &&
                              doctor.firstName + " " + doctor &&
                              doctor.lastName
                            }
                          />
                        )}
                      </div>
                    </Col>
                    <Col xs={6} id="doc-details">
                      <div>
                        <b className="doc-name">
                          {doctor && doctor.firstName} {doctor && doctor.lastName}
                        </b>
                        <br />
                        <span style={{ fontSize: 12, display: "block" }}>
                          {doctor &&
                            doctor.specialities &&
                            doctor.specialities.map((speciality, index) => (
                              <span key={index}>{speciality.name} </span>
                            ))}
                        </span>
                        <span>
                          Country Of Residence:{" "}
                          <b>{doctor && doctor.countryName}</b>
                        </span>
                        <br />
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <div className="mr-4 ml-4">
                    <div className="row">
                      <div className="col-4">
                        <span style={{ fontSize: 12 }}>Experience</span>
                        <br />
                        <b>{doctor && doctor.experience} yrs</b>
                      </div>
                      <div className="col-4">
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
                      <div className="col-4">
                        <span style={{ fontSize: 12 }}>Languange</span>
                        <br />
                        <b>
                          {doctor &&
                            doctor.languages &&
                            doctor.languages.map((lang, index) => (
                              <span key={index}>{lang.name} </span>
                            ))}
                        </b>
                      </div>
                    </div>
                    <hr style={{ borderColor: "black" }} />
                    <h5 className="blue">
                      Date: {moment(appointment.startTime).format("MMMM DD")}
                    </h5>
                    <h5 className="blue">
                      Time:{" "}
                      {moment(appointment.startTime).format("LT") +
                        "-" +
                        moment(appointment.endTime).format("LT")}
                    </h5>
                    <hr style={{ borderColor: "black" }} />
                    <br />
                    <div className="m-3">
                      <div className="row">
                        <div className="col-12">
                          <span className="price">
                            $

                            {appointment.appointmentMode === "CONSULTATION" ||
                              appointment.appointmentMode === ""
                              ? doctor && doctor.rate
                              : appointment.appointmentMode === "FOLLOW_UP"
                                ? doctor && doctor.halfRate
                                : ""}

                          </span>
                          <br />
                          <span>
                            USD /{" "}
                            {appointment.appointmentMode === "CONSULTATION" ||
                              appointment.appointmentMode === ""
                              ? "Consultation"
                              : appointment.appointmentMode === "FOLLOW_UP"
                                ? "Follow up"
                                : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </>
          }
          <Col md={4} style={{ display: display.appointment }}>
            <div id="dorctor-list" className="doctor-list-new">
              <p style={{ fontSize: 12 }}>
                Your total for this Primary Care visit.
              </p>
              <div id="calendar-list">
                <div id="price-box">
                  <span className="price">
                    $

                    {appointment.appointmentMode === "CONSULTATION" ||
                      appointment.appointmentMode === ""
                      ? doctor && doctor.rate
                      : appointment.appointmentMode === "FOLLOW_UP"
                        ? doctor && doctor.halfRate
                        : ""}

                  </span>
                  <br />
                  <span>
                    USD /{" "}
                    {appointment.appointmentMode === "CONSULTATION" ||
                      appointment.appointmentMode === ""
                      ? "Consultation"
                      : appointment.appointmentMode === "FOLLOW_UP"
                        ? "Follow up"
                        : ""}
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
                    <Col
                      md={12}
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <p style={{ fontSize: 9, marginBottom: 0 }}>
                        You can cancel your appointment before 2 days or else it
                        will be deducted
                        <br />
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      md={12}
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <p style={{ fontSize: 9, marginBottom: 0 }}>
                        Appointment is 95% reimbursed if cancelled 24h before
                        the start time.
                      </p>
                    </Col>
                  </Row>
                  <br />
                  {!profilepID.activated ?
                    <Row>
                      {/* <Col md={1}></Col> */}
                      {/* <Col md={5} style={{ paddingLeft: 0 }}><button type="button" className="btn btn-primary continue-btn" onClick={bookappointment}>Pay by PayPal</button></Col> */}

                      {disable.payment && (
                        <Col md={12} style={{ paddingLeft: 0 }}>
                          <button
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                            onClick={() => {
                              setDisable({ ...disable, payment: false })


                            }}

                          >
                            Pay Now
                          </button>
                          {/* <button  className="btn btn-primary"
                          style={{ width: "100%" }} onClick={handleShowmodal}>
                          Click to Pay
                        </button> */}
                        </Col>

                      )}

                      {/* <Modal  show={show} onHide={handleClosemodal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Payment</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                      <button
                          className="btn btn-primary"
                          style={{ width: "40%" }}
                          onClick={() => {
                            setDisable({ ...disable, payment: false })
                            
                           
                            }}
                         
                        >
                         Proceed Now
                        </button>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosemodal}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal> */}


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
                    </Row>
                    :
                    <Row>
                      <Col md={12} style={{ paddingLeft: 0 }}>
                        <button
                          className="btn btn-primary"
                          style={{ width: "100%" }}
                          onClick={(e) => {
                            // setDisable({ ...disable, payment: false })
                            setNextAppointment()

                          }}

                        >
                          Book Now
                        </button>
                      </Col>
                    </Row>
                  }

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
                    Ok
                  </button>
                </Link>
              </DialogActions>
            </Dialog>
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
        <Tour
          onRequestClose={() => closeAppointmentTour()}
          startAt={0}
          steps={appointmentTypeTour}
          isOpen={isAppointmentTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          //accentColor={accentColor}
          onAfterOpen={disableBody}
          onBeforeClose={enableBody}
        />
      </Container>
      {/* <Footer /> */}
    </div>
  );
};

export default MyDoctor;

