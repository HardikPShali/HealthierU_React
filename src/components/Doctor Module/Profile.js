import React, { useEffect, useState } from 'react';
// import Footer from './Footer';
import './doctor.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
// import Cookies from 'universal-cookie';
import Avatar from 'react-avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// import CreateIcon from '@material-ui/icons/Create';
// import IconButton from '@material-ui/core/IconButton';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import DeleteIcon from '@material-ui/icons/Delete';
import DialogContent from '@material-ui/core/DialogContent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { uploadDoctorDocument, getDoctorDocument } from "../../service/frontendapiservices";
import TransparentLoader from "../Loader/transparentloader";
import DoctorDocumentUpload from "../CommonModule/doctordocumentupload"

const Profile = ({ currentDoctor }) => {
    //const cookies = new Cookies();
    //const currentLoggedInUser = cookies.get("currentUser");
    //console.log("currentUser", currentDoctor);
    const [open, setOpen] = useState(false);
    const [documentData, setDocumentData] = useState([])
    const [documentName, setDocumentName] = useState("");
    const [documentFile, setDocumentFile] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctorDocument();
    }, [currentDoctor]);

    const loadDoctorDocument = async () => {
        const doctorId = currentDoctor.id;
        const res = await getDoctorDocument(doctorId);
        if (res && res.status === 200) {
            setDocumentData(res.data.documentsDocumentsList);
            setLoading(false);
        }
        else if (res && res.status === 204) {
            setDocumentData([]);
            setLoading(false);
        }
    }

    const handleDocnameChange = (e) => {
        setDocumentName(e.target.value);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const [uploadOpen, setUploadOpen] = useState(false);

    const handleUploadClose = () => {
        setUploadOpen(false);
    }

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files);
    }

    const handleUpload = async (e) => {
        const info = {
            doctorId: currentDoctor.id,
            doctor_email: currentDoctor.email,
            documentName: documentName
        }
        const files = documentFile;
        const res = await uploadDoctorDocument(files, info);
        if (res && res.status === 201) {
            const existingDoc = documentData;
            existingDoc.push(res.data);
            setDocumentData(existingDoc);
            setUploadOpen(false);
        }
    }

    return (
        <div>
            {loading && (
                <TransparentLoader />
            )}
            <Container>
                <Row>
                    <Col md={4}>
                        <div id="profile-col-1">
                            {currentDoctor && currentDoctor.picture ? (<img src={currentDoctor.picture} id="profile-pic" alt="" />)
                                : (<Avatar className='avatar-profile' name={currentDoctor.firstName + " " + currentDoctor.lastName} size="150" />)}

                            <div id="name"><br />{currentDoctor.firstName + " " + currentDoctor.lastName}<br />
                                <ul style={{ margin: '0px', fontSize: '12px', color: '#000' }} className="list--tags">
                                    {currentDoctor && currentDoctor.specialities && currentDoctor.specialities.map((speciality, index) => (
                                        <li key={index}>{speciality.name}</li>
                                    )
                                    )}
                                </ul>
                            </div>
                            <br />
                            <p id="description">
                                {currentDoctor.bio}
                            </p>
                            <br />
                            <div>
                                <button className="btn btn-primary request-edit" onClick={handleOpen}>Request Edit</button>
                            </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div id="profile-col-2">
                            {/* <table id="user-info">
                                <tbody>
                                    <tr>
                                        <th>Mobile Number</th>
                                        <td>{currentDoctor.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{currentDoctor.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Education</th>
                                        <td>{currentDoctor.education}</td>
                                    </tr>
                                    <tr>
                                        <th>Years of experience</th>
                                        <td>{currentDoctor.experience}</td>
                                    </tr>
                                    <tr>
                                        <th>Country Of Residence</th>
                                        <td>{currentDoctor.countryName}</td>
                                    </tr>
                                    <tr>
                                        <th>Languages</th>
                                        <td>
                                            <ul style={{ margin: '0px' }} className="list--tags">
                                                {currentDoctor && currentDoctor.languages && currentDoctor.languages.map((language, index) => (
                                                    <li key={index}>{language.name}</li>
                                                )
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Other Certifications</th>
                                        <td>{currentDoctor.certificates}</td>
                                    </tr>
                                    <tr>
                                        <th>Awards</th>
                                        <td>{currentDoctor.awards}</td>
                                    </tr>
                                </tbody>
                            </table> */}
                            <Tabs defaultActiveKey='general' id='uncontrolled-tab-example' className='record-tabs mb-3'>
                                <Tab eventKey='general' title='General'>
                                    <div className='general-tab'>
                                        <table id="user-info">
                                            <tbody>
                                                <tr>
                                                    <th>Phone Number</th>
                                                    <td>{currentDoctor.phone}</td>
                                                </tr>
                                                <tr>
                                                    <th>Gender</th>
                                                    <td>{currentDoctor.gender}</td>
                                                </tr>
                                                <tr>
                                                    <th>Date of Birth</th>
                                                    <td>{currentDoctor.dateOfBirth}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th>Marital Status</th>
                                                    <td>{currentDoctor.experience}</td>
                                                </tr> */}
                                                <tr>
                                                    <th>Nationality</th>
                                                    <td>{currentDoctor.countryName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Specialities</th>
                                                    <td>
                                                        <ul style={{ margin: '0px' }} className="list--tags">
                                                            {currentDoctor && currentDoctor.languages && currentDoctor.languages.map((language, index) => (
                                                                <li key={index}>{language.name}</li>
                                                            )
                                                            )}
                                                        </ul>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>About</th>
                                                    <td>{currentDoctor.bio}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab>

                                <Tab eventKey='education' title='Education'>
                                    <div className='general-tab'>
                                        <table id="user-info">
                                            <tbody>
                                                <tr>
                                                    <th>Education</th>
                                                    <td>{currentDoctor.education}</td>
                                                </tr>

                                                <tr>
                                                    <th>Experience</th>
                                                    <td>{currentDoctor.experience}</td>
                                                </tr>

                                                <tr>
                                                    <th>Languages</th>
                                                    <td>

                                                        <ul style={{ margin: '0px' }} className="list--tags">
                                                            {currentDoctor && currentDoctor.specialities && currentDoctor.specialities.map((specialities, index) => (
                                                                <li key={index}>{specialities.name}</li>
                                                            )
                                                            )}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab>
                            </Tabs>
                            <br />
                            <DoctorDocumentUpload currentDoctor={currentDoctor} isDoctor={true} />
                            {/* <button
                                className="btn btn-primary float-right"
                                onClick={() => setUploadOpen(true)}
                            >
                                Upload Documents
                            </button>
                            <br />
                            <br />
                            <div className="doc-table-scroll">
                                <table className="table table-bordered table-striped table-hover doc-table">
                                    <thead>
                                        <tr>
                                            <th>Document Name</th>
                                            <th>Document Type</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentData && documentData.length > 0 ? documentData.map((doc, index) => (
                                            <tr key={index}>
                                                {console.log("doc", doc)}
                                                <td>{doc.documentName}</td>
                                                <td>{doc.documentType}</td>
                                                <td>{doc.documentStatus}</td>
                                                <td>
                                                    <IconButton color="primary" className="mr-2 p-0"><CreateIcon /></IconButton>
                                                    <IconButton color="secondary" className="mr-2 p-0"><DeleteIcon /></IconButton>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center" }}>No document found...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>*/}
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    Please contact healthyu48@gmail.com
                </DialogTitle>
                <DialogActions>
                    <button onClick={handleClose} className="btn btn-primary sign-btn w-50" id="close-btn">
                        Ok
                    </button>
                </DialogActions>
            </Dialog>

            <Dialog aria-labelledby="customized-dialog-title" open={uploadOpen}>
                <DialogTitle id="customized-dialog-title">
                    Upload Document
                </DialogTitle>
                <ValidatorForm onSubmit={(e) => handleUpload(e)}>
                    <DialogContent dividers>
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Choose Document:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="standard-basic"
                                    variant="filled"
                                    name="doctorDocumentFile"
                                    type="file"
                                    inputProps={{
                                        required: true,
                                        multiple: true
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                />
                            </Col>
                        </Row>
                        <br />
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Document Name:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="standard-basic"
                                    variant="filled"
                                    name="documentName"
                                    inputProps={{
                                        required: true
                                    }}
                                    onChange={(e) => handleDocnameChange(e)}
                                />
                            </Col>
                        </Row>
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={handleUploadClose}
                            className="btn btn-danger text-light"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary text-light"
                            type="submit"
                        >
                            Upload
                        </button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </div>
    )
}

export default Profile
