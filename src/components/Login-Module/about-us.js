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
import { HOMEPAGE_GETHELP } from '../../util/constant';
import { useTranslation } from 'react-i18next';

// import PatientFooter from "./../Patient Module/Footer";
// import DoctorFooter from "./../Doctor Module/Footer";
// import PatientHeader from "./../Patient Module/Header";
// import DoctorHeader from "./../Doctor Module/Header";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AboutUs = ({ currentuserInfo }) => {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [open, setOpen] = useState(false);
  // const handleClickOpen = () => {
  //     setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
  };

  const [contactDetails, setContactDetails] = useState({
    senderName: "",
    senderMail: "",
    subject: "",
    message: "",
  });

  const { senderName, senderMail, subject, message } = contactDetails;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleInputChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

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

  const sendContactDetails = () => {
    var payload = {
      method: "post",
      mode: "no-cors",
      data: contactDetails,
      url: `/api/contact-us`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios(payload)
      .then((response) => {
        // //console.log(response.status);
        if (response.status === 200 || response.status === 201) {
          alert("Message sent successfully");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          setServerError(true);
          setTimeout(() => window.location.assign("/"), 5000);
        }
      });
  };

  const { t } = useTranslation(['about-us']);
  const language = localStorage.getItem('i18nextLng');

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
                {t('Healthcare at')}
                <br />
                {t('your hands')}
              </h3>
              <p className="help-desc">
                {t(`${HOMEPAGE_GETHELP.DESCRIPTION}`)}
              </p>
              <Link to={redirectUrl}>
                <button className="btn btn-light get-started-btn">
                  {t('Get Started Now')}
                </button>
              </Link>
            </div>
          </div>
          <Container>
            <Row id="aboutus-two">
              <Col md={5}>
                <h2>HealthierU</h2>
                <h4>{t('Wellness Optimized')}</h4>
                <br />
                <p>
                  {t('HealthierU is an integrated and fully secured health communications platform that aims to bring the best international medical care to all users from across the globe.')}{" "}
                </p>
                <p>
                  {t('Get answers. Get well.')}
                  <br />
                  {t('Tap into the best virtual healthcare.')}
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
                <h2>{t('Why choose HealthierU?')}</h2>
                <br />
                <p id="doc-box-text">
                  {t('When it comes to your health, prevention is always much better than a cure; this is exactly what HealthierU does. Preventive care is important because it helps you stay healthy and enables you to access prompt treatment when necessary. It can also help reduce your overall medical expenses.')}
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
                length={5}
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
                              {t('Set up your account')}
                              <br />
                              {t('within seconds and the team will get')}  <br />{t('in touch with you for verification purposes.')}
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
                              {t('Get easy access to your')}
                              <br />
                              {t("patient's medical records.")}
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
                              {t('Consult and chat with your')}
                              <br />
                              {t('patient according to your')}
                              <br />
                              {t('availaibility and time zone.')}
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
                              {t('Access the latest updates in')}
                              <br />
                              {t('the health and medical field.')}
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
                            <MDBCardText>
                              {t('Connect with the right')}
                              <br />
                              {t('medical care.')}
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="4">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step6} />
                          <MDBCardBody>
                            <MDBCardText>
                              {t('Schedule your online')}
                              <br />
                              {t('consultation.')}
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol md="4">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step7} />
                          <MDBCardBody>
                            <MDBCardText>
                              {t('Pay as soon as you book.')}
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
                              {t('Consult with your')}
                              <br />
                              {t('virtual doctor.')}
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
                              {t("Review your doctor's report.")}
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="5">
                      <MDBCol md="5">
                        <MDBCard className="mb-2">
                          <MDBCardImage className="img-fluid" src={step10} />
                          <MDBCardBody>
                            <MDBCardText>
                              {t('Access your personalized')} <br />
                              {t('supplements and wearables.')}
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
                              {t('Find out more about our nutrition and')} <br />
                              {t('workout plans, courses and latest')} <br />{" "}
                              {t('scientific articles.')}
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBCarouselItem>
                  </MDBRow>
                </MDBCarouselInner>
              </MDBCarousel>
            </MDBContainer>
          </Container>
          <br />
          <br />
          <Container id="our-services">
            <Row id="aboutus-four">
              <Col md={5} style={{ padding: "0px" }}>
                <img className="image" src={features} alt="Features" />
              </Col>
              <Col md={1}></Col>
              <Col md={6}>
                <h2>{t('Our Features')}</h2>
                <br />
                <br />
                <h5>{t('Robust & scalable platform')}</h5>
                <p>
                  {t('A powerful technology stack for a highly-scalable')}
                  <br />
                  {t('telemedicine platform.')}
                </p>

                <h5>{t('Unlimited access to accredited doctors')}</h5>
                <p>
                  {t('We offer access to the best accredited doctors and medical')}
                  <br />
                  {t('institutions in Europe and the USA.')}
                </p>

                <h5>{t('Quick access to medical care')}</h5>
                <p>{t('Connect to any of our global doctors at your convenience.')}</p>

                <h5>{t('Healthcare data security')}</h5>
                <p>
                  {t('We respect and commit to protecting your privacy and')}
                  <br />
                  {t('personal data.')}
                </p>

                <h5>{t('Innovative AI - powered app')}</h5>
                <p>
                  {t('Our AI technology will help personalize and optimize your')}
                  <br />
                  {t('needs based on a comprehensive assessment.')}
                </p>

                <h5>{t('Integration of wearable devices')}</h5>
                <p>
                  {t('Connect with any wearable device and allow us to remotely')}
                  <br />
                  {t('monitor your health.')}
                </p>
              </Col>
            </Row>
          </Container>
          <Container id="contact-us">
            <Row id="aboutus-last">
              <Col md={12} className="mt-5 mb-5">
                <h2>{t('Feel Free To Contact Us')}</h2>
                <h5>{t('Contact Our Support Team At Anytime')}</h5>
                <br />
                <br />
                <ValidatorForm onSubmit={() => sendContactDetails()}>
                  <Row>
                    <Col md={6}>
                      <TextValidator
                        id={language === 'ar' ? "standard-basic-arabic" : "standard-basic"}
                        type="text"
                        name="senderName"
                        value={senderName}
                        onChange={(e) => handleInputChange(e)}
                        placeholder={t("YOUR NAME*")}
                        validators={["required"]}
                        errorMessages={[t("This field is required")]}
                        variant="filled"
                      />
                      <br />
                      <TextValidator
                        id={language === 'ar' ? "standard-basic-arabic" : "standard-basic"}
                        type="text"
                        name="senderMail"
                        value={senderMail}
                        onChange={(e) => handleInputChange(e)}
                        placeholder={t("EMAIL ADDRESS*")}
                        validators={["required"]}
                        errorMessages={[t("This field is required")]}
                        variant="filled"
                      />
                      <br />
                      <TextValidator
                        id={language === 'ar' ? "standard-basic-arabic" : "standard-basic"}
                        type="text"
                        name="subject"
                        value={subject}
                        onChange={(e) => handleInputChange(e)}
                        placeholder={t("SUBJECT")}
                        variant="filled"
                      />
                      <br />
                    </Col>
                    <Col md={6}>
                      <TextValidator
                        id={language === 'ar' ? "standard-basic-arabic" : "standard-basic"}
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => handleInputChange(e)}
                        placeholder={t("YOUR MESSAGE")}
                        multiline
                        rows={4}
                        variant="filled"
                      />
                      <input
                        className="btn btn-primary sign-btn"
                        type="submit"
                        value={t("SEND MESSAGE")}
                      />
                    </Col>
                  </Row>
                </ValidatorForm>
                <br />
                <br />
                <Row id="contact-details">
                  <Col md={4}>
                    <h6>{t('Phone')}</h6>
                    <p>+971 2 650 2444</p>
                  </Col>
                  <Col md={4}>
                    <h6>{t('E-mail Address')}</h6>
                    <p>customerservice@healthieru.ae</p>
                  </Col>
                  <Col md={4}>
                    <h6>{t('Office Address')}</h6>
                    <p>Reem Island, Abu Dhabi, UAE</p>
                  </Col>
                </Row>
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
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              {t('Message sent successfully!')}
            </DialogTitle>
            <DialogActions>
              <button
                autoFocus
                onClick={handleClose}
                className="btn btn-primary sign-btn"
                id="close-btn"
              >
                {t('Ok')}
              </button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AboutUs;
