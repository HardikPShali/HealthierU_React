import React, { useState, useEffect } from 'react'
import './patient.css';
import { Container, Row, Col } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import Avatar from 'react-avatar';
import Loader from './../Loader/Loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Select from '@material-ui/core/Select';
import { Multiselect } from 'multiselect-react-dropdown';
import moment from 'moment';
import $ from 'jquery';
import ImageCropper from '../CommonModule/ImageCroper';
import {
    getCountryList,
    getLanguageList
} from '../../service/adminbackendservices';
import {
    getLoggedInUserDataByUserId,
    updatePatientData
} from '../../service/frontendapiservices';
import TransparentLoader from '../Loader/transparentloader';
//import { checkAccessToken } from '../../service/RefreshTokenService';
// import LocalStorageService from './../../util/LocalStorageService';
// import axios from "axios";
// import Footer from './Footer';

$(document).ready(function () {
    $(".upload-button").on('click', function () {
        $(".file-upload").trigger('click');
    });
});
const Profile = () => {
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
        highBp: '',
        lowBp: '',
        height: '',
        weight: '',
        bloodGroup: '',
        address: '',
    });

    const [loading, setLoading] = useState(true);
    const [transparentLoading, setTransparentLoading] = useState(false);

    const [language, setLanguage] = useState({
        languageOptions: []
    });
    const { languageOptions } = language;

    const [options, Setoption] = useState({
        countryList: []
    });

    const { countryList } = options;

    const [profilePicture, setProfilePicture] = useState({});

    const { firstName, lastName, dateOfBirth, phone, countryId, bloodGroup, gender, languages, highBp, height, weight, maritalStatus, lowBp, address } = currentPatient;


    useEffect(() => {
        getCurrentPatient();
        loadOptions();
        loadLanguage();
    }, []);

    const currentLoggedInUser = cookies.get("currentUser");
    const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
    const getCurrentPatient = async () => {
        const res = await getLoggedInUserDataByUserId(loggedInUserId).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data) {
            setCurrentPatient({...res.data[0]});
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const [display, setDisplay] = useState({
        profile: "block",
        editProfile: "none"
    })

    const loadOptions = async () => {
        const res = await getCountryList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data && res.data.length > 0) {
            Setoption({ countryList: res.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const loadLanguage = async () => {
        const res = await getLanguageList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data && res.data.length > 0) {
            setLanguage({ languageOptions: res.data })
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const handleLanguages = (selectedList, selectedItem) => {
        // e.preventDefault()
        languages.push({ name: selectedItem.name });
    };

    const removeLanguages = (selectedList, removedItem) => {
        var array = languages;
        var index = array.indexOf(removedItem); // Let's say it's Bob.
        array.splice(index, 1);
        // setCurrentPatient({ ...currentPatient, languages: array });
    }

    const handleInputChange = (e) => {
        e.preventDefault()
        // setCurrentPatient({ ...currentPatient, [e.target.name]: e.target.value });
    };

    const handlePhone = (e) => {
        // setCurrentPatient({ ...currentPatient, phone: e });
    };
    const handleCountry = (e) => {
        // setCurrentPatient({ ...currentPatient, countryId: e.target.value });
    };

    const handleDateChange = (e) => {
        const d = new Date(e.target.value);
        const isoDate = d.toISOString();
        // setCurrentPatient({ ...currentPatient, dateOfBirth: isoDate });
    };

    const handleDetails = async e => {
        console.log("profilePicture ::::::", profilePicture);
        setTransparentLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append('profileData', JSON.stringify(currentPatient));
        bodyFormData.append('profilePicture', profilePicture);
        const response = await updatePatientData(bodyFormData);

        if (response.status === 200 || response.status === 201) {
            // location.reload();
            // eslint-disable-next-line no-restricted-globals
            location.reload();
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
    }

    // useEffect(() => {
    //     if (transparentLoading === false) {
    //         // setCurrentPatient({ ...currentPatient, ...{ pic: "jsjsjsjs" } });
    //         setDisplay({ ...display, profile: 'block', editProfile: 'none' })

    //         getCurrentPatient();

    //     }
    // }, [transparentLoading]);

    const now = new Date();
    const newDate = now.setDate(now.getDate() - 1);
    const maxDate = {
        max: moment(newDate).format("YYYY-MM-DD"),
        min: moment(now).subtract(100, "years").format("YYYY-MM-DD")
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

    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
            {transparentLoading && (
                <TransparentLoader />
            )}
            {currentPatient && (
                <Container style={{ display: display.profile }}>
                    <Row>
                        <Col md={4}>
                            <div id="profile-col-1">
                                {(currentPatient && currentPatient.picture) ? (<img src={currentPatient.picture} alt="" id="profile-pic" />)
                                    : (<Avatar name={currentPatient && (currentPatient.firstName + " " + currentPatient.lastName)} size="150" />)}
                                <div id="name">{currentPatient && (currentPatient.firstName + " " + currentPatient.lastName)}</div>
                                <br />
                                <p id="description">
                                    {currentPatient.bio}
                                </p>
                                <br />
                                <div>
                                    <button className="btn btn-primary request-edit" onClick={() => {
                                        setDisplay({ ...display, profile: 'none', editProfile: 'block' })
                                    }}>Edit Picture</button>
                                </div>
                            </div>
                        </Col>
                        <Col md={8}>
                            <div id="profile-col-2">
                                <table id="user-info">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <td>{currentPatient.firstName + " " + currentPatient.lastName}</td>
                                        </tr>
                                        <tr>
                                            <th>Address</th>
                                            <td>{currentPatient.address}</td>
                                        </tr>
                                        <tr>
                                            <th>Contact Number</th>
                                            <td>{currentPatient.phone}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{currentPatient.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Gender</th>
                                            <td>{currentPatient.gender}</td>
                                        </tr>
                                        <tr>
                                            <th>Date of birth</th>
                                            <td>
                                                {moment(currentPatient.dateOfBirth).format("DD/MM/YY")}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Marital Status</th>
                                            <td>{currentPatient.maritalStatus}</td>
                                        </tr>
                                        <tr>
                                            <th>Blood Group</th>
                                            <td>{showBloodGroup(currentPatient.bloodGroup)}</td>
                                        </tr>
                                        <tr>
                                            <th>Height</th>
                                            <td>{currentPatient.height} cm</td>
                                        </tr>
                                        <tr>
                                            <th>Weight</th>
                                            <td>{currentPatient.weight} kg</td>
                                        </tr>
                                        <tr>
                                            <th>High BP</th>
                                            <td>{currentPatient.highBp} mmHg</td>
                                        </tr>
                                        <tr>
                                            <th>Low BP</th>
                                            <td>{currentPatient.lowBp} mmHg</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
            {currentPatient && (
                <Container style={{ display: display.editProfile }}>
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8} id="profile-form">
                            <br />
                            <button className="btn btn-primary" onClick={() => {
                                setDisplay({ ...display, profile: 'block', editProfile: 'none' })
                            }}>
                                back to Profile
                            </button>
                            <div id="editProfile-col">
                                <ValidatorForm onSubmit={handleDetails}>
                                    <Row style={{ justifyContent: 'center' }}>
                                        <ImageCropper setProfilePicture={setProfilePicture} imageUrl={currentPatient.picture} />
                                    </Row>

                                    <br />
                                    <Row>
                                        <Col md={6}>
                                            <p>First Name<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="firstName"
                                                onChange={e => handleInputChange(e)}
                                                value={firstName}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                        <Col md={6}>
                                            <p>Last Name<sup>*</sup></p>
                                            <TextValidator id="standard-basic" type="text" name="lastName"
                                                onChange={e => handleInputChange(e)}
                                                value={lastName}
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                                variant="filled" />
                                        </Col>
                                    </Row><br />
                                    <Row>
                                        <Col md={6}>
                                            <p>Date of Birth</p>
                                            <TextValidator id="standard-basic" type="date" name="dateOfBirth" value={moment(dateOfBirth).format('YYYY-MM-DD')} inputProps={maxDate} InputLabelProps={{ shrink: true, }}
                                                variant="filled" onChange={e => handleDateChange(e)} onKeyDown={(e) => e.preventDefault()} />
                                        </Col>
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
                                        </Col>
                                    </Row>
                                    <br />
                                    <p>Gender</p>
                                    <FormControl component="fieldset">
                                        <RadioGroup id="gender-radio" aria-label="gender" name="gender"
                                            variant="filled" onChange={e => handleInputChange(e)} value={gender}>
                                            <FormControlLabel value="FEMALE" control={<Radio color="primary" />} label="Female" />
                                            <FormControlLabel value="MALE" control={<Radio color="primary" />} label="Male" />
                                            {/* <FormControlLabel value="UNKNOWN" control={<Radio color="primary" />} label="Other" /> */}
                                        </RadioGroup>
                                    </FormControl>
                                    <br />
                                    <p>Address<sup>*</sup></p>
                                    <TextValidator id="standard-basic" type="text" name="address"
                                        onChange={e => handleInputChange(e)}
                                        value={address}
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                        variant="filled" />
                                    <br />
                                    <Row>
                                        <Col md={6}>
                                            <p>Country Of Residence</p>
                                            <FormControl>
                                                <Select
                                                    id="demo-controlled-open-select"
                                                    variant="filled"
                                                    name="countryId"
                                                    value={countryId}
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
                                        <Col md={6}>
                                            <p>Marital Status<sup>*</sup></p>
                                            <FormControl>
                                                <Select
                                                    id="demo-controlled-open-select"
                                                    variant="filled"
                                                    name="maritalStatus"
                                                    value={maritalStatus}
                                                    inputProps={{
                                                        required: true
                                                    }}
                                                    displayEmpty
                                                    onChange={e => handleInputChange(e)}
                                                >
                                                    <MenuItem value=""><em>Select</em></MenuItem>
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
                                            <p>Blood group<sup>*</sup></p>
                                            <FormControl>
                                                <Select
                                                    id="demo-controlled-open-select"
                                                    variant="filled"
                                                    name="bloodGroup"
                                                    value={bloodGroup}
                                                    inputProps={{
                                                        required: true
                                                    }}
                                                    displayEmpty
                                                    onChange={e => handleInputChange(e)}
                                                >
                                                    <MenuItem value=""><em>Select</em></MenuItem>
                                                    <MenuItem value="APOS">A +ve</MenuItem>
                                                    <MenuItem value="ANEG">A -ve</MenuItem>
                                                    <MenuItem value="BPOS">B +ve</MenuItem>
                                                    <MenuItem value="BNEG">B -ve</MenuItem>
                                                    <MenuItem value="OPOS">O +ve</MenuItem>
                                                    <MenuItem value="ONEG">O -ve</MenuItem>
                                                    <MenuItem value="ABPOS">AB +ve</MenuItem>
                                                    <MenuItem value="ABNEG">AB -ve</MenuItem>
                                                </Select>
                                            </FormControl>

                                        </Col>
                                    </Row>
                                    <br />
                                    <br />
                                    <Row>
                                        <Col md={6}>
                                            <p>Weight (in Kg)</p>
                                            <TextValidator id="standard-basic" type="number" name="weight"
                                                onChange={e => handleInputChange(e)}
                                                value={weight}
                                                inputProps={{
                                                    min: 5,
                                                    max: 999
                                                }}
                                                variant="filled" />
                                        </Col>
                                        <Col md={6}>
                                            <p>Height (in cm)</p>
                                            <TextValidator id="standard-basic" type="number" name="height"
                                                onChange={e => handleInputChange(e)}
                                                value={height}
                                                inputProps={{
                                                    min: 30,
                                                    max: 250
                                                }}
                                                variant="filled" />
                                        </Col>
                                    </Row>
                                    <br />

                                    <Row>
                                        <Col md={6}>
                                            <p>High BP(in mmHg)</p>
                                            <TextValidator id="standard-basic" type="number" name="highBp"
                                                onChange={e => handleInputChange(e)}
                                                value={highBp}
                                                inputProps={{
                                                    min: 50,
                                                    max: 300
                                                }}
                                                variant="filled" />
                                        </Col>
                                        <Col md={6}>
                                            <p>Low BP(in mmHg)</p>
                                            <TextValidator id="standard-basic" type="number" name="lowBp"
                                                onChange={e => handleInputChange(e)}
                                                value={lowBp}
                                                inputProps={{
                                                    min: 50,
                                                    max: 200
                                                }}
                                                variant="filled" />
                                        </Col>
                                    </Row>
                                    <br />

                                    <button className="btn btn-primary continue-btn" type="submit">Update</button>
                                </ValidatorForm>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )
            }
            {/* <Footer /> */}
        </div >
    )
}

export default Profile
