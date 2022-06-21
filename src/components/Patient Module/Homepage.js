import React, { useState, useEffect } from 'react';
import './patient.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import home2 from '../../images/home-2.png';
import healthAssessmentBg from '../../images/svg/health-assessment-bg.svg';
import { Link } from 'react-router-dom';
import Welcome from './../CommonModule/Welcome';
import Loader from './../Loader/Loader';
import SpecialitiesSection from './SpecialitiesSection';
import UpcomingAppointments from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments';
import OurDoctors from './OurDoctorsSections/OurDoctors';
import { getFirebaseToken, getPermissions, onMessageListener } from '../../util';
import { getFcmTokenApi } from '../../service/frontendapiservices';
import Cookies from 'universal-cookie';
import moment from 'moment';
import CustomToastMessage from '../CommonModule/CustomToastMessage/CustomToastMessage';

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
        triggerFcmTokenHandler();
    }, [currentuserInfo]);

    // FCM TOKEN VALIDATIONS AND CREATIONS
    const cookie = new Cookies();
    const [tokenFound, setTokenFound] = useState(false);

    const fcmTokenGenerationHandler = async () => {
        let tokenToBeGenerated;
        const tokenFunction = async () => {
            tokenToBeGenerated = await getFirebaseToken(setTokenFound);
            onMessageListener();

            if (tokenToBeGenerated) {
                console.log({ tokenToBeGenerated });
            }
            return tokenToBeGenerated;
        };

        const getPermission = async () => {
            const permission = await getPermissions();
            if (permission === 'granted') {
                tokenFunction();
            }
        };
        getPermission();
        // alert('token generated')
    }


    const triggerFcmTokenHandler = async () => {
        const currentPatient = cookie.get('currentUser');
        const userId = currentPatient.id;
        const response = await getFcmTokenApi(userId).catch(err => console.log({ err }))
        console.log({ response })

        if (response.data.data === null) {

            fcmTokenGenerationHandler();

        }
        else {

            const dateAfter30Days = new Date().setDate(new Date().getDate() + 31);
            const dayAfter30daysConverted = moment(dateAfter30Days).format('YYYY-MM-DD');

            let fcmTokenCreationDate = ''
            let fcmTokenCreationDateConverted = ''


            if (response.status === 200) {
                fcmTokenCreationDate = response.data.data.createdAt;
                fcmTokenCreationDateConverted = moment(fcmTokenCreationDate).format('YYYY-MM-DD');

            }

            // if (fcmTokenCreationDateConverted > dayAfter30daysConverted) {
            //     console.log("Token expired");
            fcmTokenGenerationHandler();
            // }
            // else {
            //     console.log("Token not expired");
            //     const tokenGenerated = response.data.data.token;

            //     localStorage.setItem('fcmToken', tokenGenerated);
            //     console.log({ 'fcmToken': tokenGenerated });
            // }
        }

    }


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

    return (
        <div>
            <br />
            <br />
            <Container>
                <Row>
                    <Col md={6}>
                        <div id="patient-card">
                            <div className="patient-card_text col-md-6">
                                <div className="patient-card_how-healthy-wrap">
                                    <h3 style={{ marginLeft: 15 }} className="mb-3">How healthy are you?</h3>
                                    <Link to="/patient/questionnaire/existing" style={{ marginRight: 20 }}>
                                        <button variant="primary" className="btn btn-primary assessment-btn">
                                            Take Assessment
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-md-6 text-center w-100'>
                                <div className='health-assess-bg__wrapper'>
                                    <img src={healthAssessmentBg} alt="home-2" className='health-assess-bg' />
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
            <CustomToastMessage />
        </div>
    )
}
export default Homepage;

