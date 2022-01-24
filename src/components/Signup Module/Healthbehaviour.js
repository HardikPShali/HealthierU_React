import React, { Component } from 'react';
import './signup2.css';
//import TextField from '@material-ui/core/TextField';
//import PhoneInput from 'react-phone-input-2'
//import '../admin-module/user-management/node_modules/react-phone-input-2/lib/style.css'
//import InputLabel from '@material-ui/core/InputLabel';
//import MenuItem from '@material-ui/core/MenuItem';
//import Select from '@material-ui/core/Select';
//import FormControl from '@material-ui/core/FormControl';
//import Radio from '@material-ui/core/Radio';
//import RadioGroup from '@material-ui/core/RadioGroup';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormLabel from '@material-ui/core/FormLabel';
//import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class Healthbehaviour extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       msg: "",
//       firstname: "",
//       lastname: "",
//       dob: "",
//       phone: "",
//       nationality: "",
//       gender: "",
//       users: [],
//     };
//   }

//   handleFirstnameChange = e => {
//     this.setState({ firstname: e.target.value });
//     this.setState({ msg: "" });
//     //console.log(this.state.firstname);
//   };
//   handleLastnameChange = e => {
//     this.setState({ lastname: e.target.value });
//     this.setState({ msg: "" });
//     //console.log(this.state.firstname);
//   };

//   handleLogin = e => {
//     e.preventDefault();
//     const firstname = this.state.firstname.trim();
//     const lastname = this.state.lastname.trim();
//     //console.log('Firstname:', firstname);
//     //console.log('Lastname:', lastname);
//   }

  render () {
  return (
    <div className="wrapper">
      <div id="details">
        {/* <!-- Tabs Titles --> */}
        <h2 className="details-title1">Health Behaviours</h2>
        <p className="detail-desc1">Do You Suffer from Any of the Following?</p>
        {/* <!-- Login Form --> */}
        <div className="form-box">
        <form className="hb-form">
            <label className="hb-label">Family History</label>
            <div className="hb-left"><input type="radio" value="Heart Disease" name="fhistory" /><spna className="radio-text">Heart Disease</spna></div>
            <div className="hb-left"><input type="radio" value="Hypertension" name="fhistory" /><spna className="radio-text">Hypertension</spna></div>
            <div className="hb-left"><input type="radio" value="Hyperlipidemia" name="fhistory" /><spna className="radio-text">Hyperlipidemia</spna></div>
            <div className="hb-left"><input type="radio" value="Stroke" name="fhistory" /><spna className="radio-text">Stroke</spna></div>
            <div className="hb-left"><input type="radio" value="Syncope" name="fhistory" /><spna className="radio-text">Syncope</spna></div>
            <div className="hb-left"><input type="radio" value="Carotid or Vascular Disease" name="fhistory" /><spna className="radio-text">Carotid or Vascular Disease</spna></div>
            <div className="hb-left"><input type="radio" value="Diabetes" name="fhistory" /><spna className="radio-text">Diabetes</spna></div>
            <div className="hb-left"><input type="radio" value="Cancer" name="fhistory" /><spna className="radio-text">Cancer</spna></div>
            <div className="hb-left"><input type="radio" value="Thyroid Disease" name="fhistory" /><spna className="radio-text">Thyroid Disease</spna></div>
            <div className="hb-left"><input type="radio" value="Sudden Death" name="fhistory" /><spna className="radio-text">Sudden Death</spna></div>
            <label className="hb-label">Social History</label>
            <div className="hb-left"><input type="radio" value="Smoking" name="shistory" /><spna className="radio-text">Smoking</spna></div>
            <div className="hb-left"><input type="radio" value="Alcohol" name="shistory" /><spna className="radio-text">Alcohol</spna></div>
            <div className="hb-left"><input type="radio" value="Elicit Drugs" name="shistory" /><spna className="radio-text">Elicit Drugs</spna></div>
            <div className="hb-left"><input type="radio" value="Narcotics" name="shistory" /><spna className="radio-text">Narcotics</spna></div>
            <div className="hb-left"><input type="radio" value="Opioid (Pain Medications)" name="shistory" /><spna className="radio-text">Opioid (Pain Medications</spna></div>
            <div className="hb-left"><input type="radio" value="Sleeping Medications" name="shistory" /><spna className="radio-text">Sleeping Medications</spna></div>
          <button className="btn btn-primary continue-btn" type="submit">Continue</button>
          </form>
        </div>
        
      </div>
    </div>
  );
};
};

export default Healthbehaviour;
