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
} from '../../service/frontendapiservices';
import ImageCropper from './ImageCroper';
import DoctorDocumentUpload from "./doctordocumentupload";
import { getCurrentDoctorInfo } from "../../service/AccountService";
import { firestoreService } from "../../util";
import DatePicker from 'react-date-picker';
import { useHistory } from "react-router";

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

    const [options, Setoption] = useState({
        countryList: []
    });
    const [maritalstatusoptions, Setmaritalstatusoption] = useState({
        maritalstatusList: [
            { label: "Married", value: 1 },
            { label: "Widowed", value: 2 },
            { label: "Separated", value: 3 },
            { label: "Divorced", value: 4 },
            { label: "Single", value: 5 },
        ]
    });
    const [profilePicture, setProfilePicture] = useState({});

    const { countryList } = options;
    const maritalstatusList = maritalstatusoptions

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
        loadmaritalstatusOptions();
        // loadSpeciality();
        // loadLanguage();
        const profileStatus = cookies.get("userProfileCompleted");
        if (profileStatus) {
            async function currentUserData() {
                const res = await getCurrentDoctorInfo(currentuserInfo.id, currentuserInfo.login);
                if (res) {
                    setCurrentDoctor(res);
                    setDisplayDocumentForm(true);
                }
            }
            currentUserData();
        }
    }, [])

    const [state, setstate] = useState({
        userId: (currentuserInfo && currentuserInfo.id) || "",
        fullname: (currentuserInfo && currentuserInfo.fullname) || "",
        phone: "",
        countryId: "",
        dateOfBirth: "",
        maritalstatusId: "",
        gender: "",
        height: "",
        weight: "",
        highbp: "",
        lowbp: "",
        allergies: ""
    });

    //const [timeZone, setTimezone] = useState("");

    //const handleTimezoneChange = (e) => {
    //    setTimezone(e.value);
    //};

    const loadOptions = async () => {
        const res = await getCountryList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data) {
            Setoption({ countryList: res.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const loadmaritalstatusOptions = async () => {
        // const res = await getMaritalstatusList().catch(err => {
        //     if (err.response.status === 500 || err.response.status === 504) {
        //         setLoading(false);
        //     }
        // });
       
            Setmaritalstatusoption({ maritalstatusList })
            setTimeout(() => setLoading(false), 1000);
        
    }
    const loadSpeciality = async () => {
        const res = await getSpecialityList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data) {
            setSpeciality({ specialityOptions: res.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const { userId, fullname, phone, countryId, dateOfBirth, maritalstatusId, gender, height, weight, highbp, lowbp, allergies } = state;


    // const handleSpecialities = (selectedList, selectedItem) => {
    //     // e.preventDefault()
    //     specialities.push({ id: selectedItem.id });
    //     setSpecialityError(false);
    // };
    // const handleLanguages = (selectedList, selectedItem) => {
    //     // e.preventDefault()
    //     languages.push({ name: selectedItem.name });
    //     setLanguageError(false);
    // };
    // const loadLanguage = async () => {
    //     const res = await getLanguageList().catch(err => {
    //         if (err.response.status === 500 || err.response.status === 504) {
    //             setLoading(false);
    //         }
    //     });
    //     if (res && res.data) {
    //         setLanguage({ languageOptions: res.data })
    //         setTimeout(() => setLoading(false), 1000);
    //     }
    // }

    // const removeSpecialities = (selectedList, removedItem) => {
    //     var array = specialities;
    //     var index = array.indexOf(removedItem); // Let's say it's Bob.
    //     array.splice(index, 1);
    //     setstate({ ...state, specialities: array });
    // }
    // const removeLanguages = (selectedList, removedItem) => {
    //     var array = languages;
    //     var index = array.indexOf(removedItem); // Let's say it's Bob.
    //     array.splice(index, 1);
    //     setstate({ ...state, languages: array });
    // }

    const handleInputChange = (e) => {
        e.preventDefault()
        setstate({ ...state, [e.target.name]: e.target.value });
    };

    const handlePhone = (e) => {
        setstate({ ...state, phone: e });
    };
    const handleCountry = (e) => {
        setstate({ ...state, countryId: e.target.value });
    };
    const handleMaritalStatus = (e) => {
        setstate({ ...state, maritalstatusId: e.target.value });
    }
    const handleDateChange = (e) => {
        // const d = new Date(e);
        // alert(d);
        //const isoDate = d.toISOString();
        // let formattedDate = `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`
        setstate({ ...state, dateOfBirth: e });
        setDefaultDate(e);

        // console.log("defaultDate", defaultDate);
    };
    const getUpdatedCurrentUserData = async () => {
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
            const currentUserInformation = await getUpdatedUserData();
            cookies.set("currentUser", currentUserInformation.data);
            setCurrentUserDataAfterApproval(currentUserInformation.data);
            if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted) {
                history.push('/patient/questionnaire/view');
            }
        }
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {
            const currentUserInformation = await getUpdatedUserData();
            cookies.set("currentUser", currentUserInformation.data);
            cookies.remove("userProfileCompleted");
            if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted && !currentUserInformation.data.approved) {
                setTransparentLoading(false);
                handleClickOpen();
            } else if (currentUserInformation && currentUserInformation.data && currentUserInformation.data.profileCompleted && currentUserInformation.data.approved) {
                history.push('/doctor');
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
            }
            if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
                getUpdatedCurrentUserData();
            }
        }
    }

    const handleDetails = async e => {
        e.preventDefault();
        const patientPayload = {
            userId: userId,
            fullname: fullname,
            phone: phone,
            countryId: countryId,
            dateOfBirth: dateOfBirth,
            maritalstatusId: maritalstatusId,
            gender: gender,
            height: height,
            weight: weight,
            highbp: highbp,
            lowbp: lowbp,
            allergies: allergies,
            patientTimeZone: currentTimeZone
        };
        var bodyFormData = new FormData();
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT")) {
            // if (languages.length === 0) {
            //      setLanguageError(true);
            // }

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
                const { email, firebasePwd } = response.data;
                firestoreService.createNewUser(email, firebasePwd)
                    .then((userRecord) => {
                        var loginUser = userRecord.userd;
                        console.log('user Created', loginUser.email, loginUser.uid)
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log('user Created failed', errorCode, errorMessage)
                    });
                updateCurrentUserData();
            }

        }
        if (currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR")) {
            // if (languages.length === 0) {
            //     setLanguageError(true);
            // }
            // else if (specialities.length === 0) {
            //     setSpecialityError(true);
            // }

            setTransparentLoading(true);
            state.doctorTimeZone = currentTimeZone
            bodyFormData.append('profileData', JSON.stringify(state));
            const response = await updateRoleDoctor(bodyFormData).catch(err => {
                setTransparentLoading(false);
                if (err.response.status === 400 && state.phone === "") {
                    setPhoneError(err.response.data.title);
                }
                else if (err.response.status === 400 && state.phone !== "") {
                    setFormError(err.response.data.title);
                }
            });
            if (response && (response.status === 200 || response.status === 201)) {
                //updateCurrentUserData();
                const { email, firebasePwd } = response.data;
                firestoreService.createNewUser(email, firebasePwd)
                    .then((userRecord) => {
                        var loginUser = userRecord.userd;
                        console.log('user Created', loginUser.email, loginUser.uid);

                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log('user Created failed', errorCode, errorMessage)
                    });
                const res = await getCurrentDoctorInfo(currentuserInfo.id, currentuserInfo.login);
                if (res) {
                    setCurrentDoctor(res);
                    updateCurrentUserData();
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

    // const [languageError, setLanguageError] = useState(false);
    // const [specialityError, setSpecialityError] = useState(false);

    // const [uploadOpen, setUploadOpen] = useState(false);

    // const handleUploadClose = () => {
    //     setUploadOpen(false);
    // }

    const [phoneError, setPhoneError] = useState();
    const [formError, setFormError] = useState();
    const [displaydocumentForm, setDisplayDocumentForm] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState();

    console.log("currentUserInfo ::", currentuserInfo);

    return (
        <div>
            {loading && (
                <Loader />
            )}
            {transparentLoading && (
                <TransparentLoader />
            )}
            <Header />
            <Container style={{ maxWidth: "100%" }}>
                <Row>
                    <Col md={6} id="welcome-bg"></Col>
                    <Col md={6} style={{ background: "#fff", padding: "5%" }}>

                        <div className="sign-box">
                            <h2 id="welcome-title">
                                Tell Us More About You!
                            </h2>
                            <br />
                            {!displaydocumentForm && (
                                <ValidatorForm onSubmit={handleDetails} onError={(err) => console.log(err)}>
                                    <Row style={{ justifyContent: 'center', flexDirection: "column" }} >
                                        {currentuserInfo && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") &&
                                            <ImageCropper setProfilePicture={setProfilePicture} imageUrl={currentuserInfo.imageUrl} />
                                        }
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <p>Full Name<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="fullName"
                                                onChange={e => handleInputChange(e)}
                                                value={fullname}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                        {/* <Col md={6}>
                                            <p>Last Name<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="lastName"
                                                onChange={e => handleInputChange(e)}
                                                value={lastName}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col> */}
                                    </Row><br />
                                    <Row>
                                        <Col md={6}>
                                            <p>Mobile Number<sup>*</sup></p>
                                            <PhoneInput
                                                inputProps={{
                                                    name: 'phone',
                                                    required: true,
                                                    maxLength: 16,
                                                    minLength: 12
                                                }}
                                                country={'us'}
                                                value={phone}
                                                onChange={e => handlePhone(e)}
                                                variant="filled"
                                            />
                                            {phoneError && (<span style={{ color: "red", fontSize: "11px" }}>{phoneError}</span>)}
                                        </Col>
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
                                                    onChange={e => handleCountry(e)}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {countryList && countryList.map((option, index) => (
                                                        <MenuItem value={option.id} key={index}>{option.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Col>


                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md={12}>
                                            {console.log("wqfqwfqwfqwfqwff", dateOfBirth)}
                                            <p>Date of Birth<sup>*</sup></p>
                                            <DatePicker
                                                name='dateOfBirth'
                                                className="fc_quickfixcal"
                                                calendarClassName='fc_quickfixcalendar'
                                                // value={new Date()}
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
                                            {/* <TextValidator
                                                id="standard-basic"
                                                type="date"
                                                name="dateOfBirth"
                                                inputProps={maxDate}
                                                InputLabelProps={{ shrink: true, }}
                                                variant="filled"
                                                value={dateOfBirth ? moment(dateOfBirth).format("YYYY-MM-DD") : moment(defaultDate).format("YYYY-MM-DD")}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                onChange={e => handleDateChange(e)}
                                                onKeyDown={(e) => handleDateChange(e)}
                                            /> */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <p>Marital Status<sup>*</sup></p>
                                            <FormControl>
                                                <Select
                                                    id="demo-controlled-open-select"
                                                    variant="filled"
                                                    name="maritalstataus"
                                                    value={maritalstatusId}
                                                    inputProps={{ required: true }}
                                                    displayEmpty
                                                    onChange={e => handleMaritalStatus(e)}
                                                    options={maritalstatusList}
                                                >


                                                </Select>
                                            </FormControl>
                                        </Col>
                                        <Col md={6}>
                                            <p>Gender <sup>*</sup></p>
                                            <FormControl component="fieldset">
                                                <RadioGroup id="gender-radio" aria-label="gender" name="gender"
                                                    variant="filled" onChange={e => handleInputChange(e)} value={gender}>
                                                    <FormControlLabel value="FEMALE" control={<Radio color="primary" inputProps={{ required: true }} />} label="Female" />
                                                    <FormControlLabel value="MALE" control={<Radio color="primary" inputProps={{ required: true }} />} label="Male" />
                                                    {/* <FormControlLabel value="UNKNOWN" control={<Radio color="primary" />} label="Other" /> */}
                                                </RadioGroup>
                                            </FormControl>
                                        </Col>

                                    </Row>
                                    <br />
                                    {/* {currentuserInfo && Object.keys(currentuserInfo).length > 0 && currentuserInfo.authorities.some((user) => user === "ROLE_PATIENT") && (<>
                                        <Row>
                                            <Col md={12}>
                                                <p>Languages <sup>*</sup></p>
                                                <FormControl>
                                                    <div className="multiselect">
                                                        <Multiselect
                                                            options={languageOptions}
                                                            onSelect={handleLanguages}
                                                            onRemove={removeLanguages}
                                                            displayValue="name"
                                                        />
                                                    </div>
                                                </FormControl>
                                                {languageError && (
                                                    <p style={{ color: "red" }}>This field is required.</p>
                                                )}
                                            </Col>
                                        </Row>
                                    </>)} */}
                                    {/* {currentuserInfo && Object.keys(currentuserInfo).length > 0 && currentuserInfo.authorities.some((user) => user === "ROLE_DOCTOR") && (<>
                                        <Row> */}
                                    {/* <Col md={6}>
                                            <p>Current Timezone</p>
                                            <TimezoneSelect
                                                className="timezoneInput"
                                                value={timeZone}
                                                required={true}
                                                onChange={handleTimezoneChange}
                                            />
                                        </Col> */}
                                    {/* <Col md={12}>
                                                <p>Languages<sup>*<sup></sup></sup></p>
                                                <FormControl>
                                                    <div className="multiselect">
                                                        <Multiselect
                                                            options={languageOptions}
                                                            onSelect={handleLanguages}
                                                            onRemove={removeLanguages}
                                                            displayValue="name"
                                                        />
                                                    </div>
                                                </FormControl>
                                                {languageError && (
                                                    <p style={{ color: "red" }}>This field is required.</p>
                                                )}
                                            </Col>
                                        </Row>
                                        <br /> */}

                                    {/* <Row>
                                            <Col md={6}>
                                                <p>Education<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="text" name="education"
                                                    onChange={e => handleInputChange(e)}
                                                    value={education}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    variant="filled" />

                                            </Col>
                                            <Col md={6}>
                                                <p>Years Of experience<sup>*</sup></p>
                                                <TextValidator id="standard-basic" type="number" name="experience"
                                                    onChange={e => handleInputChange(e)}
                                                    value={experience}
                                                    validators={['required']}
                                                    errorMessages={['This field is required']}
                                                    inputProps={{
                                                        min: 0,
                                                        max: 65
                                                    }}
                                                    variant="filled" />
                                            </Col>
                                        </Row>
                                        <br /> */}

                                    {/* <p>Specialization<sup>*</sup></p>
                                        <FormControl>
                                            <div className="multiselect">
                                                <Multiselect
                                                    options={specialityOptions}
                                                    onSelect={handleSpecialities}
                                                    onRemove={removeSpecialities}
                                                    displayValue="name"
                                                />
                                            </div>
                                        </FormControl>
                                        {specialityError && (
                                            <p style={{ color: "red" }}>This field is required.</p>
                                        )}
                                        <br />
                                        <br />

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
                                    </>)} */}
                                    <Row>
                                        <Col md={6}>
                                            <p>Height(CM)<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="height"
                                                onChange={e => handleInputChange(e)}
                                                value={height}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                        <Col md={6}>
                                            <p>Weight(KG)<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="weight"
                                                onChange={e => handleInputChange(e)}
                                                value={weight}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <p>High BP(mmHg)<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="highbp"
                                                onChange={e => handleInputChange(e)}
                                                value={highbp}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                        <Col md={6}>
                                            <p>Low BP(mmHg)<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="lowbp"
                                                onChange={e => handleInputChange(e)}
                                                value={lowbp}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <p>Allergies<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="allergies"
                                                onChange={e => handleInputChange(e)}
                                                value={allergies}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>

                                    </Row>
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
                            )}
                            {displaydocumentForm && (<>
                                <DoctorDocumentUpload isDoctor={true} currentDoctor={currentDoctor} />
                                <br />
                                <button className="btn btn-primary continue-btn" onClick={() => getUpdatedCurrentUserData()}>Proceed</button>
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
                            (<Link to="/patient/questionnaire/view"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                Ok
                            </button></Link>
                            )}
                        {currentUserDataAfterApproval && Object.keys(currentUserDataAfterApproval).length > 0
                            && currentUserDataAfterApproval.authorities.some((user) => user === "ROLE_DOCTOR")
                            && currentUserDataAfterApproval.profileCompleted && !currentUserDataAfterApproval.approved &&
                            (<Link to="/doctor/logout"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                Ok
                            </button></Link>
                            )}
                        {currentUserDataAfterApproval && Object.keys(currentUserDataAfterApproval).length > 0
                            && currentUserDataAfterApproval.authorities.some((user) => user === "ROLE_DOCTOR")
                            && currentUserDataAfterApproval.profileCompleted && currentUserDataAfterApproval.approved &&
                            (<Link to="/doctor"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                                Ok
                            </button></Link>
                            )}
                    </>

                </DialogActions>
            </Dialog>

        </div >
    )
};
export default Welcome
