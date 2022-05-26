import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./landing.css";
import aboutUsimg from "../../images/macbook-iphone-healthyU.png";
import features from "../../images/our-features.png";
import { Container, Row, Col } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
} from "mdbreact";
import { Link } from "react-router-dom";
import step1 from "../../images/step1.PNG";
import step2 from "../../images/step2.PNG";
import step3 from "../../images/step3.png";
import step4 from "../../images/step4.PNG";
import step5 from "../../images/step5.PNG";
import step6 from "../../images/step6.PNG";
import step7 from "../../images/step7.PNG";
import step8 from "../../images/step8.PNG";
import step9 from "../../images/step9.PNG";
import step10 from "../../images/step10.PNG";
import step11 from "../../images/step11.PNG";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { HOMEPAGE_GETHELP } from "../../util/constant";
import { useHistory } from "react-router-dom";
// import PatientFooter from "./../Patient Module/Footer";
// import DoctorFooter from "./../Doctor Module/Footer";
// import PatientHeader from "./../Patient Module/Header";
// import DoctorHeader from "./../Doctor Module/Header";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AboutUs = ({ currentuserInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [open, setOpen] = useState(false);
  // const handleClickOpen = () => {
  //     setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
  };

  // const [contactDetails, setContactDetails] = useState({
  //   senderName: "",
  //   senderMail: "",
  //   subject: "",
  //   message: "",
  // });

  // const { senderName, senderMail, subject, message } = contactDetails;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // const handleInputChange = (e) => {
  //   setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  // };

  //console.log("currentuserInfo ::::: about us :::::", currentuserInfo);
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

  // const sendContactDetails = () => {
  //   var payload = {
  //     method: "post",
  //     mode: "no-cors",
  //     data: contactDetails,
  //     url: `/api/contact-us`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   };
  //   axios(payload)
  //     .then((response) => {
  //       // //console.log(response.status);
  //       if (response.status === 200 || response.status === 201) {
  //         alert("Message sent successfully");
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status === 500) {
  //         setServerError(true);
  //         setTimeout(() => history.push("/"), 5000);
  //       }
  //     });
  // };

  return (
    <div>
      {loading && <Loader />}
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
          {authorities.length > 0 &&
          authorities.some((user) => user === "ROLE_PATIENT") ? (
            <></>
          ) : authorities.length > 0 &&
            authorities.some((user) => user === "ROLE_DOCTOR") ? (
            <></>
          ) : (
            <Header />
          )}
          <div className="header-bgimage">
            <div className="header-caption">
              <h3 className="h3-responsive">
                Healthcare at
                <br />
                your hands
              </h3>
              <p className="help-desc">{HOMEPAGE_GETHELP.DESCRIPTION}</p>
              <Link to={redirectUrl}>
                <button className="btn btn-light get-started-btn">
                  Get Started Now
                </button>
              </Link>
            </div>
          </div>
          <Container>
            <Row id="aboutus-two">
              <Col md={5}>
                <h2>HealthierU</h2>
                <h4>Wellness Optimized</h4>
                <br />
                <p>
                  HealthierU is an integrated and fully secured health
                  communications platform that aims to bring the best
                  international medical care to all users from across the globe.{" "}
                </p>
                <p>
                  Get answers. Get well.
                  <br />
                  'Tap into the best virtual healthcare.'
                </p>
              </Col>
              <Col md={7}>
                <img className="image" src={aboutUsimg} alt="HealthierU " />
              </Col>
            </Row>
          </Container>
          <Container id="second-box">
            <Row>
              <Col md={6} id="why-choose"></Col>
              <Col md={6} id="col-card-2">
                <h2>Why choose HealthierU?</h2>
                <br />
                <p id="doc-box-text">
                  When it comes to your health, prevention is always much better
                  than a cure; this is exactly what HealthierU does. Preventive
                  care is important because it helps you stay healthy and
                  enables you to access prompt treatment when necessary. It can
                  also help reduce your overall medical expenses.
                </p>
              </Col>
            </Row>
          </Container>
          <br />
          <br />
          <Container id="aboutus-three">
            <MDBContainer id="how-it-work">
              <MDBCarousel
                activeItem={1}
                length={4}
                slide={true}
                interval={false}
                showControls={true}
                multiItem
              >
                <MDBCarouselInner>
                  <MDBRow>
                    <MDBCarouselItem itemId="1">
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step1} />
                          <MDBCardBody>
                            <MDBCardText>
                              Connect with our Global Wellness Experts Virtually
                              <br />
                              Our specialties include mental health, nutrition,
                              sleep health, immunity, fitness, and much more.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="2"></MDBCol>
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step2} />
                          <MDBCardBody>
                            <MDBCardText>
                              Set up your account within seconds
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="2">
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step3} />
                          <MDBCardBody>
                            <MDBCardText>
                              Connect with the right care.
                              <br />
                              Find the right doctor for your need.
                              <br />
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="2"></MDBCol>
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step4} />
                          <MDBCardBody>
                            <MDBCardText>
                              Access your appointments in seconds.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="3">
                      <MDBCol md="4">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step5} />
                          <MDBCardBody>
                            <MDBCardText>Find the right care.</MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="4">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step6} />
                          <MDBCardBody>
                            <MDBCardText>
                              Schedule your online
                              <br />
                              consultation.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="4">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step7} />
                          <MDBCardBody>
                            <MDBCardText>
                              Consult with your doctor virtually.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="4">
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step8} />
                          <MDBCardBody>
                            <MDBCardText>
                              Have instant chat with your doctor.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="2"></MDBCol>
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step9} />
                          <MDBCardBody>
                            <MDBCardText>
                              Review your doctor's report and prescription.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                    {/* <MDBCarouselItem itemId="5">
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step10} />
                      <MDBCardBody>
                        <MDBCardText>
                          Access your personalized <br />
                          supplements and wearables.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="2"></MDBCol>
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step11} />
                      <MDBCardBody>
                        <MDBCardText>
                          Find out more about our nutrition and <br />
                          workout plans, courses and latest <br /> scientific
                          articles.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBCarouselItem> */}
                  </MDBRow>
                </MDBCarouselInner>
              </MDBCarousel>
            </MDBContainer>
          </Container>
          <br />
          <br />
          <div id="our-services">
            <Container>
              <Row id="aboutus-four">
                <Col md={5} style={{ padding: "0px" }}>
                  <img className="image" src={features} alt="Features" />
                </Col>
                <Col md={1}></Col>
                <Col md={6}>
                  <h2>Our Features</h2>
                  <br />
                  <br />
                  <h5>Robust & scalable platform</h5>
                  <p>
                    A powerful technology stack for a highly-scalable
                    <br />
                    telemedicine platform.
                  </p>

                  <h5>Unlimited access to accredited doctors</h5>
                  <p>
                    We offer access to the best accredited doctors and medical
                    <br />
                    institutions in Europe and the USA.
                  </p>

                  <h5>Quick access to medical care</h5>
                  <p>
                    Connect to any of our global doctors at your convenience.
                  </p>

                  <h5>Healthcare data security</h5>
                  <p>
                    We respect and commit to protecting your privacy and
                    <br />
                    personal data.
                  </p>

                  <h5>Innovative AI - powered app</h5>
                  <p>
                    Our AI technology will help personalize and optimize your
                    <br />
                    needs based on a comprehensive assessment.
                  </p>

                  <h5>Integration of wearable devices</h5>
                  <p>
                    Connect with any wearable device and allow us to remotely
                    <br />
                    monitor your health.
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          {/* <Container id="contact-us">
            <Row id="aboutus-last">
              <Col md={12} className="mt-5 mb-5">
                <h2>Feel Free To Contact Us</h2>
                <h5>Contact Our Support Team At Anytime</h5>
                <br />
                <br />
                <ValidatorForm onSubmit={() => sendContactDetails()}>
                  <Row>
                    <Col md={6}>
                      <TextValidator
                        id="standard-basic"
                        type="text"
                        name="senderName"
                        value={senderName}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="YOUR NAME*"
                        validators={["required"]}
                        errorMessages={[("This field is required")]}
                        variant="filled"
                      />
                      <br />
                      <TextValidator
                        id="standard-basic"
                        type="text"
                        name="senderMail"
                        value={senderMail}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="EMAIL ADDRESS*"
                        validators={["required"]}
                        errorMessages={[("This field is required")]}
                        variant="filled"
                      />
                      <br />
                      <TextValidator
                        id="standard-basic"
                        type="text"
                        name="subject"
                        value={subject}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="SUBJECT"
                        variant="filled"
                      />
                      <br />
                    </Col>
                    <Col md={6}>
                      <TextValidator
                        id="standard-basic"
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="YOUR MESSAGE"
                        multiline
                        rows={4}
                        variant="filled"
                      />
                      <input
                        className="btn btn-primary sign-btn"
                        type="submit"
                        value="SEND MESSAGE"
                      />
                    </Col>
                  </Row>
                </ValidatorForm>
                <br />
                <br />
                <Row id="contact-details">
                  <Col md={4}>
                    <h6>Phone</h6>
                    <p>+971 2 650 2444</p>
                  </Col>
                  <Col md={4}>
                    <h6>E-mail Address</h6>
                    <p>customerservice@healthieru.ae</p>
                  </Col>
                  <Col md={4}>
                    <h6>Office Address</h6>
                    <p>Reem Island, Abu Dhabi, UAE</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container> */}
          {authorities.length > 0 &&
          authorities.some((user) => user === "ROLE_PATIENT") ? (
            <></>
          ) : authorities.length > 0 &&
            authorities.some((user) => user === "ROLE_DOCTOR") ? (
            <></>
          ) : (
            <Footer />
          )}
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Message sent successfully!
            </DialogTitle>
            <DialogActions>
              <button
                autoFocus
                onClick={handleClose}
                className="btn btn-primary sign-btn"
                id="close-btn"
              >
                Ok
              </button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AboutUs;
