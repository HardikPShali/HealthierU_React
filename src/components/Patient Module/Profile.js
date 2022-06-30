import React, { useState, useEffect } from "react";
import "./patient.css";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import Cookies from "universal-cookie";
import Loader from "./../Loader/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Select from "@material-ui/core/Select";
import { Multiselect } from "multiselect-react-dropdown";
import moment from "moment";
import $ from "jquery";
import ImageCropper from "../CommonModule/ImageCroper";
import {
    getCountryList,
    getLanguageList,
} from "../../service/adminbackendservices";
import {
    getLoggedInUserDataByUserId,
    updatePatientData,
} from "../../service/frontendapiservices";
import TransparentLoader from "../Loader/transparentloader";
import { useHistory } from "react-router-dom";
import callIcon from "../../../src/images/svg/call-icon.svg";
import calendarIcon from "../../../src/images/svg/calender-beige.svg";
import ringIcon from "../../../src/images/svg/marital-status-icon.svg";
import flagIcon from "../../../src/images/svg/nationality-icon.svg";
import languageIcon from "../../../src/images/svg/language-icon.svg";
import bloodGroupIcon from "../../../src/images/svg/blood-group-icon.svg";
import heightIcon from "../../../src/images/svg/height-icon.svg";
import weightIcon from "../../../src/images/svg/weight-icon.svg";
import bloodPressureIcon from "../../../src/images/svg/blood-pressure-icon.svg";

import "./profile/profile.css";
import ProfileRow from "../CommonModule/Profile/ProfileRow/ProfileRow";
import ProfileImage from "../CommonModule/Profile/ProfileImage/ProfileImage";

//import { checkAccessToken } from '../../service/RefreshTokenService';
// import LocalStorageService from './../../util/LocalStorageService';
// import axios from "axios";
// import Footer from './Footer';

$(document).ready(function () {
    $(".upload-button").on("click", function () {
        $(".file-upload").trigger("click");
    });
});
const Profile = () => {
    const history = useHistory();
    const cookies = new Cookies();
    const [currentPatient, setCurrentPatient] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        countryId: "",
        gender: "",
        email: "",
        languages: [],
        maritalStatus: null,
        highBp: "",
        lowBp: "",
        height: "",
        weight: "",
        bloodGroup: "",
        address: "",
        picture: "",
    });

    const [loading, setLoading] = useState(true);
    const [transparentLoading, setTransparentLoading] = useState(false);

    const [language, setLanguage] = useState({
        languageOptions: [],
    });
    const { languageOptions } = language;

    const [options, Setoption] = useState({
        countryList: [],
    });

    const { countryList } = options;

    const [profilePicture, setProfilePicture] = useState({});

    const {
        firstName,
        lastName,
        dateOfBirth,
        phone,
        countryId,
        bloodGroup,
        gender,
        languages,
        highBp,
        height,
        weight,
        maritalStatus,
        lowBp,
        address,
    } = currentPatient;

    const [toggleProfile, setToggleProfile] = useState({
        profile: false,
        editProfile: false,
    });

    useEffect(() => {
        getCurrentPatient();
        loadOptions();
        loadLanguage();
    }, []);

    const currentLoggedInUser = cookies.get("currentUser");
    const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
    const getCurrentPatient = async () => {
        const res = await getLoggedInUserDataByUserId(loggedInUserId).catch(
            (err) => {
                if (err.response.status === 500 || err.response.status === 504) {
                    setLoading(false);
                }
            }
        );
        if (res && res.data) {
            setCurrentPatient({ ...res.data[0] });
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const loadOptions = async () => {
        const res = await getCountryList().catch((err) => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data.data && res.data.data.length > 0) {
            Setoption({ countryList: res.data.data });
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const loadLanguage = async () => {
        const res = await getLanguageList().catch((err) => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        console.log("res", res);
        if (res && res.data) {
            setLanguage({ languageOptions: res.data.data });
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleLanguages = (selectedList, selectedItem) => {
        // e.preventDefault()
        languages.push({ name: selectedItem.name });
    };

    const removeLanguages = (selectedList, removedItem) => {
        var array = languages;
        var index = array.indexOf(removedItem); // Let's say it's Bob.
        array.splice(index, 1);
        setCurrentPatient({ ...currentPatient, languages: array });
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        setCurrentPatient({ ...currentPatient, [e.target.name]: e.target.value });
    };

    const handlePhone = (e) => {
        setCurrentPatient({ ...currentPatient, phone: e });
    };
    const handleCountry = (e) => {
        setCurrentPatient({ ...currentPatient, countryId: e.target.value });
    };

    const handleDateChange = (e) => {
        const d = new Date(e.target.value);
        const isoDate = d.toISOString();
        setCurrentPatient({ ...currentPatient, dateOfBirth: isoDate });
    };

    const handleDetails = async (e) => {
        console.log("profilePicture ::::::", profilePicture);
        setTransparentLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append("profileData", JSON.stringify(currentPatient));
        bodyFormData.append("profilePicture", profilePicture);
        const response = await updatePatientData(bodyFormData);

        if (response.status === 200 || response.status === 201) {
            // location.reload();
            // setCurrentPatient({ ...currentPatient, ...{ picture: response.data.picture + '?' + Math.random() } });
            // setDisplay({ ...display, profile: 'block', editProfile: 'none' })
            // setTransparentLoading(false);

            history.go(0);
            // eslint-disable-next-line no-restricted-globals
            // window.location.reload();
            // setDisplay({ ...display, profile: 'block', editProfile: 'none' })
            // setTransparentLoading(false);
            // setTimeout(() => {
            //     alert('2')
            //     ////console.log("response.data ::::::", response.data);
            //     setCurrentPatient({ ...currentPatient, ...{ picture: response.data.picture } });
            //     setDisplay({ ...display, profile: 'block', editProfile: 'none' })
            //     setTransparentLoading(false);
            //     console.log(JSON.stringify(response));
            // }, 10000);
        }
    };

    const now = new Date();
    const newDate = now.setDate(now.getDate() - 1);
    const maxDate = {
        max: moment(newDate).format("YYYY-MM-DD"),
        min: moment(now)
            .subtract(100, "years")
            .format("YYYY-MM-DD"),
    };

    const showBloodGroup = (bg) => {
        if (bg === "APOS") {
            return "A +ve";
        }
        if (bg === "ANEG") {
            return "A -ve";
        }
        if (bg === "BPOS") {
            return "B +ve";
        }
        if (bg === "BNEG") {
            return "B -ve";
        }
        if (bg === "OPOS") {
            return "O +ve";
        }
        if (bg === "ONEG") {
            return "O -ve";
        }
        if (bg === "ABPOS") {
            return "AB +ve";
        }
        if (bg === "ABNEG") {
            return "AB -ve";
        }
    };

    return (
        <div>
            {loading && <Loader />}
            {transparentLoading && <TransparentLoader />}
            {currentPatient && toggleProfile.editProfile === false && (
                <Container>
                    <Row className="row-margin-bottom">
                        <Col md={3}>
                            <ProfileImage
                                currentPatient={currentPatient}
                                onEdit={() => {
                                    setToggleProfile({ ...toggleProfile, editProfile: true });
                                }}
                            />
                            {/* <div id="profile-col-1">
                {currentPatient && currentPatient.picture ? (
                  <img src={currentPatient.picture} alt="" id="profile-pic" />
                ) : (
                  <Avatar
                    className="avatar-profile"
                    name={
                      currentPatient &&
                      currentPatient.firstName + " " + currentPatient.lastName
                    }
                    style={{ height: "150px", width: "138px" }}
                  />
                )}
                <br />
                <div id="name">
                  {currentPatient &&
                    currentPatient.firstName + " " + currentPatient.lastName}
                </div>
                <p id="description">{currentPatient.email}</p>
                <br />
                <div className="col-md-12 text-center mt-3">
                  <button
                    className="btn btn-primary request-edit"
                    onClick={() => {
                      setToggleProfile({ ...toggleProfile, editProfile: true });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div> */}
                        </Col>
                        <Col md={9}>
                            <Row>
                                <Col md={12}>
                                    <div id="profile-col-2">
                                        <Tabs
                                            defaultActiveKey="general"
                                            id="uncontrolled-tab-example"
                                            className="record-tabs mb-3"
                                        >
                                            <Tab eventKey="general" title="General">
                                                <div className="general-tab scroller-cardlist">
                                                    <div className="d-flex flex-column">
                                                        <ProfileRow
                                                            icon={callIcon}
                                                            title="Phone Number"
                                                            value={currentPatient.phone}
                                                        />
                                                        <ProfileRow
                                                            icon={calendarIcon}
                                                            title="Date of Birth"
                                                            value={moment(currentPatient.dateOfBirth).format(
                                                                "DD/MM/YY"
                                                            )}
                                                        />
                                                        <ProfileRow
                                                            icon={ringIcon}
                                                            title="Marital Status"
                                                            value={currentPatient.maritalStatus}
                                                        />
                                                        <ProfileRow
                                                            icon={flagIcon}
                                                            title="Nationality"
                                                            value={currentPatient.countryName}
                                                        />
                                                        <ProfileRow
                                                            icon={languageIcon}
                                                            title="Languages"
                                                            value={
                                                                currentPatient &&
                                                                currentPatient.languages &&
                                                                currentPatient.languages.map(
                                                                    (language, index) => (
                                                                        <li key={index}>{language.name}</li>
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Tab>

                                            {/* <Tab eventKey="lifestyle" title="Lifestyle">
                                                <div className="general-tab">
                                                    <h1>LIFE STYLE TABLE COMES HERE</h1>
                                                </div>
                                            </Tab> */}

                                            <Tab eventKey="medical" title="Medical">
                                                <div className="general-tab scroller-cardlist">
                                                    <div className="d-flex flex-column">
                                                        <ProfileRow
                                                            icon={bloodGroupIcon}
                                                            title="Blood Group"
                                                            value={showBloodGroup(currentPatient.bloodGroup)}
                                                        />
                                                        <ProfileRow
                                                            icon={heightIcon}
                                                            title="Height (CM)"
                                                            value={currentPatient.height}
                                                        />
                                                        <ProfileRow
                                                            icon={weightIcon}
                                                            title="Weight (KG)"
                                                            value={currentPatient.weight}
                                                        />
                                                        <ProfileRow
                                                            icon={bloodPressureIcon}
                                                            title="Blood Pressure"
                                                            value={
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        flexDirection: "row",
                                                                        justifyContent: "flex-start",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <span style={{ marginRight: "30px" }}>
                                                                        High (mmHg)
                                                                        <br />
                                                                        {currentPatient.highBp}
                                                                    </span>

                                                                    <span style={{ marginRight: "10px" }}>
                                                                        Low (mmHg)
                                                                        <br />
                                                                        {currentPatient.lowBp}
                                                                    </span>
                                                                </div>
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            )}
            {currentPatient && toggleProfile.editProfile === true && (
                <Container>
                    <Row className="conflict_profile-form">
                        <Col md={2}></Col>
                        <Col md={8} id="profile-form" className="conflict_profile">
                            <br />

                            <div id="editProfile-col">
                                <ValidatorForm onSubmit={handleDetails}>
                                    <Row style={{ justifyContent: "center" }}>
                                        <ImageCropper
                                            setProfilePicture={setProfilePicture}
                                            imageUrl={currentPatient.picture}
                                        />
                                    </Row>

                                    <Tabs
                                        defaultActiveKey="general"
                                        id="uncontrolled-tab-example"
                                        className="record-tabs mb-3"
                                    >
                                        <Tab eventKey="general" title="General">
                                            <div className="general-medical-tab">
                                                <Row>
                                                    <Col md={12}>
                                                        <p>
                                                            Name<sup>*</sup>
                                                        </p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="text"
                                                            name="firstName"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={firstName}
                                                            validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                            errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                    {/* <Col md={6}>
                                                        <p>
                                                            Last Name<sup>*</sup>
                                                        </p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="text"
                                                            name="lastName"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={lastName}
                                                            validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                            errorMessages={["This field is required", "Last Name cannot have any numeric values"]}
                                                            variant="filled"
                                                        />
                                                    </Col> */}
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={6}>
                                                        <p>Date of Birth</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={moment(dateOfBirth).format("YYYY-MM-DD")}
                                                            inputProps={maxDate}
                                                            InputLabelProps={{ shrink: true }}
                                                            variant="filled"
                                                            onChange={(e) => handleDateChange(e)}
                                                            onKeyDown={(e) => e.preventDefault()}
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>
                                                            Phone Number<sup>*</sup>
                                                        </p>
                                                        <PhoneInput
                                                            inputProps={{
                                                                name: "phone",
                                                                required: true,
                                                                maxLength: 20,
                                                                minLength: 12,
                                                            }}
                                                            country={"us"}
                                                            value={phone}
                                                            onChange={(e) => handlePhone(e)}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <p>Gender</p>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        id="gender-radio"
                                                        aria-label="gender"
                                                        name="gender"
                                                        variant="filled"
                                                        onChange={(e) => handleInputChange(e)}
                                                        value={gender}
                                                    >
                                                        <FormControlLabel
                                                            value="FEMALE"
                                                            control={<Radio color="primary" />}
                                                            label="Female"
                                                        />
                                                        <FormControlLabel
                                                            value="MALE"
                                                            control={<Radio color="primary" />}
                                                            label="Male"
                                                        />
                                                        {/* <FormControlLabel value="UNKNOWN" control={<Radio color="primary" />} label="Other" /> */}
                                                    </RadioGroup>
                                                </FormControl>
                                                <br />
                                                <p>
                                                    Address<sup>*</sup>
                                                </p>
                                                <TextValidator
                                                    id="standard-basic"
                                                    type="text"
                                                    name="address"
                                                    onChange={(e) => handleInputChange(e)}
                                                    value={address}
                                                    validators={["required"]}
                                                    errorMessages={["This field is required"]}
                                                    variant="filled"
                                                />
                                                <br />
                                                <Row>
                                                    <Col md={6}>
                                                        <p>Nationality</p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="countryId"
                                                                value={countryId}
                                                                displayEmpty
                                                                onChange={(e) => handleCountry(e)}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select</em>
                                                                </MenuItem>
                                                                {countryList &&
                                                                    countryList.map((option, index) => (
                                                                        <MenuItem value={option.id} key={index}>
                                                                            {option.name}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>
                                                            Marital Status<sup>*</sup>
                                                        </p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="maritalStatus"
                                                                value={maritalStatus}
                                                                inputProps={{
                                                                    required: true,
                                                                }}
                                                                displayEmpty
                                                                onChange={(e) => handleInputChange(e)}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select</em>
                                                                </MenuItem>
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
                                                        <p>Languages</p>
                                                        <FormControl>
                                                            <div className="multiselect">
                                                                <Multiselect
                                                                    options={languageOptions}
                                                                    onSelect={handleLanguages}
                                                                    onRemove={removeLanguages}
                                                                    selectedValues={languages}
                                                                    displayValue="name"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>
                                                            Blood group<sup>*</sup>
                                                        </p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="bloodGroup"
                                                                value={bloodGroup}
                                                                inputProps={{
                                                                    required: true,
                                                                }}
                                                                displayEmpty
                                                                onChange={(e) => handleInputChange(e)}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select</em>
                                                                </MenuItem>
                                                                <MenuItem value="A+ve">A +ve</MenuItem>
                                                                <MenuItem value="A-ve">A -ve</MenuItem>
                                                                <MenuItem value="B+ve">B +ve</MenuItem>
                                                                <MenuItem value="BNEG">B -ve</MenuItem>
                                                                <MenuItem value="OPOS">O +ve</MenuItem>
                                                                <MenuItem value="ONEG">O -ve</MenuItem>
                                                                <MenuItem value="ABPOS">AB +ve</MenuItem>
                                                                <MenuItem value="ABNEG">AB -ve</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab>

                                        {/* <Tab eventKey="lifestyle" title="Lifestyle">
                                            <div className="general-tab">
                                                <h1>LIFE STYLE TABLE COMES HERE</h1>
                                            </div>
                                        </Tab> */}

                                        <Tab eventKey="education" title="Medical">
                                            <div className="general-medical-tab">
                                                <Row>
                                                    <Col md={6}>
                                                        <p>Weight (in Kg)</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="number"
                                                            name="weight"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={weight}
                                                            inputProps={{
                                                                min: 5,
                                                                max: 999,
                                                            }}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>Height (in cm)</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="number"
                                                            name="height"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={height}
                                                            inputProps={{
                                                                min: 30,
                                                                max: 250,
                                                            }}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                </Row>
                                                <br />

                                                <Row>
                                                    <Col md={6}>
                                                        <p>High BP(in mmHg)</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="number"
                                                            name="highBp"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={highBp}
                                                            inputProps={{
                                                                min: 50,
                                                                max: 300,
                                                            }}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <p>Low BP(in mmHg)</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="number"
                                                            name="lowBp"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={lowBp}
                                                            inputProps={{
                                                                min: 50,
                                                                max: 200,
                                                            }}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab>
                                    </Tabs>

                                    <br />
                                    <div className="edit-profile__button-wrapper">
                                        <button
                                            className="btn btn-primary continue-btn-profile"
                                            onClick={() => {
                                                // setDisplay({ ...display, profile: 'block', editProfile: 'none' })
                                                setToggleProfile({ ...toggleProfile, editProfile: false });
                                            }}
                                        >
                                            Go Back
                                        </button>

                                        <button
                                            className="btn btn-primary continue-btn-profile"
                                            type="submit"
                                        >
                                            Update Profile
                                        </button>
                                    </div>
                                </ValidatorForm>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
            {/* <Footer /> */}
        </div>
    );
};

export default Profile;
