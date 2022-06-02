import React, { Component } from "react"; 
import logo from "../../images/logo/logo-with-quote.png";
import "./patient.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  Link,
  // Navlink
} from "react-router-dom";
import applestore from "../../images/icons used/appstore.png";
import googleplay from "../../images/icons used/googleplay.png";
import fbicon from "../../images/icons used/facebook.png";
import instaicon from "../../images/icons used/instagram.png";
import twittericon from "../../images/icons used/twitter.png";
import gplusicon from "../../images/icons used/googleplus.png";
import YouTubeIcon from "@material-ui/icons/YouTube";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
//   const change = (e) => {
//     localStorage.setItem("language", e.target.value);
//     // window.location.reload();
//   };

  return (
    <footer>
      <div id="footer">
        <Container>
          <Row>
          <Col md={3} lg={2} xl={2}>
              <img
                src={logo}
                id="icon"
                alt="HealthierU Logo"
                style={{ width: "10rem", marginBottom: 22 }}
              />
              <br />
              <Link to="/about-us" id="footer-link">
                About us
              </Link>
              <HashLink to="/about-us#how-it-work" id="footer-link">
                How it Works
              </HashLink>
              <HashLink to="/about-us#our-services" id="footer-link">
                Our services
              </HashLink>
              {/* <Link to="" id="footer-link">
                                Articles
                            </Link> */}
              {/* <HashLink to="/about-us#contact-us" id="footer-link">
                                Contact us
                            </HashLink> */}
            </Col>
            <Col
              md={9}
              lg={6}
              xl={6}
              style={{ display: "flex", height: 180, alignItems: "center" }}
            >
              {/*<div id="active-user">
                                <b id="right-border">
                                    <span>42,233</span> Active Users
                                    </b>
                                <b style={{ paddingLeft: 15 }}>
                                    <span>128</span> Expert Doctors
                                        </b>
                            </div><br />*/}
              <div style={{ width: "100%", textAlign: "center" }}>
                <p>Email Newsletters</p>
                <p style={{ fontSize: 11 }}>
                  Stay up-to-date with the latest content and offers from
                  HealthierU
                </p>
                <form style={{ marginLeft: 26 }}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    id="footer-input"
                  />
                  <input
                    type="submit"
                    value="Subscribe"
                    className="btn submit-btn"
                  />
                </form>
              </div>
            </Col>
            <Col md={12} lg={4} xl={4} id="last-col">
              <h4 className="footer-wellnes">Wellness Optimized</h4>
              <p id="download-statement">
                Unlock your health data and get instant insights
                <br />
                Download the HealthierU app today
              </p>
              <div className="footer-store-icons">
                <img
                  src={applestore}
                  alt=""
                  id="store-icon"
                  className="mr-3 image-mobile-respv__landing"
                />

                <img src={googleplay} alt="" id="store-icon" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div id="copyright">
        <Container>
          <Row>
            <Col md={8}>
              <div className="terms-container">
                <Link to="/privacy-policy" className="" id="copy-link">
                  Privacy and Security
                </Link>
                <Link to="/terms-and-conditions" className="" id="copy-link">
                  Terms and Conditions
                </Link>
                <Link to="/help-and-support" className="" id="copy-link">
                  Help And Support
                </Link>
                {/* <Link to="/licenses" className="" id="copy-link">
                                    HealthierU Licenses
                                </Link>
                                <Link to="/partners" className="" id="copy-link">
                                    Partners
                                </Link> */}
              </div>
              <p id="copyright-text">
                © 2021 <Link to="/">HealthierU</Link> - All Rights Reserved.
              </p>
            </Col>
            <Col id="last-col">
              {/* <p id="lang-select">
                Language
                <select onChange={(e) => change(e)}>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="enuk">English(UK)</option>
                </select>
              </p> */}
              <div id="social-icon" className="d-flex">
                <a
                  href="https://www.facebook.com/HealthierU-109526728064645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                  id="foot-icon"
                >
                  <img src={fbicon} alt="" />
                </a>
                <a
                  href="https://twitter.com/healthierU_ae?s=08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                  id="foot-icon"
                >
                  <img src={twittericon} alt="" />
                </a>
                {/* <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="disable-footer-links"
                                    id="foot-icon"
                                >
                                    <img src={gplusicon} alt="" />
                                </a> */}
                <a
                  href="https://www.instagram.com/healthieru_ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                  id="foot-icon"
                >
                  <img src={instaicon} alt="" />
                </a>
                <a
                  href="https://www.linkedin.com/company/healthieruae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                  id="foot-icon"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCRAOeEpbC3sekMbOWgdTTPQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                  id="foot-icon"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
