import React, { useState, useEffect } from 'react';
// import Footer from './Footer'
import './doctor.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Welcome from './../CommonModule/Welcome';
import LocalStorageService from './../../util/LocalStorageService';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Loader from './../Loader/Loader';
import AppoitmentCountsSection from './AppointmentCounts/AppointmentCounts'
// const docprofile = './src/images/doctor/'
// import UpcomingAppointments from './UpcomingAppointmentSection/UpcomingAppointments'
import UpcomingAppointment from '../CommonModule/UpcomingAppointmentsSection/UpcomingAppointments'
const Homepage = ({ currentuserInfo }) => {
    currentuserInfo = LocalStorageService.getCurrentUser();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
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
                    <Col md={6}>
                        <UpcomingAppointment />
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}
        </div >
    );
}
