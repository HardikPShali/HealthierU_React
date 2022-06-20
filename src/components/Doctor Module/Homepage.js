import React, { useState, useEffect } from "react";
// import Footer from './Footer'
import Availability from "./Availability";
import "./doctor.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Welcome from "./../CommonModule/Welcome";
import LocalStorageService from "./../../util/LocalStorageService";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Loader from "./../Loader/Loader";
import AppoitmentCountsSection from "./AppointmentCounts/AppointmentCounts";
// import UpcomingAppointment from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments'
import UpcomingAppointment from "./UpcomingAppointmentsSection/UpcomingAppointments";
import { getFirebaseToken, getPermissions, onMessageListener, removeMessageListener } from "../../util";
import { getFcmTokenApi } from "../../service/frontendapiservices";
import moment from 'moment'
import Cookies from "universal-cookie";
import CustomToastMessage from "../CommonModule/CustomToastMessage/CustomToastMessage";


const Homepage = ({ currentuserInfo }) => {
  currentuserInfo = LocalStorageService.getCurrentUser();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    // triggerFcmTokenHandler();
    fcmTokenGenerationHandler()
  }, []);

  // const handleClickOpen = () => {
  //     setOpen(true);
  // };

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


  // const triggerFcmTokenHandler = async () => {
  //   const currentPatient = cookie.get('currentUser');
  //   const userId = currentPatient.id;
  //   const response = await getFcmTokenApi(userId).catch(err => console.log({ err }))
  //   console.log({ response })

  //   if (response.data.data === null) {

  //     fcmTokenGenerationHandler();

  //   }
  //   else {

  //     const dateAfter30Days = new Date().setDate(new Date().getDate() + 31);
  //     const dayAfter30daysConverted = moment(dateAfter30Days).format('YYYY-MM-DD');

  //     let fcmTokenCreationDate = ''
  //     let fcmTokenCreationDateConverted = ''


  //     if (response.status === 200) {
  //       fcmTokenCreationDate = response.data.data.createdAt;
  //       fcmTokenCreationDateConverted = moment(fcmTokenCreationDate).format('YYYY-MM-DD');

  //     }

  //     // if (fcmTokenCreationDateConverted > dayAfter30daysConverted) {
  //     //   console.log("Token expired");
  //     fcmTokenGenerationHandler();
  //     // }
  //     // else {
  //     //   console.log("Token not expired");
  //     //   const tokenGenerated = response.data.data.token;

  //     //   localStorage.setItem('fcmToken', tokenGenerated);
  //     //   console.log({ 'fcmToken': tokenGenerated });
  //     // }
  //   }

  // }


  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {/* <Availability /> */}

      {loading && <Loader />}
      {currentuserInfo && !currentuserInfo.profileCompleted ? (
        <Welcome currentuserInfo={currentuserInfo} />
      ) : currentuserInfo && !currentuserInfo.approved ? (
        <Dialog aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title">
            Message from Administrator
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Your profile is still under review by our Admins, they will be in
              touch with you soon.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Link to="/doctor/logout">
              <button
                autoFocus
                onClick={handleClose}
                className="btn btn-primary sign-btn"
                id="close-btn"
              >
                Ok
              </button>
            </Link>
          </DialogActions>
        </Dialog>
      ) : (
        doctorHomePage()
      )}
    </>
  );
};

export default Homepage;
function doctorHomePage() {
  return (
    <div>
      <br />
      <br />
      <Container>
        <Row>
          <Col md={12}>
            <AppoitmentCountsSection />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col md={12}>
            <UpcomingAppointment />
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
      <CustomToastMessage />
    </div>
  );
}
