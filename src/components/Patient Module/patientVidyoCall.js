import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Link } from 'react-router-dom'
import './patient.css'
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import patientprofile from '../../images/patientprof.png';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ForumRoundedIcon from '@material-ui/icons/ForumRounded';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import Loader from '../Loader/Loader';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';


const PatientVidyoCall = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        const element = document.getElementById("chat-panel");
        element.scrollTop = element.scrollHeight;
    }, []);

    const updateScroll = () => {
        const element = document.getElementById("chat-panel");
        element.scrollTop = element.scrollHeight;
    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
            <Header />
            <Container style={{ margin: '20px auto 50px' }}>
                <Link to="/patient/myappointment">
                    <IconButton style={{ background: '#4F80E2', color: '#fff' }} >
                        <ArrowBackIcon />
                    </IconButton>
                </Link>
                <br />
                <br />
                <Row>
                    <Col md={5} id="col">
                        <div id="videoChat-box">
                            <div id="call-box">
                                <div><span className="live-indicator">LIVE</span><span className="time-indicator">39:19</span></div>

                            </div>
                            <br />
                            <Row id="patient-row" style={{ padding: '0px' }}>
                                <Col xs={6} style={{ padding: '0px' }}>
                                    <div className="user-img">
                                        <img src={patientprofile} style={{ width: "60px", height: "60px" }} />
                                        <div className="ml-2">
                                            <b className="doc-name">Daniel Smith</b><br />
                                            <span style={{ fontSize: 12, display: "block" }}>Chronic Diabetes</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6} id="callBtn-group">
                                    <div className="call-btn">
                                        <button className="btn call-end"><CallEndIcon /></button>
                                        <button className="btn call"><VideoCallIcon /></button>
                                        <button className="btn call"><ForumRoundedIcon /></button>
                                        <button className="btn call"><MicOffRoundedIcon /></button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>


                    <Col md={3} id="col">
                        <div id="message-box">
                            <p>Message</p>
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                            <hr className="hr" />
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                            <hr className="hr" />
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                            <hr className="hr" />
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                            <hr className="hr" />
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                            <hr className="hr" />
                            <Row id="chat-heads">
                                <Col xs={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col xs={4}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                        <Col xs={8} style={{ padding: 0 }}><div id="chat-name"><b>Dora Herrera</b><br />A small river named Duden flows by their place and</div></Col>
                                    </Row>
                                </Col>
                                <Col xs={4} style={{ textAlign: "right" }}><span id="chat-time">10:00 PM</span></Col>
                            </Row>
                        </div>

                    </Col>


                    <Col md={4} id="col">
                        <div id="Chat-box">
                            <div className="chat-panel mb-4" id="chat-panel">
                                <Row className="sent">
                                    <Col md={10} className="messageBody"><p>Hello Sir, my wife is not well we want to meet you.</p><span className="messageTime">Just now</span></Col>
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                </Row>
                                <Row className="reply">
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                    <Col md={10} className="messageBody"><p>Hello, you can book appointment and you can choose time from working hours.</p><span className="messageTime">Just now</span></Col>
                                </Row>
                                <Row className="sent">
                                    <Col md={10} className="messageBody"><p>Hello Sir, my wife is not well we want to meet you.</p><span className="messageTime">Just now</span></Col>
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                </Row>
                                <Row className="reply">
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                    <Col md={10} className="messageBody"><p>Hello, you can book appointment and you can choose time from working hours.</p><span className="messageTime">Just now</span></Col>
                                </Row>
                                <Row className="sent">
                                    <Col md={10} className="messageBody"><p>Hello Sir, my wife is not well we want to meet you.</p><span className="messageTime">Just now</span></Col>
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                </Row>
                                <Row className="reply">
                                    <Col md={2}><img src={patientprofile} style={{ width: 40, height: 40, borderRadius: 10 }} /></Col>
                                    <Col md={10} className="messageBody"><p>Hello, you can book appointment and you can choose time from working hours.</p><span className="messageTime">Just now</span></Col>
                                </Row>
                            </div>
                            <div className="message-area">
                                <textarea type="text" className="input-text" />
                            </div>
                        </div>
                    </Col>

                </Row>
            </Container>
            <Footer />
        </div>
    )
}

export default PatientVidyoCall;
