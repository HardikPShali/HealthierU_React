import React, { useState, useEffect } from 'react';
import './patient.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import home2 from '../../images/home-2.png';
import { Link } from 'react-router-dom';
import Welcome from './../CommonModule/Welcome';
import Loader from './../Loader/Loader';
import SpecialitiesSection from './SpecialitiesSection';
import UpcomingAppointments from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments';
import OurDoctors from './OurDoctorsSections/OurDoctors';
// import { getCurrentUserInfo } from "../../service/AccountService";
// import LocalStorageService from './../../util/LocalStorageService';
// import Footer from './Footer'
// import QuestionnaireView from './questionnaire/QuestionnaireView'
// import CircularProgress from '@material-ui/core/CircularProgress';

// const docprofile = './src/images/doctor/'

const Homepage = ({ currentuserInfo }) => {
    const [loading, setLoading] = useState(true);
    //const [currentUser, setCurrentUser] = useState(currentuserInfo)
    ////console.log("currentuserInfo :::: ", currentuserInfo)

    useEffect(() => {
        if (currentuserInfo) {
            setTimeout(() => setLoading(false), 1000);
        }
    }, [currentuserInfo]);

    // const getCurrentuser = async () => {
    //     const currentUser = await getCurrentUserInfo();
    //     setLoading(false);
    //     setCurrentUser(currentUser)
    // }

    return (<>
        {loading && (
            <Loader />
        )}
        {/* {currentuserInfo && (
            setTimeout(() => setLoading(false), 1000)
        )} */}
        {currentuserInfo && !currentuserInfo.profileCompleted ?
            <Welcome currentuserInfo={currentuserInfo} /> : patientHomePage()
        }
    </>)


}


function patientHomePage() {

    return (
        <div>
            <br />
            <br />
            <Container className="p-0 our-spl-wrapper">
                <Row>
                    <Col md={6}>
                        <div id="patient-card">
                            <div className="patient-card_text">
                                <div>
                                    <h2>How healthy are you?</h2>
                                    <Link to="/patient/questionnaire/existing">
                                        <button variant="primary" className="btn btn-primary assessment-btn">
                                            Take my assessment
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </Col>
                    <Col md={6}>
                        <SpecialitiesSection />
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container>
                <Row>
                    <Col md={12}>
                        <UpcomingAppointments />
                    </Col>


                </Row>
                <br />
                <Row>
                    <Col md={12}>
                        <OurDoctors />
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            {/* <Footer /> */}
        </div>
    )
}
export default Homepage;

