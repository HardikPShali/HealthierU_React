import React, { useState } from 'react'
import "./landing.css";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Login-Module/Header";
import Footer from '../Login-Module/Footer';

export default function PrivacyPolicy({ currentuserInfo }) {
    const [serverError, setServerError] = useState(false);

    const { authorities = [] } = currentuserInfo || {};

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
                                        <center><h4>HealthierU Licenses</h4></center>
                                        <br />
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <p className='static-pages'>
                                                            Lorem Ipsum is simply dummy text of the printing
                                                            and typesetting industry. Lorem Ipsum has been the
                                                            industry's standard dummy text ever since the
                                                            1500s, when an unknown printer took a galley of
                                                            type and scrambled it to make a type specimen
                                                            book. It has survived not only five centuries, but
                                                            also the leap into electronic typesetting,
                                                            remaining essentially unchanged. It was
                                                            popularised in the 1960s with the release of
                                                            Letraset sheets containing Lorem Ipsum passages,
                                                            and more recently with desktop publishing software
                                                            like Aldus PageMaker including versions of Lorem
                                                            Ipsum.
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p className='static-pages'>
                                                            Contrary to popular belief, Lorem Ipsum is not
                                                            simply random text. It has roots in a piece of
                                                            classical Latin literature from 45 BC, making it
                                                            over 2000 years old. Richard McClintock, a Latin
                                                            professor at Hampden-Sydney College in Virginia,
                                                            looked up one of the more obscure Latin words,
                                                            consectetur, from a Lorem Ipsum passage, and going
                                                            through the cites of the word in classical
                                                            literature, discovered the undoubtable source.
                                                            Lorem Ipsum comes from sections 1.10.32 and
                                                            1.10.33 of "de Finibus Bonorum et Malorum" (The
                                                            Extremes of Good and Evil) by Cicero, written in
                                                            45 BC. This book is a treatise on the theory of
                                                            ethics, very popular during the Renaissance. The
                                                            first line of Lorem Ipsum, "Lorem ipsum dolor sit
                                                            amet..", comes from a line in section 1.10.32.
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <p className='static-pages'>
                                                            It is a long established fact that a reader will
                                                            be distracted by the readable content of a page
                                                            when looking at its layout. The point of using
                                                            Lorem Ipsum is that it has a more-or-less normal
                                                            distribution of letters, as opposed to using
                                                            'Content here, content here', making it look like
                                                            readable English. Many desktop publishing packages
                                                            and web page editors now use Lorem Ipsum as their
                                                            default model text, and a search for 'lorem ipsum'
                                                            will uncover many web sites still in their
                                                            infancy. Various versions have evolved over the
                                                            years, sometimes by accident, sometimes on purpose
                                                            (injected humour and the like).
                                                        </p>
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
