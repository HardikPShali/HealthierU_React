/*global google*/
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./landing.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  Link,
  // useHistory
} from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LocalStorageService from "./../../util/LocalStorageService";
import qs from "qs";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Cookies from "universal-cookie";
import Loader from "./../Loader/Loader";
import TransparentLoader from "./../Loader/transparentloader";
import { handleGoogleAuth } from "./../../service/googleapiservice";
// import firebase from "firebase";
// import { sendFcmTokenToServer } from "../../service/firebaseservice";
import {
  handleSignin,
  getCurrentUserInfo,
  activateUser,
  sendOtpEmail,
  verifyOtp,
  accountActivationCheckBeforeTokenGeneration,
} from "../../service/AccountService";
// import { openStdin } from "process";
import gmailIcon from "../../images/icons used/gmailIcon.png";
import OtpInput from "react-otp-input";
import OtpTimer from "otp-timer";
// import axios from "axios";
// import otpGenerator from "otp-generator";
// import ReCAPTCHA from "react-google-recaptcha";
import { useHistory } from "react-router-dom";
import { withRouter, BrowserRouter } from "react-router";

import GoogleSignInButton from "../CommonModule/GoogleAuth/GoogleSignInButton/GoogleSignInButton";
import { toast } from 'react-toastify';
import { getFirebaseToken, getPermissions } from "../../util";
import { getFcmTokenApi } from "../../service/frontendapiservices";

import moment from "moment";

const Signin = () => {
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(200);
  // const [firebaseToken, setFirebaseToken] = useState();
  // console.log("firebaseToken ::", firebaseToken);

  const cookies = new Cookies();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState({
    msg: "",
    loggedIn: false,
    email: "",
    password: "",
    otp: "",
  });

  useEffect(() => {
    const width = document.getElementById("signinbtn").clientWidth;
    setGoogleBtnWidth(width);

    setTimeout(() => setLoading(false), 500);
    const activationkey = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    }).activationkey;
    if (activationkey) {
      handleActivateUser();
    }
  }, []);

  //User won't land on the sign in page only even when user has not sign out from the application | HEAL-55 & HEAL-10
  // useEffect(() => {
  //   if (
  //     cookies.get("currentUser")?.id !== "" &&
  //     cookies.get("currentUser")?.authorities[0] === "ROLE_PATIENT"
  //   ) {
  //     history.push("/patient");
  //     history.go(0);
  //   }
  //   if (
  //     cookies.get("currentUser")?.id !== "" &&
  //     cookies.get("currentUser")?.authorities[0] === "ROLE_DOCTOR"
  //   ) {
  //     history.push("/doctor");
  //     history.go(0);
  //   }
  //   if (
  //     cookies.get("currentUser")?.id !== "" &&
  //     cookies.get("currentUser")?.authorities[0] === "ROLE_ADMIN"
  //   ) {
  //     history.push("/admin");
  //     history.go(0);
  //   }
  // }, [cookies.get("currentUser")]);

  const responseGoogle = async (response) => {
    removeAllCookies();
    setLoader(true);
    storeGoogleToken(response);
    const googleUserData = {
      token: response.credential,
    };
    const googleAccessToken = await handleGoogleAuth(googleUserData, history).catch(
      (err) => {
        console.log({ err })
        if (err.response.status === 500 || err.response.status === 504) {
          setLoader(false);
        }
      }
    );
    if (googleAccessToken) {
      //console.log("googleAccessToken  :: ", googleAccessToken);
      LocalStorageService.setToken(googleAccessToken);
      getCurrentUserData();
      // triggerFcmTokenHandler();
    }
    setLoader(false);
  };

  const handleActivateUser = async () => {
    const activationkey = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    }).activationkey;

    const response = await activateUser(activationkey);
    if (response && (response.status === 200 || response.status === 201)) {
      handleClickOpen();
    }
  };

  const { email, password, msg, otp } = user;
  const handleInputChange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value, msg: "" });
  };

  // const [captchaVerify, setCaptchaVerify] = useState(false);

  // const handleRecaptchaChange = (value) => {
  //   console.log(value);
  //   if (value !== null || value !== "") {
  //     setCaptchaVerify(true);
  //     setUser({
  //       ...user,
  //       msg: "",
  //     });
  //   } else {
  //     setCaptchaVerify(false);
  //   }
  // };

  // const [otpText, setOtpText] = useState();

  const handleOTPChange = (otpText) => {
    setUser({ ...user, otp: otpText, msg: "" });
  };

  const [otpDisplay, setOtpDisplay] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const getCurrentUserData = async () => {
    const currentUserInformation = await getCurrentUserInfo().catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    console.log({ currentUserInformation });
    setCurrentUser(currentUserInformation.data.userInfo);
    // cookies.set('currentUser', currentUserInformation);
    // const fcmToken = getFirebaseToken(currentUserInformation.id);
    // console.log("fcmToken :::::::::::",fcmToken);
    // if (fcmToken) {
    // const currentLoggedInUser = cookies.get("currentUser");
    const { authorities = [] } = currentUserInformation.data.userInfo || {};

    // if (!currentUserInformation) {
    //   window.location.assign("/");
    // }

    delete currentUserInformation.data.role.languages;
    delete currentUserInformation.data.role.bio;
    delete currentUserInformation.data.role.specialities;
    delete currentUserInformation.data.role.specialitiesList;
    delete currentUserInformation.data.role.educationalQualifications;

    cookies.set("currentUser", currentUserInformation.data.userInfo, { path: '/' });
    currentUserInformation.data.role.firebasePwd =
      currentUserInformation.data.firebasePwd;
    if (!currentUserInformation.data.role.email) {
      currentUserInformation.data.role.email =
        currentUserInformation.data.userInfo.email;
    }
    cookies.set("profileDetails", currentUserInformation.data.role, {
      path: "/"
    });
    if (
      authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER")
    ) {
      history.push("/admin");
      // history.go(0);
    }

    if (authorities.some((user) => user === "ROLE_PATIENT")) {
      history.push("/patient")
      // history.go(0);
    }
    if (authorities.some((user) => user === "ROLE_DOCTOR")) {
      history.push("/doctor");
      // history.go(0);
    }
  };
  // }

  const [activateError, setActivateError] = useState(false);

  const handleActivateErrorOpen = () => {
    setActivateError(true);
  };

  const handleActivateErrorClose = () => {
    setActivateError(false);
  };

  const emailValidator = new RegExp(
    "^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
  );
  ValidatorForm.addValidationRule("isValidEmail", (value) => {
    if (!emailValidator.test(value)) {
      return false;
    } else if (emailValidator.test(value)) {
      return true;
    }
  });

  const removeAllCookies = () => {
    const allCookies = cookies.getAll()

    for (let key in allCookies) {
      cookies.remove(key)

    }
  }

  const handleSigninHandler = async () => {
    let encodedPassword = encodeURIComponent(password);
    removeAllCookies();
    // SIGNIN LOGIC
    const response = await handleSignin(email, encodedPassword).catch((err) => {
      if (err.response && err.response.status === 400) {
        setUser({
          ...user,
          msg: "Invalid email or password combination. Please try again",
        });
        setLoader(false);
      } else if (err.response && err.response.status === 401) {
        setLoader(false);
        handleActivateErrorOpen();
      }
    });
    if (response && response.data) {
      LocalStorageService.setToken(response.data);
      getCurrentUserData();
    }
  }

  const handleLogin = async (e) => {
    //if (captchaVerify) {
    setLoader(true);
    const accountCheckResponse = await accountActivationCheckBeforeTokenGeneration(email).catch(err => console.log({ err }))

    console.log({ accountCheckResponse })

    if (accountCheckResponse.data.status === true) {
      handleSigninHandler();
    }
    else if (accountCheckResponse.data.data.registerAgain === true) {
      setLoader(false);
      toast.error('Your account was not registered properly. Please register again.', {
        autoClose: 3000,
        hideProgressBar: true,
        toastId: "accountNotRegistered",
      });
      setTimeout(() => {
        history.push('/signup');
      }, 3000);
    }
    else if (accountCheckResponse.data.data.registerAgain === false && accountCheckResponse.data.message === "Your account has been deactivated") {
      setLoader(false);
      toast.error('Your account has been deactivated. Please contact the administrator.', {
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "accountDeactivated",
      });
    }
    else if (accountCheckResponse.data.message === "Your account has been deactivated. Please contact administrator") {
      setLoader(false);
      toast.error('Your account has been deactivated. Please contact the administrator.', {
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "accountDeactivated",
      });
    }
    else if (accountCheckResponse.data.data.profileComplete === true && accountCheckResponse.data.data.approved === false) {
      handleSigninHandler();
    }
    else if (accountCheckResponse.data.data.unrgistered === true) {
      setLoader(false);
      setUser({
        ...user,
        msg: "Invalid email or password combination. Please try again",
      })
    }
    else {
      setLoader(false);
      toast.error('Something went wrong. Please try again.', {
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "somethingWentWrong",
      });
    }

    // } else {
    //   setUser({
    //     ...user,
    //     msg: "Please verify captcha!",
    //   });
    // }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const handleClickShowPassword = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const sendOtp = async () => {
    const res = await sendOtpEmail().catch((err) => {
      if (err.response && err.response.status === 406) {
        setUser({
          ...user,
          msg: "Invalid user. Please enter valid user to get OTP!",
        });
        setLoader(false);
      }
    });

    if (res) {
      setOtpDisplay(true);
      setLoader(false);
    }
  };

  const handleOTPSubmit = async () => {
    const res = await verifyOtp(otp).catch((err) => {
      if (err.response && err.response.status === 406) {
        setUser({
          ...user,
          msg: "Invalid OTP. Please generate new OTP and try again!",
        });
        setLoader(false);
      }
    });
    if (res) {
      //if (otpText !== otp) {
      //  setUser({ ...user, msg: "Invalid OTP" });
      //} else if (otpText === otp) {
      cookies.set("currentUser", currentUser, { path: '/' });
      history.push("/admin");
    }
  };


  // google signup code to tackle "500 user role reqd." error
  const storeGoogleToken = (response) => {
    cookies.set("GOOGLE_ACCESS_TOKEN", response.credential, { path: '/' });
    cookies.set("GOOGLE_PROFILE_DATA", response.profileObj, { path: '/' });
  };


  return (
    <div>
      {loading && <Loader />}
      {loader && <TransparentLoader />}
      <Header hideButton={true} />
      <div id="signin-bg">
        <Container>
          <Row>
            <Col md={7}></Col>
            <Col md={5}>
              <h2 id="signin-title">Sign in</h2>
              <div className="sign-box">
                {!otpDisplay && (
                  <>
                    <ValidatorForm
                      onError={(errors) => console.log(errors)}
                      onSubmit={(e) => handleLogin(e)}
                    >
                      <label
                        style={{ fontSize: 12, color: "#ff9393" }}
                        className="left"
                      >
                        {msg}
                      </label>
                      <p>
                        Email<sup>*</sup>
                      </p>
                      <TextValidator
                        id="standard-basic"
                        type="email"
                        name="email"
                        onChange={(e) => handleInputChange(e)}
                        value={email}
                        validators={[
                          // "isValidEmail",
                          "required",
                          "maxStringLength:50",
                        ]}
                        errorMessages={[
                          // "Please enter a valid email",
                          "This field is required",
                          "Email should not exceed 50 characters",
                        ]}
                        variant="filled"
                      />
                      <br />
                      <p>
                        Password<sup>*</sup>
                      </p>
                      <TextValidator
                        id="standard-basic"
                        name="password"
                        type={passwordShown ? "text" : "password"}
                        onChange={(e) => handleInputChange(e)}
                        value={password}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
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
                      <Link to="/forgetpassword" className="forget-text">
                        Forgot password?
                      </Link>
                      {/* <ReCAPTCHA
                      sitekey={CAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                    /> */}
                      <input
                        id="signinbtn"
                        className="btn btn-primary sign-btn shadow-sm"
                        type="submit"
                        value="Sign In"
                      />

                    </ValidatorForm>
                    <div className="w-100 mt-3">
                      <GoogleSignInButton
                        id="google-btn"
                        width={googleBtnWidth}
                        responseCallBack={responseGoogle}
                        responseError={(e) => console.log(e)}
                      />
                    </div>
                  </>
                )}
                {otpDisplay && (
                  <div>
                    <label
                      style={{ fontSize: 12, color: "#ff9393" }}
                      className="left"
                    >
                      {msg}
                    </label>
                    <p>Enter OTP:</p>
                    <OtpInput
                      value={otp}
                      onChange={(e) => handleOTPChange(e)}
                      numInputs={6}
                      separator={<span>&nbsp;</span>}
                      className="otpInput"
                    />
                    <br />
                    <p className="otpText">
                      <OtpTimer
                        seconds={59}
                        minutes={2}
                        resend={() => sendOtp()}
                        text="Code Expires in"
                        ButtonText="Resent OTP"
                        textColor={"#56BEEC"}
                        buttonColor={"#fff"}
                        background={"#56BEEC"}
                      />
                    </p>
                    <input
                      className="btn btn-primary sign-btn shadow-sm"
                      type="button"
                      onClick={() => handleOTPSubmit()}
                      value="Submit"
                    />
                  </div>
                )}
                <div className="row">
                  <div className="col-12">
                    <p className="signup-text">Don't have an account yet?</p>
                    <Link className="w-100 d-block" to="/signup">
                      <button className="btn btn-primary w-100 sign-btn shadow-sm">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                  Email Activated!
                </DialogTitle>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    You have successfully activated your email address. Now you
                    can Log in to your account.
                  </Typography>
                  {/* <>
                  {currentLoggedInUser && Object.keys(currentLoggedInUser).length > 0 && currentLoggedInUser.authorities.some((user) => user === "ROLE_PATIENT") &&
                    (<Typography gutterBottom>
                    You have successfully activated your email address. Now you can Log in to your account.
                    </Typography>
                    )}
                  {currentLoggedInUser && Object.keys(currentLoggedInUser).length > 0 && currentLoggedInUser.authorities.some((user) => user === "ROLE_DOCTOR") &&
                    (<Typography gutterBottom>
                      You have successfully activated your email address. Now you can Log in to your account and you can complete your profile.
                      But Admin Approval is pending for Account Activation.
                    </Typography>
                    )}
                </> */}
                </DialogContent>
                <DialogActions>
                  <button
                    autoFocus
                    onClick={handleClose}
                    className="btn btn-primary sign-btn"
                    id="close-btn"
                  >
                    OK
                  </button>
                </DialogActions>
              </Dialog>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />

      <Dialog aria-labelledby="customized-dialog-title" open={activateError}>
        <DialogTitle id="customized-dialog-title">
          Account Not Activated!
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Your account is not activated. Please contact Administrator or click
            on the activation link sent to your email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <button
            autoFocus
            onClick={handleActivateErrorClose}
            className="btn btn-primary sign-btn"
            id="close-btn"
          >
            OK
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(Signin);
