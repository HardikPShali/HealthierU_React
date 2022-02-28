import './doctor-document.css';
import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination'
import editIcon from '../../../images/Icons/edit icon_40 pxl.svg';
import { formatDate } from "../../questionnaire/QuestionnaireService";
import { getCurrentUserInfo, getCurrentDoctorInfo } from "../../../service/AccountService";
import {
    validateEmail,
    deleteDocument,
    // getDoctorDetail,
    getDocument,
    getDocuments,
    getPatientDetail,
    postDocument,
    postLabDocument,
    getDoctorDocuments,
    getDefaultPrescription,
    getDocumentById
} from "../../../service/DocumentService";
import VisibilityIcon from '@material-ui/icons/Visibility';
import TransparentLoader from '../../Loader/transparentloader';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from "@material-ui/core";
// import Footer from '../Footer';
// import documentViewImage from '../../../images/icons used/document icon@2x.png';

const DoctorDocument = (props) => {


    useEffect(() => {
        loadDocuments();
    }, []);
    const [loading, setLoading] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [documentId, setDocumentId] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);
    const [showDelete, setDeleteShow] = useState(false);
    const [showLabResultUpload, setShowLabResultUpload] = useState(false);
    const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
    const [prescriptionDocumentUrl, setPrescriptionDocumentUrl] = useState("");
    const [labDocumentUrl, setLabDocumentUrl] = useState("");
    const [setDefaultPrescriptionDocumentUrl] = useState("");
    const [presecriptionDocument, setPresecriptionDocument] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        documentsList: [],
    });

    const [labDocument, setLabDocument] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        documentsList: [],
    });

    const [labResult, setLabResult] = useState({
        name: "",
        duration: null,
        labName: "",
        decription: "",
        labResultDocument: null
    });
    const [prescriptionResult, setPrescriptionResult] = useState({
        name: "",
        duration: null,
        decription: "",
        prescriptionDocument: null,
    });

    const [errorMsg, setErrorMsg] = useState("");

    const handleUploadLabResultShow = () => {
        setShowLabResultUpload(true);
        setLabResult(null);
        setPatient(null);
    }
    const handleDeleteShow = () => setDeleteShow(true);
    const handleDeleteClose = () => setDeleteShow(false);

    const handleUploadLabResultClosed = () => {
        setShowLabResultUpload(false);
        setErrorMsg("");
    }
    const handleUploadPrescriptionClosed = () => {
        setShowPrescriptionUpload(false);
        setErrorMsg("");
    }

    const handleLabResultChange = e => {
        if (e.target.type === "file") {
            const fileSize = e.target.files[0].size;
            console.log("fileSize ::", fileSize)
            const maxSize = 1000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg("")
                setLabResult({ ...labResult, labResultDocument: e.target.value });
            }
            else {
                document.getElementById("labResultDocument").value = "";
                setErrorMsg("Please upload PDF file with size less than 1mb.")
            }
        }
        else {
            setLabResult({ ...labResult, [e.target.name]: e.target.value });
        }
    };

    const handlePrescriptionChange = e => {
        if (e.target.type === "file") {
            const fileSize = e.target.files[0].size;
            console.log("fileSize ::", fileSize)
            const maxSize = 1000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg("")
                setPrescriptionResult({ ...prescriptionResult, prescriptionDocument: e.target.value });
            }
            else {
                document.getElementById("prescriptionDocument").value = "";
                setErrorMsg("Please upload PDF file with size less than 1mb.")
            }
        }
        else {
            setPrescriptionResult({ ...prescriptionResult, [e.target.name]: e.target.value });
        }
    };

    // const handleDoctorTag = async (e) => {
    //     //console.log(e.target.value)
    //     if (validateEmail(e.target.value)) {
    //         setDoctor(null);
    //         const data = await getDoctorDetail(e.target.value);
    //         setDoctor(data);
    //     }
    // };

    const handlePatientTag = async (e) => {

        //console.log(e.target.value)
        if (validateEmail(e.target.value)) {
            setPatient(null)
            const data = await getPatientDetail(e.target.value);
            setPatient(data);
        }
    };


    const loadDocuments = async () => {
        setLoading(true)
        // GET request using fetch with async/await
        const currentUser = await getCurrentUserInfo();

        const doctor = await getCurrentDoctorInfo(currentUser.id, currentUser.login);
        setDoctor(doctor)

        const presecriptionDocument = await getDoctorDocuments("Prescription", 0, doctor.id);
        //if(presecriptionDocument) {
        setPresecriptionDocument(presecriptionDocument);
        setLoading(false)
        //}

    }

    const handleLabResultSubmission = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg("");
        const data = new FormData(event.target);
        //console.log(data);
        const response = await postLabDocument(data).catch(err => {
            if (err.response.status === 400) {
                setLoading(false);
                setErrorMsg("Please upload the document in PDF format.");
            }
        });
        if (response) {
            setLoading(false);
            setShowLabResultUpload(false);
            setErrorMsg("");
        }
        const labDocument = await getDoctorDocuments("Lab", 0, doctor.id);
        setLabDocument(labDocument)
    }

    const handlePrescriptionSubmission = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg("");
        const data = new FormData(event.target);
        //console.log(data);
        const response = await postDocument(data).catch(err => {
            if (err.response.status === 400) {
                setLoading(false);
                setErrorMsg("Please upload the document in PDF format.");
            }
        });
        if (response) {
            setLoading(false);
            setShowPrescriptionUpload(false);
            setErrorMsg("");
        }
        const prescriptionDocument = await getDoctorDocuments("Prescription", 0, doctor.id);
        setPresecriptionDocument(prescriptionDocument);
    }


    const showDocument = async (val) => {
        const res = await getDocument(val);
        setPrescriptionDocumentUrl(res);
    }

    const showLabDocument = async (val) => {
        const res = await getDocument(val);
        setLabDocumentUrl(res);
    }

    const showDefaultPrescriptionDocument = async () => {
        const res = await getDefaultPrescription();
        setDefaultPrescriptionDocumentUrl(res);
        const link = document.createElement('a');
        link.href = res.data;
        link.setAttribute(
            'download',
            `prescription.pdf`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
    }

    const handlePrescriptionUploadShow = () => {
        setPrescriptionResult(null);
        setShowPrescriptionUpload(true);
        setPrescriptionResult(null);
        setPatient(null);
    }

    const clickTabEvent = async (event) => {
        setLoading(true);
        let documents;
        if (event === 'labResult') {
            documents = await getDoctorDocuments("Lab", 0, doctor.id)
            //if(documents) {
            setLabDocument(documents)
            setLoading(false);
            //}
        }

        if (event === 'prescription') {
            documents = await getDoctorDocuments("Prescription", 0, doctor.id)
            //if(documents) {
            setPresecriptionDocument(documents);
            setLoading(false);
            //}
        }
        setPrescriptionDocumentUrl("");
        setLabDocumentUrl("");
        setCurrentPageNumber(1)
    }


    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);
        const prescriptionDocument = await getDoctorDocuments("Prescription", pageNumber - 1, doctor.id);
        setPresecriptionDocument(prescriptionDocument);
        //console.log(currentPageNumber)
    }

    const clickPaginationForLab = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);

        const documents = await getDoctorDocuments("Lab", pageNumber - 1, doctor.id);
        setLabDocument(documents);
        //console.log(currentPageNumber)

    }


    const handleDeleteModal = (id) => {
        setDocumentId(id)
        setDeleteShow(true);
    }


    const handleEditModal = async item => {
        const payload = {
            id: item.id,
            patientId: null,
        };
        const res = await getDocumentById(payload);
        if (res && res.data) {
            if (res.data?.documentUrl !== "") {
                setEditDocument(true)
            }
            else {
                setEditDocument(false)
            }
            setPrescriptionResult(res.data);
            setDoctor(item.doctor);
            setPatient(item.patient);
            setShowPrescriptionUpload(true);
        }
    };

    const handleEditLabModal = async item => {
        const payload = {
            id: item.id,
            patientId: null,
        };
        const res = await getDocumentById(payload);
        if (res && res.data) {
            if (res.data?.documentUrl !== "") {
                setEditDocument(true)
            }
            else {
                setEditDocument(false)
            }
            setLabResult(res.data);
            setDoctor(item.doctor);
            setPatient(item.patient);
            setShowLabResultUpload(true);
        }
    };

    const [editDocument, setEditDocument] = useState(false);


    const handleDeleteDocumentSubmission = async () => {
        setPrescriptionDocumentUrl("");
        setLabDocumentUrl("");
        const resp = await deleteDocument(documentId);
        if (resp) {
            setDeleteShow(false);
        }
        const prescriptionDocument = await getDocuments("Prescription", 0);
        setPresecriptionDocument(prescriptionDocument);


        const labDocument = await getDocuments("Lab", 0);
        setLabDocument(labDocument);
    }


    return (
        <div>
            {loading && (
                <TransparentLoader />
            )}
            <div className="container">

                <br />
                <br />


                <Tabs className="justify-content-center record-tabs" defaultActiveKey="prescription" id="uncontrolled-tab-example"
                    onSelect={clickTabEvent}>
                    <Tab eventKey="prescription" title="Prescription">
                        <br />
                        <div className="row">
                            <div className="col-md-10"></div>
                            <div className="col-md-2 text-right">
                                <button type="button" className="btn btn-primary"
                                    onClick={e => handlePrescriptionUploadShow()}>Add Prescription
                                </button>
                            </div>
                            <div className="col-md-3 text-left">
                                <button className="btn btn-primary btn-red btn-download-prescription" onClick={() => showDefaultPrescriptionDocument()}>
                                    <GetAppIcon /> Sample Prescription
                                </button>
                            </div>
                        </div>
                        <br />
                        <div id="prescription-list">
                            <table >
                                <thead>
                                    <tr>
                                        <th width="120">Action</th>
                                        <th width="200">Name</th>
                                        <th width="200">Date</th>
                                        <th width="250">Description</th>
                                        <th width="80">Duration</th>
                                        <th width="150">Patient</th>
                                        <th width="200">Doctor</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {presecriptionDocument?.documentsList ? presecriptionDocument?.documentsList.map((dataItem, subIndex) => {
                                        return <tr key={dataItem.id}>
                                            <td width="120" key="Sr." style={{ cursor: "pointer" }}>


                                                {/* <img width="20" height="20" onClick={e => showDocument(dataItem)} alt="" 
                                                    src={documentViewImage} />*/}
                                                <VisibilityIcon style={{ color: "#00D0CC" }} title="View" width="20" height="20" onClick={e => showDocument(dataItem)} />
                                                <img width="15" height="15" onClick={() => handleEditModal(dataItem)} src={editIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} />
                                                <DeleteIcon style={{ color: "#00D0CC" }} title="View" width="20" height="20" onClick={e => handleDeleteModal(dataItem.id)} />


                                            </td>
                                            <td width="200">{dataItem.name}</td>
                                            <td width="200">{formatDate(dataItem.docUploadTime)}</td>
                                            <td width="250">{dataItem.decription}</td>
                                            <td width="80">{dataItem.duration}</td>
                                            <td width="150">{dataItem?.patient ? dataItem?.patient?.firstName + ' ' + dataItem?.patient?.lastName : ''}</td>
                                            <td width="200">{dataItem?.doctor ? dataItem?.doctor?.firstName + ' ' + dataItem?.doctor?.lastName : ''}</td>
                                        </tr>

                                    }) : <tr></tr>}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div><Pagination size="sm" style={{ float: 'right' }}>
                            {
                                presecriptionDocument?.totalPages ?
                                    Array.from(Array(presecriptionDocument.totalPages), (e, i) => {
                                        return <Pagination.Item key={i + 1}
                                            active={i + 1 === currentPageNumber ? true : false}
                                            onClick={e => clickPagination(i + 1)}>
                                            {i + 1}
                                        </Pagination.Item>
                                    })
                                    : <span></span>

                            }
                        </Pagination>
                        </div>
                        <br />
                        <br />
                        <div className="row">
                            <embed src={prescriptionDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                width="100%" />
                        </div>
                    </Tab>
                    <Tab eventKey="labResult" title="Lab Result" onSelect={clickTabEvent}>
                        <br />

                        <div className="row">
                            <div className="col-md-10"></div>
                            <div className="col-md-2 text-right">
                                <button type="button" className="btn btn-primary"
                                    onClick={handleUploadLabResultShow}>Add
                                    Lab Result
                                </button>
                            </div>
                        </div>
                        <br />
                        <div id="prescription-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th width="130"><b>Action</b></th>
                                        <th width="200"><b>Name</b></th>
                                        <th width="200"><b>Lab Name</b></th>
                                        <th width="150"><b>Date</b></th>
                                        <th width="250"><b>Description</b></th>
                                        <th width="150"><b>Patient</b></th>
                                        <th width="200"><b>Doctor</b></th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {labDocument?.documentsList ? labDocument.documentsList.map((dataItem, subIndex) => {
                                        return <tr key={dataItem.id}>
                                            <td width="130" key="Sr.">
                                                {/*<img width="20" height="20" onClick={e => showLabDocument(dataItem)} alt=""
                                                    src={documentViewImage} style={{ cursor: 'pointer' }} />*/}
                                                <VisibilityIcon style={{ color: "#00D0CC", cursor: "pointer" }} title="View" width="20" height="20" onClick={e => showLabDocument(dataItem)} />

                                                <img width="15" height="15" onClick={() => handleEditLabModal(dataItem)} src={editIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%', cursor: "pointer" }} />
                                                <DeleteIcon style={{ color: "#00D0CC", cursor: "pointer" }} title="View" width="20" height="20" onClick={e => handleDeleteModal(dataItem.id)} />

                                            </td>
                                            <td width="200">{dataItem.name}</td>
                                            <td width="200">{dataItem.labName}</td>
                                            <td width="150">{formatDate(dataItem.docUploadTime)}</td>
                                            <td width="250">{dataItem.decription}</td>
                                            <td width="150">{dataItem?.patient ? dataItem?.patient?.firstName + ' ' + dataItem?.patient?.lastName : ''}</td>
                                            <td width="200">{dataItem?.doctor ? dataItem?.doctor?.firstName + ' ' + dataItem?.doctor?.lastName : ''}</td>

                                        </tr>

                                    }) : <tr></tr>}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div>
                            <Pagination size="sm" style={{ float: 'right' }}>
                                {
                                    labDocument?.totalPages ?
                                        Array.from(Array(labDocument.totalPages), (e, i) => {
                                            return <Pagination.Item key={i + 1} active={i + 1 === currentPageNumber}
                                                onClick={e => clickPaginationForLab(i + 1)}>
                                                {i + 1}
                                            </Pagination.Item>
                                        }) : <span></span>

                                }
                            </Pagination>
                        </div>
                        <br />
                        <br />

                        <div className="row">

                            {labDocumentUrl !== null || labDocumentUrl !== "" ?
                                <embed src={labDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" />
                                : <span></span>
                            }
                        </div>
                    </Tab>
                </Tabs>

                <br />
                <br />


                <Modal show={showPrescriptionUpload} onHide={handleUploadPrescriptionClosed}>
                    <form onSubmit={e => handlePrescriptionSubmission(e)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Prescription</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden={true} id="id" name="id" value={prescriptionResult?.id}
                                onChange={e => handlePrescriptionChange(e)}
                            ></input>
                            <div className="form-group row">
                                <label htmlFor="topic" className="col-sm-3 col-form-label">Duration</label>
                                <div className="col-sm-9">
                                    <input type="text" id="duration" name="duration" className="form-control"
                                        onChange={e => handlePrescriptionChange(e)}
                                        value={prescriptionResult?.duration}
                                        placeholder="Duration" required></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="decription" className="col-sm-3 col-form-label">Description</label>
                                <div className="col-sm-9">
                                    <input type="text" id="decription" name="decription" className="form-control"
                                        onChange={e => handlePrescriptionChange(e)}
                                        value={prescriptionResult?.decription}
                                        placeholder="Description" required></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="prescriptionDocument"
                                    className="col-sm-3 col-form-label">Document</label>
                                <div className="col-sm-9">
                                    {errorMsg && (
                                        <label style={{ fontSize: 12, color: '#ff9393', margin: "5px 0" }} className="left">{errorMsg}</label>
                                    )}
                                    {!prescriptionResult?.id && (
                                        <input type="file" id="prescriptionDocument" name="prescriptionDocument"
                                            className="form-control"
                                            onChange={e => handlePrescriptionChange(e)}
                                            placeholder="Document" accept="application/pdf"
                                            required={prescriptionResult?.id ? false : true}></input>
                                    )}
                                    {prescriptionResult?.id && !editDocument && (<div style={{ display: "inline-flex", alignItems: "center" }}>
                                        <IconButton onClick={() => setEditDocument(true)}>
                                            <CancelIcon style={{ color: "red" }} />
                                        </IconButton>
                                        <input type="file" id="prescriptionDocument" name="prescriptionDocument"
                                            className="form-control"
                                            onChange={e => handlePrescriptionChange(e)}
                                            placeholder="Document" accept="application/pdf"
                                            required={prescriptionResult?.id ? false : true}></input></div>)}
                                    {prescriptionResult?.id && editDocument && (<>
                                        <button type="button" className="btn btn-primary mr-2" onClick={() => setEditDocument(false)}>Edit</button>
                                        <a href={prescriptionResult?.documentUrl} download className="btn btn-primary">Download</a>
                                    </>)}

                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="doctorEmail" className="col-sm-3 col-form-label">Doctor Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="doctorEmail" name="doctorEmail" className="form-control"
                                        value={doctor?.email}
                                        placeholder="Doctor Email" readOnly></input>
                                    {doctor?.id ? <span>Doctor Name:  <b>{doctor?.firstName + ' ' + doctor?.lastName}
                                        <input hidden={true} id="doctorId" name="doctorId"
                                            value={doctor?.id} /></b></span>
                                        : <span>No Doctor Found</span>}
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="patientEmail" className="col-sm-3 col-form-label">Patient Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="patientEmail" name="patientEmail" className="form-control"
                                        value={patient?.email}
                                        placeholder="Patient Email" onChange={e => handlePatientTag(e)}></input>
                                    {patient?.id ? <span>Patient Name: <b>{patient?.firstName + ' ' + patient?.lastName}
                                        <input hidden={true} id="patientId" name="patientId"
                                            value={patient?.id} /></b></span> : <span>No Patient found</span>}
                                </div>
                            </div>

                            <div className="container">
                                <div className="row">
                                </div>
                            </div>


                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleUploadPrescriptionClosed}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" disabled={!patient?.id || !prescriptionResult.prescriptionDocument}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>

                <Modal show={showLabResultUpload} onHide={handleUploadLabResultClosed}>
                    <form onSubmit={e => handleLabResultSubmission(e)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Lab Result</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input hidden={true} id="id" name="id" value={labResult?.id}
                                onChange={e => handleLabResultChange(e)}
                            ></input>
                            <div className="form-group row">
                                <label htmlFor="labName" className="col-sm-3 col-form-label">Lab Name</label>
                                <div className="col-sm-9">
                                    <input type="text" id="labName" name="labName" className="form-control"
                                        onChange={e => handleLabResultChange(e)}
                                        value={labResult?.labName}
                                        placeholder="Lab Name" required></input>
                                </div>
                            </div>


                            <div className="form-group row">
                                <label htmlFor="decription" className="col-sm-3 col-form-label">Description</label>
                                <div className="col-sm-9">
                                    <input type="text" id="decription" name="decription" className="form-control"
                                        onChange={e => handleLabResultChange(e)}
                                        value={labResult?.decription}
                                        placeholder="Description" required></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="document" className="col-sm-3 col-form-label">Document</label>
                                <div className="col-sm-9">
                                    {errorMsg && (
                                        <label style={{ fontSize: 12, color: '#ff9393', margin: "5px 0" }} className="left">{errorMsg}</label>
                                    )}
                                    {!labResult?.id && (
                                        <input type="file" id="labResultDocument" name="labResultDocument"
                                            className="form-control"
                                            onChange={e => handleLabResultChange(e)}
                                            placeholder="Document" accept="application/pdf"
                                            required={labResult?.id ? false : true}></input>
                                    )}
                                    {labResult?.id && !editDocument && (<div style={{ display: "inline-flex", alignItems: "center" }}>
                                        <IconButton onClick={() => setEditDocument(true)}>
                                            <CancelIcon style={{ color: "red" }} />
                                        </IconButton>
                                        <input type="file" id="labResultDocument" name="labResultDocument"
                                            className="form-control"
                                            onChange={e => handleLabResultChange(e)}
                                            placeholder="Document" accept="application/pdf"
                                            required={labResult?.id ? false : true}></input>
                                    </div>)}
                                    {labResult?.id && editDocument && (<>
                                        <button type="button" className="btn btn-primary mr-2" onClick={() => setEditDocument(false)}>Edit</button>
                                        <a href={labResult?.documentUrl} download className="btn btn-primary">Download</a>
                                    </>)}

                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="doctorEmail" className="col-sm-3 col-form-label">Doctor Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="doctorEmail" name="doctorEmail" className="form-control"
                                        value={doctor?.email}
                                        placeholder="Doctor Email" readOnly></input>
                                    {doctor?.id ? <span>Doctor Name:  <b>{doctor?.firstName + ' ' + doctor?.lastName}
                                        <input hidden={true} id="doctorId" name="doctorId"
                                            value={doctor?.id} /></b></span>
                                        : <span>No Doctor Found</span>}
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="patientEmail" className="col-sm-3 col-form-label">Patient Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="patientEmail" name="patientEmail" className="form-control"
                                        validate value={patient?.email} required={true}
                                        placeholder="Patient Email" onChange={e => handlePatientTag(e)}></input>
                                    {patient?.id ? <span>Patient Name: <b>{patient?.firstName + ' ' + patient?.lastName}
                                        <input hidden={true} id="patientId" name="patientId"
                                            value={patient?.id} /></b></span> : <span>No Patient found</span>}
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleUploadLabResultClosed}>
                                Close
                            </Button>
                            {console.log("Patient ::: ", patient)}
                            <Button variant="primary" type="submit" disabled={!patient?.id || !labResult.labResultDocument}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>

                <Modal show={showDelete} onHide={handleDeleteClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Document</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><p>Are you sure to Delete the Document ?</p></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteDocumentSubmission()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/* <Footer /> */}
        </div>
    );
}
export default DoctorDocument;