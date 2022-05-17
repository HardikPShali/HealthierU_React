import React, { useState } from 'react';
import './landing.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../Login-Module/Header';
import Footer from '../Login-Module/Footer';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy({ currentuserInfo }) {
    const [serverError, setServerError] = useState(false);

    const { authorities = [] } = currentuserInfo || {};

    let redirectUrl = '';
    if (authorities.some((user) => user === 'ROLE_PATIENT')) {
        redirectUrl = '/patient';
    } else if (authorities.some((user) => user === 'ROLE_DOCTOR')) {
        redirectUrl = '/doctor';
    } else {
        redirectUrl = '/';
    }

    return (
        <div>
            {serverError && (
                <>
                    <center
                        className="d-flex w-100 align-items-center"
                        style={{ height: '100vh' }}
                    >
                        <h2>Something went wrong. Try again after some time!</h2>
                        <p>You will be redirected to HomePage in 5 sec.</p>
                    </center>
                </>
            )}
            {!serverError && (
                <>
                    {authorities.length > 0 &&
                        authorities.some((user) => user === 'ROLE_PATIENT') ? (
                        <></>
                    ) : authorities.length > 0 &&
                        authorities.some((user) => user === 'ROLE_DOCTOR') ? (
                        <></>
                    ) : (
                        <Header />
                    )}
                    <Container>
                        <Row>
                            <Col md={2}></Col>
                            <Col md={8}>
                                <div className="content" id="profile-form">
                                    <div className="signin-box">
                                        <center>
                                            <h3>
                                                <strong>Privacy Policy</strong>
                                            </h3>
                                        </center>
                                        <br />
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={12}>
                                                        <p className="static-pages">
                                                            At Privacy Policy, one of our main priorities is
                                                            the privacy of our visitors. This Privacy Policy
                                                            document contains types of information that is
                                                            collected and recorded by Privacy Policy and how
                                                            we use it.
                                                            <br />
                                                            If you have additional questions or require more
                                                            information about our Privacy Policy, do not
                                                            hesitate to contact us through email.
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Log Files</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            Privacy Policy follows a standard procedure of
                                                            using log files. These files log visitors when
                                                            they visit websites. All hosting companies do this
                                                            and a part of hosting services' analytics. The
                                                            information collected by log files include
                                                            internet protocol (IP) addresses, browser type,
                                                            Internet Service Provider (ISP), date and time
                                                            stamp, referring/exit pages, and possibly the
                                                            number of clicks. These are not linked to any
                                                            information that is personally identifiable. The
                                                            purpose of the information is for analyzing
                                                            trends, administering the site, tracking users'
                                                            movement on the website, and gathering demographic
                                                            information.
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Cookies and Web Beacons</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            Like any other website, Privacy Policy uses
                                                            'cookies'. These cookies are used to store
                                                            information including visitors' preferences, and
                                                            the pages on the website that the visitor accessed
                                                            or visited. The information is used to optimize
                                                            the users' experience by customizing our web page
                                                            content based on visitors' browser type and/or
                                                            other information.
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Privacy Policy</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            You may consult this list to find the Privacy
                                                            Policy for each of the advertising partners of
                                                            Privacy Policy. Our Privacy Policy was created
                                                            with the help of the{' '}
                                                            <Link
                                                                to={{
                                                                    pathname:
                                                                        'https://www.privacypolicygenerator.info/',
                                                                }}
                                                                target="_blank"
                                                            >
                                                                Privacy Policy Generator
                                                            </Link>
                                                            .
                                                            <br />
                                                            Third-party ad servers or ad networks uses
                                                            technologies like cookies, JavaScript, or Web
                                                            Beacons that are used in their respective
                                                            advertisements and links that appear on Privacy
                                                            Policy, which are sent directly to users' browser.
                                                            They automatically receive your IP address when
                                                            this occurs. These technologies are used to
                                                            measure the effectiveness of their advertising
                                                            campaigns and/or to personalize the advertising
                                                            content that you see on websites that you visit.
                                                            <br />
                                                            Note that Privacy Policy has no access to or
                                                            control over these cookies that are used by
                                                            third-party advertisers.
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Third Party Privacy Policies</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            Privacy Policy's Privacy Policy does not apply to
                                                            other advertisers or websites. Thus, we are
                                                            advising you to consult the respective Privacy
                                                            Policies of these third-party ad servers for more
                                                            detailed information. It may include their
                                                            practices and instructions about how to opt-out of
                                                            certain options. You may find a complete list of
                                                            these Privacy Policies and their links here:
                                                            Privacy Policy Links.
                                                            <br />
                                                            You can choose to disable cookies through your
                                                            individual browser options. To know more detailed
                                                            information about cookie management with specific
                                                            web browsers, it can be found at the browsers'
                                                            respective websites. What Are Cookies?
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Children's Information</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            Privacy Policy does not knowingly collect any
                                                            Personal Identifiable Information from children
                                                            under the age of 13. If you think that your child
                                                            provided this kind of information on our website,
                                                            we strongly encourage you to contact us
                                                            immediately and we will do our best efforts to
                                                            promptly remove such information from our records.
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Online Privacy Policy Only</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            This Privacy Policy applies only to our online
                                                            activities and is valid for visitors to our
                                                            website with regards to the information that they
                                                            shared and/or collect in Privacy Policy. This
                                                            policy is not applicable to any information
                                                            collected offline or via channels other than this
                                                            website.
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <Col md={12}>
                                                        <h5>
                                                            <strong>Consent</strong>
                                                        </h5>
                                                        <p className="static-pages">
                                                            By using our website, you hereby consent to our
                                                            Privacy Policy and agree to its Terms and
                                                            Conditions.
                                                        </p>
                                                        <br />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    {authorities.length > 0 &&
                        authorities.some((user) => user === 'ROLE_PATIENT') ? (
                        <></>
                    ) : authorities.length > 0 &&
                        authorities.some((user) => user === 'ROLE_DOCTOR') ? (
                        <></>
                    ) : (
                        <Footer />
                    )}
                </>
            )}

            {/* <Footer /> */}
        </div>
    );
}
