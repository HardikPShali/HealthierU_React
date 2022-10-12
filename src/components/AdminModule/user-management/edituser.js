import React, { useState, useEffect } from 'react';
// import axios from "axios";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  //Link,
  useParams,
  useHistory,
} from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Navbar from '../layout/Navbar';
import 'mdbreact/dist/css/mdb.css';
import Loader from '../../Loader/Loader';
import TransparentLoader from '../../Loader/transparentloader';
// import LocalStorageService from '../../../util/LocalStorageService';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { Multiselect } from 'multiselect-react-dropdown';
import Select from '@material-ui/core/Select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  //Container,
  Row,
  Col,
} from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import $ from 'jquery';
//import { checkAccessToken } from '../../../service/RefreshTokenService';
import ImageCropper from '../../CommonModule/ImageCroper';
import {
  getUserByUserId,
  getCountryList,
  getSpecialityList,
  getLanguageList,
  updateRoleDoctor,
  updateRolePatient,
  // updateUserData
} from '../../../service/adminbackendservices';
import {
  updateDoctorDocumentNew,
  getDoctorDocument
} from '../../../service/frontendapiservices'
import DoctorDocumentUpload from '../../CommonModule/doctordocumentupload';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

$(document).ready(function () {
  $('.upload-button').on('click', function () {
    $('.file-upload').click();
  });
});

const EditUser = (props) => {
  const { selectedId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  // const [currentUser, setCurrentUser] = useState({});
  const [speciality, setSpeciality] = useState({
    specialityOptions: [],
  });
  const { specialityOptions } = speciality;
  const [language, setLanguage] = useState({
    languageOptions: [],
  });
  const { languageOptions } = language;
  const [options, Setoption] = useState({
    countryList: [],
  });

  const [profilePicture, setProfilePicture] = useState({});

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { countryList } = options;

  const [educationList, setEducationList] = useState([
    { institution: '', educationalQualification: '' },
  ]);
  const [updatedExperience, setUpdatedExperience] = useState(0)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    countryId: '',
    gender: '',
    email: '',
    // rate: 0,
    // halfRate: 0,
    // education: '',
    educationalQualifications: [],
    specialities: [],
    salutation: '',
    experience: '',
    experienceWithMonths: '',
    languages: [],
    certificates: '',
    awards: '',
    address: '',
    maritalStatus: '',
    lowBp: '',
    highBp: '',
    weight: '',
    height: '',
    langKey: '',
    authorities: [],
    modeOfEmployment: '',
    affiliation: '',
    licenseNumber: '',
    referencePhoneNumber: '',
    certifyingBody: ''
  });
  const cookies = new Cookies();
  const [documentInfo, setDocumentinfo] = useState({})
  const [documentUpdateFile, setDocumentUpdateFile] = useState()
  const [doctorId, setDoctorId] = useState(0)
  const [checkDoctorDocument, setCheckDoctorDocument] = useState(false)

  useEffect(() => {
    getCurrentUser();
    loadOptions();
    loadSpeciality();
    loadLanguage();

  }, []);
  useEffect(() => {

    if (user.salutation === '') {
      setUser({ ...user, salutation: 'non-doc' })
    }
  }, [user]);
  // const userState = props.location.state;
  const currentUserAuthorities = cookies.get('authorities');
  const authorityName =
    currentUserAuthorities === 'ROLE_DOCTOR'
      ? 'doctors'
      : currentUserAuthorities === 'ROLE_PATIENT'
        ? 'patients'
        : '';

  const getCurrentUser = async () => {
    const res = await getUserByUserId(authorityName, selectedId);
    if (res && res.data) {
      if (authorityName === 'patients') {
        setUser(res.data[0]);
      } else if (authorityName === 'doctors') {
        setUser(res.data.doctors[0]);
        setDoctorId(res.data.doctors[0])
        setUpdatedExperience(res.data.doctors[0].experienceWithMonths)
      }
      setTimeout(() => setTransparentLoading(false), 1000);
    }

  };
  const loadOptions = async () => {
    const res = await getCountryList();
    if (res && res.data) {
      Setoption({ countryList: res.data.data });
      setTimeout(() => setLoading(false), 1000);
    }
  };
  const loadSpeciality = async () => {
    const res = await getSpecialityList();
    if (res && res.data) {
      setSpeciality({ specialityOptions: res.data.data });
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const {
    firstName,
    lastName,
    dateOfBirth,
    phone,
    countryId,
    gender,
    email,
    // education,
    // rate,
    // halfRate,
    //picture,
    specialities,
    salutation,
    experience,
    experienceWithMonths,
    languages,
    certificates,
    awards,
    address,
    maritalStatus,
    lowBp,
    highBp,
    weight,
    height,
    educationalQualifications,
    modeOfEmployment,
    affiliation,
    rate,
    halfRate,
    licenseNumber,
    referencePhoneNumber,
    certifyingBody
  } = user;
  //const onInputChange = e => {
  //setUser({ ...user, [e.target.name]: e.target.value });
  // };
  const handleRefPhone = (e) => {
    setUser({ ...user, referencePhoneNumber: e });
  };
  const handleSpecialities = (selectedList, selectedItem) => {
    // e.preventDefault()
    specialities.push({ id: selectedItem.id });
  };
  const handleLanguages = (selectedList, selectedItem) => {
    // e.preventDefault()
    languages.push({ name: selectedItem.name });
  };
  const loadLanguage = async () => {
    //var getLanguageList = {
    //  method: 'get',
    //  url: `/api/languages`,
    //  headers: {
    //    'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
    //    'Content-Type': 'application/json'
    //  }
    //};
    const res = await getLanguageList();
    if (res && res.data) {
      setLanguage({ languageOptions: res.data.data });
      setTimeout(() => setLoading(false), 1000);
    }
    // .catch(error => {
    //   if (error.response && error.response.status === 401) {
    //     checkAccessToken();
    //   }
    // })
  };

  const removeSpecialities = (selectedList, removedItem) => {
    var array = specialities;
    var index = array.indexOf(removedItem); // Let's say it's Bob.
    array.splice(index, 1);
    setUser({ ...user, specialities: array });
  };
  const removeLanguages = (selectedList, removedItem) => {
    var array = languages;
    var index = array.indexOf(removedItem); // Let's say it's Bob.
    array.splice(index, 1);
    setUser({ ...user, languages: array });
  };
  const handleInputChange = (e) => {
    let value;
    if ((e.target.name === "rate" || e.target.name === "halfRate") && (e.target.value % 1 !== '0')) {
      if (e.target.value !== '0') {
        value = parseFloat(e.target.value);
      }
      else {
        toast.error("Invalid Rate or Half rate!")
      }
    }
    else if (e.target.name === "experience") {
      const experienceValue = e.target.value
      const convertedValue = experienceValue.split('.')
      if (convertedValue[1]) {
        if (convertedValue[1] > 0 && convertedValue[1] <= 11) {
          setUser({ ...user, [e.target.name]: e.target.value });
          setUpdatedExperience(e.target.value)
        }
        else {
          setUpdatedExperience(experienceWithMonths)
          toast.error("Please enter valid experience", {
            toastId: 'experienceValue'
          })
        }
      }
      else {
        setUser({ ...user, [e.target.name]: e.target.value });
        setUpdatedExperience(e.target.value)
      }
    }
    else {
      value = e.target.value;
      setUser({ ...user, [e.target.name]: value });
    }
  };

  const handlePhone = (e) => {
    const appendPlus = "+" + e
    setUser({ ...user, phone: appendPlus });
  };
  const handleCountry = (e) => {
    setUser({ ...user, countryId: e.target.value });
  };

  const handleDateChange = (e) => {
    const d = new Date(e.target.value);
    const isoDate = d.toISOString();
    setUser({ ...user, dateOfBirth: isoDate });
  };

  const handleDetails = async (e) => {
    setTransparentLoading(true);
    const patientPayload = {
      address: user.address,
      bloodGroup: user.bloodGroup,
      countryId: user.countryId,
      countryName: user.countryName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      firstName: user.firstName,
      gender: user.gender,
      height: user.height,
      highBp: user.highBp,
      rate: user.rate,
      halfRate: user.halfRate,
      id: user.id,
      languages: user.languages,
      lastName: user.lastName,
      lowBp: user.lowBp,
      maritalStatus: user.maritalStatus,
      middleName: user.middleName,
      phone: user.phone,
      picture: user.picture,
      userId: user.userId,
      weight: user.weight,
    };
    var bodyFormData = new FormData();
    if (currentUserAuthorities === 'ROLE_PATIENT') {
      bodyFormData.append('profileData', JSON.stringify(patientPayload));
      const response = await updateRolePatient(bodyFormData).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setTransparentLoading(false);
          toast.error("Something went wrong.Please try again!")
          history.go(0)
        }
      });
      if (response.status === 200 || response.status === 201) {
        // user.login = userState.login;
        // user.langKey = userState.langKey;
        // user.authorities = userState.authorities;
        // const userResponse = await updateUserData(user);
        // if (userResponse) {
        //window.location.assign("/admin");
        history.push('/admin');
        toast.success("Profile Data Updated")
        //}
      }
    }
    if (currentUserAuthorities === 'ROLE_DOCTOR') {
      let res;

      if (user.salutation === 'non-doc') {
        user.salutation = ''
      }

      bodyFormData.append('profileData', JSON.stringify(user));
      bodyFormData.append('profilePicture', profilePicture);
      const response = await updateRoleDoctor(bodyFormData).catch((err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setTransparentLoading(false);
          toast.error("Something went wrong.Please try again!")
          //history.go(0)
        }
      });
      if (documentInfo.document && documentInfo.licenseNumber && documentInfo.certifyingBody && documentInfo.referencePhoneNumber) {
        const info = {
          doctorId: user.id,
          licenseNumber: documentInfo.licenseNumber,
          referencePhoneNumber: documentInfo.referencePhoneNumber,
          certifyingBody: documentInfo.certifyingBody
        }

        res = await updateDoctorDocumentNew(info).catch(err => {
          if (err.response.status === 500 || err.response.status === 504) {
            setTransparentLoading(false);
            toast.error("Something went wrong.Please try again!")
            //history.go(0)
          }
        });

        if (response.status === 200 || response.status === 201 && res.status === 200) {
          history.push('/admin');
          toast.success("Profile Data Updated")
        }
        if (!documentUpdateFile && !documentInfo) {
          toast.error("Please add document details")
        }
      }
      else {
        // setTimeout(() => {
        setTransparentLoading(false);
        handleClose()
        toast.error("Please add license/registration number and subsequent documents")
        // }, 5000)
      }
    }
  };

  const now = new Date();
  const newDate = now.setDate(now.getDate() - 1);
  let maxDate;
  const role = cookies.get('authorities');
  if (role === 'ROLE_DOCTOR') {
    maxDate = {
      max: moment(newDate).format('YYYY-MM-DD'),
      min: moment(now)
        .subtract(75, 'years')
        .format('YYYY-MM-DD'),
    };
  }

  if (role === 'ROLE_PATIENT') {
    maxDate = {
      max: moment(newDate).format('YYYY-MM-DD'),
      min: moment(now)
        .subtract(100, 'years')
        .format('YYYY-MM-DD'),
    };
  }

  // handle input change
  const handleEducationDetailsInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...user.educationalQualifications];
    list[index][name] = value;
    setEducationList(list);
    setUser({ ...user, educationalQualifications: list });
  };
  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...user.educationalQualifications];
    list.splice(index, 1);
    setUser({ ...user, educationalQualifications: list });
  };
  // handle click event of the Add button
  const handleAddClick = () => {
    const list = [...user.educationalQualifications];
    list.push({ institution: '', educationalQualification: '' })
    setUser({ ...user, educationalQualifications: list });
  };
  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Navbar pageTitle="home" />
      <div className="container">
        <button className="btn btn-primary" onClick={() => history.goBack()}>
          Browse Back
        </button>
        <div className="w-75 mx-auto shadow p-5 edit-box">
          <Row style={{ justifyContent: 'center', flexDirection: "column" }}>
            {currentUserAuthorities &&
              currentUserAuthorities === 'ROLE_DOCTOR' && (
                <ImageCropper
                  setProfilePicture={setProfilePicture}
                  imageUrl={user.picture}
                  role={'Admin'}
                />
              )}
          </Row>
          <ValidatorForm onSubmit={handleClickOpen}>
            <h2 className="text-center mb-4">
              Edit {firstName} {lastName}
            </h2>
            <Row>
              <Col md={12}>
                <p>Full Name</p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="firstName"
                  onChange={(e) => handleInputChange(e)}
                  value={firstName ? firstName : ''}
                  variant="filled"
                />
              </Col>
              {/* <Col md={6}>
                <p>Last Name</p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="lastName"
                  onChange={(e) => handleInputChange(e)}
                  value={lastName ? lastName : ''}
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
                  value={moment(dateOfBirth).format('YYYY-MM-DD')}
                  inputProps={maxDate}
                  InputLabelProps={{ shrink: true }}
                  variant="filled"
                  onChange={(e) => handleDateChange(e)}
                  onKeyDown={(e) => e.preventDefault()}
                />
              </Col>
              <Col md={6}>
                <p>Email</p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="email"
                  value={email ? email : ''}
                  disabled
                  variant="filled"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <p>Mobile Number</p>
                <PhoneInput
                  inputProps={{
                    name: 'phone',
                    maxLength: 16,
                    minLength: 12,
                  }}
                  country={'us'}
                  value={phone ? phone : ''}
                  onChange={(e) => handlePhone(e)}
                  variant="filled"
                />
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
                    value={gender ? gender : ''}
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
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <p>Address</p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="address"
                  onChange={(e) => handleInputChange(e)}
                  value={address ? address : ''}
                  variant="filled"
                />
              </Col>
            </Row>
            <br />
            {currentUserAuthorities === 'ROLE_DOCTOR' && (
              <>
                <Row>
                  <Col md={6}>
                    <p>Rate for 1hr in $</p>
                    <TextValidator
                      id="standard-basic"
                      type="number"
                      name="rate"
                      onChange={(e) => handleInputChange(e)}
                      value={rate ? rate : ''}
                      // inputProps={{
                      //   min: 0.01,
                      //   step: 0.01,
                      //   required: true,
                      // }}
                      validators={['required']}
                      errorMessages={['This field is required']}
                      variant="filled"
                    />
                  </Col>
                  <Col md={6}>
                    <p>Rate for 30min in $</p>
                    <TextValidator
                      id="standard-basic"
                      type="number"
                      name="halfRate"
                      onChange={(e) => handleInputChange(e)}
                      value={halfRate ? halfRate : ''}
                      // inputProps={{
                      //   min: 0.01,
                      //   step: 0.01,
                      //   required: true,
                      // }}
                      validators={['required']}
                      errorMessages={['This field is required']}
                      variant="filled"
                    />
                  </Col>
                </Row>
                <br />
              </>
            )}
            <br />
            {currentUserAuthorities === 'ROLE_PATIENT' && (
              <>
                <Row>
                  <Col md={6}>
                    <p>Nationality</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="countryId"
                        value={countryId ? countryId : ''}
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
                    <p>Marital Status</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="maritalStatus"
                        value={maritalStatus ? maritalStatus : ''}
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
                          variant='filled'
                        />
                      </div>
                    </FormControl>
                  </Col>
                </Row>

                <br />
                <br />
                <Row>
                  <Col md={6}>
                    <p>Weight(in kg)</p>
                    <TextValidator
                      id="standard-basic"
                      type="number"
                      name="weight"
                      onChange={(e) => handleInputChange(e)}
                      value={weight ? weight : ''}
                      inputProps={{
                        min: 0,
                        max: 999,
                      }}
                      variant="filled"
                    />
                  </Col>
                  <Col md={6}>
                    <p>Height(in cm)</p>
                    <TextValidator
                      id="standard-basic"
                      type="number"
                      name="height"
                      onChange={(e) => handleInputChange(e)}
                      value={height ? height : ''}
                      inputProps={{
                        min: 0,
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
                      value={highBp ? highBp : ''}
                      inputProps={{
                        min: 0,
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
                      value={lowBp ? lowBp : ''}
                      inputProps={{
                        min: 0,
                        max: 200,
                      }}
                      variant="filled"
                    />
                  </Col>
                </Row>
                <br />
              </>
            )}
            {currentUserAuthorities === 'ROLE_DOCTOR' && (
              <>
                <Row>
                  <Col md={6}>
                    <p>Nationality</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="countryId"
                        value={countryId ? countryId : ''}
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
                  <Col md={6}>
                    <p>Salutation</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="salutation"
                        value={salutation ? salutation : ''}
                        displayEmpty
                        inputProps={{ required: true }}
                        onChange={e => handleInputChange(e)}
                      >

                        <MenuItem value='non-doc'>
                          Health and Wellness/Non-Medical
                        </MenuItem>
                        <MenuItem value='Dr.'>
                          Doctor/Medical
                        </MenuItem>

                      </Select>
                    </FormControl>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6}>
                    <p>Years of experience</p>
                    <TextValidator id="standard-basic" type="number" name="experience"
                      onChange={e => handleInputChange(e)}
                      value={updatedExperience}
                      variant="filled"
                      validators={[
                        'required',
                        'minNumber:0',
                        'maxNumber:50',
                      ]}
                      errorMessages={[
                        'This field is required',
                        'Invalid Experience',
                        'Invalid Experience',
                      ]}
                      placeholder='Years of experience' />
                  </Col>
                  <Col md={6}>
                    <p>Specialization</p>
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
                  </Col>
                </Row>
                <br />
                {/* <Row>
                  <Col md={6}>
                    <p>Other Certifications (optional)</p>
                    <TextValidator
                      id="standard-basic"
                      type="text"
                      name="certificates"
                      onChange={(e) => handleInputChange(e)}
                      value={certificates ? certificates : ''}
                      variant="filled"
                      placeholder="Example: MBBS, MD ..."
                      inputProps={{
                        title: 'Make it comma (,) separated.',
                      }}
                    />
                  </Col>
                  <br />
                  <Col md={6}>
                    <p>Awards (optional)</p>
                    <TextValidator
                      id="standard-basic"
                      type="text"
                      name="awards"
                      onChange={(e) => handleInputChange(e)}
                      value={awards ? awards : ''}
                      variant="filled"
                      placeholder="Example: People's Doctor of the USA, etc ..."
                      inputProps={{
                        title: 'Make it comma (,) separated.',
                      }}
                    />
                    <br />
                  </Col>
                </Row> */}
                <Row>
                  <Col md={6}>
                    <p>Mode of Employment</p>
                    <FormControl>
                      <Select
                        id="demo-controlled-open-select"
                        variant="filled"
                        name="modeOfEmployment"
                        value={modeOfEmployment ? modeOfEmployment : ''}
                        displayEmpty
                        inputProps={{ required: true }}
                        onChange={e => handleInputChange(e)}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        <MenuItem value="Self - Employed">Self - Employed</MenuItem>
                        <MenuItem value="Employed">Employed</MenuItem>

                      </Select>
                    </FormControl>
                  </Col>
                  <Col md={6}>
                    <p>Affiliation</p>
                    <TextValidator
                      id="standard-basic"
                      type="text"
                      name="affiliation"
                      onChange={(e) => handleInputChange(e)}
                      inputProps={{
                        min: 0,
                        max: 80,
                        step: 0.1,
                      }}
                      value={affiliation ? affiliation : ''}
                      variant="filled"
                    />
                  </Col>
                </Row>
                <br />
                {user?.educationalQualifications.map((x, i) => {
                  return (
                    <div key={i}>
                      <Row>
                        <Col md={6}>
                          <p>
                            Education<sup>*</sup>
                          </p>
                          <TextValidator
                            id="standard-basic"
                            type="text"
                            name="educationalQualification"
                            onChange={(e) =>
                              handleEducationDetailsInputChange(e, i)
                            }
                            value={x.educationalQualification}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            variant="filled"
                            placeholder="Education"
                          />
                        </Col>
                        <Col md={6}>
                          <p>
                            Institution<sup>*</sup>
                          </p>
                          <TextValidator
                            id="standard-basic"
                            type="text"
                            name="institution"
                            onChange={(e) =>
                              handleEducationDetailsInputChange(e, i)
                            }
                            value={x.institution}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            variant="filled"
                            placeholder="Institution"
                          />
                        </Col>
                      </Row>
                      <br />
                      <div className="btn-box" style={{ marginLeft: '12px' }}>
                        {user?.educationalQualifications.length !== 1 && (
                          <Button
                            variant="secondary"
                            onClick={() => handleRemoveClick(i)}
                          >
                            Remove
                          </Button>
                        )}
                        {user?.educationalQualifications.length - 1 === i && (
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
                <DoctorDocumentUpload currentDoctor={user} isDoctor={false} setDocumentinfo={setDocumentinfo} documentInfo={documentInfo} setDocumentUpdateFile={setDocumentUpdateFile} />
              </>
            )}
            <div className="text-center">
              <button className="btn btn-primary continue-btn" type="submit">
                Update user
              </button>
            </div>
          </ValidatorForm>
        </div>
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Are you sure to update the data?
        </DialogTitle>
        <DialogActions>
          <button
            autoFocus
            onClick={() => handleDetails()}
            className="btn btn-primary sign-btn"
          >
            OK
          </button>
          <button
            autoFocus
            onClick={handleClose}
            className="btn btn-primary sign-btn"
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditUser;
