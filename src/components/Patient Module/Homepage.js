import React, { useState, useEffect } from 'react';
import './patient.css';
import Cookies from 'universal-cookie'
import { Container, Row, Col } from 'react-bootstrap';
import Welcome from './../CommonModule/Welcome';
import Loader from './../Loader/Loader';
import SpecialitiesSection from './SpecialitiesSection/SpecialitiesSection';
import UpcomingAppointments from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments';
import OurDoctors from './OurDoctorsSections/OurDoctors';
import TakeAssessmentCard from './TakeAssessmentCard/TakeAssessmentCard';
// import { getFirebaseToken, getPermissions, onMessageListener } from '../../util';
// import { getFcmTokenApi } from '../../service/frontendapiservices';
// import Cookies from 'universal-cookie';
// import moment from 'moment';
// import home2 from '../../images/home-2.png';

// import { getCurrentUserInfo } from "../../service/AccountService";
// import LocalStorageService from './../../util/LocalStorageService';
// import Footer from './Footer'
// import QuestionnaireView from './questionnaire/QuestionnaireView'
// import CircularProgress from '@material-ui/core/CircularProgress';

// const docprofile = './src/images/doctor/'

const Homepage = ({ currentuserInfo }) => {
    const [loading, setLoading] = useState(true);
    //const [currentUser, setCurrentUser] = useState(currentuserInfo)
    useEffect(() => {
        if (currentuserInfo) {
            setTimeout(() => setLoading(false), 200);
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


const patientHomePage = () => {
    const cookies = new Cookies()
    return (
        <div>
            <br />
            <br />
            <Container>
                <Row>
                    <Col md={6}>
                        <TakeAssessmentCard />
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

