import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './doctor.css';
import { Button } from 'react-bootstrap';
// import '../Patient Module/patient.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Avatar from 'react-avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
    uploadDoctorDocument,
    getDoctorDocument,
    updateDoctorData,
    updateDoctorDocumentNew
} from '../../service/frontendapiservices';
import TransparentLoader from '../Loader/transparentloader';
import DoctorDocumentUpload from '../CommonModule/doctordocumentupload';
import moment from 'moment';
import calendarIcon from '../../../src/images/svg/calendar-teal.svg';
import institutionIcon from '../../../src/images/svg/institutionIcon.svg';
import callIcon from '../../../src/images/svg/call-icon.svg';
import flagIcon from '../../../src/images/svg/nationality-icon.svg';
import languageIcon from '../../../src/images/svg/language-icon.svg';
import genderIcon from '../../../src/images/svg/gender-icon.svg';
import educationIcon from '../../../src/images/svg/education-icon.svg';
import experienceIcon from '../../../src/images/svg/experience-icon.svg';
import specialityIcon from '../../../src/images/svg/speciality-icon.svg';
import {
    getCountryList,
    getLanguageList,
    getSpecialityList,
} from '../../service/adminbackendservices';
import { Multiselect } from 'multiselect-react-dropdown';
import Select from '@material-ui/core/Select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ImageCropper from '../CommonModule/ImageCroper';
import ProfileRow from '../CommonModule/Profile/ProfileRow/ProfileRow';
import Cookies from "universal-cookie";

// import Cookies from 'universal-cookie';
// import CreateIcon from '@material-ui/icons/Create';
// import IconButton from '@material-ui/core/IconButton';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Footer from './Footer';
// import aboutIcon from '../../../src/images/icons used/about.png';
// import ProfileImage from "../CommonModule/Profile/ProfileImage/ProfileImage";

const Profile = ({ currentDoctor }) => {
    const history = useHistory();
    const cookies = new Cookies();

    console.log("currentDoctor Props", currentDoctor);

    const [documentData, setDocumentData] = useState([]);
    const [documentName, setDocumentName] = useState('');
    const [documentFile, setDocumentFile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggleProfile, setToggleProfile] = useState({
        profile: false,
        editProfile: false,
    });
    const [profilePicture, setProfilePicture] = useState({});

    const [currentDoctorData, setCurrentDoctorData] = useState(JSON.parse(JSON.stringify(currentDoctor)));
    const [language, setLanguage] = useState({
        languageOptions: [],
    });

    const [specialityError, setSpecialityError] = useState(false);

    const [options, Setoption] = useState({
        countryList: [],
    });

    const [speciality, setSpeciality] = useState({
        specialityOptions: [],
    });

    let {
        firstName,
        lastName,
        phone,
        gender,
        dateOfBirth,
        countryId,
        languages,
        educationalQualifications,
        experience,
        specialities,
    } = currentDoctorData ? currentDoctorData : currentDoctor;


    const { languageOptions } = language;

    const { countryList } = options;

    const { specialityOptions } = speciality;

    //LOAD COUNTRY LIST
    const loadOptions = async () => {
        const res = await getCountryList().catch((err) => {
            if (err.status === 500 || err.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data.data && res.data.data.length > 0) {
            Setoption({ countryList: res.data.data });
            setTimeout(() => setLoading(false), 1000);
        }
    };

    //LOAD LANGUAGE LIST
    const loadLanguage = async () => {
        const res = await getLanguageList().catch((err) => {
            if (err.status === 500 || err.status === 504) {
                setLoading(false);
            }
        });
        if (res && res.data.data && res.data.data.length > 0) {
            setLanguage({ languageOptions: res.data.data });
            setTimeout(() => setLoading(false), 1000);
        }
    };

    //LOAD SPECIALITY LIST
    const loadSpeciality = async () => {
        const res = await getSpecialityList().catch((err) => {
            if (err.status === 500 || err.status === 504) {
                setLoading(false);
            }
        });

        if (res && res.data.data && res.data.data.length > 0) {
            setSpeciality({ specialityOptions: res.data.data });

            setTimeout(() => setLoading(false), 1000);
        }
    };
    const [documentInfo, setDocumentinfo] = useState({})
    const [documentUpdateFile, setDocumentUpdateFile] = useState()
    const [currentdocumentData, setCurrentDocumentData] = useState([])
    //LOAD DOCUMENT LIST
    const loadDoctorDocument = async () => {
        const doctorId = currentDoctor.id;
        const res = await getDoctorDocument(doctorId);
        if (res && res.status === 200) {
            setDocumentData(res.data.documentsDocumentsList);
            setCurrentDocumentData(res.data.documentsDocumentsList[0])
            setLoading(false);
        } else if (res && res.status === 204) {
            setDocumentData([]);
            setLoading(false);
        }
    };
    const { licenseNumber, referencePhoneNumber, certifyingBody } = currentdocumentData ? currentdocumentData : documentData;
    useEffect(() => {
        loadDoctorDocument();
        loadOptions();
        loadLanguage();
        loadSpeciality();
    }, [currentDoctor]);

    const handleDocnameChange = (e) => {
        setDocumentName(e.target.value);
    };

    const [uploadOpen, setUploadOpen] = useState(false);

    const handleUploadClose = () => {
        setUploadOpen(false);
    };

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files);
    };

    const handleUpload = async (e) => {
        const info = {
            doctorId: currentDoctor.id,
            doctor_email: currentDoctor.email,
            documentName: documentName,
        };
        const files = documentFile;
        const res = await uploadDoctorDocument(files, info);
        if (res && res.status === 201) {
            const existingDoc = documentData;
            existingDoc.push(res.data);
            setDocumentData(existingDoc);
            setUploadOpen(false);
        }
    };

    // const currentLoggedInUser = cookies.get("profileDetails");
    // console.log('currentLoggedInUser', currentLoggedInUser);

    // HANDLERS FOR EDIT PAGE
    const handleInputChange = (e) => {
        // e.preventDefault();
        console.log(e.target.value);
        setCurrentDoctorData({ ...currentDoctorData, [e.target.name]: e.target.value });
    };

    const handleLanguages = (selectedItem) => {
        selectedItem.forEach((e) => {
            const index = languages.findIndex((x) => x.name == e.name)
            if (index == -1) {
                languages.push(e);
            }

        })

        setCurrentDoctorData({ ...currentDoctorData, languages: languages });
    };
    const removeLanguages = (removedItem) => {
        var array = languages;
        var index = array.indexOf(removedItem);
        array.splice(index, 1);
        setCurrentDoctorData({ ...currentDoctorData, languages: array });
    };

    const now = new Date();
    const newDate = now.setDate(now.getDate() - 1);
    const maxDate = {
        max: moment(newDate).format('YYYY-MM-DD'),
        min: moment(now)
            .subtract(100, 'years')
            .format('YYYY-MM-DD'),
    };

    const handleDateChange = (e) => {
        const d = new Date(e.target.value);
        const isoDate = d.toISOString();
        setCurrentDoctorData({ ...currentDoctorData, dateOfBirth: isoDate });
    };

    const handlePhone = (e) => {
        setCurrentDoctorData({ ...currentDoctorData, phone: e });
    };

    const handleCountry = (e) => {
        setCurrentDoctorData({ ...currentDoctorData, countryId: e.target.value });
    };

    const handleSpecialities = (selectedItem) => {
        selectedItem.forEach((e) => {
            const index = specialities.findIndex((x) => x.name == e.name)
            if (index == -1) {
                specialities.push(e);
            }

        })
        // specialities.push({ id: selectedItem.id, name: selectedItem.name });
        setSpecialityError(false);
    };

    const removeSpecialities = (removedItem) => {
        var array = specialities;
        var index = array.indexOf(removedItem); // Let's say it's Bob.
        array.splice(index, 1);
        setCurrentDoctorData({ ...setCurrentDoctorData, specialities: array });
    };

    // EDIT PROFILE HANDLER ON SUBMIT
    const handleDetails = async e => {
        console.log("Doctor Profile Data", currentDoctorData);
        console.log("profilePicture ::::::", profilePicture);
        setLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        const reqBody = { ...currentDoctorData };
        reqBody.lastName = '';
        bodyFormData.append('profileData', JSON.stringify(reqBody));
        bodyFormData.append('profilePicture', profilePicture);
        const response = await updateDoctorData(bodyFormData);
        const user = cookies.get("profileDetails");
        const info = {
            doctorId: user.id,
            //doctor_email: user.email,
            // documentName: documentName,
            licenseNumber: documentInfo.licenseNumber,
            referencePhoneNumber: documentInfo.referencePhoneNumber,
            certifyingBody: documentInfo.certifyingBody
        }
        const res = await updateDoctorDocumentNew(info).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (response.status === 200 || response.status === 201 && res.status === 200) {
            cookies.set('profileDetails', response.data.data);
            // setCurrentDoctorData({ currentDoctorData: currentDoctorData });
            history.go(0);
        }
    }

    const [educationList, setEducationList] = useState([{ institution: '', educationalQualification: '' }]);
    // handle input change
    const handleEducationDetailsInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...currentDoctorData.educationalQualifications];
        list[index][name] = value;
        //setEducationList(list);
        setCurrentDoctorData({ ...currentDoctorData, educationalQualifications: list });
        console.log("state", currentDoctorData)
    };
    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...currentDoctorData.educationalQualifications];
        list.splice(index, 1);
        //setEducationList(list);
        setCurrentDoctorData({ ...currentDoctorData, educationalQualifications: list })
    };


    // handle click event of the Add button
    const handleAddClick = () => {
        const list = [...currentDoctorData.educationalQualifications];
        list.push({ institution: '', educationalQualification: '' })
        setCurrentDoctorData({ ...currentDoctorData, educationalQualifications: list });

    };


    return (
        <div>
            {loading && <TransparentLoader />}
            {currentDoctor && toggleProfile.editProfile === false && (
                <Container>
                    <Row>
                        <Col md={3}>
                            <div id="profile-col-1">
                                {currentDoctor && currentDoctor.picture ? (
                                    <img src={currentDoctor.picture} id="profile-pic" alt="" />
                                ) : (
                                    <Avatar
                                        className="avatar-profile"
                                        name={
                                            currentDoctor.firstName
                                        }
                                        size={145}
                                        style={{
                                            width: 137,
                                            height: 150
                                        }}
                                    />
                                )}
                                <br />
                                <div id="name">
                                    {currentDoctor.firstName}
                                </div>
                                <p id="description">{currentDoctor.email}</p>
                                <br />
                                <div className="col-md-12 text-center mt-3">
                                    <button
                                        className="btn btn-primary request-edit"
                                        onClick={() => {
                                            // setDisplay({ ...display, profile: 'none', editProfile: 'block' })
                                            setToggleProfile({ ...toggleProfile, editProfile: true });
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
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
                                                            title="Phone"
                                                            value={currentDoctor.phone}
                                                        />
                                                        <ProfileRow
                                                            icon={genderIcon}
                                                            title="Gender"
                                                            value={currentDoctor.gender}
                                                        />
                                                        <ProfileRow
                                                            icon={calendarIcon}
                                                            title="Date of Birth"
                                                            value={moment(currentDoctor.dateOfBirth).format(
                                                                'DD/MM/YY'
                                                            )}
                                                        />
                                                        <ProfileRow
                                                            icon={flagIcon}
                                                            title="Nationality"
                                                            value={currentDoctor.countryName}
                                                        />
                                                        <ProfileRow
                                                            icon={languageIcon}
                                                            title="Languages"
                                                            value={
                                                                currentDoctor &&
                                                                currentDoctor.languages &&
                                                                currentDoctor.languages.map(
                                                                    (language, index) => (
                                                                        <li key={index}>{language.name}</li>
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Tab>

                                            <Tab eventKey="education" title="Education">
                                                <div className="general-tab scroller-cardlist">
                                                    <div className="d-flex flex-column">
                                                        <ProfileRow
                                                            icon={educationIcon}
                                                            title="EducationalQualification"
                                                            value={
                                                                currentDoctor &&
                                                                currentDoctor.educationalQualifications &&
                                                                currentDoctor.educationalQualifications.map(
                                                                    (edu, index) => (
                                                                        <div>
                                                                            <li key={index}>{edu.educationalQualification}</li>

                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        //value={currentDoctor.education}
                                                        /> <ProfileRow
                                                            icon={institutionIcon}
                                                            title="Institution"
                                                            value={
                                                                currentDoctor &&
                                                                currentDoctor.educationalQualifications &&
                                                                currentDoctor.educationalQualifications.map(
                                                                    (edu, index) => (
                                                                        <div>
                                                                            <li key={index}>{edu.institution}</li>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        //value={currentDoctor.education}
                                                        />
                                                        <ProfileRow
                                                            icon={experienceIcon}
                                                            title="Experience"
                                                            value={currentDoctor.experience}
                                                        />
                                                        <ProfileRow
                                                            icon={specialityIcon}
                                                            title="Specialities"
                                                            value={
                                                                currentDoctor &&
                                                                currentDoctor.specialities &&
                                                                currentDoctor.specialities.map(
                                                                    (speciality, index) => (
                                                                        <li key={index}>{speciality.name}</li>
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                        {/* <div style={{ marginTop: '10px' }}>
                                            <DoctorDocumentUpload
                                                currentDoctor={currentDoctor}
                                                isDoctor={true}
                                            />
                                        </div> */}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            )}
            {currentDoctor && toggleProfile.editProfile === true && (
                <Container>
                    <Row className="conflict_profile-form">
                        <Col md={2}></Col>
                        <Col md={8} id="profile-form" className="conflict_profile">
                            <br />

                            <div id="editProfile-col">
                                <ValidatorForm onSubmit={handleDetails}>
                                    <Row style={{ justifyContent: 'center', flexDirection: "column" }} >
                                        <ImageCropper setProfilePicture={setProfilePicture} imageUrl={currentDoctor.picture} />
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
                                                    <Col md={6}>
                                                        {/* <p>
                                                            Last Name<sup>*</sup>
                                                        </p> */}
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="text"
                                                            name="lastName"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={lastName}
                                                            // validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                            // errorMessages={["This field is required", "Last Name cannot have any numeric values"]}
                                                            variant="filled"
                                                            style={{ display: 'none' }}
                                                        />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={6}>
                                                        <p>Date of Birth</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={moment(dateOfBirth).format('YYYY-MM-DD')}
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
                                                                name: 'phone',
                                                                required: true,
                                                                maxLength: 20,
                                                                minLength: 12,
                                                            }}
                                                            country={'us'}
                                                            value={phone}
                                                            onChange={(e) => handlePhone(e)}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                </Row>
                                                <br />

                                                <br />

                                                <Row>
                                                    <Col md={6}>
                                                        <p>Nationality</p>
                                                        <FormControl>
                                                            <Select
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="countryName"
                                                                value={countryId}
                                                                displayEmpty
                                                                onChange={(e) => handleCountry(e)}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select</em>
                                                                </MenuItem>
                                                                {countryList &&
                                                                    countryList.map((option) => (
                                                                        <MenuItem value={option.id} key={option.id}>
                                                                            {option.name}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Col>
                                                    <Col md={6}>
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
                                                                <FormControlLabel
                                                                    value="OTHER"
                                                                    control={<Radio color="primary" />}
                                                                    label="Other"

                                                                />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
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
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <DoctorDocumentUpload
                                                            currentDoctor={currentDoctor}
                                                            isDoctor={true}
                                                            setDocumentinfo={setDocumentinfo}
                                                            setDocumentUpdateFile={setDocumentUpdateFile}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab>

                                        <Tab eventKey="education" title="Education">
                                            <div className="general-medical-tab">
                                                {currentDoctorData?.educationalQualifications.map((x, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <p>Education<sup>*</sup></p>
                                                                    <TextValidator id="standard-basic" type="text" name="educationalQualification"
                                                                        onChange={(e) => handleEducationDetailsInputChange(e, i)}
                                                                        value={x.educationalQualification}
                                                                        validators={['required']}
                                                                        errorMessages={['This field is required']}
                                                                        variant="filled"
                                                                        placeholder='Education' />

                                                                </Col>
                                                                <Col md={6}>
                                                                    <p>Institution<sup>*</sup></p>
                                                                    <TextValidator id="standard-basic" type="text" name="institution"
                                                                        onChange={(e) => handleEducationDetailsInputChange(e, i)}
                                                                        value={x.institution}
                                                                        validators={['required']}
                                                                        errorMessages={['This field is required']}
                                                                        variant="filled"
                                                                        placeholder='Institution' />

                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <div className="btn-box">
                                                                {currentDoctorData?.educationalQualifications.length !== 1 && (
                                                                    <Button
                                                                        className="medicineRemoveButton"
                                                                        variant="secondary"
                                                                        onClick={() => handleRemoveClick(i)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                                {currentDoctorData?.educationalQualifications.length - 1 === i && (
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
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Experience</p>
                                                        <TextValidator
                                                            id="standard-basic"
                                                            type="number"
                                                            name="experience"
                                                            onChange={(e) => handleInputChange(e)}
                                                            value={experience}
                                                            variant="filled"
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* </Row> */}
                                                <br />

                                                <Row>
                                                    <Col md={12}>
                                                        <p>Specialities</p>
                                                        <FormControl>
                                                            <div className="multiselect">
                                                                <Multiselect
                                                                    options={specialityOptions}
                                                                    onSelect={handleSpecialities}
                                                                    onRemove={removeSpecialities}
                                                                    selectedValues={specialities}
                                                                    displayValue="name"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        {specialityError && (
                                                            <p style={{ color: 'red' }}>
                                                                This field is required.
                                                            </p>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab>
                                    </Tabs>

                                    <br />
                                    <div className='edit-profile__button-wrapper'>
                                        <button
                                            className="btn btn-primary continue-btn"
                                            onClick={() => {
                                                // setDisplay({ ...display, profile: 'block', editProfile: 'none' })
                                                setToggleProfile({ ...toggleProfile, editProfile: false });
                                            }}
                                        >
                                            Go Back
                                        </button>

                                        <button
                                            className="btn btn-primary continue-btn"
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

            <Dialog aria-labelledby="customized-dialog-title" open={uploadOpen}>
                <DialogTitle id="customized-dialog-title">Upload Document</DialogTitle>
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
                                        multiple: true,
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
                                        required: true,
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
                        <button className="btn btn-primary text-light" type="submit">
                            Upload
                        </button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </div>
    );
};

export default Profile;

// onSubmit={handleDetails}
