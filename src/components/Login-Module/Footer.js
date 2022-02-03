import React from 'react' //{ Component }
import logo from '../../images/logo/logo_white.svg';
import './landing.css';
import { Container, Row, Col } from 'react-bootstrap';
import {
    Link,
    // Navlink 
} from 'react-router-dom';
import applestore from '../../images/icons used/appstore.png'
import googleplay from '../../images/icons used/googleplay.png'
import fbicon from '../../images/icons used/facebook.png'
import instaicon from '../../images/icons used/instagram.png'
import twittericon from '../../images/icons used/twitter.png'
import gplusicon from '../../images/icons used/googleplus.png'
import YouTubeIcon from '@material-ui/icons/YouTube';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { HashLink } from 'react-router-hash-link';


const Footer = () => {
    return (
        <footer>
            <div id="footer">
                <Container>
                    <Row>
                        <Col md={2}>
                            <img
                                src={logo}
                                id="icon"
                                alt="HealthierU Logo"
                                style={{ width: "70%", marginBottom: 10 }}
                            /><br />
                            <Link to="/about-us" id="footer-link">About us</Link>
                            <HashLink to="/about-us#how-it-work" id="footer-link">How it Works</HashLink>
                            <HashLink to="/about-us#our-services" id="footer-link">Our services</HashLink>
                            <Link to="" id="footer-link">Articles</Link>
                            <HashLink to="/about-us#contact-us" id="footer-link">Contact us</HashLink>
                        </Col>
                        <Col md={6} style={{ display: 'flex', height: 180, alignItems: 'center' }}>
                            {/* <div id="active-user">
                                <b id="right-border">
                                    <span>42,233</span> Active Users
                                    </b>
                                <b style={{ paddingLeft: 15 }}>
                                    <span>128</span> Expert Doctors
                                        </b>
                            </div><br /> */}
                            <div style={{ width: "100%" }}>
                                <p>Email Newsletters</p>
                                <p style={{ fontSize: 11 }}>Stay up-to-date with the latest content and offers from HealthierU</p>
                                <form>
                                    <input type="email" placeholder="Email Address" name="email" id="footer-input" />
                                    <input type="submit" value="Subscribe" className="btn submit-btn" />
                                </form>
                            </div>
                        </Col>
                        <Col md={4} id="last-col">
                            <h2>Wellness Optimized</h2>
                            <p id="download-statement">Unlock your health data and get instant insights<br />Download the HealthierU app today</p>
                            <div className="d-flex">

                                <img src={applestore} alt="" id="store-icon" />


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
                            <div className="d-flex">
                                <Link to="" className="disable-footer-links" id="copy-link">Privacy Policy</Link>
                                <Link to="" className="disable-footer-links" id="copy-link">Terms and Conditions</Link>
                                <Link to="" className="disable-footer-links" id="copy-link">Help</Link>
                                <Link to="" className="disable-footer-links" id="copy-link">HealthierU Licenses</Link>
                                <Link to="" className="disable-footer-links" id="copy-link">Partners</Link>
                            </div>
                            <p id="copyright-text">© 2021 <Link to="/">HealthierU</Link> - All Rights Reserved.</p>
                        </Col>
                        <Col id="last-col">
                            <p id="lang-select">Language <select>
                                <option>English</option>
                                <option>Arabic</option>
                                <option>English (UK)</option>
                            </select></p>
                            <div id="social-icon" className="d-flex">
                                <a href="https://www.facebook.com/HealthierU-109526728064645" target="_blank" rel="noopener noreferrer" className="" id="foot-icon"><img src={fbicon} alt="" /></a>
                                <a href="https://twitter.com/healthierU_ae?s=08" target="_blank" rel="noopener noreferrer" className="" id="foot-icon"><img src={twittericon} alt="" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="disable-footer-links" id="foot-icon"><img src={gplusicon} alt="" /></a>
                                <a href="https://www.instagram.com/healthieru_ae/" target="_blank" rel="noopener noreferrer" className="" id="foot-icon"><img src={instaicon} alt="" /></a>
                                <a href="https://www.linkedin.com/company/healthieruae/" target="_blank" rel="noopener noreferrer" className="" id="foot-icon"><LinkedInIcon /></a>
                                <a href="https://www.youtube.com/channel/UCRAOeEpbC3sekMbOWgdTTPQ" target="_blank" rel="noopener noreferrer" className="" id="foot-icon"><YouTubeIcon /></a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    )
};

export default Footer
