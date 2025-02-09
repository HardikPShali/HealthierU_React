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


const Homepage = ({ currentuserInfo }) => {
  currentuserInfo = LocalStorageService.getCurrentUser();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


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
        <Dialog aria-labelledby="customized-dialog-title" className="admin-review-dialog" open={open}>
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
                OK
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
    </div>
  );
}
