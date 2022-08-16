import React, { useState, useEffect, Fragment } from 'react'
import Header from './Header';
import './landing.css';
import { Container, Row, Col } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Loader from '../Loader/Loader';
import TransparentLoader from '../Loader/transparentloader';
import $ from 'jquery';
import { Multiselect } from 'multiselect-react-dropdown';
import Cookies from 'universal-cookie';
import momentTz from 'moment-timezone';
import {
    getCountryList,
    getSpecialityList,
    getLanguageList
} from '../../service/adminbackendservices';
import {
    updateUserAccount,
    updateRolePatient,
    updateRoleDoctor,
    getUpdatedUserData,
    getFcmTokenApi,
} from '../../service/frontendapiservices';
import ImageCropper from './ImageCroper';
import DoctorDocumentUpload from "./doctordocumentupload";
import { getCurrentDoctorInfo } from "../../service/AccountService";
import DatePicker from 'react-date-picker';
import { useHistory } from "react-router";
import { Button } from 'react-bootstrap';
import { deleteTokenHandler, getFirebaseToken, getPermissions } from '../../util';
import { toast } from 'react-toastify';
// import 'react-calendar/dist/Calendar.css';

//import axios from 'axios';
// import Footer from './Footer';
//import properties from "../../properties";
//import LocalStorageService from '../../util/LocalStorageService';
// import CreateIcon from '@material-ui/icons/Create';
// import IconButton from '@material-ui/core/IconButton';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import DeleteIcon from '@material-ui/icons/Delete';
// import TextField from '@material-ui/core/TextField';
//import { checkAccessToken } from '../../service/RefreshTokenService';
// import TimezoneSelect from 'react-timezone-select';


$(document).ready(function () {
    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });
});



const Welcome = ({ currentuserInfo }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [transparentLoading, setTransparentLoading] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState();
    const cookies = new Cookies();
    const currentTimeZone = momentTz.tz.guess();

    const [open, setOpen] = useState(false);
    const [currentUserDataAfterApproval, setCurrentUserDataAfterApproval] = useState({});

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [documentInfo, setDocumentinfo] = useState({})
    const [documentUpdateFile, setDocumentUpdateFile] = useState()
    const [options, Setoption] = useState({
        countryList: []
    });
    const [profilePicture, setProfilePicture] = useState({});

    const { countryList } = options;


    const [speciality, setSpeciality] = useState({
        specialityOptions: []
    });
    const { specialityOptions } = speciality;

    const [language, setLanguage] = useState({
        languageOptions: []
    });
    const { languageOptions } = language;

    const [defaultDate, setDefaultDate] = useState(new Date(moment().format('YYYY-MM-DD')));

    useEffect(() => {
        loadOptions();
        loadSpeciality();
        loadLanguage();
        loadDocuments()
    }, [])
    // useEffect(() => {
    //     loadDocuments();
    // }, [currentDoctor])
    const loadDocuments = async () => {
        const profileStatus = cookies.get("userProfileCompleted");
        if (profileStatus) {
            const currentUserData = async () => {
                const res = await getCurrentDoctorInfo(currentuserInfo.id, currentuserInfo.login);
                if (res) {
                    setCurrentDoctor(res.data);
                    setDisplayDocumentForm(true);
                }
            }

            currentUserData();
        }
    }
    const [educationList, setEducationList] = useState([{ institution: '', educationalQualification: '' }]);
    const [state, setstate] = useState({
        userId: (currentuserInfo && currentuserInfo.id) || "",
        firstName: (currentuserInfo && currentuserInfo.firstName + " " + currentuserInfo.lastName) || "",
        lastName: (currentuserInfo && currentuserInfo.lastName) || "",
        dateOfBirth: "",
        phone: "",
        countryId: "",
        countryName: "",
        gender: "",
        highbp: 0,
        lowbp: 0,
        height: 0,
        weight: 0,
        maritalstatus: "",
        allergies: "",
        email: (currentuserInfo && currentuserInfo.email) || "",
        educationalQualifications: [],
        // institution: "",
        // rate: 0,
        // halfRate: 0,
        // bio: "",
        //modeodemployement: "",
        address: "",
        affiliation: "",
        experience: 0,
        specialities: [],
        languages: [],
        // certificates: "",
        // awards: "",
        modeOfEmployment: "",
        licenseNumber: "",
        referencePhoneNumber: "",
        certifyingBody: ""
        // license: "",
        // refphone: "",
        // certifyingbody: ""

    });

    const [timeZone, setTimezone] = useState("");

    const handleTimezoneChange = (e) => {
        setTimezone(e.value);
    };

    const loadOptions = async () => {
        const res = await getCountryList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data) {
            Setoption({ countryList: res.data.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }
    const loadSpeciality = async () => {
        const res = await getSpecialityList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });

        if (res && res.data) {
            setSpeciality({ specialityOptions: res.data.data })

            setTimeout(() => setLoading(false), 1000);
        }
    }

    const { userId, firstName, lastName = '', phone, countryId, dateOfBirth, maritalstatus, gender, height, weight, highbp, lowbp, allergies, email, specialities, languages, modeodemployement, address, affiliation, certificates, awards, experience, license, refphone, certifyingbody, rate, halfRate, bio, modeOfEmployment, educationalQualifications, countryName, licenseNumber, referencePhoneNumber, certifyingBody } = state;


    const handleSpecialities = (selectedList, selectedItem) => {
        // e.preventDefault()
        specialities.push({ id: selectedItem.id, name: selectedItem.name });
        setSpecialityError(false);
    };

    const handleLanguages = (selectedList, selectedItem) => {
        // e.preventDefault()
        languages.push({ name: selectedItem.name });
        setLanguageError(false);
    };
    const loadLanguage = async () => {
        const res = await getLanguageList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data) {
            setLanguage({ languageOptions: res.data.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const removeSpecialities = (selectedList, removedItem) => {
        var array = specialities;
        var index = array.indexOf(removedItem); // Let's say it's Bob.
        array.splice(index, 1);
        setstate({ ...state, specialities: array });
    }
    const removeLanguages = (selectedList, removedItem) => {
        var array = languages;
        var index = array.indexOf(removedItem); // Let's say it's Bob.
        array.splice(index, 1);
        setstate({ ...state, languages: array });
    }

    const handleInputChange = (e) => {
        e.preventDefault()
        // if (e.target.name === "experience") {
        //     if (e.target.value > 50) {
        //         toast.error("Experience must be between 1 to 50!")
        //     }
        // }

        setstate({ ...state, [e.target.name]: e.target.value });

    };
    const handlePhone = (e) => {
        setstate({ ...state, phone: e });
    };
    const handleRefPhone = (e) => {
        setstate({ ...state, referencePhoneNumber: e });
    };
    const handleCountry = (e) => {
        setstate({ ...state, countryId: e.target.value });
        // setstate({ ...state, countryName: e.target.name });
    };

    const handleDateChange = (e) => {
        // const d = new Date(e);
        // alert(d);
        //const isoDate = d.toISOString();
        // let formattedDate = `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`
        const age = moment().diff(e, 'years')
        if (age >= 18 && age <= 120) {
            setstate({ ...state, dateOfBirth: e });
            setDefaultDate(e);
        }
        else if (age > 120) {
            toast.error("Please enter valid age!")
        }
        else {
            toast.error("Your Age must be 18 or above to process further.")
        }
        // if (age <= 120) {
        //     setstate({ ...state, dateOfBirth: e });
        //     setDefaultDate(e);
        // }
        // else {
        //     toast.error("Please enter valid age!")
        // }

    };
    const getUpdatedCurrentUserData = async () => {
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
            const currentUserInformation = await getUpdatedUserData();
            cookies.set("currentUser", currentUserInformation.data);
            setCurrentUserDataAfterApproval(currentUserInformation.data);
            if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted) {
                // triggerFcmTokenHandler();
                history.push('/patient/questionnaire/new');
            }
        }
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {
            if (documentInfo && documentUpdateFile) {
                const currentUserInformation = await getUpdatedUserData();
                cookies.set("currentUser", currentUserInformation.data);
                cookies.remove("userProfileCompleted");
                setCurrentUserDataAfterApproval(currentUserInformation.data);
                if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted && !currentUserInformation.data.approved) {
                    setTransparentLoading(false);
                    handleClickOpen();
                } else if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted && currentUserInformation.data.approved) {
                    // triggerFcmTokenHandler();
                    history.push('/doctor');
                }
            }
            else {
                toast.error("Please add license/registration number and subsequent documents!")
            }
        }
    }
    const updateCurrentUserData = async () => {
        currentuserInfo.profileCompleted = true;
        const response = await updateUserAccount(currentuserInfo);
        if (response.status === 200 || response.status === 201) {
            if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {
                const currentUserInformation = await getUpdatedUserData();
                cookies.set("userProfileCompleted", true);
                setCurrentUserDataAfterApproval(currentUserInformation.data);
                setDisplayDocumentForm(true);
                setTransparentLoading(false);
                // triggerFcmTokenHandler();
            }
            if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
                getUpdatedCurrentUserData();
                // triggerFcmTokenHandler();
            }
        }
    }

    // handle input change
    const handleEducationDetailsInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...educationList];
        list[index][name] = value;
        setEducationList(list);
        setstate({ ...state, educationalQualifications: list });
    };
    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...educationList];
        list.splice(index, 1);
        setEducationList(list);
    };
    // handle click event of the Add button
    const handleAddClick = () => {
        setEducationList([...educationList, { institution: '', educationalQualification: '' }]);
    };
    const handleDetails = async e => {
        e.preventDefault();

        const patientPayload = {
            userId: userId,
            firstName: firstName,
            lastName: "",
            phone: phone,
            countryId: countryId,
            dateOfBirth: dateOfBirth,
            maritalStatus: maritalstatus,
            gender: gender,
            height: height,
            weight: weight,
            highBp: highbp,
            lowBp: lowbp,
            allergies: allergies,
            email: email,
            address: address,
            languages: languages,
            patientTimeZone: currentTimeZone
        };
        const doctorPayload = {
            // userId: (currentuserInfo && currentuserInfo.id) || "",
            // firstName: (currentuserInfo && currentuserInfo.firstName) || "",
            // lastName: (currentuserInfo && currentuserInfo.lastName) || "",
            phone: phone,
            countryId: countryId,
            // countryName: countryName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            educationalQualifications: educationalQualifications,
            //institution: institution,
            // rate: rate,
            // halfRate: halfRate,
            affiliation: affiliation,
            // bio: bio,
            // licenseNumber: licenseNumber,
            // referencePhoneNumber: referencePhoneNumber,
            // certifyingBody: certifyingBody,
            experience: experience,
            specialities: specialities,
            languages: languages,
            // certificates: certificates,
            modeOfEmployment: modeOfEmployment,
            // awards: awards,
            // email: (currentuserInfo && currentuserInfo.email) || "",
            // address: address,
            languages: languages,
            doctorTimeZone: currentTimeZone,
            licenseNumber: licenseNumber,
            referencePhoneNumber: referencePhoneNumber,
            certifyingBody: certifyingBody
        };

        var bodyFormData = new FormData();
        var bodyFormDataDoctor = new FormData();
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {

            if (languages.length === 0) {
                setLanguageError(true);
            }
            else if (state.phone === "") {
                setPhoneError("This field is required")
            }
            else {
                setTransparentLoading(true);
                bodyFormData.append('profileData', JSON.stringify(patientPayload));
                bodyFormData.append('profilePicture', profilePicture);
                const response = await updateRolePatient(bodyFormData).catch(err => {
                    setTransparentLoading(false);
                    if (err.response.status === 400 && state.phone === "") {
                        setPhoneError(err.response.data.title);
                    }
                    else if (err.response.status === 400 && state.phone !== "") {
                        setFormError(err.response.data.title);

                    }
                });
                if (response && (response.status === 200 || response.status === 201)) {
                    cookies.set("profileDetails", response.data.data, {
                        path: "/"
                    });
                    updateCurrentUserData();
                }
            }
        }
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {

            if (languages.length === 0) {
                setLanguageError(true);
            }
            else if (specialities.length === 0) {
                setSpecialityError(true);
            }
            else {
                setTransparentLoading(true);
                bodyFormDataDoctor.append('profileData', new Blob([JSON.stringify(doctorPayload)], {
                    type: "application/json"
                }));
                const response = await updateRoleDoctor(bodyFormDataDoctor).catch(err => {
                    setTransparentLoading(false);
                    if (err.response.status === 400 && state.phone === "") {
                        setPhoneError(err.response.data.title);
                    }
                    else if (err.response.status === 400 && state.phone !== "") {
                        setFormError(err.response.data.title);

                    }
                    else if (err.response.status === 500 && state.phone === "") {
                        setPhoneError("This field is required")
                    }
                });
                if (response && (response.status === 200 || response.status === 201)) {
                    const res = await getCurrentDoctorInfo(currentuserInfo.id, currentuserInfo.login);
                    if (res) {
                        setCurrentDoctor(res.data);
                        updateCurrentUserData();
                    }
                }
            }
        }
    }
    const now = new Date();
    const newDate = now.setDate(now.getDate() - 1);
    let maxDate
    if (currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {
        maxDate = {
            max: moment(newDate).format("YYYY-MM-DD"),
            min: moment(now).subtract(75, "years").format("YYYY-MM-DD")
        };
    }

    if (currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
        maxDate = {
            max: moment(newDate).format("YYYY-MM-DD"),
            min: moment(now).subtract(100, "years").format("YYYY-MM-DD")
        };
    }

    const [languageError, setLanguageError] = useState(false);
    const [specialityError, setSpecialityError] = useState(false);

    const [uploadOpen, setUploadOpen] = useState(false);

    const handleUploadClose = () => {
        setUploadOpen(false);
    }
    const [phoneError, setPhoneError] = useState();
    const [formError, setFormError] = useState();
    const [displaydocumentForm, setDisplayDocumentForm] = useState(false);
    const logoutLogic = () => {
        cookies.remove("refresh_token", { path: '/' });
        cookies.remove("currentUser", { path: '/' });
        cookies.remove("access_token", { path: '/' });
        cookies.remove("GOOGLE_ACCESS_TOKEN", { path: '/' });
        cookies.remove("GOOGLE_PROFILE_DATA", { path: '/' });
        cookies.remove("authorities", { path: '/' });
        cookies.remove("userProfileCompleted", { path: '/' });
        cookies.remove("profileDetails", { path: '/' });
        // deleteTokenHandler().then(() => {
        //     localStorage.clear();
        //     history.push("/signin");
        //     history.go(0);
        // });
    }

    return (
        <div>
            {loading && (
                <Loader />
            )
            }
            {transparentLoading && (
                <TransparentLoader />
            )}
            <Header />
            <Container style={{ maxWidth: "100%" }}>
                <Row>
                    <Col md={6} id="welcome-bg"></Col>
                    <Col md={6} style={{ background: "#fff", padding: "2%" }}>

                        <div className="sign-box signup-form-helper">
                            <h2 id="welcome-title">
                                Tell Us More About You!
                            </h2>
                            <br />
                            {!displaydocumentForm && (
                                <>
                                    <div>
                                        <Row style={{ justifyContent: 'center', flexDirection: "column" }} >
                                            {currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") &&
                                                <ImageCropper setProfilePicture={setProfilePicture} imageUrl={currentuserInfo.imageUrl} />
                                            }
                                        </Row>

                                        <ValidatorForm onSubmit={handleDetails} onError={(err) => console.log(err)}>

                                            <Row>
                                                <Col md={12}>
                                                    <p>Full Name<sup>*</sup></p>
                                                    <TextValidator id="standard-basic" type="text" name="firstName"
                                                        onChange={e => handleInputChange(e)}
                                                        value={firstName}
                                                        validators={['required']}
                                                        errorMessages={['This field is required']}
                                                        variant="filled"
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    {/* <p>Last Name<sup>*</sup></p> */}
                                                    <TextValidator id="standard-basic" type="text" name="lastName"
                                                        onChange={e => handleInputChange(e)}
                                                        value={lastName ? lastName : ''}
                                                        // validators={['required']}
                                                        // errorMessages={['This field is required']}
                                                        variant="filled"
                                                        disabled
                                                        required
                                                        style={{ display: 'none' }}
                                                    />
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col md={12}>
                                                    <p>Phone Number<sup>*</sup></p>
                                                    <PhoneInput
                                                        inputProps={{
                                                            name: 'phone',
                                                            required: true,
                                                            maxLength: 20,
                                                            minLength: 12
                                                        }}
                                                        country={'us'}
                                                        value={phone}
                                                        onChange={e => handlePhone(e)}
                                                        variant="filled"
                                                        required
                                                    />
                                                    {phoneError && (<span style={{ color: "red", fontSize: "11px" }}>{phoneError}</span>)}
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col md={6}>
                                                    <p>Nationality<sup>*</sup></p>
                                                    <FormControl>
                                                        <Select
                                                            id="demo-controlled-open-select"
                                                            variant="filled"
                                                            name="countryId"
                                                            value={countryId}
                                                            inputProps={{ required: true }}
                                                            displayEmpty
                                                            required
                                                            onChange={e => handleCountry(e)}
                                                        >
                                                            <MenuItem value="">
                                                                Select
                                                            </MenuItem>
                                                            {countryList && countryList.map((option, index) => (
                                                                <MenuItem value={option.id} key={index}>{option.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Col>
                                                <Col md={6}>
                                                    <p>Date of Birth<sup>*</sup></p>

                                                    <DatePicker
                                                        name='dateOfBirth'
                                                        className="fc_quickfixcal"
                                                        calendarClassName='fc_quickfixcalendar'
                                                        clearIcon=""
                                                        value={dateOfBirth}
                                                        onChange={e => handleDateChange(e)}
                                                        format={'y-MM-dd'}
                                                        dayPlaceholder="DD"
                                                        monthPlaceholder="MM"
                                                        yearPlaceholder="YYYY"
                                                        required={true}
                                                        maxDate={new Date()}
                                                    />
                                                </Col>

                                            </Row>
                                            <br />
                                            <Row>


                                                <Col md={6}>
                                                    <p>Gender <sup>*</sup></p>
                                                    <FormControl>
                                                        <Select
                                                            id="demo-controlled-open-select"
                                                            variant="filled"
                                                            name="gender"
                                                            value={gender}
                                                            inputProps={{ required: true }}
                                                            displayEmpty
                                                            required
                                                            onChange={e => handleInputChange(e)}

                                                        >
                                                            <MenuItem value="">
                                                                Select
                                                            </MenuItem>
                                                            <MenuItem value="MALE">
                                                                Male
                                                            </MenuItem>
                                                            <MenuItem value="FEMALE">
                                                                Female
                                                            </MenuItem>
                                                            <MenuItem value="UNKNOWN">
                                                                Other
                                                            </MenuItem>

                                                        </Select>
                                                    </FormControl>

                                                </Col>
                                                <Col md={6}>
                                                    <p>Email</p>
                                                    <TextValidator id="standard-basic" type="text" name="email"
                                                        value={email}
                                                        onChange={e => handleInputChange(e)}
                                                        disabled
                                                        variant="filled" />
                                                </Col>
                                            </Row>
                                            <br />

                                            <Row>

                                                <Col md={12}>
                                                    <p>Languages<sup>*<sup></sup></sup></p>
                                                    <FormControl>
                                                        <div className="multiselect">
                                                            <Multiselect
                                                                options={languageOptions}
                                                                onSelect={handleLanguages}
                                                                onRemove={removeLanguages}
                                                                displayValue="name"
                                                                required
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    {languageError && (
                                                        <p style={{ color: "red" }}>This field is required.</p>
                                                    )}
                                                </Col>
                                            </Row>
                                            <br />
                                            {currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") && (<>
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Allergies<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="text" name="allergies"
                                                            onChange={e => handleInputChange(e)}
                                                            value={allergies}
                                                            variant="filled"
                                                            required
                                                            placeholder="Allergies"
                                                            inputProps={{
                                                                title: "Make it comma (,) separated."
                                                            }} />
                                                    </Col>

                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Marital Status<sup>*</sup></p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="maritalstatus"
                                                                value={maritalstatus}
                                                                displayEmpty
                                                                required
                                                                inputProps={{ required: true }}
                                                                onChange={e => handleInputChange(e)}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="MARRIED">Married</MenuItem>
                                                                <MenuItem value="SINGLE">Single</MenuItem>
                                                                <MenuItem value="DIVORCED">Divorced</MenuItem>
                                                                <MenuItem value="WIDOWED">Widowed</MenuItem>
                                                                <MenuItem value="OTHER">Other</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                    </Col>


                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={6}>
                                                        <p>Height(CM)<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="number" name="height"
                                                            onChange={e => handleInputChange(e)}
                                                            value={height === 0 ? '' : height}
                                                            validators={[
                                                                "required",
                                                                "matchRegexp:(^[0-9]{0,3}(\.[0-9]{1,2})?$)",
                                                            ]}
                                                            errorMessages={['This field is required',
                                                                "Please Enter Valid Height"]}
                                                            variant="filled"
                                                            inputProps={{
                                                                min: 30,
                                                                max: 250,
                                                                step: 0.1,
                                                            }}
                                                            required
                                                            placeholder='Height' />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>Weight(KG)<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="number" name="weight"
                                                            onChange={e => handleInputChange(e)}
                                                            value={weight === 0 ? '' : weight}
                                                            validators={[
                                                                "required",
                                                                "matchRegexp:(^[0-9]{0,3}(\.[0-9]{1,2})?$)",
                                                            ]}
                                                            errorMessages={['This field is required',
                                                                "Please Enter Valid Weight"]}
                                                            variant="filled"
                                                            inputProps={{
                                                                min: 5.0,
                                                                max: 999.0,
                                                                step: 0.1,
                                                            }}
                                                            required
                                                            placeholder='Weight' />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={6}>
                                                        <p>High BP(mmHg)<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="number" name="highbp"
                                                            onChange={e => handleInputChange(e)}
                                                            value={highbp === 0 ? '' : highbp}
                                                            validators={[
                                                                "required",
                                                                "matchRegexp:(^[0-9]{0,3}(\.[0-9]{1,2})?$)",
                                                            ]}
                                                            errorMessages={['This field is required',
                                                                "Please Enter Valid High BP Rate"]}
                                                            variant="filled"
                                                            inputProps={{
                                                                min: 50,
                                                                max: 300,
                                                                step: 0.1,
                                                            }}
                                                            required
                                                            placeholder='High BP' />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>Low BP(mmHg)<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="number" name="lowbp"
                                                            onChange={e => handleInputChange(e)}
                                                            value={lowbp === 0 ? '' : lowbp}
                                                            validators={[
                                                                "required",
                                                                "matchRegexp:(^[0-9]{0,3}(\.[0-9]{1,2})?$)",
                                                            ]}
                                                            errorMessages={['This field is required',
                                                                "Please Enter Valid Low BP Rate"]}
                                                            variant="filled"
                                                            inputProps={{
                                                                min: 50,
                                                                max: 200,
                                                                step: 0.1,
                                                            }}
                                                            required
                                                            placeholder='Low BP' />
                                                    </Col>
                                                </Row>
                                                <br />

                                            </>)}
                                            {currentuserInfo && Object.keys(currentuserInfo).length > 0 && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR") && (<>
                                                {/* <Row> */}
                                                {/* <Col md={12}>
                                                <p>Bio</p>
                                                <TextValidator id="standard-basic" type="text" name="bio"
                                                    onChange={e => handleInputChange(e)}
                                                    value={bio}
                                                    variant="filled"
                                                    placeholder='Bio' />
                                            </Col> */}
                                                {/* </Row> */}

                                                <Row>
                                                    <Col md={6}>
                                                        <p>Years of experience<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="number" name="experience"
                                                            onChange={e => handleInputChange(e)}
                                                            value={experience}
                                                            validators={['required',
                                                                'minNumber:0', 'maxNumber:50']}
                                                            errorMessages={['This field is required', 'Invalid Experience', 'Invalid Experience']}
                                                            variant="filled"
                                                            required
                                                            placeholder='Years of experience' />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>Mode of Employment<sup>*</sup></p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="modeOfEmployment"
                                                                value={modeOfEmployment}
                                                                displayEmpty
                                                                required
                                                                inputProps={{ required: true }}
                                                                onChange={e => handleInputChange(e)}
                                                            >
                                                                <MenuItem value="">Select</MenuItem>
                                                                <MenuItem value="Self - Employed">Self - Employed</MenuItem>
                                                                <MenuItem value="Employed">Employed</MenuItem>

                                                            </Select>
                                                        </FormControl>

                                                    </Col>

                                                    {/* <Col md={4}>
                                                <p>Rate<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="rate"
                                                    onChange={e => handleInputChange(e)}
                                                    value={rate}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    variant="filled"
                                                    placeholder='Rate' />

                                            </Col>
                                            <Col md={4}>
                                                <p>Half Rate<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="halfRate"
                                                    onChange={e => handleInputChange(e)}
                                                    value={halfRate}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    variant="filled"
                                                    placeholder='HalfRate' />

                                            </Col> */}



                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Affiliation<sup>*</sup></p>
                                                        <TextValidator id="standard-basic" type="text" name="affiliation"
                                                            onChange={e => handleInputChange(e)}
                                                            value={affiliation}
                                                            required
                                                            validators={[
                                                                "required",
                                                                "matchRegexp:(^[a-zA-Z ]*$)",
                                                            ]}
                                                            errorMessages={['This field is required',
                                                                "Please Enter Valid Affiliation"
                                                            ]}
                                                            variant="filled"
                                                            placeholder='Affiliation' />


                                                    </Col>
                                                </Row>
                                                <br />

                                                <Row>
                                                    <Col md={12}>
                                                        <p>Specialization<sup>*</sup></p>
                                                        <FormControl>
                                                            <div className="multiselect">
                                                                <Multiselect
                                                                    options={specialityOptions}
                                                                    onSelect={handleSpecialities}
                                                                    onRemove={removeSpecialities}
                                                                    displayValue="name"
                                                                    required
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        {specialityError && (
                                                            <p style={{ color: "red" }}>This field is required.</p>
                                                        )}
                                                    </Col>
                                                </Row>
                                                <br />
                                                {/* <Row>

                                            <Col md={12}>
                                                <p>Address<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="address"
                                                    onChange={e => handleInputChange(e)}
                                                    value={address}
                                                    variant="filled"
                                                    placeholder='Address' />
                                            </Col>
                                        </Row> */}




                                                {/* <Row>
                                            <Col md={6}>
                                                <p>Other Certifications (optional)</p>
                                                <TextValidator id="standard-basic" type="text" name="certificates"
                                                    onChange={e => handleInputChange(e)}
                                                    value={certificates}
                                                    variant="filled"
                                                    placeholder="Example: MBBS, MD ..."
                                                    inputProps={{
                                                        title: "Make it comma (,) separated."
                                                    }} />
                                                <br />
                                            </Col>
                                            <Col md={6}>
                                                <p>Awards (optional)</p>
                                                <TextValidator id="standard-basic" type="text" name="awards"
                                                    onChange={e => handleInputChange(e)}
                                                    value={awards}
                                                    variant="filled"
                                                    placeholder="Example: People's Doctor of the USA, etc ..."
                                                    inputProps={{
                                                        title: "Make it comma (,) separated."
                                                    }} />
                                                <br />

                                            </Col>

                                        </Row>
                                        <br />
                                        <br /> */}
                                                {/* <Row>
                                            <Col md={6}>
                                                <p>License Number<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="licenseNumber"
                                                    onChange={(e) => handleInputChange(e)}
                                                    value={licenseNumber}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    variant="filled"
                                                    placeholder='License Number' />

                                            </Col>
                                            <Col md={6}>
                                                <p>Certifying Body<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="certifyingBody"
                                                    onChange={(e) => handleInputChange(e)}
                                                    value={certifyingBody}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    variant="filled"
                                                    placeholder='Certifying Body' />

                                            </Col>

                                        </Row>
                                        <br />
                                        <Row>
                                            <Col md={12}>
                                                <p>Reference Phone Number<sup>*</sup></p>
                                                <PhoneInput
                                                    inputProps={{
                                                        name: 'referencePhoneNumber',
                                                        required: true,
                                                        maxLength: 20,
                                                        minLength: 12
                                                    }}
                                                    country={'us'}
                                                    value={referencePhoneNumber}
                                                    onChange={e => handleRefPhone(e)}
                                                    variant="filled"
                                                    required
                                                />
                                                {phoneError && (<span style={{ color: "red", fontSize: "11px" }}>{phoneError}</span>)}
                                            </Col>
                                        </Row> */}
                                                <br />
                                                {educationList.map((x, i) => {
                                                    return (
                                                        <div key={i}>


                                                            <Row>
                                                                <Col md={6}>
                                                                    <p>Education<sup>*</sup></p>
                                                                    <TextValidator id="standard-basic" type="text" name="educationalQualification"
                                                                        onChange={(e) => handleEducationDetailsInputChange(e, i)}
                                                                        value={x.educationalQualification}
                                                                        required
                                                                        validators={[
                                                                            "required",
                                                                            "matchRegexp:(^[a-zA-Z ]*$)",
                                                                        ]}
                                                                        errorMessages={['This field is required',
                                                                            "Please Enter Valid Education"
                                                                        ]}
                                                                        variant="filled"
                                                                        placeholder='Education' />

                                                                </Col>

                                                                <Col md={6}>
                                                                    <p>Institution<sup>*</sup></p>
                                                                    <TextValidator id="standard-basic" type="text" name="institution"
                                                                        onChange={(e) => handleEducationDetailsInputChange(e, i)}
                                                                        value={x.institution}
                                                                        required
                                                                        validators={[

                                                                            "required",
                                                                            "matchRegexp:(^[a-zA-Z ]*$)",
                                                                        ]}
                                                                        errorMessages={['This field is required',
                                                                            "Please Enter Valid Institution"
                                                                        ]}
                                                                        variant="filled"
                                                                        placeholder='Institution' />
                                                                </Col>

                                                            </Row>
                                                            <br />
                                                            <div className="btn-box">
                                                                {educationList.length !== 1 && (
                                                                    <Button
                                                                        className="medicineRemoveButton"
                                                                        variant="secondary"
                                                                        onClick={() => handleRemoveClick(i)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                                {educationList.length - 1 === i && (
                                                                    <Button

                                                                        className="medicineButton"
                                                                        variant="primary"
                                                                        onClick={handleAddClick}
                                                                    >
                                                                        Add Education
                                                                    </Button>
                                                                )}


                                                            </div>

                                                        </div>
                                                    );
                                                })}


                                            </>)
                                            }


                                            {formError && (<span style={{ color: "red", fontSize: "12px" }}>{formError}</span>)}
                                            <br />
                                            <small className="left">By providing your mobile number, you give us permission to contact you via text. View terms.</small>
                                            {currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") &&
                                                <button className="btn btn-primary continue-btn" type="submit">Continue</button>
                                            }

                                            {currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR") &&
                                                <button className="btn btn-primary continue-btn" type="submit">Continue</button>

                                            }
                                        </ValidatorForm>
                                    </div>
                                </>
                            )}
                            {displaydocumentForm && (<>

                                <DoctorDocumentUpload isDoctor={true} currentDoctor={currentDoctor} setDocumentinfo={setDocumentinfo}
                                    setDocumentUpdateFile={setDocumentUpdateFile} />
                                <br />
                                <button className="btn btn-primary continue-btn" onClick={() => getUpdatedCurrentUserData()}>Continue</button>
                            </>)}

                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    Profile Completed!
                </DialogTitle>
                <DialogContent dividers>
                    <>
                        {currentuserInfo && Object.keys(currentuserInfo).length > 0 && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") &&
                            (<Typography gutterBottom>
                                You have successfully complete your profile details. Please click Ok to proceed.
                            </Typography>
                            )}
                        {currentuserInfo && Object.keys(currentuserInfo).length > 0 && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR") &&
                            (<Typography gutterBottom>
                                You have successfully complete your profile details.But admin approval is pending for account activation.
                                Please contact the administrator.
                            </Typography>
                            )}
                    </>
                    {/* <Typography gutterBottom>
                        You have successfully complete your profile details.
          </Typography> */}
                </DialogContent>
                <DialogActions>
                    <>
                        {currentUserDataAfterApproval && Object.keys(currentUserDataAfterApproval).length > 0
                            && currentUserDataAfterApproval.authorities.some((user) => user === "ROLE_PATIENT")
                            && currentUserDataAfterApproval.profileCompleted &&
                            (<Link to="/patient/questionnaire/new"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                Ok
                            </button></Link>
                            )}
                        {currentUserDataAfterApproval && Object.keys(currentUserDataAfterApproval).length > 0
                            && currentUserDataAfterApproval.authorities.some((user) => user === "ROLE_DOCTOR")
                            && currentUserDataAfterApproval.profileCompleted && !currentUserDataAfterApproval.approved &&
                            (
                                <div onClick={() => logoutLogic()}>
                                    <Link to="/doctor/logout"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                        Ok
                                    </button></Link>
                                </div>

                            )}
                        {currentUserDataAfterApproval && Object.keys(currentUserDataAfterApproval).length > 0
                            && currentUserDataAfterApproval.authorities.some((user) => user === "ROLE_DOCTOR")
                            && currentUserDataAfterApproval.profileCompleted && currentUserDataAfterApproval.approved &&
                            (
                                <div onClick={() => logoutLogic()}>
                                    <Link to="/doctor"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                        Ok
                                    </button></Link>
                                </div>

                            )}
                    </>

                </DialogActions>
            </Dialog>

        </div >
    )
};
export default Welcome
