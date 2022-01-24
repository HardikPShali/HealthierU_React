import React, { useState, useEffect } from "react";
import axios from 'axios'
import '../admin.css'
import { Link, useHistory } from "react-router-dom";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import LocalStorageService from '../../../util/LocalStorageService';
import properties from "../../../properties";
import Loader from '../../Loader/Loader';
import Navbar from '../layout/Navbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import 'mdbreact/dist/css/mdb.css';

const isnum = /\d/;
const islow = "(?=.*[a-z])";
const isup = "(?=.*[A-Z])";
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddUser = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const classes = useStyles();

  let history = useHistory();
  const [user, setUser] = useState({
    login: "",
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    imageUrl: "",
    authorities: []
  });
  const handelRole = e => {
    e.preventDefault()
    setUser({ ...user, authorities: [e.target.value] })
  }
  // const [passwordValidity, setpasswordValidity] = useState({
  //   minchar: false,
  //   upcase: false,
  //   lowcase: false,
  //   num: false
  // })
  // const {phone} = updatedphone;
  const { firstName, lastName, email, login,
    // imageUrl, 
    password, authorities
  } = user;
  // const { 
  //   minchar, upcase, lowcase, num 
  // } = passwordValidity;

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
    //console.log(e.target.name, ":", e.target.value);
  };
  const handleInputchange = e => {
    e.preventDefault()
    setUser({ ...user, [e.target.name]: e.target.value });
    // if (e.target.name === "password") {
    //   const passvalue = e.target.value;
    //   setpasswordValidity({
    //     minchar: passvalue.length >= 8 ? true : false,
    //     num: passvalue.match(isnum) ? true : false,
    //     lowcase: passvalue.match(islow) ? true : false,
    //     upcase: passvalue.match(isup) ? true : false
    //   })
    // }
    //console.log(user);
  };
  var addUser = {
    method: 'post',
    data: JSON.stringify(user),
    url: properties.UAA + '/api/register',
    headers: {
      'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
      'Content-Type': 'application/json'
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    const result = await axios(addUser).catch(err => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    if (result)
      history.push("/admin");
  };

  return (
    <div>
      {loading && (
        <Loader />
      )}
      <Navbar />
      <div className="container">
        <br />
        <Link title="Back to home" to="/admin">
          <ArrowBackIcon className="arrowBackbtn" />
        </Link>
        <div className="w-75 mx-auto shadow p-5">
          <h2 className="text-center mb-4">Add A User</h2>
          <ValidatorForm onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <TextValidator
                type="text"
                placeholder="Enter Email"
                name="email"
                value={email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Please provide a valid email']}
                onChange={e => onInputChange(e)}
              />
            </div>
            <div className="form-group">
              <TextValidator
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                value={firstName}
                validators={['required']}
                errorMessages={['This field is required']}
                onChange={e => onInputChange(e)}
              />
            </div>
            <div className="form-group">
              <TextValidator
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                value={lastName}
                validators={['required']}
                errorMessages={['This field is required']}
                onChange={e => onInputChange(e)}
              />
            </div>
            <div className="form-group">
              <TextValidator
                type="text"
                placeholder="Username"
                name="login"
                value={login}
                validators={['required']}
                errorMessages={['This field is required']}
                onChange={e => onInputChange(e)}
              />
              <TextValidator id="standard-basic" placeholder="Password" type="password" name="password"
                onBlur={e => handleInputchange(e)}
                onChange={e => handleInputchange(e)}
                value={password}
                validators={['required', 'minStringLength:8', 'matchRegexp:(?=.*[a-z])', 'matchRegexp:(?=.*[A-Z])', 'matchRegexp:(?=.*[0-9])']}
                errorMessages={['This field is required', '', '', '', '']} />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="authorities"
                  value={authorities}
                  onChange={e => handelRole(e)}
                >
                  <MenuItem value="ROLE_DOCTOR">Doctor</MenuItem>
                  <MenuItem value="ROLE_PATIENT">Patient</MenuItem>
                  <MenuItem value="ROLE_USER">Physical Trainer</MenuItem>
                </Select>
              </FormControl>
            </div>
            <button className="btn btn-primary btn-block">Add User</button>
          </ValidatorForm>
        </div>
      </div>
    </div>
  );
};

export default AddUser;