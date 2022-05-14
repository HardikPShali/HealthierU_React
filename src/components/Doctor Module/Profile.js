import React, { useEffect, useState } from 'react';
import './doctor.css';
// import '../Patient Module/patient.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Avatar from 'react-avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { uploadDoctorDocument, getDoctorDocument } from "../../service/frontendapiservices";
import TransparentLoader from "../Loader/transparentloader";
import DoctorDocumentUpload from "../CommonModule/doctordocumentupload"
import moment from 'moment';
import calendarIcon from '../../../src/images/icons used/calendar-dob.png';
import callIcon from '../../../src/images/icons used/phone-white.png';
import flagIcon from '../../../src/images/icons used/nationality.png';
import languageIcon from '../../../src/images/icons used/language.png';
import genderIcon from '../../../src/images/icons used/gender.png';
import educationIcon from '../../../src/images/icons used/education.png';
import experienceIcon from '../../../src/images/icons used/experience.png';
import specialitiesIcon from '../../../src/images/icons used/specialities.png';
import Cookies from 'universal-cookie';

import Loader from './../Loader/Loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ImageCropper from '../CommonModule/ImageCroper';

// import Cookies from 'universal-cookie';
// import CreateIcon from '@material-ui/icons/Create';
// import IconButton from '@material-ui/core/IconButton';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Footer from './Footer';
// import aboutIcon from '../../../src/images/icons used/about.png';

const Profile = ({ currentDoctor }) => {
    //const cookies = new Cookies();
    //const currentLoggedInUser = cookies.get("currentUser");
    console.log("currentUser Doctor Profile", currentDoctor);
    const [open, setOpen] = useState(false);
    const [documentData, setDocumentData] = useState([])
    const [documentName, setDocumentName] = useState("");
    const [documentFile, setDocumentFile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggleProfile, setToggleProfile] = useState({
        profile: false,
        editProfile: false
    });
    const [profilePicture, setProfilePicture] = useState({});

    const [currentDoctorData, setCurrentDoctorData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        countryName: "",
        languages: [],
        education: "",
        experience: "",
        specialities: []
    });

    const cookies = new Cookies();



    useEffect(() => {
        loadDoctorDocument();
    }, [currentDoctor]);

    const loadDoctorDocument = async () => {
        const doctorId = currentDoctor.id;
        const res = await getDoctorDocument(doctorId);
        if (res && res.status === 200) {
            setDocumentData(res.data.documentsDocumentsList);
            setLoading(false);
        }
        else if (res && res.status === 204) {
            setDocumentData([]);
            setLoading(false);
        }
    }

    const handleDocnameChange = (e) => {
        setDocumentName(e.target.value);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const [uploadOpen, setUploadOpen] = useState(false);

    const handleUploadClose = () => {
        setUploadOpen(false);
    }

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files);
    }

    const handleUpload = async (e) => {
        const info = {
            doctorId: currentDoctor.id,
            doctor_email: currentDoctor.email,
            documentName: documentName
        }
        const files = documentFile;
        const res = await uploadDoctorDocument(files, info);
        if (res && res.status === 201) {
            const existingDoc = documentData;
            existingDoc.push(res.data);
            setDocumentData(existingDoc);
            setUploadOpen(false);
        }
    }

    const currentLoggedInUser = cookies.get("profileDetails");
    console.log('currentLoggedInUser', currentLoggedInUser);

    const handleInputChange = (e) => {
        e.preventDefault()
        setCurrentDoctorData({ ...currentDoctorData, [e.target.name]: e.target.value });
    };

    // const handleLanguages = (selectedList, selectedItem) => {
    //     // e.preventDefault()
    //     languages.push({ name: selectedItem.name });
    // };

    // const removeLanguages = (selectedList, removedItem) => {
    //     var array = languages;
    //     var index = array.indexOf(removedItem); // Let's say it's Bob.
    //     array.splice(index, 1);
    //     setCurrentPatient({ ...currentPatient, languages: array });
    // }

    return (
        <div>
            {loading && (
                <TransparentLoader />
            )}
            {currentDoctor && toggleProfile.editProfile === false && (
                <Container>
                    <Row>
                        <Col md={12}>
                            <div id="profile-col-1">
                                {currentDoctor && currentDoctor.picture ? (<img src={currentDoctor.picture} id="profile-pic" alt="" />)
                                    : (<Avatar className='avatar-profile' name={currentDoctor.firstName + " " + currentDoctor.lastName} size={150} />)}
                                <br />
                                <div id="name">
                                    {currentDoctor.firstName + " " + currentDoctor.lastName}
                                </div>
                                <p id="description">
                                    {currentDoctor.email}
                                </p>
                                <br />
                                <div className='col-md-12 text-center mt-3'>
                                    <button className="btn btn-primary request-edit" onClick={
                                        () => {
                                            // setDisplay({ ...display, profile: 'none', editProfile: 'block' })
                                            setToggleProfile({ ...toggleProfile, editProfile: true })
                                        }
                                    }>Request Edit</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div id="profile-col-2">
                                <Tabs defaultActiveKey='general' id='uncontrolled-tab-example' className='record-tabs mb-3'>
                                    <Tab eventKey='general' title='General'>
                                        <div className='general-tab'>
                                            <table id="user-info">
                                                <tbody>
                                                    <tr>
                                                        <img src={callIcon} alt='icons' className='icon-tabs call-icon' />
                                                        <th>Phone Number</th>
                                                        <td>{currentDoctor.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <img src={genderIcon} alt='icons' className='icon-tabs gender-icon' />

                                                        <th>Gender</th>
                                                        <td>{currentDoctor.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <img src={calendarIcon} alt='icons' className='icon-tabs calendar-icon' />
                                                        <th>Date of Birth</th>
                                                        <td>{moment(currentDoctor.dateOfBirth).format("DD/MM/YY")}</td>
                                                    </tr>

                                                    <tr>
                                                        <img src={flagIcon} alt='icons' className='icon-tabs nationality-icon' />
                                                        <th>Nationality</th>
                                                        <td>{currentDoctor.countryName}</td>
                                                    </tr>
                                                    <tr>
                                                        <img src={languageIcon} alt='icons' className='icon-tabs language-icon' />
                                                        <th>Languages</th>
                                                        <td>
                                                            <ul style={{ margin: '0px' }} className="list--tags">
                                                                {currentDoctor && currentDoctor.languages && currentDoctor.languages.map((language, index) => (
                                                                    <li key={index}>{language.name}</li>
                                                                )
                                                                )}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                    {/* <tr>
                                                    <img src={aboutIcon} alt='icons' className='icon-tabs about-icon' />
                                                    <th>About</th>
                                                    <td>{currentDoctor.bio}</td>
                                                </tr> */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Tab>

                                    <Tab eventKey='education' title='Education'>
                                        <div className='general-tab'>
                                            <table id="user-info">
                                                <tbody>
                                                    <tr>
                                                        <img src={educationIcon} alt='icons' className='icon-tabs education-icon' />
                                                        <th>Education</th>
                                                        <td>{currentDoctor.education}</td>
                                                    </tr>

                                                    <tr>
                                                        <img src={experienceIcon} alt='icons' className='icon-tabs experience-icon' />

                                                        <th>Experience</th>
                                                        <td>{currentDoctor.experience}</td>
                                                    </tr>

                                                    <tr>
                                                        <img src={specialitiesIcon} alt='icons' className='icon-tabs specialities-icon' />
                                                        <th>Specialities</th>
                                                        <td>

                                                            <ul style={{ margin: '0px' }} className="list--tags">
                                                                {currentDoctor && currentDoctor.specialities && currentDoctor.specialities.map((specialities, index) => (
                                                                    <li key={index}>{specialities.name}</li>
                                                                )
                                                                )}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Tab>
                                </Tabs>
                                <br />
                                <DoctorDocumentUpload currentDoctor={currentDoctor} isDoctor={true} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
            {
                currentDoctor && toggleProfile.editProfile === true && (
                    <Container >
                        <Row className='conflict_profile-form'>
                            <Col md={2}></Col>
                            <Col md={8} id="profile-form" className='conflict_profile'>
                                <br />
                                <button className="btn btn-primary" onClick={() => {
                                    // setDisplay({ ...display, profile: 'block', editProfile: 'none' })
                                    setToggleProfile({ ...toggleProfile, editProfile: false })
                                }}>
                                    back to Profile
                                </button>
                                <div id="editProfile-col">
                                    <ValidatorForm>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <ImageCropper setProfilePicture={setProfilePicture} imageUrl={currentDoctor.picture} />
                                        </Row>

                                        <Tabs defaultActiveKey='general' id='uncontrolled-tab-example' className='record-tabs mb-3'>
                                            <Tab eventKey='general' title='General'>
                                                <div className='general-tab'>
                                                    <Row>
                                                        <Col md={6}>
                                                            <p>First Name<sup>*</sup></p>
                                                            {/* <TextValidator id="standard-basic" type="text" name="firstName"
                                                                onChange={e => handleInputChange(e)}
                                                                value={firstName}
                                                                validators={['required']}
                                                                errorMessages={['This field is required']}
                                                                variant="filled" /> */}
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>Last Name<sup>*</sup></p>
                                                            {/* <TextValidator id="standard-basic" type="text" name="lastName"
                                                                onChange={e => handleInputChange(e)}
                                                                value={lastName}
                                                                validators={['required']}
                                                                errorMessages={['This field is required']}
                                                                variant="filled" /> */}
                                                        </Col>
                                                    </Row><br />
                                                    <Row>
                                                        <Col md={6}>
                                                            <p>Date of Birth</p>
                                                            {/* <TextValidator id="standard-basic" type="date" name="dateOfBirth" value={moment(dateOfBirth).format('YYYY-MM-DD')} inputProps={maxDate} InputLabelProps={{ shrink: true, }}
                                                                variant="filled" onChange={e => handleDateChange(e)} onKeyDown={(e) => e.preventDefault()} /> */}
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>Phone Number<sup>*</sup></p>
                                                            {/* <PhoneInput
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
                                                            /> */}
                                                        </Col>
                                                    </Row>
                                                    <br />

                                                    <br />

                                                    <Row>
                                                        <Col md={6}>
                                                            <p>Nationality</p>
                                                            {/* <FormControl>
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
                                                            </FormControl> */}
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>Gender</p>
                                                            {/* <FormControl component="fieldset">
                                                        <RadioGroup id="gender-radio" aria-label="gender" name="gender"
                                                            variant="filled" onChange={e => handleInputChange(e)} value={gender}>
                                                            <FormControlLabel value="FEMALE" control={<Radio color="primary" />} label="Female" />
                                                            <FormControlLabel value="MALE" control={<Radio color="primary" />} label="Male" />
                                                            <FormControlLabel value="UNKNOWN" control={<Radio color="primary" />} label="Other" /> 
                                                        </RadioGroup>
                                                    </FormControl> */}

                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col md={6}>
                                                            <p>Languages</p>
                                                            {/* <FormControl>
                                                                <div className="multiselect">
                                                                    <Multiselect
                                                                        options={languageOptions}
                                                                        onSelect={handleLanguages}
                                                                        onRemove={removeLanguages}
                                                                        selectedValues={languages}
                                                                        displayValue="name"
                                                                    />
                                                                </div>
                                                            </FormControl> */}
                                                        </Col>
                                                        <Col md={6}>
                                                            {/* <p>Blood group<sup>*</sup></p>
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
                                                                    <MenuItem value="A+ve">A +ve</MenuItem>
                                                                    <MenuItem value="A-ve">A -ve</MenuItem>
                                                                    <MenuItem value="B+ve">B +ve</MenuItem>
                                                                    <MenuItem value="BNEG">B -ve</MenuItem>
                                                                    <MenuItem value="OPOS">O +ve</MenuItem>
                                                                    <MenuItem value="ONEG">O -ve</MenuItem>
                                                                    <MenuItem value="ABPOS">AB +ve</MenuItem>
                                                                    <MenuItem value="ABNEG">AB -ve</MenuItem>
                                                                </Select>
                                                            </FormControl> */}

                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Tab>

                                            <Tab eventKey='education' title='Education'>
                                                <div className='general-tab'>
                                                    <Row>
                                                        <Col md={6}>
                                                            <p>Education</p>
                                                            {/* <TextValidator id="standard-basic" type="number" name="weight"
                                                                onChange={e => handleInputChange(e)}
                                                                value={weight}
                                                                inputProps={{
                                                                    min: 5,
                                                                    max: 999
                                                                }}
                                                                variant="filled" /> */}
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>Experience</p>
                                                            {/* <TextValidator id="standard-basic" type="number" name="height"
                                                                onChange={e => handleInputChange(e)}
                                                                value={height}
                                                                inputProps={{
                                                                    min: 30,
                                                                    max: 250
                                                                }}
                                                                variant="filled" /> */}
                                                        </Col>
                                                    </Row>
                                                    <br />

                                                    <Row>
                                                        <Col md={6}>
                                                            <p>Specialities</p>
                                                            {/* <TextValidator id="standard-basic" type="number" name="highBp"
                                                                onChange={e => handleInputChange(e)}
                                                                value={highBp}
                                                                inputProps={{
                                                                    min: 50,
                                                                    max: 300
                                                                }}
                                                                variant="filled" /> */}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Tab>
                                        </Tabs>

                                        <br />

                                        <button className="btn btn-primary continue-btn" type="submit">Update</button>
                                    </ValidatorForm>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                )
            }

            <Dialog aria-labelledby="customized-dialog-title" open={uploadOpen}>
                <DialogTitle id="customized-dialog-title">
                    Upload Document
                </DialogTitle>
                <ValidatorForm onSubmit={(e) => handleUpload(e)}>
                    <DialogContent dividers>
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Choose Document:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="standard-basic"
                                    variant="filled"
                                    name="doctorDocumentFile"
                                    type="file"
                                    inputProps={{
                                        required: true,
                                        multiple: true
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                />
                            </Col>
                        </Row>
                        <br />
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Document Name:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="standard-basic"
                                    variant="filled"
                                    name="documentName"
                                    inputProps={{
                                        required: true
                                    }}
                                    onChange={(e) => handleDocnameChange(e)}
                                />
                            </Col>
                        </Row>
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={handleUploadClose}
                            className="btn btn-danger text-light"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary text-light"
                            type="submit"
                        >
                            Upload
                        </button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </div>
    )

}

export default Profile



// onSubmit={handleDetails}