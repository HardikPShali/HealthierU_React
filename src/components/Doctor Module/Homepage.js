import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import './doctor.css'
import { Container, Row, Col, Card } from 'react-bootstrap'
// import home2 from '../../images/home-2.png'
import home3 from '../../images/home-3.png'
import { Link } from 'react-router-dom'
import Welcome from './../CommonModule/Welcome';
import LocalStorageService from './../../util/LocalStorageService';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Loader from './../Loader/Loader';

// const docprofile = './src/images/doctor/'

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
    return (<>
        {loading && (
            <Loader />
        )}
        {currentuserInfo && !currentuserInfo.profileCompleted ?
            <Welcome currentuserInfo={currentuserInfo} /> :

            currentuserInfo && !currentuserInfo.approved ? <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    Message from Administrator
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                    Your profile is still under review by our Admins, they will be in touch with you soon.
                </Typography>
                </DialogContent>
                <DialogActions>
                    <Link to="/doctor/logout"><button autoFocus onClick={handleClose} className="btn btn-primary sign-btn" id="close-btn">
                        Ok
                    </button></Link>
                </DialogActions>
            </Dialog> : doctorHomePage()

        }
    </>)
}


export default Homepage
function doctorHomePage() {
    return (
        <div>
            <br />
            <br />
            <Container>
                <Row>
                    <Col md={6} style={{ height: "60vh" }}>
                        <Card id="patient-card">
                            <Card.Img variant="top" src={home3} />
                            <Card.Body>
                                <Card.Title>Take a look at your patients</Card.Title>
                                <Card.Text>
                                    Access your patient's information and medical records.
                                    </Card.Text>
                                <Link to="/doctor/mypatient"><button variant="primary" className="btn btn-outline-light assessment-btn">My Patients</button></Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Row>
                            {/*<Col md={6}>
                                <div id="Box3" className="card-box">Lifestyle</div>
                            </Col>*/}
                            <Col md={12}>
                                <Link to="/doctor/shop"><div id="Box4" className="card-box">Shop</div></Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                            <Link to="/doctor/article"><div id="Box5" className="card-box">Articles</div></Link>
                            </Col>
                            {/*<Col md={6}>
                                <div id="Box6" className="card-box">Education</div>
                            </Col>*/}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            {/* <Footer /> */}
        </div >
    )
}
