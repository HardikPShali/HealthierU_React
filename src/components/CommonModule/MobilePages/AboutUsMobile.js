import React from 'react'
import { Container, Row, Col, Card } from "react-bootstrap";
import '../../../components/Login-Module/landing.css'
import step3 from "../../../images/step3.png";
import step13 from "../../../images/step13.png";
import CornelMedicine from "../../../images/cornell-medicine-logo.png";
import heartIcon from "../../../images/HeartSpl.png";
import labIcon from "../../../images/LabSpl.png";
import molecularIcon from "../../../images/MolecularSpl.png";
import careIcon from "../../../images/CareSpl.png";


const AboutUsMobile = (props) => {
  return (
    <div>
      <div id="about-us" className="about-us_section">
        <Container className="p-0 padding-mobile">
          {/* <h3 className="better-future text-uppercase text-center">
              HAND-IN-HAND FOR A BETTER FUTURE
            </h3> */}
          <div className="better-future-content">
            <div className="about-sec">
              <Row>
                <Col sm={12} md={7} lg={5}>
                  <div className="about-content">
                    <h3>ABOUT US</h3>
                    <span className="line"></span>
                    <p className="light" id="how-it-work">
                      HealthierU utilizes next-generation telemedicine to
                      provide you with the best access to highly trained and
                      licensed experts from wellness centers and clinics
                      across the UAE and across the globe.
                    </p>
                  </div>
                  <div className="how-content">
                    <h3>HOW?</h3>
                    <ul className="light">
                      <li>We use technology to transform your experience.</li>
                      <li>
                        We believe in a proactive care management approach.
                      </li>
                      <li>
                        We create a consumer-first approach and a personalized
                        data-driven digital health experience.
                      </li>
                      <li>
                        We are pioneers in bringing the Internet of Health to
                        everyone.
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </div>
      <div className="edge-section">
          <Container className="edge-section_container">
            <Row>
              <Col className="edge-text" sm={12} md={12} lg={6} xl={6}>
                <h1>OUR EDGE</h1>
                <p className="light edge-subtitle">
                  A one-of-a-kind and scalable wellness and prevention
                  telemedicine platform.
                </p>
                <ul>
                  <li>Personalized</li>
                  <li>Proactive system: Predicts diseases before they occur</li>
                  <li>Patient-centered</li>
                  <li>Value and not volume-based</li>
                  <li>Designed to prevent diseases</li>
                  <li>Barely any waiting time</li>
                  <li>
                    Treatment decisions are influenced by what is best for the
                    patient
                  </li>
                </ul>
              </Col>
              <Col className="edge-image" sm={12} md={12} lg={6} xl={6}>
                {/* <img className="mr-4" src={Edge1} alt=""></img> */}
                <img src={step3} alt=""></img>
              </Col>
              <div className="our_partners">
                <h4>Our Partner</h4>
                <div className="our_partners-logo">
                  <div className="cornel-logo">
                    <img src={CornelMedicine} alt="" />
                  </div>
                  {/* <div className="our_partners-vr-line"></div> */}
                  {/* <div className="reem-logo">
                    <img src={ReemHospital} alt="" />
                  </div> */}
                </div>
              </div>
            </Row>
          </Container>
        </div>
        <div className="powerful_feature">
          <Container>
            <Row>
              <Col className="powerful_Ftr-image" sm={12} md={12} lg={6} xl={6}>
                <img src={step13} alt=""></img>
              </Col>
              <Col className="powerful_Ftr-text" sm={12} md={12} lg={6} xl={6}>
                <h1>POWERFUL FEATURES</h1>
                <ul>
                  <li>Convenient and easy-to-use app</li>
                  <li>
                    Comprehensive solutions to help prevent and predict diseases
                  </li>
                  <li>
                    Unlimited 24/7 access to professionals in the wellness and
                    prevention field
                  </li>
                  <li>Robust and powerful technology</li>
                  <li>
                    Quick access to personalized supplements and wearables
                  </li>
                  <li>Customized nutrition meal and fitness plans</li>
                  <li>E-courses on wellness, health, and much more</li>
                  <li>Medicine and appointment reminders</li>
                  <li>Quick access to labs near you</li>
                  <li>Healthcare data security</li>
                </ul>
                <br></br>
                <br></br>
                <br id="our-service"></br>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="our_spl-section">
          <Container className="p-0 padding-mobile">
            <div>
              <br></br>
              <h1 className="our_spl-title">OUR SPECIALITIES</h1>
              <p className="our_spl-subtitle">
                We offer programs and plans to help support your wellness
                journey.
              </p>
            </div>
            <Row>
              <Col sm={12} md={6} lg={3} xl={3} l='true'>
                <img src={heartIcon} alt="" />
                <h3>REGENERATIVE MEDICINE</h3>
                <ul>
                  <li>Sleep Therapy</li>
                  <li>Immune Health</li>
                  <li>Sexual health</li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l='true'>
                <img src={labIcon} alt="" />
                <h3>FUNCTIONAL MEDICINE</h3>
                <ul>
                  <li>Comprehensive lab diagnostics</li>
                  <li>Gut Microbiome</li>
                  <li>Sexual health hormones</li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l='true'>
                <img src={molecularIcon} alt="" />
                <h3>MOLECULAR MEDICINE</h3>
                <ul>
                  <li>
                    Integrative and Holistic Nutrition and sport Performance
                  </li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l='true'>
                <img src={careIcon} alt="" />
                <h3>ENERGY / BODY-MIND MEDICINE</h3>
                <ul>
                  <li>Stress management</li>
                  <li>Mental management</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
    </div>
  )
}

export default AboutUsMobile