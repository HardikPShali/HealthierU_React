import React, { useState, useEffect, useRef } from 'react';
import {
  getAppointmentModeForAvailabilitySlotsDisplay,
  getAppointmentModeToDisplayAsLabel,
} from './../../util/appointmentModeUtil';
import { Container, Row, Col } from 'react-bootstrap';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TuneIcon from '@material-ui/icons/Tune';
import axios from 'axios';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import SearchBar from 'material-ui-search-bar';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
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
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import Paypal from '../CommonModule/Paypal';
import TransparentLoader from '../Loader/transparentloader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getLoggedInUserDataByUserId,
  getLikedDoctorByPatientId,
  getMoreLikedDoctorByPatientId,
  postLikedDoctor,
  postUnlikedDoctor,
  getInvalidDates,
  getSearchData,
  setNextAppointmentDoctor,
  getAvailableSlotsForMyDoctors,
  getSearchDataAndFilter,
  getAvailableSlotTimings,
} from '../../service/frontendapiservices';
import {
  getSpecialityList,
  getCountryList,
  getLanguageList,
} from '../../service/adminbackendservices';
import './patient.css';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Tour from 'reactour';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Slider from '@material-ui/core/Slider';
import { Multiselect } from 'multiselect-react-dropdown';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  doctorListLimit,
  doctorListLimitNonPaginated,
} from '../../util/configurations';
import lodash, { isObject } from 'lodash';
import PromoCodeForPatient from './PromoCodeForPatient/PromoCodeForPatient';
import useRole from '../../custom-hooks/useRole';
import PaypalCheckoutButton from './PaypalCheckout/PaypalCheckoutButton';
// import { Button, Modal } from 'react-bootstrap';
// import PaypalMobile from './MobilePayment/PaypalMobile';
// import Footer from "./Footer";
// import SearchIcon from "@material-ui/icons/Search";
// import { firestoreService } from '../../util';
// import Tooltip from '@material-ui/core/Tooltip';
//import SearchIcon from "@material-ui/icons/Search";
//import Footer from "./Footer";

const rightArrow = <FontAwesomeIcon icon={faChevronRight} />;

const MyDoctor = (props) => {
  const controller = new AbortController();

  let history = useHistory();
  const ref = useRef();

  const specialityRef = useRef();
  const languageRef = useRef()

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

  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(users);
  const [specialityArray, setSpecialityArray] = useState({
    name: [],
  });
  const { name } = specialityArray;

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

  const [finalAppointmentData, setFinalAppointmentData] = useState([]);
  const { remarks, urgency } = appointment;
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentLoggedInUser = cookies.get('currentUser');
  const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
  const profilepID = cookies.get('profileDetails');

  const role = useRole();

  const getRoleName = () => {
    return role[0].includes("ROLE_DOCTOR") ? "doctor" : "patient";
  };

  // console.log({ getRoleName: getRoleName() });

  const [nextAppDetails, setNextAppDetails] = useState(null);
  const getCurrentPatient = async () => {
    if (getRoleName() === "doctor") {
      console.log({ stateData: props.location.state });
      // if no stateDtat is present then redirect to prev page
      if (!props.location.state) {
        history.go(-1);
      }
      setNextAppDetails(props.location.state);
      const patientInfo = props.location.state;
      if (patientInfo) {
        setCurrentPatient({ ...currentPatient, id: patientInfo.patient.id });
        loadUsers(patientInfo.patient.id);
      }
    } else {
      const res = await getLoggedInUserDataByUserId(loggedInUserId);
      // console.log('res1', res);
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
  const [likedDoctors, setLikedDoctors] = useState(0)
  const getAllLikedDoctors = async () => {
    // console.log("getAllLikedDoctors trigerred");
    setTransparentLoading(true);
    setDisplay({ ...display, like: 'block', unlike: 'none' });
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
      setLikedDoctors(doctorArray.length)
      setIsFiltered(true)
      setLikedOffset(likedOffset + 1);
      setTransparentLoading(false);
    }
  };
  const allDoctorData = () => {
    // console.log("allDoctorData trigerred");
    // history.go(0);
    if (history.go(0) === true) {
      setFilterData(users);
      setdoctor(users[0]);
      const docId = users[0].id;
      // getInValidAppointments(docId);
      setLikedOffset(0);
      setDisplay({ ...display, like: 'none', unlike: 'block' });
    }
  };

  const [offset, setOffset] = useState(0);
  const [likedOffset, setLikedOffset] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0)

  const loadUsers = async (patientId) => {
    if (getRoleName() === "patient") {
      const data = {
        searchKeyword: '',
        specialitiesId: [],
        countryIds: [],
        languageName: [],
        gender: [],
        // docStartTime: new Date(),
        docEndTime: null,
        rateMin: 0.0,
        rateMax: null,
      };

      const result = await getSearchDataAndFilter(
        // patientId,
        data,
        0,
        doctorListLimit,
        patientId
      ).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      });
      if (
        result &&
        result.data &&
        result.data.data.doctors &&
        result.data.data.doctors.length > 0
      ) {
        setOffset(1);
        setUser(result.data.data.doctors);
        setdoctor(result.data.data.doctors);
        //const currentSelectedDate = new Date();
        //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
        const docId = result.data.data.doctors[0]?.id;
        setAppointment({
          ...appointment,
          patientId: patientId,
          doctorId: docId,
        });
        // getInValidAppointments(docId);
        setTotalDoctors(result.data.data.totalItems)
        setFilterData(result.data.data.doctors);
        //setTimeout(() => searchNutritionDoctor(), 3000);
        // setTimeout(() => setLoading(false), 1000);
        setLoading(false)
        const tourState = cookies.get('tour');
        if (!tourState) {
          setIsTourOpen(true);
        }

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
          setSearchText(text);
          handleSearchData();
          history.replace({ state: null });
        } else if (
          props &&
          props.location &&
          props.location.state &&
          props.location.state !== 'sports medicine'
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
          // getInValidAppointments(docId);
          history.replace({ state: null });
        }
        setTransparentLoading(false);
      } else {
        // setTimeout(() => setLoading(false), 1000);
        setLoading(false)
      }
    } else {
      setOffset(1);
      const doctorInfo = profilepID;
      setUser(doctorInfo.id);
      setdoctor(doctorInfo.id);
      //const currentSelectedDate = new Date();
      //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
      const docId = doctorInfo.id?.id;
      setAppointment({ ...appointment, patientId: patientId, doctorId: docId });
      // getInValidAppointments(docId);
      setFilterData(doctorInfo);
      //setTimeout(() => searchNutritionDoctor(), 3000);
      // setTimeout(() => setLoading(false), 1000);
      setLoading(false)
      const tourState = cookies.get('tour');
      if (!tourState) {
        setIsTourOpen(false);
      }

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
        setSearchText(text);
        handleSearchData();
        history.replace({ state: null });
      } else if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state !== 'sports medicine'
      ) {
        const user = cookies.get('profileDetails');
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
        // getInValidAppointments(docId);
        history.replace({ state: null });
      }
      setTransparentLoading(false);
      // } else {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };
  const [checkLoadMoreDoctors, setCheckLoadMoreDoctors] = useState(true)
  const loadMore = async () => {
    if (searchText) {
      setTransparentLoading(true);
      const res = await getSearchData(searchText, offset, doctorListLimit);
      if (res.data.currentPage == res.data.totalPages) {
        setCheckLoadMoreDoctors(false)
      }
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
      // const result = await getMoreDoctors(
      //   currentPatient,
      //   doctorListLimit,
      //   offset
      // );
      const data = {
        searchKeyword: '',
        specialitiesId: [],
        countryIds: [],
        languageName: [],
        gender: [],
        // docStartTime: new Date(),
        docEndTime: null,
        rateMin: 0.0,
        rateMax: null,
      };

      const patientIdForLoadMore = cookies.get('profileDetails')?.id;

      const result = await getSearchDataAndFilter(
        // patientId,
        data,
        offset,
        doctorListLimit,
        patientIdForLoadMore
      ).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      });
      if (result.data.data.currentPage == result.data.data.totalPages) {
        setCheckLoadMoreDoctors(false)
      }
      if (
        result &&
        result.data &&
        result.data.data.doctors &&
        result.data.data.doctors.length > 0
      ) {
        // var existingUsersList = [];
        var existingUsersList = users;
        result.data.data &&
          result.data.data.doctors.map((newData) => {
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
    // console.log('createLikedDoctor trigerred')
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
    // console.log('createUnlikedDoctor trigerred')
    // console.log({ display })
    setTransparentLoading(true);
    setLikedOffset(0);
    const response = await postUnlikedDoctor(likeId);
    // //console.log(response.status);
    if (response.status === 200 || response.status === 204) {
      toast.success('Successfully removed from your favourites', {
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "createUnlikedDoctor",
      });
      if (display.like === 'block' && display.unlike === 'none') {
        getAllLikedDoctors();
      }
      else if (display.like === 'none' && display.unlike === 'block') {
        loadUsers(currentPatient.id);
      }
      else {
        loadUsers(currentPatient.id);
      }
    }
  };
  const loadSpeciality = async () => {
    const res = await getSpecialityList();
    // console.log('Res speciality', res);
    if (res && res.data.data) {
      res.data.data.map((specialityName) => {
        name.push(specialityName.name);
        return specialityName;
      });
      setSpeciality({ specialityOptions: res.data.data });
    }
  };

  useEffect(() => {
    getCurrentPatient();
    loadSpeciality();
    loadCountry();
    loadLanguage();
  }, []);

  useEffect(() => {
    getAvailableSlotsOfDoctors();
  }, [appointment]);

  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  // useeffect trigger handle search data with dep searchText
  useEffect(() => {
    const timerFn = setTimeout(() => {
      setSearchText(debouncedSearchText);
    }, 1000);
    return () => {
      clearTimeout(timerFn);
    };
  }, [debouncedSearchText]);

  const handleSearchInputChange = (searchValue) => {
    //console.log("searchValue :::::::", searchValue);
    if (searchValue === '') {
      setSearchText('');
      setIsFiltered(false)
      setFilterData(users);
      // setdoctor(users[0]);
      //const currentSelectedDate = new Date();
      //onDaySelect(currentSelectedDate, users[0] && users[0].id);
      setAvailability([]);
      setAppointmentSlot([]);
      // getInValidAppointments(users[0].id);
      setOffset(1);
      setDisplay({ ...display, suggestion: 'none' });
    } else {
      setSearchText(searchValue);
      setIsFiltered(true)
      // setTimeout(() => setDisplay({ ...display, suggestion: 'block' }), 1500);
      setDisplay({ ...display, suggestion: 'block' })
      //searchData(searchValue);
    }
  };

  // useEffect(() => {
  //   if (searchText !== "") {
  //     handleSearchData();
  //   }
  // }, [searchText]);

  const handleSearchData = lodash.memoize(async (showToast = false) => {
    //controller abort function
    // controller.abort();
    const newPatientId = cookies.get('profileDetails')?.id;

    if (searchText !== '') {
      setTransparentLoading(true);
      const data = {
        searchKeyword: searchText,
        specialitiesId: [],
        countryIds: [],
        languageName: [],
        gender: [],
        // docStartTime: new Date(),
        docEndTime: null,
        rateMin: 0.0,
        rateMax: null,
      };
      const res = await getSearchDataAndFilter(
        data,
        0,
        doctorListLimit,
        newPatientId
      );
      if (res.status === 200 && res.data.data?.doctors.length > 0) {
        setFilterData(res.data.data.doctors);
        // setdoctor(res.data.doctors[0]);
        setTransparentLoading(false);
        setAvailability([]);
        setAppointmentSlot([]);
        setdoctor([])
      } else if (res.data.data.doctors.length === 0) {
        setFilterData([]);
        setdoctor('');
        setTransparentLoading(false);
      } else if (res.status === 204) {
        setFilterData([]);
        setdoctor('');
        setTransparentLoading(false);
      }
    }
    // if (showToast) {
    //   handleToast();
    // }
  });

  const handleInputChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const [Availability, setAvailability] = useState([]);
  const [appointmentSlot, setAppointmentSlot] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState();

  const handleAppoitnmentType = (e) => {
    setTransparentLoading(true);
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
    getInValidAppointmentsForSetNextAppointment(user.id);
    // console.log({ appointment })
    if (Availability && Availability.length > 0) {
      if (e.target.value === 'First Consultation') {
        const consultationSlots = createConsultationSlots(Availability);
        if (consultationSlots && consultationSlots.length > 0) {
          setAppointmentSlot(consultationSlots);
          setTransparentLoading(false);
          // console.log({ consultationSlots });
          document.querySelector('#calendar-list').scrollTo(0, 500);
          setDisplayCalendar(false);
          setDisplaySlot(true);
          getAvailableSlotsOfDoctors(user.id, e.target.value);
        } else {
          setTransparentLoading(false);
          setAppointmentSlot([]);
          setDisplayCalendar(false);
          setDisplaySlot(true);
        }
      } else if (e.target.value === 'Follow Up') {
        setAppointmentSlot(Availability);
        // console.log({ Availability });
        setTransparentLoading(false);
        document.querySelector('#calendar-list').scrollTo(0, 500);
        setDisplayCalendar(false);
        setDisplaySlot(true);
        getAvailableSlotsOfDoctors(user.id, e.target.value);
      } else if (e.target.value === '') {
        setAppointmentSlot([]);
        setTransparentLoading(false);
      }
      setDisable({ ...disable, continue: true });
    }
  };

  // startTime, endTime
  const [combinedSlots, setCombinedSlots] = useState([]);

  //console.log("combinedSlots :: ", combinedSlots);
  const createConsultationSlots = (slots) => {
    const updatedArray = [];
    const combinedArray = [];
    if (slots && slots.length > 0) {
      slots.map((slot, i) => {
        // if (slots[i + 1] && slots[i + 1].startTime === slot.endTime) {
        const endTime = moment(slot.endTime).add('0.5', 'hours').utc().format();
        // const endTimeInOneHour = endTime.add(30, 'minutes');
        updatedArray.push({
          ...slot,
          // startTime: slot.startTime,
          endTime: endTime,
          // type: slot.type,
          // status: slot.status,
          // doctorId: slot.doctorId,
          // remarks: slot.remarks,
        });
        // combinedArray.push({
        //   slot1: slot,
        //   slot2: slots[i + 1],
        //   slotId: slot.id + slots[i + 1].id,
        // });
        // }
        return slots;
      });
    }
    // setCombinedSlots(combinedArray);
    return updatedArray;
  };

  const [consultationSlotsDisplay, setConsultationSlotsDisplay] = useState([]);

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

  const [disabledDates, setDisabledDates] = useState([]);
  const getInValidAppointmentsForSetNextAppointment = async (doctorId) => {
    setDisabledDates([]);
    const inValidAppointmentFilter = {
      startTime: new Date(new Date().setHours(0, 0, 0)).toISOString(),
      endTime: new Date(
        new Date().setDate(new Date().getDate() + 31)
      ).toISOString(),
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const response = await getInvalidDates(inValidAppointmentFilter);
    // console.log({ response });
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
  const getInValidAppointments = async (doctorId) => {
    setDisabledDates([]);
    const inValidAppointmentFilter = {
      startTime: new Date(new Date().setHours(0, 0, 0)).toISOString(),
      endTime: new Date(
        new Date().setDate(new Date().getDate() + 31)
      ).toISOString(),
      doctorId: doctorId,
    };
    // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
    const response = await getInvalidDates(inValidAppointmentFilter);
    // console.log({ response });
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
      // console.log("DisabledDates", { disabledDates });
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
    setDisable({ ...disable, continue: false });
  };

  // STATE FOR MODAL
  // const [paymentErrorModal, setPaymentErrorModal] = useState(false);
  // let handlePaymentErrorModal;

  const bookappointment = async (orderData) => {
    setLoading(true);
    let finalAppointmentDataArray = {};
    if (appointment.appointmentMode === 'First Consultation') {
      finalAppointmentDataArray = {
        id: appointment.id,
        type: 'FIRST_CONSULTATION',
        paymentsAppointmentsDTO: orderData,
      };
    } else if (appointment.appointmentMode === 'Follow Up') {
      finalAppointmentDataArray = {
        id: appointment.id,
        type: 'FOLLOW_UP',
        paymentsAppointmentsDTO: orderData,
      };
    }

    if (promoCodeApplied === true) {
      finalAppointmentDataArray.couponId = couponIdState;
    }
    const newPaymentData = {
      ...finalAppointmentDataArray,
    };
    const paymentUrlToBeUsed = () => {
      if (promoCodeApplied === true) {
        return '/api/v2/appointments/payment/bulk/coupon';
      }
      else {
        return '/api/v2/appointments/payment/bulk';
      }
    }

    const newPaymentApi = {
      method: 'post',
      mode: 'no-cors',
      data: newPaymentData,
      url: paymentUrlToBeUsed(),
      headers: {
        Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    // console.log({ newPaymentApi });

    try {
      // await api call
      const newPaymentResponse = await axios(newPaymentApi);
      //success logic
      if (
        newPaymentResponse.status === 200 ||
        newPaymentResponse.status === 201
      ) {
        props.history.push('/patient/myappointment');
      }
    } catch (err) {
      //error logic
      // console.log({ err });
      const errorMessage = err.response.data.message;
      const errorStatus = err.response.status;

      if (errorStatus === 500 && errorMessage) {
        setLoading(false);
        // FOR MODAL
        // setPaymentErrorModal(true);

        // FOR TOAST
        toast.error(`${errorMessage}. Please try again.`, {
          hideProgressBar: true,
        });
      } else {
        setLoading(false);
        // FOR MODAL
        // setPaymentErrorModal(true);

        // FOR TOAST
        toast.error(`Payment failed. Please try again.`, {
          hideProgressBar: true,
        });
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
  //for payment waiting modal
  const [show, setShow] = useState(false);

  const handleClosemodal = () => setShow(false);
  const handleShowmodal = () => setShow(true);

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

  // React Tour code

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAppointmentTourOpen, setIsAppointmentTourOpen] = useState(false);

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  const closeTour = () => {
    cookies.set('tour', false, {
      path: "/"
    });
    setIsTourOpen(false);
  };

  const closeAppointmentTour = () => {
    setIsAppointmentTourOpen(false);
  };

  const accentColor = '#5cb7b7';

  const tourConfig = [
    {
      selector: 'li.MuiGridListTile-root:nth-child(2)',
      content: `Select your doctor.`,
    },
    {
      selector: '.appointment-type',
      content: `Select the appointment type either FollowUp or Consultation.`,
    },
    {
      selector: '.react-calendar',
      content: `Select a date from Calendar to see the available slots.`,
    },
    {
      selector: '.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded',
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
      selector: '.appointment-type',
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

  // if (isTourOpen || isAppointmentTourOpen) {
  //   document.body.style.color = '#00000080';
  // } else {
  //   document.body.style.color = 'unset';
  // }

  // Filter Box Code

  const [filter, setFilter] = useState(false);

  const [filterValues, setFilterValues] = useState({
    specialityFilter: [],
    languageFilter: [],
    genderFilter: '',
    docStartTime: '',
    docEndTime: '',
    locationFilter: '',
    insuranceFilter: '',
    countryFilter: '',
    feesFilter: [0, 1000],
    sortFilter: '',
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
      // ...filterValues,
      specialityFilter: [],
      languageFilter: [],
      genderFilter: '',
      docStartTime: '',
      docEndTime: '',
      locationFilter: '',
      insuranceFilter: '',
      countryFilter: '',
      feesFilter: [0, 1000],
      sortFilter: '',
    });
    setSelectedFilter({
      // ...selectedFilter,
      selectedSpeciality: [],
      selectedLanguage: [],
    });
    // setdoctor(users[0]);
    specialityRef.current.resetSelectedValues();
    languageRef.current.resetSelectedValues();
    loadSpeciality();
    setTransparentLoading(false);
    loadUsers()
    setIsFiltered(false)
  };

  const handleCheckbox = (checked) => {
    if (checked === false) {
      setFilterValues({ ...filterValues, docEndTime: '' });
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
    // console.log('Country List', res);
    if (res && res.data.data) {
      setCountryList(res.data.data);
    }
  };

  const getAvalabilityTime = () => {
    let startTime;
    let endTime;
    const newStartTime = new Date(docStartTime);
    const newEndTime = new Date(docEndTime);
    if (docStartTime !== '' && docEndTime === '') {
      startTime = new Date(newStartTime.setHours(0, 0, 0)).toISOString();
      endTime = new Date(newStartTime.setHours(23, 59, 59)).toISOString();
    } else if (docStartTime !== '' && docEndTime !== '') {
      startTime = new Date(newStartTime.setHours(0, 0, 0)).toISOString();
      endTime = new Date(newEndTime.setHours(23, 59, 59)).toISOString();
    }
    return startTime + ',' + endTime;
  };
  const [isFiltered, setIsFiltered] = useState(false)
  const handleFilter = async () => {
    setTransparentLoading(true);
    setFilter(false);
    const availabilityFilter = getAvalabilityTime();
    const splitStr = availabilityFilter?.split(',');
    const startTime = splitStr[0];
    const endTime = splitStr[1];


    let genderConvertedToArray = genderFilter.split(" ")
    let countryIdConvertedToArray = countryFilter.toString().split(' ')

    if (genderConvertedToArray == "") {
      genderConvertedToArray = []
    }

    if (countryIdConvertedToArray == "") {
      countryIdConvertedToArray = []
    }


    const patientIdForFilter = cookies.get('profileDetails')?.id;
    if (
      genderConvertedToArray === '' &&
      feesFilter[0] === 0 &&
      feesFilter[1] === 1000 &&
      countryIdConvertedToArray === '' &&
      (docStartTime === '' || null) &&
      specialityFilter.length === 0 &&
      languageFilter.length === 0
    ) {
      loadUsers(currentPatient.id);
    } else {
      let data = {
        "searchKeyword": "",
        "specialitiesId": specialityFilter ? specialityFilter : [],
        "countryIds": countryIdConvertedToArray ? countryIdConvertedToArray : [],
        "languageName": languageFilter ? languageFilter : [],
        "gender": genderConvertedToArray ? genderConvertedToArray : [],
        "docStartTime": startTime,
        "docEndTime": endTime,
        "rateMin": feesFilter[0] ? feesFilter[0] : "",
        "rateMax": feesFilter[1] ? feesFilter[1] : "",
      }

      if (startTime === 'undefined') {
        data.docStartTime = null;
      }

      if (endTime === 'undefined') {
        data.docEndTime = null;
      }
      const result = await getSearchDataAndFilter(
        data,
        0,
        doctorListLimitNonPaginated,
        patientIdForFilter
      ).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          toast.error('Something went wrong. Please try again', {
            toastId: 'filterErrorToast',
          });
          setTransparentLoading(false);
        }
      });
      if (result && (result.status === 200 || result.status === 204)) {
        setTotalDoctors(result.data.data.totalItems)
        setIsFiltered(true)
        if (
          result.data.data &&
          result.data.data.doctors &&
          result.data.data.doctors.length > 0
        ) {
          setOffset(1);
          setAvailability([]);
          setAppointmentSlot([]);
          setTotalDoctors(result.data.data.totalItems)
          setFilterData(result.data.data.doctors);
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
    toast.success(
      'Please select a doctor before proceeding to appointment selection',
      {
        position: 'top-right',
        autoClose: 7000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const [disableButton, setDisableButton] = useState(false);
  const setNextAppointment = async () => {
    setDisableButton(true);
    setLoading(true);
    const stateData = [];
    stateData.push(nextAppDetails);
    const app = [];
    app.push(appointment);
    const data = [];

    {
      app.map((a) => {
        data.push({
          id: a.id,
          type: 'DR',
          status: 'PENDING',
          doctorId: a.doctorId,
          patientId: a.patientId,
          unifiedAppointment: a.id + '#' + 'FOLLOW_UP',
          appointmentMode: 'Follow Up',
          remarks: null,
          urgency: null,
          patient: null,
          patientName: null,
          timeZone: null,
          appointmentBookedTime: null,
          appointmentExpireTime: null,
          startTime: a.startTime,
          endTime: a.endTime,
        });
      });
    }
    // const data = {
    //   ...data1[0],
    //   ...data2[0]
    // }
    const res = await setNextAppointmentDoctor(data[0]).catch((err) => {
      if (err.response.status === 500 && err.response.data.message === 'Invalid id and doctorId  and PatientId are required') {
        toast.error('Please select date and time to book slot', {
          toastId: 'nextAppointmentErrorToast',
          autoClose: 3000,
          hideProgressBar: true,
        })
        setLoading(false);
      }
      else {
        toast.error('Something went wrong. Please try again', {
          toastId: 'nextAppointmentErrorToast',
          autoClose: 3000,
          hideProgressBar: true,
        })
        setLoading(false);
      }
    });
    if (res) {
      // toast.success('Next Appointment is Set Successfully.');
      setDisableButton(false);
      setLoading(false);
      props.history.push({ pathname: `/doctor/my-appointments` });
    }
    setLoading(false);

  };

  // AVAILABLE SLOTS OF A DOCTOR
  const [enableDates, setEnableDates] = useState([]);
  const getAvailableSlotsOfDoctors = async (id, type) => {
    if (id) {
      const response = await getAvailableSlotsForMyDoctors(
        id,
        type
      ).catch((err) => console.log({ err }));

      setAvailableSlotsDisplay(response.data);

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
        return eD;
      })
    );
  };

  //promo-code states
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [couponIdState, setCouponIdState] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoCodeObject, setPromoCodeObject] = useState({});
  const [promoCodeEntered, setPromoCodeEntered] = useState('');

  const handlePromoCodeStates = (promoCodeData) => {
    if (!promoCodeData || promoCodeData === false) {
      setPromoCodeApplied(promoCodeData.promoCodeAdded)
    }
    else {
      setPromoCodeApplied(promoCodeData.promoCodeAdded);
      setCouponIdState(promoCodeData.couponId);
      setDiscountApplied(promoCodeData.discountApplied);
      setPromoCodeEntered(promoCodeData.promoCodeTextEntered);
    }
  }

  useEffect(() => {
    if (appointment.appointmentMode !== "" && isObject(doctor)) {
      setPromoCodeObject({
        doctorId: doctor.id,
        patientId: cookies.get('profileDetails')?.id,
        rate: doctor.rate,
        halfRate: doctor.halfRate,
        apptMode: appointment.appointmentMode,
      })
    }
  }, [doctor, appointment]);

  const handleFreeCouponTransactions = async () => {
    setLoading(true);
    let finalAppointmentDataArray = {};
    if (promoCodeApplied === true && promoCodeEntered === 'HEALTHIERUAE' && appointment.appointmentMode === 'First Consultation') {
      finalAppointmentDataArray = {
        id: appointment.id,
        type: "FIRST_CONSULTATION",
        paymentsAppointmentsDTO: {
          appointmentMode: "First Consultation",
          intent: "CAPTURE",
          payerId: "100%DISCOUNT_COUPON",
          paymentId: "100%DISCOUNT_COUPON",
          paymentmethod: "paypal website",
          state: "COMPLETED",
          transactionAmount: "0.00",
          transactionCurrency: "USD",
          transactionId: "100%DISCOUNT_COUPON" + Math.floor(Math.random() * 1000000),
          userName: "Jane Doe",
          userId: 1500
        },
        couponId: couponIdState,

      };
    } else if (promoCodeApplied === true && promoCodeEntered === 'HEALTHIERUAE' && appointment.appointmentMode === 'Follow Up') {
      finalAppointmentDataArray = {
        id: appointment.id,
        type: 'FOLLOW_UP',
        paymentsAppointmentsDTO: {
          appointmentMode: "Follow Up",
          intent: "CAPTURE",
          payerId: "100%DISCOUNT_COUPON",
          paymentId: "100%DISCOUNT_COUPON",
          paymentmethod: "paypal website",
          state: "COMPLETED",
          transactionAmount: "0.00",
          transactionCurrency: "USD",
          transactionId: "100%DISCOUNT_COUPON" + Math.floor(Math.random() * 1000000),
          userName: "Jane Doe",
          userId: 1500
        },
        couponId: couponIdState
      };
    }
    const freePaymentPayload = {
      ...finalAppointmentDataArray,
    }

    const freePaymentApi = {
      method: 'post',
      mode: 'no-cors',
      data: freePaymentPayload,
      url: "/api/v2/appointments/payment/bulk/coupon",
      headers: {
        Authorization: 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    // console.log({ newPaymentApi });

    try {
      // await api call
      const freePaymentResponse = await axios(freePaymentApi);

      //success logic
      if (
        freePaymentResponse.status === 200 ||
        freePaymentResponse.status === 201
      ) {
        setLoading(false)
        props.history.push('/patient/myappointment');
      }
    } catch (err) {
      //error logic
      // console.log({ err });
      const errorMessage = err.response.data.message;
      const errorStatus = err.response.status;

      if (errorStatus === 500 && errorMessage) {
        setLoading(false);
        // FOR MODAL
        // setPaymentErrorModal(true);

        // FOR TOAST
        toast.error(`${errorMessage}. Please try again.`, {
          hideProgressBar: true,
        });
      } else {
        setLoading(false);
        // FOR MODAL
        // setPaymentErrorModal(true);

        // FOR TOAST
        toast.error(`Payment failed. Please try again.`, {
          hideProgressBar: true,
        });
      }
    }


  }

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Container className="my-doctor pt-4">
        <Row>
          {getRoleName() === 'patient' && (
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
                          ? '#F6CEB4'
                          : ''
                          }`,
                        color: `${specialityFilter.length > 0 ||
                          languageFilter.length > 0 ||
                          genderFilter ||
                          feesFilter[0] > 0 ||
                          feesFilter[1] < 1000 ||
                          docStartTime ||
                          countryFilter
                          ? '#00d0cc'
                          : ''
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
                    value={debouncedSearchText}
                    id="doctor-search"
                    autoComplete="off"
                    onChange={(value) => {
                      setDebouncedSearchText(value);
                      handleSearchInputChange(value);
                      // handleSearchData(true);
                    }}
                    onCancelSearch={() => handleSearchInputChange('')}
                    onRequestSearch={() => handleSearchData(false)}
                    cancelOnEscape={true}
                    onKeyDown={(e) =>
                      e.keyCode === 13 ? handleSearchData(true) : ''
                    }
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
                  {searchText !== '' && (
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
                        <div className="filter-body">
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
                                    ref={specialityRef}
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
                                    ref={languageRef}
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
                                          e.target.value === ''
                                            ? ''
                                            : new Date(e.target.value),
                                      })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                      min: moment(new Date()).format(
                                        'YYYY-MM-DD'
                                      ),
                                    }}
                                    value={moment(
                                      new Date(docStartTime)
                                    ).format('YYYY-MM-DD')}
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
                                          e.target.value === ''
                                            ? ''
                                            : new Date(e.target.value),
                                      })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                      min: moment(
                                        new Date(docStartTime)
                                      ).format('YYYY-MM-DD'),
                                    }}
                                    value={moment(new Date(docEndTime)).format(
                                      'YYYY-MM-DD'
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
                        My Appointments{' '}
                        <span id="arrowright">{rightArrow}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <br />
                <div id="card-list" className="scroller-cardlist">
                  {/* {console.log("filterData", filterData.length)}
                  {console.log("totalDoctors", totalDoctors)} */}
                  {filterData && filterData.length > 0 ? (
                    <GridList cellHeight={220}>
                      <GridListTile
                        key="Subheader"
                        cols={2}
                        style={{ height: 'auto' }}
                      ></GridListTile>
                      {filterData.map(
                        (user, index) =>
                          user &&
                          user.activated && (
                            <GridListTile
                              key={index}
                              className={`card-list__grid-list-tile ${user.id === doctor?.id ? 'card-border' : ''
                                }`}
                              onClick={async () => {
                                setdoctor(user);
                                setAppointment({
                                  ...appointment,
                                  doctorId: user.id,
                                });
                                setDisplay({
                                  ...display,
                                  doctor: 'block',
                                  appointment: 'none',
                                });
                                setAppointment({
                                  ...appointment,
                                  appointmentMode: '',
                                });
                                setDisable({ ...disable, continue: true });
                                setEnableDates([])
                                setAvailableSlotsDisplay([])
                                // getAvailableSlotsOfDoctors(user.id);
                                //const currentSelectedDate = new Date();
                                //onDaySelect(currentSelectedDate, user.id);
                                setAvailability([]);
                                setAppointmentSlot([]);
                                // setBorderStyle({ ...borderStyle, border: '1px solid black' });
                                // getInValidAppointments(user.id);
                              }}
                            // style={user.id === doctor.id ? { border: '1px solid black' } : {}}
                            >
                              {!user.liked && (
                                <FavoriteBorderIcon
                                  style={{ color: '#f6ceb4' }}
                                  id="fav-icon"
                                  onClick={() => createLikedDoctor(user.id)}
                                />
                              )}

                              {user.liked && (
                                <FavoriteIcon
                                  style={{ color: '#00d0cc' }}
                                  id="fav-icon"
                                  onClick={() =>
                                    createUnlikedDoctor(user.likeId)
                                  }
                                />
                              )}
                              {user.picture ? (
                                <img src={user.picture} alt="" className='profile-in-gridlist' />
                              ) : (
                                <Avatar
                                  name={user.firstName + ' ' + user.lastName}
                                />
                              )}
                              <GridListTileBar
                                style={{ cursor: 'pointer' }}
                                title={<span>{user.salutation} {user.firstName}</span>}
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
                                    doctor: 'block',
                                    appointment: 'none',
                                  });
                                  setDisable({ ...disable, continue: true });
                                  // getAvailableSlotsOfDoctors(user.id);
                                  //const currentSelectedDate = new Date();
                                  //onDaySelect(currentSelectedDate, user.id);
                                  setAvailability([]);
                                  setAppointmentSlot([]);
                                  // getInValidAppointments(user.id);
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
                  {/* {filterData && (filterData.length !== totalDoctors || totalDoctors !== 0) && !isFiltered && checkLoadMoreDoctors && ( */}
                  {filterData && !isFiltered && checkLoadMoreDoctors && (

                    <>
                      <div
                        className="text-center"
                        style={{ display: display.unlike, marginTop: '5px' }}
                      >
                        <button
                          className="btn btn-outline-secondary"
                          onClick={loadMore}
                          style={{ boxShadow: 'none' }}
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
                </div>
              </div>
            </Col>
          )}
          {getRoleName() === 'patient' ? (
            <Col md={6} lg={4} style={{ display: display.doctor }}>
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
                              name={
                                doctor.firstName + ' ' + (doctor.lastName || '')
                              }
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} id="doc-details">
                        <div>
                          <p className="doc-name">{doctor.salutation}{' '}{doctor.firstName}</p>
                          <div>
                            <ul
                              style={{
                                fontSize: 14,
                                display: 'flex',
                                //textAlign: 'center',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                marginLeft: '-30px'
                              }}
                              className="list--tags-speciality"
                            >
                              {doctor &&
                                doctor.specialities &&
                                doctor.specialities.map((speciality, index) => (
                                  <li className='specialitiesTags' key={index}>{speciality.name} </li>
                                ))}
                            </ul>
                          </div>
                          <p
                            style={{
                              fontSize: 14,
                              textAlign: 'center',
                              fontWeight: '400',
                            }}
                          >
                            {doctor.experienceWithMonths} years of experience
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
                            <b>Nationality:</b> {doctor.countryName}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Education</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.educationalQualifications &&
                            doctor.educationalQualifications.map((x, index) => (
                              <li key={index} className="list-font">
                                {x.educationalQualification}{' '}
                              </li>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Institution</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.educationalQualifications &&
                            doctor.educationalQualifications.map((x, index) => (
                              <li className="list-font" key={index}>
                                {x.institution}{' '}
                              </li>
                            ))}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Language</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.languages &&
                            doctor.languages.map((lang, index) => (
                              <li key={index} className="list-font">
                                {lang.name}{' '}
                              </li>
                            ))}
                        </div>
                      </div>
                    </div>
                    <hr />

                    <div className="ml-4">
                      {doctor.bio && (
                        <b>
                          <p style={{ fontSize: 14, margin: '0 auto' }}>
                            About
                          </p>
                        </b>
                      )}

                      <p style={{ fontSize: 14, textAlign: 'justify' }}>
                        {doctor.bio && <span>{doctor.bio}</span>}

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
                            <span>{doctor.experienceWithMonths} yrs</span>
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
                                ? 'Consultation'
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
                    <center>No Doctor Selected ...</center>
                  </div>
                )}
              </div>
            </Col>
          ) : (
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
                          <p className="doc-name">{doctor.salutation}{' '}{doctor.firstName}</p>
                          <ul
                            style={{
                              fontSize: 14,
                              display: 'flex',
                              //textAlign: 'center',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              marginLeft: '-30px'
                            }}
                            className="list--tags-speciality"
                          >
                            {doctor &&
                              doctor.specialities &&
                              doctor.specialities.map((speciality, index) => (
                                <li className='specialitiesTags' key={index}>{speciality.name} </li>
                              ))}
                          </ul>
                          <p
                            style={{
                              fontSize: 14,
                              textAlign: 'center',
                              fontWeight: '400',
                            }}
                          >
                            {doctor.experienceWithMonths} years of experience
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
                            <b>Nationality:</b>
                            {doctor.countryName}
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Education</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.educationalQualifications &&
                            doctor.educationalQualifications.map((x, index) => (
                              <li key={index} className="list-font">
                                {x.educationalQualification}{' '}
                              </li>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Institution</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.educationalQualifications &&
                            doctor.educationalQualifications.map((x, index) => (
                              <li key={index} className="list-font">
                                {x.institution}{' '}
                              </li>
                            ))}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <b>
                            <span style={{ fontSize: 14 }}>Language</span>
                          </b>
                          <br />

                          {doctor &&
                            doctor.languages &&
                            doctor.languages.map((lang, index) => (
                              <li key={index}>{lang.name} </li>
                            ))}
                        </div>
                      </div>
                    </div>
                    <hr />
                    {/* <h5>About</h5> */}
                    <div className="ml-4">
                      {doctor.bio && (
                        <b>
                          <p style={{ fontSize: 14, margin: '0 auto' }}>
                            About
                          </p>
                        </b>
                      )}
                      <p style={{ fontSize: 14 }}>
                        {doctor.bio && <span>{doctor.bio}</span>}
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
                            <span>{doctor.experienceWithMonths} yrs</span>
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
                                ? 'Consultation'
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
          )}
          {getRoleName() === 'patient' ? (
            <Col md={6} lg={4} style={{ display: display.doctor }}>
              {/* <Tooltip title="Take a Booking appointment tour again." arrow>
                <button
                  onClick={() => setIsTourOpen(true)}
                  className="howToBtn"
                >
                  How to?
                </button>
              </Tooltip> */}
              <div id="dorctor-list" className="calendar-helper">
                <div style={{ height: 470 }} id="calendar-list">
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
                    {doctor && doctor.activated ? (
                      displayCalendar && (
                        <>
                          <div className="appointment-type">
                            {/* {console.log({ currentDate })} */}
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
                                <MenuItem value="First Consultation">
                                  Consultation(1 Hr)
                                </MenuItem>
                                <MenuItem value="Follow Up">
                                  Follow up(30 Mins)
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                          <Calendar
                            onChange={(e) =>
                              onDaySelect(new Date(e), doctor && doctor.id, appointment.appointmentMode)
                            }
                            value={currentDate}
                            // maxDetail="month"
                            minDetail="month"
                            minDate={new Date()} //to disable past days
                            maxDate={
                              new Date(
                                new Date().setDate(new Date().getDate() + 180)
                              )
                            } // next 3week condition
                            // Temporarily commented to enable calendar click functionality for appointment.
                            tileDisabled={({ activeStartDate, date, view }) =>
                              disabledCalendarDates(date)
                            }
                          // } // greyout dates
                          />
                        </>
                      )
                    ) : (
                      <div className="no-result">
                        <center>Select a Doctor to view Calendar ...</center>
                      </div>
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
                          {moment(currentDate).format('DD, MMMM YYYY')}
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
                              No slots available for consultation.
                            </div>
                          ) : (
                            <div
                              style={{ textAlign: 'center', marginTop: '50%' }}
                            >
                              No slots available.
                            </div>
                          )}
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
                      color: '#ff9393',
                      marginBottom: '10px',
                      marginTop: '10px',
                    }}
                    className="left"
                  >
                    {slotError}
                  </label>
                </div>
              </div>
            </Col>
          ) : (
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
                <div style={{ height: 470 }} id="calendar-list">
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
                          {/* {console.log({ currentDate })} */}
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
                              {/* <MenuItem value="First Consultation">
                                Consultation(1 Hr)
                              </MenuItem> */}
                              <MenuItem value="Follow Up">
                                Follow up(30 Mins)
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <Calendar
                          onChange={(e) =>
                            onDaySelect(new Date(e), doctor && doctor.id, appointment.appointmentMode)
                          }
                          value={currentDate}
                          // maxDetail="month"
                          minDetail="month"
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
                          {moment(currentDate).format('DD, MMMM YYYY')}
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
                              No slots available for consultation.
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
                  className="btn btn-primary continue-btn-reschedule"
                  onClick={() => {
                    setNextAppointment();
                  }}
                  disabled={disable.continue && disableButton}
                >
                  Book Slot
                </button>
              </div>
            </Col>
          )}
          {/* {!profilepID.activated && (
            <Col md={4} style={{ display: display.appointment }}>
              <div id="dorctor-list">
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
                <br />
                <br />

                <div className="appointment-box">
                  <ValidatorForm onSubmit={() => console.log('Form submitted')}>
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
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                    <br />
                    <br />
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
          )} */}
          {getRoleName() === 'patient' ? (
            <Col md={7} style={{ display: display.appointment }}>
              <div id="dorctor-list" className="doctor-list-new">
                <IconButton
                  style={{
                    background: '#F6CEB4',
                    color: '#00d0cc',
                    margin: "auto 10px"
                  }}
                  onClick={() => {
                    setDisplay({
                      ...display,
                      doctor: 'block',
                      appointment: 'none',
                    });
                    setDiscountApplied(false);
                    setCouponIdState(null);
                    setPromoCodeApplied(false);
                    setPromoCodeEntered(false);
                    setDisable({ ...disable, payment: true });
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <p className="blue ml-2 text-center">Confirm your booking</p>
                <Row id="doc-row">
                  <Col xs={12}>
                    <div className="doc-img">
                      {doctor?.picture ? (
                        <img src={doctor?.picture} alt="" />
                      ) : (
                        <Avatar
                          name={doctor?.firstName + ' ' + doctor?.lastName}
                        />
                      )}
                    </div>
                  </Col>
                  <Col xs={12} id="doc-details">
                    <div>
                      <p className="doc-name">{doctor?.salutation}{' '}{doctor?.firstName}</p>
                      <ul
                        style={{
                          fontSize: 14,
                          display: 'flex',
                          //textAlign: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          marginLeft: '-30px'
                        }}
                        className="list--tags-speciality"
                      >
                        {doctor &&
                          doctor.specialities &&
                          doctor.specialities.map((speciality, index) => (
                            <li className='specialitiesTags' key={index}>{speciality.name} </li>
                          ))}
                      </ul>
                      <p
                        style={{
                          fontSize: 12,
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      >
                        {doctor?.experienceWithMonths} years of experience
                      </p>
                    </div>
                  </Col>
                </Row>
                <div className="mr-4 ml-4">
                  <div className="row">
                    <div className="col-12">
                      <span style={{ fontSize: 12 }}>
                        <b>Nationality:</b> {doctor?.countryName}
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
                      <span style={{ fontSize: 12 }}>Language</span>
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
                              ? 'Follow up'
                              : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ) : (
            <>
              <Col md={8} style={{ display: display.appointment }}>
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
                        <p className="doc-name">{doctor.salutation}{' '}{doctor.firstName}</p>
                        <ul
                          style={{
                            fontSize: 14,
                            display: 'flex',
                            //textAlign: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginLeft: '-30px'
                          }}
                          className="list--tags-speciality"
                        >
                          {doctor &&
                            doctor.specialities &&
                            doctor.specialities.map((speciality, index) => (
                              <li className='specialitiesTags' key={index}>{speciality.name} </li>
                            ))}
                        </ul>
                        <p
                          style={{
                            fontSize: 12,
                            textAlign: 'center',
                            fontWeight: '600',
                          }}
                        >
                          {doctor.experienceWithMonths} years of experience
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
                        <span style={{ fontSize: 12 }}>Language</span>
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
                    <br />
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
                          <br />
                          <span>
                            USD /{' '}
                            {appointment.appointmentMode ===
                              'First Consultation' ||
                              appointment.appointmentMode === ''
                              ? 'Consultation'
                              : appointment.appointmentMode === 'Follow Up'
                                ? 'Follow up'
                                : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </>
          )}
          <Col md={5} style={{ display: display.appointment }}>
            <div id="dorctor-list" className="doctor-list-new">
              <p style={{ fontSize: 12 }}>
                Your total for this Primary Care visit.
              </p>
              <div id="calendar-list">
                <div id="price-box">

                  {
                    promoCodeApplied ? (
                      <span className="price">
                        $
                        {appointment.appointmentMode === 'First Consultation' ||
                          appointment.appointmentMode === ''
                          ? doctor && discountApplied
                          : appointment.appointmentMode === 'Follow Up'
                            ? doctor && discountApplied
                            : ''}
                      </span>
                    ) : (
                      <span className="price">
                        $
                        {appointment.appointmentMode === 'First Consultation' ||
                          appointment.appointmentMode === ''
                          ? doctor && doctor.rate
                          : appointment.appointmentMode === 'Follow Up'
                            ? doctor && doctor.halfRate
                            : ''}
                      </span>
                    )
                  }

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
                  {getRoleName() === 'patient' ? (
                    <Row>
                      {/* <Col md={1}></Col> */}
                      {/* <Col md={5} style={{ paddingLeft: 0 }}><button type="button" className="btn btn-primary continue-btn" onClick={bookappointment}>Pay by PayPal</button></Col> */}

                      {disable.payment && (
                        <Col md={12} style={{ paddingLeft: 0 }}>
                          {/* PROMO CODE CODE GOES HERE */}
                          {
                            Object.keys(promoCodeObject).length > 0 && (
                              <PromoCodeForPatient
                                onPromoCodeChange={handlePromoCodeStates}
                                promoCodeData={promoCodeObject}
                                mobile={false}
                              />
                            )
                          }


                          <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => {
                              setDisable({ ...disable, payment: false });
                              if (promoCodeEntered === 'HEALTHIERUAE') {
                                handleFreeCouponTransactions();
                                setDisable({ ...disable, payment: true });
                              }

                            }}
                          >
                            Pay Now
                          </button>
                        </Col>
                      )}

                      {!disable.payment && (

                        <Col md={12} style={{ paddingLeft: 0 }}>
                          {/* {console.log({ appointmentId: appointment.id })} */}
                          {/* <Paypal
                            // appointmentId={appointment.id}
                            appointmentMode={appointment.appointmentMode}
                            bookappointment={bookappointment}
                            firstName={props.currentPatient.firstName}
                            // lastName={props.currentPatient.lastName}
                            email={props.currentPatient.email}
                            userId={props.currentPatient.userId}
                            rate={
                              promoCodeApplied === true ? discountApplied : doctor.rate
                            }
                            halfRate={
                              promoCodeApplied === true ? discountApplied : doctor.halfRate
                            }
                          /> */}
                          <PaypalCheckoutButton
                            appointmentMode={appointment.appointmentMode}
                            bookappointment={bookappointment}
                            firstName={props.currentPatient.firstName}
                            email={props.currentPatient.email}
                            userId={props.currentPatient.userId}
                            rate={
                              promoCodeApplied === true ? discountApplied : doctor.rate
                            }
                            halfRate={
                              promoCodeApplied === true ? discountApplied : doctor.halfRate
                            }
                          />
                        </Col>
                      )}
                    </Row>
                  ) : (
                    // <Row>
                    //   <Col md={12} style={{ paddingLeft: 0 }}>
                    //     <button
                    //       className="btn btn-primary"
                    //       style={{ width: '100%' }}
                    //       onClick={(e) => {
                    //         // setDisable({ ...disable, payment: false })
                    //         setNextAppointment();
                    //       }}
                    //     >
                    //       Book Slot
                    //     </button>
                    //   </Col>
                    // </Row>
                    <></>
                  )}
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

            {/* PAYMENT FAILED MODAL */}
            {/* <Dialog
              onClose={() => setPaymentErrorModal(false)}
              aria-labelledby="customized-dialog-title"
              open={paymentErrorModal}
            >
              <DialogTitle id="customized-dialog-title" onClose={() => setPaymentErrorModal(false)}>
                Payment failed. Please try again.
              </DialogTitle>
              <DialogActions>
                <div className='text-center w-100'>
                  <button
                    onClick={() => setPaymentErrorModal(false)}
                    className="btn btn-primary sign-btn"
                    id="close-btn"
                  >
                    OK
                  </button>
                </div>

              </DialogActions>
            </Dialog> */}
          </Col>
        </Row >

        {/* <Tour
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
         */}
        < Tour
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
      </Container >
      {/* <Footer /> */}
    </div >
  );
};

export default MyDoctor;
