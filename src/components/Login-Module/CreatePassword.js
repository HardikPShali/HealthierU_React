import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import "./landing.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
//import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import qs from "qs";
import { getCreatePasswordOtpApi } from "../../service/frontendapiservices";
import { toast } from "react-toastify";

const isnum = /\d/;
const islow = "(?=.*[a-z])";
const isup = "(?=.*[A-Z])";


const CreatePassword = () => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [otpBox, setOtpBox] = useState(new Array(4).fill(""));
  const [otpValidation, setOtpValidation] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const email = searchParams.get("email");

  // console.log({ email })

  //const [loading, setLoading] = useState(true);

  const [display, setDisplay] = useState({
    otpPage: "block",
    createPasswordPage: "none",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordValidity, setpasswordValidity] = useState({
    minchar: false,
    upcase: false,
    lowcase: false,
    num: false,
  });
  //useEffect(() => {
  //  setTimeout(() => setLoading(false), 1000);
  //}, []);
  const { newPassword, confirmPassword } = user;
  const { minchar, upcase, lowcase, num } = passwordValidity;

  const handleInputchange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    if (e.target.name === "newPassword") {
      const passvalue = e.target.value;
      setpasswordValidity({
        minchar: passvalue.length >= 8 ? true : false,
        num: passvalue.match(isnum) ? true : false,
        lowcase: passvalue.match(islow) ? true : false,
        upcase: passvalue.match(isup) ? true : false,
      });
    } else if (e.target.name === "confirmPassword") {
      ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
        if (value !== newPassword) {
          return false;
        } else if (value === newPassword) {
          return true;
        }
      });
    }
  };
  // const createNewPasswordKey = qs.parse(window.location.search, { ignoreQueryPrefix: true }).resetkey;
  const createNewPasswordKey = otpBox.join("");

  const resetPasswordPayload = {
    key: createNewPasswordKey,
    newPassword: newPassword,
  };
  const handleCreatePassword = async () => {
    var payload = {
      method: "post",
      mode: "no-cors",
      data: resetPasswordPayload,
      url: `/api/mobile/account/reset-password/finish`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
        handleClickOpen();
      }
    }).catch(error => {
      console.log(error);
      if (error.response.data.message === 'No user was found for this reset key') {
        setErrorMessage('Incorrect OTP entered. Please try again');
        setTimeout(() => {
          history.go(0);
        }, 3000)
      }
      if (error.response.status === 400 || error.response.status === 500) {
        toast.error(error.response.data.message)
      }
    });
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const handleClickShowPassword = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const handleConfirmShowPassword = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //LOGIC FOR OTP BOXES
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtpBox([...otpBox.map((ele, i) => (i === index ? element.value : ele))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOTPSubmit = async () => {
    const data = {
      email: email,
      key: otpBox.join("")
    }
    const response = await getCreatePasswordOtpApi(data);
    // console.log({ response });


    if (response.data.message === 'Otp mismatch') {
      setOtpValidation('Incorrect OTP entered. Please try again');
      setOtpBox(new Array(4).fill(""));
    }
    else if (response.data.message === 'Otp verified') {
      setOtpValidation('');
      setDisplay({
        otpPage: "none",
        createPasswordPage: "block",
      });
    }
    else if (response.data.message === 'Your account has been blocked. Please try again after some time' && response.data.status === false) {
      setOtpValidation(response.data.message);
      setOtpBox(new Array(4).fill(""));
    }
    else {
      setOtpValidation('Something went wrong. Please try again.');
      setOtpBox(new Array(4).fill(""));
    }

    // setDisplay({ ...display, otpPage: "none", createPasswordPage: "block" });
  };

  return (
    <div>
      <Header />
      <Container id="signupform-bg" style={{ display: display.otpPage }}>
        <Row>
          <Col md={6}></Col>
          <Col md={5}>
            <div className="sign-box text-center">
              <h2 id="signin-title">OTP Verification</h2>
              <p style={{ fontSize: "14px" }}>OTP has been sent to <strong>{email}</strong></p>

              <div>
                <div className="otp-box-div">
                  {otpBox.map((data, index) => {
                    return (
                      <input
                        type="text"
                        className="otp-field"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    );
                  })}

                </div>
                {
                  otpValidation && <p style={{ color: "red" }}>{otpValidation}</p>
                }
              </div>


              <div>
                <button
                  className="otp-verify"
                  onClick={() => {
                    setOtpBox(new Array(4).fill(""));
                  }}
                >
                  Clear
                </button>

                <button
                  className="otp-verify"
                  onClick={() => handleOTPSubmit()}
                  disabled={otpBox.join("") === "" ? true : false}
                >
                  Verify
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <div id="signin-bg" style={{ display: display.createPasswordPage }}>
        <Container>
          <Row>
            <Col md={7}></Col>
            <Col md={5}>
              <h2 id="signin-title">Create Password</h2>
              <div className="sign-box">
                <ValidatorForm
                  onSubmit={(e) => handleCreatePassword(e)}
                >
                  <p>
                    New Password<sup>*</sup>
                  </p>
                  <TextValidator
                    id="standard-basic"
                    type={passwordShown ? "text" : "password"}
                    name="newPassword"
                    onBlur={(e) => handleInputchange(e)}
                    onChange={(e) => handleInputchange(e)}
                    value={newPassword}
                    validators={[
                      "required",
                      "matchRegexp:(?=.*[a-z])",
                      "matchRegexp:(?=.*[A-Z])",
                      "matchRegexp:(?=.*[0-9].*|.*[~`!@#$%^&*()--+={}\[\]|\\:;\"\'<>,.?/_₹])",
                      "minStringLength:8",
                    ]}
                    errorMessages={[
                      "This field is required",
                      "Include at least 1 lower case",
                      "Include at least 1 upper case",
                      "Include at least 1 number or 1 special character",
                      "Minimum of 8 characters",
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
                            {passwordShown ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />

                  <p>
                    Confirm Password<sup>*</sup>
                  </p>
                  <TextValidator
                    id="standard-basic"
                    type={confirmPasswordShown ? "text" : "password"}
                    name="confirmPassword"
                    onBlur={(e) => handleInputchange(e)}
                    onChange={(e) => handleInputchange(e)}
                    value={confirmPassword}
                    validators={["isPasswordMatch", "required"]}
                    errorMessages={[
                      "Password Does not match",
                      "This Field is Required",
                    ]}
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleConfirmShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {confirmPasswordShown ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <label style={{ fontSize: 12, color: '#ff9393' }} className="left">{errorMessage}</label>

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


                  <input
                    className="btn btn-primary sign-btn"
                    type="submit"
                    value="Submit"
                  />
                </ValidatorForm>

                <Dialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    Password Changed Successfully!
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                      Your password is changed successfully. Please log in with
                      your new password.
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
      </div>

      <Footer />
    </div>
  );
};
export default CreatePassword;
