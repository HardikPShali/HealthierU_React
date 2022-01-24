import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
import "./landing.css";
import { Container, Row, Col } from "react-bootstrap";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  handleChangePassword
} from "../../service/frontendapiservices";
import Loader from '../Loader/Loader';

const ChangePassword = (props) => {

  const { homeUrl } = props;

  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    msg:""
  });

  const { currentPassword, newPassword, confirmPassword, msg } = changePassword;

  const [loading, setLoading] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleChangePasswordOpen = () => {
    setChangePasswordOpen(true);
  };
  const handleChangePasswordClose = () => {
    setChangePasswordOpen(false);
    window.location.assign(homeUrl);
  };

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== newPassword) {
      return false;
    } else if (value === newPassword) {
      return true;
    }
  });

  const handleChange = (e) => {
    setChangePassword({ ...changePassword, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const changePasswordObj = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    const response = await handleChangePassword(changePasswordObj).catch(err => {
      if(err && err.response.status === 400) {
        setChangePassword({...changePassword, msg: "Incorrect current password."})
      }
    });
    if (response) {
      if (response.status === 200 || response.status === 201) {
        handleChangePasswordOpen();
      }
    }
  };
  const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleClickShowPassword = (val) => {
    if(val==="current") {
      setCurrentPasswordShown(currentPasswordShown ? false : true);
    }
    if(val==="new") {
      setNewPasswordShown(newPasswordShown ? false : true);
    }
    if(val==="confirm") {
      setPasswordShown(passwordShown ? false : true);
    }
  };
  return (
    <>
      {loading && (
        <Loader />
      )}
      <Container>
        <Row>
          <Col md={2}>
          </Col>
          <Col md={8}>
            <div className="content" id="profile-form">
              <div className="signin-box">
                <center><h4>Change Password</h4></center>
                <br/>
                <ValidatorForm
                  className="changepass-form"
                  onSubmit={() => handleSubmit()}
                >
                  <Row>
                    <Col md={12}>
                      <Row>
                        <Col md={12}>
                          <p>Current Password</p>
                          <TextValidator
                            id="standard-basic"
                            type={currentPasswordShown ? "text" : "password"}
                            variant="filled"
                            name="currentPassword"
                            value={currentPassword}
                            validators={["required"]}
                            errorMessages={[""]}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword("current")}
                                >
                                  {currentPasswordShown ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            }}
                          />
                          {msg && (<p
                              className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled"
                              id="standard-basic-helper-text"
                              style={{ color: "#f44336" }}
                            >
                              {msg}
                            </p>)}
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col md={12}>
                          <p>New Password</p>
                          <TextValidator
                            id="standard-basic"
                            type={newPasswordShown ? "text" : "password"}
                            variant="filled"
                            name="newPassword"
                            value={newPassword}
                            validators={['required', 'matchRegexp:(?=.*[a-z])', 'matchRegexp:(?=.*[A-Z])', 'minStringLength:8', 'matchRegexp:(?=.*[0-9])']}
                            errorMessages={['This field is required', 'Include at least 1 lower case', 'Include at least 1 upper case', 'Minimum of 8 characters', 'At least 1 number']}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword("new")}
                                >
                                  {newPasswordShown ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            }}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col md={12}>
                          <p>Confirm Password</p>
                          <TextValidator
                            id="standard-basic"
                            type={passwordShown ? "text" : "password"}
                            variant="filled"
                            name="confirmPassword"
                            value={confirmPassword}
                            validators={["isPasswordMatch", "required"]}
                            errorMessages={["Password Does not match", ""]}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => handleClickShowPassword("confirm")}
                                >
                                  {passwordShown ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            }}
                          />
                          <br />
                          <button className="btn btn-primary sign-btn" type="submit">Submit</button>
                        </Col>
                      </Row>
                      <br />
                    </Col>
                  </Row>
                </ValidatorForm>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Dialog
        aria-labelledby="customized-dialog-title"
        open={changePasswordOpen}
        id="profilePopup"
      >
        <DialogContent className="forget-form">
          <button
            aria-label="close"
            className="closeButton"
            onClick={handleChangePasswordClose}
          >
            Close <CloseIcon />
          </button>
          <br />
          <h4>Password Changed!</h4>
          <p>
            Your password has been changed, next time login with new password.
          </p>
          <br />
          <br />
          <button
            className="btn btn-dark float-right px-5"
            onClick={() => handleChangePasswordClose()}
          >
            Ok
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePassword;
