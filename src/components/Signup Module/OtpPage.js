import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../Login-Module/landing.css";
import Header from "../Login-Module/Header";
import Footer from "../Login-Module/Footer";
import { activateOtp } from '../../service/AccountService';
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {
    Link,
} from "react-router-dom";

const OtpPage = () => {

    //LOGIC FOR OTP BOXES
    const [otpBox, setOtpBox] = useState(new Array(4).fill(''));
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtpBox([
            ...otpBox.map((ele, i) =>
                i === index ? element.value : ele
            ),
        ]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    //LOGIC FOR OTP SUBMIT
    const [user, setUser] = useState({
        msg: "",
        loggedIn: false,
        otp: "",
    });

    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOTPSubmit = async () => {
        const otp = otpBox.join('');
        const res = await activateOtp(otp).catch((err) => {
            if (err.response && err.response.status === 406) {
                setUser({
                    ...user,
                    msg: "Invalid OTP. Please generate new OTP and try again!",
                });
            }
        });
        if (res) {
            console.log(res);
            handleClickOpen();
        }
    };

    return (
        <div>
            <Header />

            <Container id="signupform-bg">
                <Row>
                    <Col md={6}></Col>
                    <Col md={5}>

                        <div className="sign-box text-center">
                            <h2 id="signin-title">OTP Verification</h2>
                            <p style={{ fontSize: '14px' }}>OTP has been sent to "email"</p>

                            <div className='otp-box-div'>
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

                            <div>
                                <button
                                    className='otp-verify'
                                    onClick={() => {
                                        setOtpBox(new Array(4).fill(''));
                                    }}
                                >
                                    Clear
                                </button>

                                <button className="otp-verify" onClick={() => handleOTPSubmit()}>
                                    Verify
                                </button>

                            </div>


                        </div>
                    </Col>
                </Row>

                <Dialog aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title">
                        Account Activated Successfully!
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Please Log In.
                            <br />
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
            </Container>
            <Footer />
        </div>
    );
};

export default OtpPage;
