import React, { useState } from 'react'
import "./landing.css";
import Loader from "../Loader/Loader";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Login-Module/Header";
import Footer from '../Login-Module/Footer';

export default function PrivacyPolicy({ currentuserInfo }) {
    const [serverError, setServerError] = useState(false);
    const [loading, setLoading] = useState(true);

    const { authorities = [] } = currentuserInfo || {};
    //console.log("authorities ::::: about us :::::", authorities);
    let redirectUrl = "";
    if (authorities.some((user) => user === "ROLE_PATIENT")) {
        redirectUrl = "/patient";
    } else if (authorities.some((user) => user === "ROLE_DOCTOR")) {
        redirectUrl = "/doctor";
    } else {
        redirectUrl = "/";
    }


    return (
        <div>
            {/* {loading && <Loader />} */}
            {serverError && (
                <>
                    <center
                        className="d-flex w-100 align-items-center"
                        style={{ height: "100vh" }}
                    >
                        <h2>Something went wrong. Try again after some time!</h2>
                        <p>You will be redirected to HomePage in 5 sec.</p>
                    </center>
                </>
            )}
            {!serverError && (
                <>
                    {
                        authorities.length > 0 &&
                            authorities.some((user) => user === "ROLE_PATIENT") ? (
                            <></>
                        ) : authorities.length > 0 &&
                            authorities.some((user) => user === "ROLE_DOCTOR") ? (
                            <></>
                        ) : (
                            <Header />
                        )
                    }
                    < Container >
                        <Row>
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <div className="content" id="profile-form">
                                    <div className="signin-box">
                                        <center><h4>Terms And Conditions</h4></center>
                                        <br />
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Paragraph 1</p>

                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Paragraph 2</p>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p>Paragraph 3</p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    {authorities.length > 0 &&
                        authorities.some((user) => user === "ROLE_PATIENT") ? (
                        <></>
                    ) : authorities.length > 0 &&
                        authorities.some((user) => user === "ROLE_DOCTOR") ? (
                        <></>
                    ) : (
                        <Footer />
                    )}
                </>
            )
            }

            {/* <Footer /> */}
        </div>
    )
}
