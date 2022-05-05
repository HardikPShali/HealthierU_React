// import React, { useEffect, useState } from "react";
// import { useHistory } from 'react-router-dom';
// //import axios from 'axios'
// import Header from "../Login-Module/Header";
// import Footer from "../Login-Module/Footer";
// import "../Login-Module/landing.css";
// import { Container, Row, Col } from "react-bootstrap";
// import {
//   Link,
//   // useHistory
// } from "react-router-dom";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import Visibility from "@material-ui/icons/Visibility";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";
// //import properties from "../../properties";
// import Loader from "./../Loader/Loader";
// import TransparentLoader from "../Loader/transparentloader";
// import doctorSVG from "../../images/doctorSVG.svg";
// import patientSVG from "../../images/patientSVG.svg";
// import physical_trainerSVG from "../../images/physicaltrainerSVG.svg";
// import Cookies from "universal-cookie";
// import { getCurrentUserInfo } from "./../../service/AccountService";
// import { handleGoogleAuth } from "./../../service/googleapiservice";
// import LocalStorageService from "./../../util/LocalStorageService";
// import { signupWithEmail } from "../../service/frontendapiservices";
// import { CAPTCHA_SITE_KEY } from "./../../util/configurations";
// import ReCAPTCHA from "react-google-recaptcha";

// const isnum = "(?=.*[0-9!@*$_])";
// const islow = "(?=.*[a-z])";
// const isup = "(?=.*[A-Z])";
// // const history = useHistory();

// const Signupform = () => {
//   const [loading, setLoading] = useState(true);
//   const [transparentLoading, setTransparentLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState({
//     userNameExistance: "",
//     emailExistance: "",
//   });
//   const { userNameExistance, emailExistance } = errorMsg;
//   const cookies = new Cookies();
//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);
//   const history = useHistory();
//   const googleAccessToken = cookies.get("GOOGLE_ACCESS_TOKEN");
//   const googleProfileData = cookies.get("GOOGLE_PROFILE_DATA");
//   //console.log("googleAccessToken :::::", googleAccessToken);
//   //console.log("googleProfileData ::::::", googleProfileData);
//   // let history = useHistory();
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const [user, setUser] = useState({
//     firstName:
//       googleProfileData && googleProfileData.givenName
//         ? googleProfileData.givenName
//         : "",
//     lastName:
//       googleProfileData && googleProfileData.familyName
//         ? googleProfileData.familyName
//         : "",
//     email:
//       googleProfileData && googleProfileData.email
//         ? googleProfileData.email
//         : "",
//     login:
//       googleProfileData && googleProfileData.email
//         ? googleProfileData.email
//         : "",
//     imageUrl:
//       googleProfileData && googleProfileData.imageUrl
//         ? googleProfileData.imageUrl
//         : "",
//     password: "",
//     langKey: "en",
//     authorities: [],
//   });

//   //console.log("user ::::::::::::", user);
//   const [passwordValidity, setpasswordValidity] = useState({
//     minchar: false,
//     upcase: false,
//     lowcase: false,
//     num: false,
//   });

//   const {
//     firstName,
//     lastName,
//     email,
//     login,
//     // imageUrl,
//     password,
//     authorities,
//   } = user;
//   const { minchar, upcase, lowcase, num } = passwordValidity;

//   const handleDoctorClick = () => {
//     const value = "ROLE_DOCTOR";
//     setUser({ ...user, authorities: [] });
//     authorities.push(value);
//     if (
//       authorities &&
//       authorities.length > 0 &&
//       authorities.some((role) => role === "ROLE_DOCTOR")
//     ) {
//       handleSignup();
//     }
//   };
//   const handlePatientClick = () => {
//     const value = "ROLE_PATIENT";
//     setUser({ ...user, authorities: [] });
//     authorities.push(value);
//     if (
//       authorities &&
//       authorities.length > 0 &&
//       authorities.some((role) => role === "ROLE_PATIENT")
//     ) {
//       handleSignup();
//     }
//   };
//   const handlePhysicaltrainerClick = () => {
//     //const value = "UNKNOWN";
//     //setUser({ ...user, authorities: [value] })
//     handleComingSoonOpen();
//   };

//   const [comingSoon, setComingSoon] = useState(false);

//   const handleComingSoonOpen = () => {
//     setComingSoon(true);
//   };

//   const handleComingSoonClose = () => {
//     setComingSoon(false);
//   };

//   const handleInputchange = (e) => {
//     if (e.target.value === " ") {
//       e.preventDefault();
//     } else {
//       setUser({ ...user, [e.target.name]: e.target.value });
//       if (e.target.name === "password") {
//         const passvalue = e.target.value;
//         setpasswordValidity({
//           minchar: passvalue.length >= 8 ? true : false,
//           num: passvalue.match(isnum) ? true : false,
//           lowcase: passvalue.match(islow) ? true : false,
//           upcase: passvalue.match(isup) ? true : false,
//         });
//       }
//     }
//   };

//   const emailValidator = new RegExp(
//     "^[a-zA-Z0-9_.]+@([a-zA-Z0-9]+[.]+[a-zA-Z]{2,})$"
//   );

//   const usernameValidator = new RegExp("^[_.@A-Za-z0-9-]*$");
//   const nameValidator = new RegExp("^[_.A-Za-z0-9 ]*$");
//   ValidatorForm.addValidationRule("isValidEmail", (value) => {
//     if (!emailValidator.test(value)) {
//       return false;
//     } else if (emailValidator.test(value)) {
//       return true;
//     }
//   });

//   ValidatorForm.addValidationRule("isValidUserName", (value) => {
//     if (!usernameValidator.test(value)) {
//       return false;
//     } else if (usernameValidator.test(value)) {
//       return true;
//     }
//   });

//   ValidatorForm.addValidationRule("isValidName", (value) => {
//     if (!nameValidator.test(value)) {
//       return false;
//     } else if (nameValidator.test(value)) {
//       return true;
//     }
//   });

//   ValidatorForm.addValidationRule("isHavingSpace", (value) => {
//     if (/^\s/.test(value)) {
//       return false;
//     } else if (!/^\s/.test(value)) {
//       return true;
//     }
//   });

//   // const [captchaError, setCaptchaError] = useState("");
//   // const [captchaVerify, setCaptchaVerify] = useState(false);

//   // const handleRecaptchaChange = (value) => {
//   //   if (value !== null || value !== "") {
//   //     setCaptchaVerify(true);
//   //     setCaptchaError("");
//   //   } else {
//   //     setCaptchaVerify(false);
//   //   }
//   // };

//   const handleSignup = async () => {
//     //if (captchaVerify) {
//       setTransparentLoading(true);
//       if (googleAccessToken) {
//         const googleUserData = {
//           token: googleAccessToken,
//           authorities: authorities,
//         };
//         const _accessToken = await handleGoogleAuth(googleUserData).catch(
//           (err) => {
//             if (err.response.status === 500 || err.response.status === 504) {
//               setTransparentLoading(false);
//             }
//           }
//         );
//         cookies.set("currentUser", currentUserInformation);
//         const currentLoggedInUser = cookies.get("currentUser");
//         const { authorities = [] } = currentLoggedInUser || {};

//         if (authorities.some((user) => user === "ROLE_PATIENT")) {
//           history.push("/patient");
//         }
//         if (authorities.some((user) => user === "ROLE_DOCTOR")) {
//           history.push("/doctor");
//         }
//       }
//       if (!googleAccessToken) {
//         //var config = {
//         //  method: 'post',
//         //  mode: 'no-cors',
//         //  data: JSON.stringify(user),
//         //  url: properties.UAA + '/api/register',
//         //  headers: {
//         //    'Content-Type': 'application/json',
//         //    'Access-Control-Allow-Origin': '*'
//         //  }
//         //}

//         const response = await signupWithEmail(user).catch((error) => {
//           setTransparentLoading(false);
//           setDisplay({ ...display, signupForm: "block", whoyouAre: "none" });
//           if (
//             error.response &&
//             error.response.status === 400 &&
//             error.response.data.errorKey === "emailexists"
//           ) {
//             setErrorMsg({
//               ...errorMsg,
//               emailExistance: error.response.data.title,
//             });
//           } else if (
//             error.response &&
//             error.response.status === 400 &&
//             error.response.data.errorKey === "userexists"
//           ) {
//             setErrorMsg({
//               ...errorMsg,
//               userNameExistance: error.response.data.title,
//             });
//           }
//         });
//         if (response && response.status === 201) {
//           setTransparentLoading(false);
//           handleClickOpen();
//         }
//         //}).catch(error => {
//         //  if (error.response && error.response.status === 400 && error.response.data.errorKey === "emailexists") {
//         //    setErrorMsg({ ...errorMsg, emailExistance: error.response.data.title });
//         //  } else if (error.response && error.response.status === 400 && error.response.data.errorKey === "userexists") {
//         //    setErrorMsg({ ...errorMsg, userNameExistance: error.response.data.title });
//         //  }
//         //})
//       }
//     //} //else {
//       // setCaptchaError("Please verify captcha!");
//        setDisplay({ ...display, signupForm: "block", whoyouAre: "none" });
//     //}
//   };

//   const [passwordShown, setPasswordShown] = useState(false);
//   const handleClickShowPassword = () => {
//     setPasswordShown(passwordShown ? false : true);
//   };
//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const [display, setDisplay] = useState({
//     signupForm: "block",
//     whoyouAre: "none",
//   });

//   const handleBlurChange = (name) => {
//     if (name === "firstName") {
//       const str = firstName;
//       const strNew = str.trim();
//       setUser({ ...user, firstName: strNew });
//     } else if (name === "lastName") {
//       const str = lastName;
//       const strNew = str.trim();
//       setUser({ ...user, lastName: strNew });
//     }
//   };

//   return (
//     <div>
//       {loading && <Loader />}
//       {transparentLoading && <TransparentLoader />}
//       <Header />
//       <Container id="signupform-bg" style={{ display: display.signupForm }}>
//         <Row>
//           <Col md={7}></Col>
//           <Col md={5}>
//             <h2 id="signin-title">Sign up</h2>
//             <div className="sign-box">
//               {/* {captchaError && (
//                 <label
//                   style={{ fontSize: 12, color: "#ff9393" }}
//                   className="left"
//                 >
//                   {captchaError}
//                 </label>
//               )} */}
//               <ValidatorForm
//                 onError={(errors) => console.log(errors)}
//                 onSubmit={() => {
//                   setDisplay({
//                     ...display,
//                     signupForm: "none",
//                     whoyouAre: "block",
//                   });
//                   window.scrollTo(0, 0);
//                   setErrorMsg({
//                     ...errorMsg,
//                     emailExistance: "",
//                     userNameExistance: "",
//                   });
//                 }}
//               >
//                 <p>
//                   First Name<sup>*</sup>
//                 </p>
//                 <TextValidator
//                   id="standard-basic"
//                   type="text"
//                   name="firstName"
//                   onChange={(e) => handleInputchange(e)}
//                   onBlur={() => handleBlurChange("firstName")}
//                   value={firstName}
//                   disabled={
//                     googleAccessToken && googleAccessToken ? true : false
//                   }
//                   validators={[
//                     "required",
//                     "maxStringLength:50",
//                     "isValidName",
//                     "isHavingSpace",
//                     "matchRegexp:^[a-zA-Z ]+$",
//                   ]}
//                   errorMessages={[
//                     "This field is required",
//                     "First name should not exceed 50 characters",
//                     "Please provide a valid first name",
//                     "Please do not use whitespace in front First Name",
//                     "First Name cannot have any numeric values"
//                   ]}
//                   variant="filled"
//                 />
//                 <br />
//                 <p>
//                   Last Name<sup>*</sup>
//                 </p>
//                 <TextValidator
//                   id="standard-basic"
//                   type="text"
//                   name="lastName"
//                   onChange={(e) => handleInputchange(e)}
//                   onBlur={() => handleBlurChange("lastName")}
//                   value={lastName}
//                   disabled={
//                     googleAccessToken && googleAccessToken ? true : false
//                   }
//                   validators={[
//                     "required",
//                     "maxStringLength:50",
//                     "isValidName",
//                     "isHavingSpace",
//                     "matchRegexp:^[a-zA-Z ]+$",
//                   ]}
//                   errorMessages={[
//                     "This field is required",
//                     "Last name should not exceed 50 characters.",
//                     "Please provide a valid last name.",
//                     "Please do not use whitespace in front Last Name",
//                     "Last Name cannot have any numeric values"
//                   ]}
//                   variant="filled"
//                 />
//                 <br />
//                 <p>
//                   Email<sup>*</sup>
//                 </p>
//                 {emailExistance && (
//                   <label
//                     style={{ fontSize: 12, color: "#ff9393" }}
//                     className="left"
//                   >
//                     {emailExistance}
//                   </label>
//                 )}
//                 <TextValidator
//                   id="standard-basic"
//                   type="text"
//                   name="email"
//                   onBlur={(e) => handleInputchange(e)}
//                   onChange={(e) => handleInputchange(e)}
//                   value={email}
//                   disabled={
//                     googleAccessToken && googleAccessToken ? true : false
//                   }
//                   validators={[
//                     "isValidEmail",
//                     "required",
//                     "maxStringLength:50",
//                   ]}
//                   errorMessages={[
//                     "Please provide valid email",
//                     "",
//                     "Email should not exceed 50 characters",
//                   ]}
//                   variant="filled"
//                 />
//                 <br />
//                 <p>
//                   Username<sup>*</sup>
//                 </p>
//                 {userNameExistance && (
//                   <label
//                     style={{ fontSize: 12, color: "#ff9393" }}
//                     className="left"
//                   >
//                     {userNameExistance}
//                   </label>
//                 )}
//                 <TextValidator
//                   id="standard-basic"
//                   type="text"
//                   name="login"
//                   onBlur={(e) => handleInputchange(e)}
//                   onChange={(e) => handleInputchange(e)}
//                   value={login}
//                   disabled={
//                     googleAccessToken && googleAccessToken ? true : false
//                   }
//                   validators={[
//                     "required",
//                     "isValidUserName",
//                     "maxStringLength:30",
//                   ]}
//                   errorMessages={[
//                     "This field is required",
//                     "Please provide a valid username",
//                     "Username should not exceed 30 characters",
//                   ]}
//                   variant="filled"
//                 />
//                 <br />
//                 {!googleAccessToken && (
//                   <>
//                     <p>
//                       Password<sup>*</sup>
//                     </p>
//                     <TextValidator
//                       id="standard-basic"
//                       type={passwordShown ? "text" : "password"}
//                       name="password"
//                       onBlur={(e) => handleInputchange(e)}
//                       onChange={(e) => handleInputchange(e)}
//                       value={password}
//                       validators={[
//                         "required",
//                         "matchRegexp:(?=.*[a-z])",
//                         "matchRegexp:(?=.*[A-Z])",
//                         "matchRegexp:(?=.*[0-9!@*$_])",
//                         "minStringLength:8",
//                         "maxStringLength:30",
//                       ]}
//                       errorMessages={[
//                         "This field is required",
//                         "Include at least 1 lower case",
//                         "Include at least 1 upper case",
//                         "At least 1 number Or 1 special character",
//                         "Minimum of 8 characters",
//                         "Password should not exceed 30 characters",
//                       ]}
//                       variant="filled"
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <IconButton
//                               aria-label="toggle password visibility"
//                               onClick={handleClickShowPassword}
//                               onMouseDown={handleMouseDownPassword}
//                             >
//                               {passwordShown ? (
//                                 <Visibility />
//                               ) : (
//                                 <VisibilityOff />
//                               )}
//                             </IconButton>
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <div className="signup-text left pass-validation">
//                       <input type="radio" required checked={minchar} />
//                       <span>Minimum of 8 characters</span>
//                       <br />
//                       <input type="radio" required checked={upcase} />
//                       <span>Include at least 1 upper case</span>
//                       <br />
//                       <input type="radio" required checked={lowcase} />
//                       <span>Include at least 1 lower case</span>
//                       <br />
//                       <input type="radio" required checked={num} />
//                       <span>At least 1 number OR 1 special character</span>
//                     </div>
//                   </>
//                 )}
//                 {/* <ReCAPTCHA
//                   sitekey={CAPTCHA_SITE_KEY}
//                   onChange={handleRecaptchaChange}
//                 /> */}
//                 <p className="signup-text">
//                   By clicking Sign Up, you agree to our Term of Services.
//                 </p>
//                 <input
//                   className="btn btn-primary sign-btn"
//                   type="submit"
//                   value="Sign Up"
//                 />
//               </ValidatorForm>
//               <p className="signup-text">Already a member?</p>
//               <Link to="/signin">
//                 <button className="btn btn-outline-primary sign-btn">
//                   Sign In
//                 </button>
//               </Link>

//               <Dialog aria-labelledby="customized-dialog-title" open={open}>
//                 <DialogTitle id="customized-dialog-title">
//                   Account Created Successfully!
//                 </DialogTitle>
//                 <DialogContent dividers>
//                   <Typography gutterBottom>
//                     Activation Email has been sent to your Email Address. Please
//                     check your inbox.
//                     <br />
//                     <br />
//                     <b>
//                       <i>
//                         Warning : Beware email might take up to 10 mins to
//                         arrive. Please check your spam folder as well.
//                       </i>
//                     </b>
//                   </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                   <Link to="/signin">
//                     <button
//                       autoFocus
//                       onClick={handleClose}
//                       className="btn btn-primary sign-btn"
//                       id="close-btn"
//                     >
//                       Ok
//                     </button>
//                   </Link>
//                 </DialogActions>
//               </Dialog>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       <div className="wrapper" style={{ display: display.whoyouAre }}>
//         <div id="user-type">
//           {/* <!-- Tabs Titles --> */}
//           <h2 className="user-title">Who are you?</h2>
//           <br />
//           {/* <!-- Login Form --> */}

//           <div className="wyr-form-box">
//             <div className="row">
//               <div className="col-md-4">
//                 <br />
//                 <button
//                   className="btn no-outline role"
//                   onClick={() => handleDoctorClick()}
//                 >
//                   <img src={doctorSVG} alt="" className="sub nopadd" />
//                   <br />
//                   Provider

//                 </button>
//               </div>
//               <div className="col-md-4">
//                 <br />
//                 <button
//                   className="btn no-outline role"
//                   onClick={() => handlePatientClick()}
//                 >
//                   <img src={patientSVG} alt="" className="sub nopadd" />
//                   <br />
//                   Individual
//                 </button>
//               </div>
//               <div className="col-md-4">
//                 <br />
//                 <button
//                   className="btn no-outline role"
//                   onClick={() => handlePhysicaltrainerClick()}
//                 >
//                   <img
//                     src={physical_trainerSVG}
//                     alt=""
//                     className="sub nopadd"
//                   />
//                   <br />
//                   Employer
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* <div className="wyr-form-box">
//             <div className="row">
//               <div className="col-12"><br />
//                 <button type="button" className="btn no-outline" onClick={() => handlePatientClick()}><img src={patientSVG} className="sub nopadd" /><br />Patient</button>
//               </div>
//             </div>
//           </div>
//           <div className="wyr-form-box">
//             <div className="row">
//               <div className="col-12"><br />
//                 <button type="button" className="btn no-outline" onClick={() => handlePhysicaltrainerClick()}><img src={physical_trainerSVG} className="sub nopadd" /><br />Physical<br />Trainer</button>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>

//       <Footer />
//       <Dialog aria-labelledby="customized-dialog-title" open={comingSoon}>
//         <DialogTitle id="customized-dialog-title">Coming Soon!</DialogTitle>
//         <DialogActions>
//           <button
//             onClick={handleComingSoonClose}
//             className="btn btn-primary sign-btn w-100"
//             id="close-btn"
//           >
//             Ok
//           </button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };
// export default Signupform;

import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
//import axios from 'axios'
import Header from "../Login-Module/Header";
import Footer from "../Login-Module/Footer";
import "../Login-Module/landing.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  Link,
  // useHistory
} from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
//import properties from "../../properties";
import Loader from "./../Loader/Loader";
import TransparentLoader from "../Loader/transparentloader";
import doctorSVG from "../../images/doctorSVG.svg";
import patientSVG from "../../images/patientSVG.svg";
import physical_trainerSVG from "../../images/physicaltrainerSVG.svg";
import Cookies from "universal-cookie";
import { getCurrentUserInfo } from "./../../service/AccountService";
import { handleGoogleAuth } from "./../../service/googleapiservice";
import LocalStorageService from "./../../util/LocalStorageService";
import { signupWithEmail } from "../../service/frontendapiservices";
import { CAPTCHA_SITE_KEY } from "./../../util/configurations";
import ReCAPTCHA from "react-google-recaptcha";

const isnum = "(?=.*[0-9!@*$_])";
const islow = "(?=.*[a-z])";
const isup = "(?=.*[A-Z])";
// const history = useHistory();

const Signupform = () => {
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    userNameExistance: "",
    emailExistance: "",
  });
  const { userNameExistance, emailExistance } = errorMsg;
  const cookies = new Cookies();
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const history = useHistory();
  const googleAccessToken = cookies.get("GOOGLE_ACCESS_TOKEN");
  const googleProfileData = cookies.get("GOOGLE_PROFILE_DATA");
  //console.log("googleAccessToken :::::", googleAccessToken);
  //console.log("googleProfileData ::::::", googleProfileData);
  // let history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState({
    firstName:
      googleProfileData && googleProfileData.givenName
        ? googleProfileData.givenName
        : "",
    lastName:
      googleProfileData && googleProfileData.familyName
        ? googleProfileData.familyName
        : "",
    email:
      googleProfileData && googleProfileData.email
        ? googleProfileData.email
        : "",
    login:
      googleProfileData && googleProfileData.email
        ? googleProfileData.email
        : "",
    imageUrl:
      googleProfileData && googleProfileData.imageUrl
        ? googleProfileData.imageUrl
        : "",
    password: "",
    langKey: "en",
    authorities: [],
  });

  //console.log("user ::::::::::::", user);
  const [passwordValidity, setpasswordValidity] = useState({
    minchar: false,
    upcase: false,
    lowcase: false,
    num: false,
  });

  const {
    firstName,
    lastName,
    email,
    login,
    // imageUrl,
    password,
    authorities,
  } = user;
  const { minchar, upcase, lowcase, num } = passwordValidity;

  const handleDoctorClick = () => {
    const value = "ROLE_DOCTOR";
    setUser({ ...user, authorities: [] });
    authorities.push(value);
    if (
      authorities &&
      authorities.length > 0 &&
      authorities.some((role) => role === "ROLE_DOCTOR")
    ) {
      handleSignup();
    }
  };
  const handlePatientClick = () => {
    const value = "ROLE_PATIENT";
    setUser({ ...user, authorities: [] });
    authorities.push(value);
    if (
      authorities &&
      authorities.length > 0 &&
      authorities.some((role) => role === "ROLE_PATIENT")
    ) {
      handleSignup();
    }
  };
  const handlePhysicaltrainerClick = () => {
    //const value = "UNKNOWN";
    //setUser({ ...user, authorities: [value] })
    handleComingSoonOpen();
  };

  const [comingSoon, setComingSoon] = useState(false);

  const handleComingSoonOpen = () => {
    setComingSoon(true);
  };

  const handleComingSoonClose = () => {
    setComingSoon(false);
  };

  const handleInputchange = (e) => {
    if (e.target.value === " ") {
      e.preventDefault();
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
      if (e.target.name === "password") {
        const passvalue = e.target.value;
        setpasswordValidity({
          minchar: passvalue.length >= 8 ? true : false,
          num: passvalue.match(isnum) ? true : false,
          lowcase: passvalue.match(islow) ? true : false,
          upcase: passvalue.match(isup) ? true : false,
        });
      }
    }
  };

  const emailValidator = new RegExp(
    "^[a-zA-Z0-9_.]+@([a-zA-Z0-9]+[.]+[a-zA-Z]{2,})$"
  );

  const usernameValidator = new RegExp("^[_.@A-Za-z0-9-]*$");
  const nameValidator = new RegExp("^[_.A-Za-z0-9 ]*$");
  ValidatorForm.addValidationRule("isValidEmail", (value) => {
    if (!emailValidator.test(value)) {
      return false;
    } else if (emailValidator.test(value)) {
      return true;
    }
  });

  ValidatorForm.addValidationRule("isValidUserName", (value) => {
    if (!usernameValidator.test(value)) {
      return false;
    } else if (usernameValidator.test(value)) {
      return true;
    }
  });

  ValidatorForm.addValidationRule("isValidName", (value) => {
    if (!nameValidator.test(value)) {
      return false;
    } else if (nameValidator.test(value)) {
      return true;
    }
  });

  ValidatorForm.addValidationRule("isHavingSpace", (value) => {
    if (/^\s/.test(value)) {
      return false;
    } else if (!/^\s/.test(value)) {
      return true;
    }
  });

  // const [captchaError, setCaptchaError] = useState("");
  // const [captchaVerify, setCaptchaVerify] = useState(false);

  // const handleRecaptchaChange = (value) => {
  //   if (value !== null || value !== "") {
  //     setCaptchaVerify(true);
  //     setCaptchaError("");
  //   } else {
  //     setCaptchaVerify(false);
  //   }
  // };

  const handleSignup = async () => {
    //if (captchaVerify) {
    setTransparentLoading(true);
    if (googleAccessToken) {
      const googleUserData = {
        token: googleAccessToken,
        authorities: authorities,
      };
      const _accessToken = await handleGoogleAuth(googleUserData).catch(
        (err) => {
          if (err.response.status === 500 || err.response.status === 504) {
            setTransparentLoading(false);
          }
        }
      );

      //console.log(_accessToken);
      if (_accessToken) {
        LocalStorageService.setToken(_accessToken);
        const currentUserInformation = await getCurrentUserInfo().catch(
          (err) => {
            if (err.response.status === 500 || err.response.status === 504) {
              setTransparentLoading(false);
            }
          }
        );
        cookies.set("currentUser", currentUserInformation);
        const currentLoggedInUser = cookies.get("currentUser");
        const { authorities = [] } = currentLoggedInUser || {};

        if (authorities.some((user) => user === "ROLE_PATIENT")) {
          history.push("/patient");
        }
        if (authorities.some((user) => user === "ROLE_DOCTOR")) {
          history.push("/doctor");
        }
      }
    }
    if (!googleAccessToken) {
      //var config = {
      //  method: 'post',
      //  mode: 'no-cors',
      //  data: JSON.stringify(user),
      //  url: properties.UAA + '/api/register',
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Access-Control-Allow-Origin': '*'
      //  }
      //}

      const response = await signupWithEmail(user).catch((error) => {
        setTransparentLoading(false);
        setDisplay({ ...display, signupForm: "block", whoyouAre: "none" });
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.errorKey === "emailexists"
        ) {
          setErrorMsg({
            ...errorMsg,
            emailExistance: error.response.data.title,
          });
        } else if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.errorKey === "userexists"
        ) {
          setErrorMsg({
            ...errorMsg,
            userNameExistance: error.response.data.title,
          });
        }
      });
      if (response && response.status === 201) {
        setTransparentLoading(false);
        handleClickOpen();
      }
      //}).catch(error => {
      //  if (error.response && error.response.status === 400 && error.response.data.errorKey === "emailexists") {
      //    setErrorMsg({ ...errorMsg, emailExistance: error.response.data.title });
      //  } else if (error.response && error.response.status === 400 && error.response.data.errorKey === "userexists") {
      //    setErrorMsg({ ...errorMsg, userNameExistance: error.response.data.title });
      //  }
      //})
    }
    //} //else {
    // setCaptchaError("Please verify captcha!");
    setDisplay({ ...display, signupForm: "block", whoyouAre: "none" });
    //}
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const handleClickShowPassword = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [display, setDisplay] = useState({
    signupForm: "block",
    whoyouAre: "none",
  });

  const handleBlurChange = (name) => {
    if (name === "firstName") {
      const str = firstName;
      const strNew = str.trim();
      setUser({ ...user, firstName: strNew });
    } else if (name === "lastName") {
      const str = lastName;
      const strNew = str.trim();
      setUser({ ...user, lastName: strNew });
    }
  };

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Header />
      <Container id="signupform-bg" style={{ display: display.signupForm }}>
        <Row>
          <Col md={7}></Col>
          <Col md={5}>
            <h2 id="signin-title">Sign up</h2>
            <div className="sign-box">
              {/* {captchaError && (
                <label
                  style={{ fontSize: 12, color: "#ff9393" }}
                  className="left"
                >
                  {captchaError}
                </label>
              )} */}
              <ValidatorForm
                onError={(errors) => console.log(errors)}
                onSubmit={() => {
                  setDisplay({
                    ...display,
                    signupForm: "none",
                    whoyouAre: "block",
                  });
                  window.scrollTo(0, 0);
                  setErrorMsg({
                    ...errorMsg,
                    emailExistance: "",
                    userNameExistance: "",
                  });
                }}
              >
                <p>
                  First Name<sup>*</sup>
                </p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="firstName"
                  onChange={(e) => handleInputchange(e)}
                  onBlur={() => handleBlurChange("firstName")}
                  value={firstName}
                  disabled={
                    googleAccessToken && googleAccessToken ? true : false
                  }
                  validators={[
                    "required",
                    "maxStringLength:50",
                    "isValidName",
                    "isHavingSpace",
                    "matchRegexp:^[a-zA-Z ]+$",
                  ]}
                  errorMessages={[
                    "This field is required",
                    "First name should not exceed 50 characters",
                    "Please provide a valid first name",
                    "Please do not use whitespace in front First Name",
                    "First Name cannot have any numeric values"
                  ]}
                  variant="filled"
                />
                <br />
                <p>
                  Last Name<sup>*</sup>
                </p>
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="lastName"
                  onChange={(e) => handleInputchange(e)}
                  onBlur={() => handleBlurChange("lastName")}
                  value={lastName}
                  disabled={
                    googleAccessToken && googleAccessToken ? true : false
                  }
                  validators={[
                    "required",
                    "maxStringLength:50",
                    "isValidName",
                    "isHavingSpace",
                    "matchRegexp:^[a-zA-Z ]+$",
                  ]}
                  errorMessages={[
                    "This field is required",
                    "Last name should not exceed 50 characters.",
                    "Please provide a valid last name.",
                    "Please do not use whitespace in front Last Name",
                    "Last Name cannot have any numeric values"
                  ]}
                  variant="filled"
                />
                <br />
                <p>
                  Email<sup>*</sup>
                </p>
                {emailExistance && (
                  <label
                    style={{ fontSize: 12, color: "#ff9393" }}
                    className="left"
                  >
                    {emailExistance}
                  </label>
                )}
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="email"
                  onBlur={(e) => handleInputchange(e)}
                  onChange={(e) => handleInputchange(e)}
                  value={email}
                  disabled={
                    googleAccessToken && googleAccessToken ? true : false
                  }
                  validators={[
                    "isValidEmail",
                    "required",
                    "maxStringLength:50",
                  ]}
                  errorMessages={[
                    "Please provide valid email",
                    "",
                    "Email should not exceed 50 characters",
                  ]}
                  variant="filled"
                />
                <br />
                <p>
                  Username<sup>*</sup>
                </p>
                {userNameExistance && (
                  <label
                    style={{ fontSize: 12, color: "#ff9393" }}
                    className="left"
                  >
                    {userNameExistance}
                  </label>
                )}
                <TextValidator
                  id="standard-basic"
                  type="text"
                  name="login"
                  onBlur={(e) => handleInputchange(e)}
                  onChange={(e) => handleInputchange(e)}
                  value={login}
                  disabled={
                    googleAccessToken && googleAccessToken ? true : false
                  }
                  validators={[
                    "required",
                    "isValidUserName",
                    "maxStringLength:30",
                  ]}
                  errorMessages={[
                    "This field is required",
                    "Please provide a valid username",
                    "Username should not exceed 30 characters",
                  ]}
                  variant="filled"
                />
                <br />
                {!googleAccessToken && (
                  <>
                    <p>
                      Password<sup>*</sup>
                    </p>
                    <TextValidator
                      id="standard-basic"
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      onBlur={(e) => handleInputchange(e)}
                      onChange={(e) => handleInputchange(e)}
                      value={password}
                      validators={[
                        "required",
                        "matchRegexp:(?=.*[a-z])",
                        "matchRegexp:(?=.*[A-Z])",
                        "matchRegexp:(?=.*[0-9!@*$_])",
                        "minStringLength:8",
                        "maxStringLength:30",
                      ]}
                      errorMessages={[
                        "This field is required",
                        "Include at least 1 lower case",
                        "Include at least 1 upper case",
                        "At least 1 number Or 1 special character",
                        "Minimum of 8 characters",
                        "Password should not exceed 30 characters",
                      ]}
                      variant="filled"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {passwordShown ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <div className="signup-text left pass-validation">
                      <input type="radio" required checked={minchar} />
                      <span>Minimum of 8 characters</span>
                      <br />
                      <input type="radio" required checked={upcase} />
                      <span>Include at least 1 upper case</span>
                      <br />
                      <input type="radio" required checked={lowcase} />
                      <span>Include at least 1 lower case</span>
                      <br />
                      <input type="radio" required checked={num} />
                      <span>At least 1 number OR 1 special character</span>
                    </div>
                  </>
                )}
                {/* <ReCAPTCHA
                  sitekey={CAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                /> */}
                <p className="signup-text">
                  By clicking Sign Up, you agree to our Term of Services.
                </p>
                <input
                  className="btn btn-primary sign-btn"
                  type="submit"
                  value="Sign Up"
                />
              </ValidatorForm>
              <p className="signup-text">Already a member?</p>
              <Link to="/signin">
                <button className="btn btn-outline-primary sign-btn">
                  Sign In
                </button>
              </Link>

              <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                  Account Created Successfully!
                </DialogTitle>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Activation Email has been sent to your Email Address. Please
                    check your inbox.
                    <br />
                    <br />
                    <b>
                      <i>
                        Warning : Beware email might take up to 10 mins to
                        arrive. Please check your spam folder as well.
                      </i>
                    </b>
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Link to="/signin">
                    <button
                      autoFocus
                      onClick={handleClose}
                      className="btn btn-primary sign-btn"
                      id="close-btn"
                    >
                      Ok
                    </button>
                  </Link>
                </DialogActions>
              </Dialog>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="wrapper" style={{ display: display.whoyouAre }}>
        <div id="user-type">
          {/* <!-- Tabs Titles --> */}
          <h2 className="user-title">Who are you?</h2>
          <br />
          {/* <!-- Login Form --> */}

          <div className="wyr-form-box">
            <div className="row">
              <div className="col-md-4">
                <br />
                <button
                  className="btn no-outline role"
                  onClick={() => handleDoctorClick()}
                >
                  <img src={doctorSVG} alt="" className="sub nopadd" />
                  <br />
                  Provider

                </button>
              </div>
              <div className="col-md-4">
                <br />
                <button
                  className="btn no-outline role"
                  onClick={() => handlePatientClick()}
                >
                  <img src={patientSVG} alt="" className="sub nopadd" />
                  <br />
                  Individual
                </button>
              </div>
              <div className="col-md-4">
                <br />
                <button
                  className="btn no-outline role"
                  onClick={() => handlePhysicaltrainerClick()}
                >
                  <img
                    src={physical_trainerSVG}
                    alt=""
                    className="sub nopadd"
                  />
                  <br />
                  Employer
                </button>
              </div>
            </div>
          </div>
          {/* <div className="wyr-form-box">
            <div className="row">
              <div className="col-12"><br />
                <button type="button" className="btn no-outline" onClick={() => handlePatientClick()}><img src={patientSVG} className="sub nopadd" /><br />Patient</button>
              </div>
            </div>
          </div>
          <div className="wyr-form-box">
            <div className="row">
              <div className="col-12"><br />
                <button type="button" className="btn no-outline" onClick={() => handlePhysicaltrainerClick()}><img src={physical_trainerSVG} className="sub nopadd" /><br />Physical<br />Trainer</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <Footer />
      <Dialog aria-labelledby="customized-dialog-title" open={comingSoon}>
        <DialogTitle id="customized-dialog-title">Coming Soon!</DialogTitle>
        <DialogActions>
          <button
            onClick={handleComingSoonClose}
            className="btn btn-primary sign-btn w-100"
            id="close-btn"
          >
            Ok
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Signupform;
