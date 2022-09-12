import React, { useState, useEffect, useRef } from 'react';
//import Footer from "./Footer";
import { getAppointmentMode, getAppointmentModeToDisplayAsLabel } from '../../../util/appointmentModeUtil';
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
import LocalStorageService from '../../../util/LocalStorageService';
import Cookies from 'universal-cookie';
import Loader from '../../Loader/Loader';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Avatar from 'react-avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paypal from '../../CommonModule/Paypal';
import TransparentLoader from '../../Loader/transparentloader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import SearchIcon from "@material-ui/icons/Search";
import {
    getLoggedInUserDataByUserId,
    getLikedDoctorByPatientId,
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
    getNonPaginatedDoctorListByPatientId,
    getAvailableSlotTimings,
} from '../../../service/frontendapiservices';
import {
    getSpecialityList,
    getCountryList,
    getLanguageList,
} from '../../../service/adminbackendservices';
import '../patient.css';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Tour from 'reactour';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { searchFilterForDoctor } from '../../../service/searchfilter';
import { doctorListLimitNonPaginated } from '../../../util/configurations';
import { getAppointmentModeForAvailabilitySlotsDisplay } from '../../../util/appointmentModeUtil';
// import Footer from "./Footer";
// import SearchIcon from "@material-ui/icons/Search";

const RescheduleAppointment = (props) => {
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
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableSlotsDisplay, setAvailableSlotsDisplay] = useState([]);

    const [finalAppointmentData, setFinalAppointmentData] = useState([]);
    const { remarks, urgency } = appointment;
    const [currentDate, setCurrentDate] = useState(new Date());

    const currentLoggedInUser = cookies.get('currentUser');
    const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
    const profilepID = cookies.get('profileDetails');
    // console.log("profileDetails", profilepID);
    const pID = profilepID && profilepID.userId;
    // console.log("currentUser", loggedInUserId);
    // console.log("pID", pID);
    // const stateData = props.location.state;
    const [nextAppDetails, setNextAppDetails] = useState(null);
    const getCurrentPatient = async () => {
        if (profilepID.activated) {
            setNextAppDetails(props.location.state);
            const patientInfo = props.location.state;
            console.log('stateData', patientInfo);
            if (patientInfo) {
                setCurrentPatient({ ...currentPatient, id: patientInfo.patient.id });
                loadUsers(patientInfo.patient.id);
            }
        } else {
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
        }
    };


    const [offset, setOffset] = useState(0);
    const [likedOffset, setLikedOffset] = useState(0);

    let doctorIdForReschedule = sessionStorage.getItem('doctorId');
    // console.log({ doctorIdForReschedule });

    const loadUsers = async (patientId) => {
        if (!profilepID.activated) {
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
                setOffset(1);
                setUser(result.data.doctors);
                const selectedDoctorForReschedule = result.data.doctors.map((value) => {
                    if (value.id == doctorIdForReschedule) {
                        // console.log({ value: value });
                        setdoctor(value);
                    }
                });
                console.log('result', result.data.doctors);
                // setdoctor(selectedDoctorForReschedule);
                //const currentSelectedDate = new Date();
                //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
                const docId = result.data.doctors[0]?.id;
                setAppointment({
                    ...appointment,
                    patientId: patientId,
                    doctorId: docId,
                });
                //getInValidAppointments(docId);
                setFilterData(result.data.doctors);
                //setTimeout(() => searchNutritionDoctor(), 3000);
                setTimeout(() => setLoading(false), 1000);
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
                    //getInValidAppointments(docId);
                    history.replace({ state: null });
                }
                setTransparentLoading(false);
            } else {
                setTimeout(() => setLoading(false), 1000);
            }
            // loadMore();
        } else {
            setOffset(10);
            const doctorInfo = profilepID;
            console.log('doctorInfo', doctorInfo);
            setUser(doctorInfo.id);
            setdoctor(doctorInfo.id);
            //const currentSelectedDate = new Date();
            //onDaySelect(currentSelectedDate, result.data.doctors[0] && result.data.doctors[0].id);
            const docId = doctorInfo.id?.id;
            setAppointment({ ...appointment, patientId: patientId, doctorId: docId });
            //getInValidAppointments(docId);
            setFilterData(doctorInfo);
            //setTimeout(() => searchNutritionDoctor(), 3000);
            setTimeout(() => setLoading(false), 1000);
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
                //getInValidAppointments(docId);
                history.replace({ state: null });
            }
            setTransparentLoading(false);
            // loadMore();

            // } else {
            //   setTimeout(() => setLoading(false), 1000);
            // }
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


        // //console.log("dataForSelectedDay :::  ", dataForSelectedDay);
        // const response = await getFilteredAppointmentData(dataForSelectedDay);
        // // //console.log(response.status);
        // if (response.status === 200 || response.status === 201) {
        //     console.log(response.data, 'in response');
        //     const arraySlot = [];
        //     response.data &&
        //         response.data.map((value) => {
        //             if (
        //                 new Date(value.startTime) >=
        //                 new Date(moment(new Date()).subtract(25, 'minutes'))
        //             ) {
        //                 arraySlot.push(value);
        //             } else {
        //                 arraySlot.push(value);
        //             }
        //         });
        //     setAvailability(arraySlot);
        //     setDisplayCalendar(true);
        //     setDisplaySlot(false);
        //     setTransparentLoading(false);
        //     if (appointment.appointmentMode) {
        //         if (appointment.appointmentMode === 'First Consultation') {
        //             const consultationSlots = createConsultationSlots(arraySlot);
        //             //console.log("consultationSlots :: ", consultationSlots);
        //             if (consultationSlots && consultationSlots.length > 0) {
        //                 setAppointmentSlot(consultationSlots);
        //                 document.querySelector('#calendar-list').scrollTo(0, 500);
        //                 setDisplayCalendar(false);
        //                 setDisplaySlot(true);
        //             } else {
        //                 setAppointmentSlot([]);
        //                 setDisplayCalendar(false);
        //                 setDisplaySlot(true);
        //             }
        //         } else if (appointment.appointmentMode === 'Follow Up') {
        //             setAppointmentSlot(arraySlot);
        //             document.querySelector('#calendar-list').scrollTo(0, 500);
        //             setDisplayCalendar(false);
        //             setDisplaySlot(true);
        //         }
        //     } else {
        //         setIsAppointmentTourOpen(true);
        //     }
        // }
    };
    const [disabledDates, setDisabledDates] = useState([]);



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

    let params = useParams();




    const oldAppointmentID = params.id;

    useEffect(() => {
    }, [oldAppointmentID]);

    const bookappointment = async (orderData) => {
        setLoading(true);
        let oldAppID = 0;
        oldAppID = params.id;
        // setOldAppointmentID(params.id);
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
        const rescheduleAppointmentApiHeader = {
            method: 'post',
            mode: 'no-cors',
            data: rescheduleData,
            url: `/api/v2/appointment/patient/reschedule/${oldAppointmentID}`,
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
    //for payment waiting modal


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
        cookies.set('tour', false, { path: '/' });
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

    if (isTourOpen || isAppointmentTourOpen) {
        document.body.style.color = '#00000080';
    } else {
        document.body.style.color = 'unset';
    }

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
            ...filterValues,
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
            ...selectedFilter,
            selectedSpeciality: [],
            selectedLanguage: [],
        });
        setdoctor(users[0]);
        setTransparentLoading(false);
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

    const handleFilter = async () => {
        setTransparentLoading(true);
        setFilter(false);
        const availabilityFilter = getAvalabilityTime();
        const splitStr = availabilityFilter?.split(',');
        const startTime = splitStr[0];
        const endTime = splitStr[1];
        if (
            genderFilter === '' &&
            feesFilter[0] === 0 &&
            feesFilter[1] === 1000 &&
            countryFilter === '' &&
            docStartTime === '' &&
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
                    //getInValidAppointments(docId);
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
    const setNextAppointment = async () => {
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
                    unifiedAppointment: a.id + '#' + 'Follow Up',
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
            if (err.res.status === 500 || err.res.status === 504) {
                setLoading(false);
            }
        });
        if (res) {
            toast.success('Next Appointment is Set Successfully.');
            props.history.push({ pathname: `/doctor/my-appointments` });
        }
    };

    // AVAILABLE SLOTS OF A DOCTOR
    const [enableDates, setEnableDates] = useState([]);
    const [rescheduleMode, setRescheduleMode] = useState('');
    const getAvailableSlotsOfDoctors = async (id, type) => {
        const state = params.type;
        setRescheduleMode(state);
        if (id) {
            const response = await getAvailableSlotsForMyDoctors(
                id,
                type
            ).catch((err) => console.log({ err }));
            // console.log({ response })
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

                    {!profilepID.activated ? (
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
                    ) : (
                        <Col md={6} lg={8} style={{ display: display.doctor }}>
                            <div id="dorctor-list" className="doctor-list-new ml-1">
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
                                                                                    Slots Available: {slot.count}
                                                                                </span>
                                                                                <span>Date: {slot.date}</span>
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
                    )}
                    {!profilepID.activated ? (
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
                    ) : (
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
                                                    minDate={new Date()} //to disable past days
                                                    maxDate={
                                                        new Date(
                                                            new Date().setDate(new Date().getDate() + 180)
                                                        )
                                                    } // next 3week condition
                                                    // Temporarily commented to enable calendar click functionality for appointment.
                                                    tileDisabled={({ activeStartDate, date, view }) =>
                                                        // activeStartDate.getDate() === date.getDate() &&
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
                                                    {moment(currentDate).format('DD, MMMY YYYY')}
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
                                                                    {moment(current.startTime).format('hh:mm A')}{' '}
                                                                    {/* - {moment(current.endTime).format('hh:mm A')}{' '} */}
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
                    {!profilepID.activated ? (
                        <Col md={7} style={{ display: display.appointment }}>
                            <div id="dorctor-list" className="doctor-list-new">
                                <IconButton
                                    style={{ background: '#F6CEB4', color: '#00d0cc', margin: 'auto 10px' }}
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
                                                <b> Nationality:</b> {doctor.countryName}
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
                                                    <b> Nationality:</b> {doctor.countryName}
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
                        </>
                    )}
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
                                    {/* <Row>
                    <Col
                      md={12}
                      style={{ display: 'flex', alignItems: 'flex-end' }}
                    >
                      <p style={{ fontSize: 9, marginBottom: 0 }}>
                        You can cancel your appointment before 2 days or else it
                        will be deducted
                        <br />
                      </p>
                    </Col>
                  </Row> */}

                                    {/* <Row>
                    <Col
                      md={12}
                      style={{ display: 'flex', alignItems: 'flex-end' }}
                    >
                      <p style={{ fontSize: 9, marginBottom: 0 }}>
                        Appointment is 95% reimbursed if cancelled 24h before
                        the start time.
                      </p>
                    </Col>
                  </Row>
                  <br /> */}
                                    {!profilepID.activated ? (
                                        <Row>

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
                                        </Row>
                                    ) : (
                                        <Row>
                                            <Col md={12} style={{ paddingLeft: 0 }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ width: '100%' }}
                                                    onClick={(e) => {
                                                        setNextAppointment();
                                                    }}
                                                >
                                                    Book Slot
                                                </button>
                                            </Col>
                                        </Row>
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
                    </Col>
                </Row>

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
        </div>
    );
};

export default RescheduleAppointment;
