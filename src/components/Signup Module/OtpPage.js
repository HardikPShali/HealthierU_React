import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../Login-Module/landing.css";
import Header from "../Login-Module/Header";
import Footer from "../Login-Module/Footer";
import { Link } from 'react-router-dom';

const OtpPage = () => {
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

    return (
        <div>
            <Header />

            <Container id="signupform-bg">
                <Row>
                    <Col md={6}></Col>
                    <Col md={5}>

                        <div className="sign-box text-center">
                            <h2 id="signin-title">OTP Verification</h2>
                            <p>OTP has been sent to "email"</p>

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

                            <p>OTP is {otpBox.join("")}</p>

                            <p>
                                <button
                                    className='btn btn-secondary mr-2'
                                    onClick={() => {
                                        setOtpBox(new Array(4).fill(''));
                                    }}
                                >
                                    Clear
                                </button>
                                <Link to="/">
                                    <button className="btn btn-outline-primary sign-btn">
                                        Verify
                                    </button>
                                </Link>
                            </p>


                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default OtpPage;
