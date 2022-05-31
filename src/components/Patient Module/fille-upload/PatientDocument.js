import './patient-document.css';
import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import editIcon from '../../../images/Icons/edit icon_40 pxl.svg';
import Pagination from 'react-bootstrap/Pagination'
import { formatDate } from "../../questionnaire/QuestionnaireService";

import { Form } from 'react-bootstrap';
import { getCurrentPatientInfo, getCurrentUserInfo } from "../../../service/AccountService";
import {
    validateEmail,
    getDocument,
    postDocument,
    postLabDocument,
    getDoctorDetail,
    getPatientDocuments,
    getDocumentById,
    //getPatientDetail,
    //getDocuments,
} from "../../../service/DocumentService";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TransparentLoader from '../../Loader/transparentloader';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from "@material-ui/core";
import { getSearchData } from '../../../service/frontendapiservices';

// import documentViewImage from '../../../images/icons used/document icon@2x.png';
// import Footer from '../Footer';

const PatientDocument = (props) => {

    useEffect(() => {
        loadDocuments();
    }, []);

    const [loading, setLoading] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [doctor, setDoctor] = useState('');
    const [patient, setPatient] = useState(null);
    const [showLabResultUpload, setShowLabResultUpload] = useState(false);
    const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
    const [prescriptionDocumentUrl, setPrescriptionDocumentUrl] = useState("");
    const [labDocumentUrl, setLabDocumentUrl] = useState("");
    const [editDocument, setEditDocument] = useState(false);
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
        resultType: "",
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

    //const [documentId, setDocumentId] = useState(null);


    const handleUploadLabResultShow = () => {
        setShowLabResultUpload(true);
        setLabResult(null);
        setDoctor(null);
    }

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

    const handleDoctorTag = async (e) => {
        //console.log(e.target.value)
        if (validateEmail(e.target.value)) {
            setDoctor(null);
            const data = await getDoctorDetail(e.target.value);
            setDoctor(data);
        }

        // autocomplete suggestions
        // let matches = [];
        // if (e.target.value.length > 0) {
        //     matches = doctor.email.filter(doc => {
        //         const regexp = new RegExp(`${e.target.value}`, 'gi');
        //         return doc.email.match(regexp);
        //     })
        // }
        // console.log("Matches::", matches)
        // setSuggestion(matches);
    };





    const loadDocuments = async () => {
        // GET request using fetch with async/await
        setLoading(true)
        const currentUser = await getCurrentUserInfo();

        const patientInfo = await getCurrentPatientInfo(currentUser.data.userInfo.id, currentUser.data.userInfo.login);
        setPatient(patientInfo)

        const presecriptionDocument = await getPatientDocuments("Prescription", 0, patientInfo.data.id);
        console.log("patientInfo.id", patientInfo.id);
        setPresecriptionDocument(presecriptionDocument);
        setLoading(false)
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
            else if (err.response.status === 500) {
                setLoading(false);
                setErrorMsg("Please upload the document with size less than 1mb.");
            }
        });
        if (response) {
            setShowLabResultUpload(false);
            setLoading(false);
            setErrorMsg("");
        }

        const labDocument = await getPatientDocuments("Lab", 0, patient.id);
        setLabDocument(labDocument);
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
            else if (err.response.status === 500) {
                setLoading(false);
                setErrorMsg("Please upload the document with size less than 1mb.");
            }
        });
        if (response) {
            setShowPrescriptionUpload(false);
            setLoading(false);
            setErrorMsg("");
        }
        const presecriptionDocument = await getPatientDocuments("Prescription", 0, patient.id);
        setPresecriptionDocument(presecriptionDocument);
    }


    const showDocument = async (val) => {
        const res = await getDocument(val);
        setPrescriptionDocumentUrl(res);
    }

    const showLabDocument = async (val) => {
        const res = await getDocument(val);
        setLabDocumentUrl(res);
    }

    // const handlePrescriptionUploadShow = () => {
    //     setShowPrescriptionUpload(true);
    //     setPrescriptionResult(null);
    //     setDoctor(null);
    // }

    const clickTabEvent = async (event) => {
        //let documents;
        setLoading(true);
        if (event === 'labResult') {
            // const labDocuments = await getPatientDocuments("Lab", 0, patient && patient.id);
            // setLabDocument(labDocuments)
            setLoading(false);
        }

        if (event === 'prescription') {
            const presecriptionDocument = await getPatientDocuments("Prescription", 0, patient && patient.id);
            setPresecriptionDocument(presecriptionDocument);
            setLoading(false);
        }

        setCurrentPageNumber(1)
    }


    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);
        const prescriptionDocument = await getPatientDocuments("Prescription", pageNumber - 1, patient.id);
        setPresecriptionDocument(prescriptionDocument);
        //console.log(currentPageNumber)
    }

    const clickPaginationForLab = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);

        const documents = await getPatientDocuments("Lab", pageNumber - 1, patient.id);
        setLabDocument(documents);
        //console.log(currentPageNumber)
    }

    /* NOT REQUIRED AS A PATIENT SHOULD NOT BE ABLE TO EDIT ANY DOCUMENT SENT BY DOCTOR */

    // const handleEditModal = async item => {
    //     const payload = {
    //         id: item.id,
    //         patientId: item.patient.id,
    //     };
    //     const res = await getDocumentById(payload);
    //     if (res && res.data) {
    //         if (res.data?.documentUrl !== "") {
    //             setEditDocument(true)
    //         }
    //         else {
    //             setEditDocument(false)
    //         }
    //         setPrescriptionResult(res.data);
    //         setShowPrescriptionUpload(true);
    //         setDoctor(item.doctor);
    //     }
    // }

    const handleEditLabModal = async item => {
        const payload = {
            id: item.id,
            patientId: item.patient.id,
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
            setShowLabResultUpload(true);
            setDoctor(item.doctor)
        }
    }

    // FOR HEAL-52
    const [user, setUser] = useState([]);
    const [searchText, setSearchText] = useState("a");
    const [suggestion, setSuggestion] = useState([]);
    useEffect(() => {
        const loadUsers = async () => {
            if (searchText) {
                const res = await getSearchData(searchText, 0, 1000);
                if (res.status === 200 && res.data?.doctors.length > 0) {
                    // console.log('res', res);
                    // console.log('res.data.doctors', res.data.doctors);
                    setUser(res.data.doctors);
                }
            }
            else {
                setSearchText('');
                setSuggestion([]);
            }
        }
        loadUsers();
    }, []);

    const onChangeHandler = text => {
        let matches = [];
        console.log('onChangehandler')
        if (text.length > 0) {
            matches = user.filter(item => {
                const regex = new RegExp(`${text}`, 'gi');
                // console.log('text', text);
                return item.email.match(regex);
            });
        }
        // console.log('Matches', matches);
        // console.log('Suggestion', suggestion);
        setSuggestion(matches);
        setSearchText(text);
    }

    const onSuggestHandler = async (text) => {
        // setDoctor(null);
        const data = await getDoctorDetail(text);
        // console.log('Data', data);
        setDoctor(data);
        setSearchText(data.firstName);
        // console.log('Text', data.firstName);
        setSuggestion([]);
    }

    return (
        <>
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
                                {/* <button type="button" className="btn btn-primary"
                                    onClick={e => handlePrescriptionUploadShow()}>Add Prescription
                                </button> */}
                            </div>
                        </div>
                        <br />
                        <div id="prescription-list">
                            <table >
                                <thead>
                                    <tr>
                                        <th width="80">Action</th>
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
                                            <td width="80" key="Sr.">


                                                {/*<img width="20" height="20" onClick={e => showDocument(dataItem)} alt=""
                                                    src={documentViewImage} />*/}
                                                <VisibilityIcon style={{ color: "#00D0CC", cursor: "pointer", marginLeft: "5px" }} title="View" width="20" height="20" onClick={e => showDocument(dataItem)} />
                                                {/* <img width="15" height="15" onClick={() => handleEditModal(dataItem)} src={editIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} /> */}



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
                        <div> <Pagination size="sm" style={{ float: 'right' }}>
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
                        <div >
                            <embed src={prescriptionDocumentUrl} type="application/pdf" frameBorder="0" height="100px"
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
                        <div id="prescription-list" className="bg-white">
                            <table>
                                <thead>
                                    <tr>
                                        <th width="80"><b>Action</b></th>
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
                                            <td width="80" key="Sr." style={{ cursor: "pointer" }}>
                                                {/*<img width="20" height="20" onClick={e => showLabDocument(dataItem)} alt=""
                                                    src={documentViewImage} />*/}
                                                <VisibilityIcon style={{ color: "#00D0CC" }} title="View" width="20" height="20" onClick={e => showLabDocument(dataItem)} />

                                                <img width="15" height="15" onClick={() => handleEditLabModal(dataItem)} src={editIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} />

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
                        <div>
                            <br />
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

                        <div >

                            {labDocumentUrl !== null || labDocumentUrl !== "" ?
                                <embed src={labDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" />
                                : <span></span>
                            }

                        </div>
                    </Tab>
                </Tabs>


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
                                        validate="true" value={doctor?.email}
                                        placeholder="Doctor Email" onChange={e => handleDoctorTag(e.target.value)}></input>
                                    {doctor?.id ? <span>Doctor Name:  <b>{doctor?.firstName + ' ' + doctor?.lastName}
                                        <input hidden={true} id="doctorId" name="doctorId" value={doctor?.id} /></b></span>
                                        : <span>No Doctor Found</span>}
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="patientEmail" className="col-sm-3 col-form-label">Patient Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="patientEmail" name="patientEmail" className="form-control"
                                        value={patient?.email}
                                        placeholder="Patient Email" readOnly></input>
                                    {patient?.id ? <span>Patient Name: <b>{patient?.firstName + ' ' + patient?.lastName}
                                        <input hidden={true} id="patientId" name="patientId" value={patient?.id} /></b></span> : <span>No Patient found</span>}
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
                            <Button variant="primary" type="submit" disabled={!doctor?.id || !prescriptionResult?.prescriptionDocument}>
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
                                <label htmlFor="labName" className="col-sm-3 col-form-label">Result Name</label>
                                <div className="col-sm-9">
                                    <input type="text" id="resultName" name="resultName" className="form-control"
                                        onChange={e => handleLabResultChange(e)}
                                        value={labResult?.resultName}
                                        placeholder="Result Name" required autoComplete='off'></input>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="labName" className="col-sm-3 col-form-label">Result Type</label>
                                <div className="col-sm-9">
                                    <select
                                        name="resultType"
                                        value={labResult?.resultType}
                                        onChange={e => handleLabResultChange(e)}
                                        required
                                        className="browser-default custom-select">
                                        <option>Select Result Type</option>
                                        <option value="Imaging">Imaging</option>
                                        <option value="Blood Tests">Blood Tests</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="labName" className="col-sm-3 col-form-label">Lab Name</label>
                                <div className="col-sm-9">
                                    <input type="text" id="labName" name="labName" className="form-control"
                                        onChange={e => handleLabResultChange(e)}
                                        value={labResult?.labName}
                                        placeholder="Lab Name" required autoComplete='off'></input>
                                </div>
                            </div>
                            {/* 
                            <div className="form-group row">
                                <label htmlFor="decription" className="col-sm-3 col-form-label">Description</label>
                                <div className="col-sm-9">
                                    <input type="text" id="decription" name="decription" className="form-control"
                                        onChange={e => handleLabResultChange(e)}
                                        value={labResult?.decription}
                                        placeholder="Description" required autoComplete='off'></input>
                                </div>
                            </div> */}

                            <div className="form-group row">
                                <label htmlFor="doctorName" className="col-sm-3 col-form-label">Doctor Name</label>
                                <div className="col-sm-9 position-relative">
                                    <input type="text" id="doctorName" name="doctorName" className="form-control"
                                        validate="true" value={doctor?.firstName}
                                        onChange={e => onChangeHandler(e.target.value)}
                                        placeholder="Doctor Name" required autoComplete='off'
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setSuggestion([]);
                                            }, 100);
                                        }}
                                    />
                                    {/* ADD DIV */}
                                    <div className='suggestion-box'>
                                        {suggestion && suggestion.map((doc, index) => {
                                            return (
                                                <div key={index} onClick={() => onSuggestHandler(doc.email)} className='suggestion col-md-12 justify-content-md-center'>
                                                    {doc.firstName + ' ' + doc.lastName}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {doctor?.id ? <span>Doctor Email:  <b>{doctor?.email}
                                        <input hidden={true} id="doctorId" name="doctorId" value={doctor?.id} /></b></span>
                                        : <span></span>}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="document" className="col-sm-3 col-form-label">Document</label>
                                <div className="col-sm-9">
                                    {errorMsg && (
                                        <label style={{ fontSize: 12, color: '#ff9393', margin: "5px 0" }} className="left">{errorMsg}</label>
                                    )}
                                    {!labResult?.id && (
                                        <input
                                            style={{ padding: '3px' }}
                                            type="file"
                                            id="labResultDocument"
                                            name="labResultDocument"
                                            className="form-control"
                                            onChange={(e) => handleLabResultChange(e)}
                                            placeholder="Document"
                                            accept="application/pdf"
                                            required={labResult?.id ? false : true}
                                        ></input>
                                        /* <input type="file" id="labResultDocument" name="labResultDocument"
                                            className="form-control"
                                            onChange={e => handleLabResultChange(e)}
                                            placeholder="Document" accept="application/pdf"
                                            required={labResult?.id ? false : true}></input> */
                                    )}
                                    {labResult?.id && !editDocument && (<div style={{ display: "inline-flex", alignItems: "center" }}>
                                        <IconButton onClick={() => setEditDocument(true)}>
                                            <CancelIcon style={{ color: "red" }} />
                                        </IconButton>
                                        <input
                                            type="file" id="labResultDocument" name="labResultDocument"
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
                            {/* <div className="form-group row">
                                <label htmlFor="patientEmail" className="col-sm-3 col-form-label">Patient Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="patientEmail" name="patientEmail" className="form-control"
                                        value={patient?.email}
                                        placeholder="Patient Email" readOnly></input>

                                    {patient?.id ? <span>Patient Name: <b>{patient?.firstName + ' ' + patient?.lastName}
                                        <input hidden={true} id="patientId" name="patientId" value={patient?.id} /></b></span> : <span>No Patient found</span>}
                                </div>
                            </div> */}
                            <div className="container">
                                <div className="row">
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleUploadLabResultClosed}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" disabled={!doctor?.id || !labResult.labResultDocument}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>

            </div>

            {/* <Footer /> */}
        </>
    );
}
export default PatientDocument;