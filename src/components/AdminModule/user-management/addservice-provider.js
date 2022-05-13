import React, { useState, useEffect } from "react";
//import axios from 'axios';
import '../admin.css';
//import { Link, useHistory } from "react-router-dom";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import 'react-phone-input-2/lib/style.css'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker
} from '@material-ui/pickers';
import Navbar from '../layout/Navbar';
import 'mdbreact/dist/css/mdb.css';
import GoogleMapReact from 'google-map-react';
import previewImg from '../../../images/default_image.jpg';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import * as imageConversion from 'image-conversion';
import TransparentLoader from '../../Loader/transparentloader';
import $ from 'jquery';
import { Row } from 'react-bootstrap';

$(document).ready(function () {
    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });
});

const AnyReactComponent = ({ text }) => <div style={{
    color: 'white',
    background: 'grey',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
}}>{text}</div>;

const AddServiceProvider = () => {

    //let history = useHistory();
    const [transparentLoading, setTransparentLoading] = useState(false);
    const [user, setUser] = useState({
        title: "",
        description: "",
        categoriesId: "",
        number: "",
        email: "",
        type: "",
        closeTime: new Date(),
        day: "",
        openTime: new Date(),
        locationDescription: "",
        lat: null,
        lon: null,
        active: ''
    });

    const [profilePicture, setProfilePicture] = useState({});

    const [errorMsg, setErrorMsg] = useState({
        msg: ''
    });
    const [preview, setPreview] = useState()
    const { msg } = errorMsg;

    console.log(user);

    useEffect(() => {
        getLocation();
    }, []);

    const handleImageChange = (e) => {
        setTransparentLoading(true);
        const imageFile = e.target.files[0];
        if (!imageFile.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
            setErrorMsg({ ...errorMsg, msg: 'Image can only be PNG or JPG' });
            setTimeout(() => setTransparentLoading(false), 1000);
        }
        else {
            imageConversion.compressAccurately(imageFile, 300).then(res => {
                var compressdImageFile = new File([res], imageFile.name);
                setTransparentLoading(false);
                setErrorMsg({ ...errorMsg, msg: '' });
                setProfilePicture(compressdImageFile);
                const objectUrl = URL.createObjectURL(compressdImageFile)
                setPreview(objectUrl)
            }).catch(function (error) {
                setErrorMsg({ ...errorMsg, msg: 'Something went wrong in compression.' });
            });
        }
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        setUser({ ...user, lat: position.coords.latitude, lon: position.coords.longitude });
        //console.log("Latitude: ", position.coords.latitude,"Longitude: ", position.coords.longitude);
    }


    // const {phone} = updatedphone;
    const { title, description, categoriesId, email, number, openTime, closeTime, day, locationDescription, type, lat, lon, active } = user;
    const onInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
        //console.log(e.target.name, ":", e.target.value);
    };

    const handleOpenDateChange = (date) => {
        // setSelectedDate(date);
        setUser({ ...user, openTime: date.toISOString() })
    };
    const handleCloseDateChange = (date) => {
        // setSelectedDate(date);
        setUser({ ...user, closeTime: date.toISOString() })
    };

    const onSubmit = async e => {
        const serviceProviderData = {
            active: active,
            categories: [
                {
                    id: categoriesId
                }
            ],
            locations: [
                {
                    description: locationDescription,
                    lat: lat,
                    lon: lon
                }
            ],
            contacts: [{
                number: number,
                email: email,
                type: type
            }],
            openingHours: [
                {
                    closeTime: closeTime,
                    day: day,
                    openTime: openTime
                }
            ],
            description: description,
            lat: lat,
            lon: lon,
            title: title,
            profilePicture: profilePicture
        }
        //console.log("serviceProviderData :::  ", serviceProviderData)
        // e.preventDefault();
        // await axios.post("http://localhost:3003/users", user);
        // history.push("/");
    };
    const centers = {
        lat: lat,
        lng: lon
    }
    return (
        <div>

            {transparentLoading && (
                <TransparentLoader />
            )}
            <Navbar />
            <div className="container">
                <br />
                <div className="w-75 mx-auto shadow p-5">
                    <h2 className="text-center mb-4">Service Provider</h2>
                    <ValidatorForm onSubmit={e => onSubmit(e)} id="serviceProvide-form">
                        <Row style={{ justifyContent: 'center' }}>
                            <div className="small-12 medium-2 large-2 columns">
                                <div className="upload-button circle" style={{ "cursor": "pointer" }}>
                                    {/* <!-- User Profile Image --> */}
                                    <img className="profile-pic" src={preview ? preview : user && user.picture ? user.picture : previewImg} alt="" />
                                </div>

                                <div className="p-image">
                                    <AddAPhotoIcon className="upload-button" />
                                    <input className="file-upload" type="file" accept="image/*" onChange={e => handleImageChange(e)}
                                        variant="filled" />
                                </div>
                            </div>
                        </Row>
                        <div style={{ fontSize: '12px', color: 'red', textAlign: 'center' }}>{msg}</div>
                        <br />
                        <p>Title</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter Title"
                                name="title"
                                value={title}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Description</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter description"
                                name="description"
                                value={description}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Category</p>
                        <FormControl>
                            <Select
                                id="demo-controlled-open-select"
                                name="categoriesId"
                                value={categoriesId}
                                displayEmpty
                                onChange={e => onInputChange(e)}
                            >
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                {/* {country.map((option, index) => ( */}
                                <MenuItem value="1">Clinic</MenuItem>
                                <MenuItem value="2">Pharmacy</MenuItem>
                                {/* // ))} */}
                            </Select>
                        </FormControl>
                        <br />
                        <hr />
                        <h3>Contact Information</h3>
                        <p>Phone Number</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                labels="Phone Number"
                                placeholder="Enter phone number"
                                name="number"
                                inputProps={{
                                    maxLength: "12"
                                }}
                                value={number}
                                validators={['required', 'isNumber']}
                                errorMessages={['This field is required', 'Please Enter valid number']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Email</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter Email"
                                name="email"
                                value={email}
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', 'Provide valid email.']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Type</p>
                        <div className="form-group">
                            <FormControl>
                                <Select
                                    id="demo-controlled-open-select"

                                    name="type"
                                    value={type}
                                    onChange={e => onInputChange(e)}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    <MenuItem value="Home">Home</MenuItem>
                                    <MenuItem value="Office">Office</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <hr />
                        <h3>Opening Hours</h3>
                        <p>Day</p>
                        <div className="form-group">
                            <FormControl>
                                <Select
                                    id="demo-controlled-open-select"

                                    name="day"
                                    value={day}
                                    onChange={e => onInputChange(e)}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <p>Opening hours</p>
                        <div className="form-group">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    value={openTime}
                                    onChange={handleOpenDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <p>Closing hours</p>
                        <div className="form-group">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    value={closeTime}
                                    onChange={handleCloseDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <hr />
                        <h3>Location</h3>
                        <p>Address</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter Address"
                                name="locationDescription"
                                value={locationDescription}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Latitude</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter Latitude"
                                name="lat"
                                value={lat}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <p>Longitude</p>
                        <div className="form-group">
                            <TextValidator
                                type="text"
                                placeholder="Enter Longitude"
                                name="lon"
                                value={lon}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={e => onInputChange(e)}
                            />
                        </div>
                        <hr />
                        <div style={{ height: '300px', width: '100%' }}>
                            <GoogleMapReact
                                yesIWantToUseGoogleMapApiInternals={true}
                                defaultCenter={centers}
                                defaultZoom={18}
                            >
                                <AnyReactComponent
                                    lat={lat}
                                    lng={lon}
                                    text="My Location"
                                />
                            </GoogleMapReact>
                        </div>
                        <br />
                        <p>Active</p>
                        <div className="form-group">
                            <FormControl>
                                <Select
                                    id="demo-controlled-open-select"
                                
                                    name="active"
                                    value={active}
                                    onChange={e => onInputChange(e)}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    <MenuItem value="true">True</MenuItem>
                                    <MenuItem value="false">False</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <button className="btn btn-primary btn-block">Add Service</button>
                    </ValidatorForm>
                </div>
            </div>
            <br />
        </div>
    );
};

export default AddServiceProvider;
