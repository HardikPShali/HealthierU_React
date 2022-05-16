import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import Footer from './Footer';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from '@material-ui/core/FormControl';
// import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import './doctor.css';
// import DatePicker from 'react-date-picker';
import Pagination from 'react-bootstrap/Pagination';
// import documentViewImage from '../../images/icons used/document icon@2x.png';
import editIcon from '../../images/Icons/edit icon_40 pxl.svg';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    formatDate,
    getPatientQuestionnaire,
} from '../questionnaire/QuestionnaireService';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import {
    getCurrentDoctorInfo,
    getCurrentUserInfo,
    // getPatientInfoByPatientId
} from '../../service/AccountService';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    getDoctorPatientDocuments,
    getDocument,
    postDocument,
    postLabDocument,
    getDocumentById,
} from '../../service/DocumentService';
import CancelIcon from '@material-ui/icons/Cancel';
import PrescriptionLabCard from './Prescription-Lab/PrescriptionLabCard';
import './Prescription-Lab/PrescriptionLab.css'
const Healthassessment = (props) => {
    //console.log("Props patient Data ::", props);

    //const { id } = useParams();

    const topicSet = new Set();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);
    //const [showDelete, setDeleteShow] = useState(false);
    const [prescriptionDocumentUrl, setPrescriptionDocumentUrl] = useState('');
    const [showLabResultUpload, setShowLabResultUpload] = useState(false);
    const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);

    const [labDocumentUrl, setLabDocumentUrl] = useState('');

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const handleUploadLabResultClosed = () => setShowLabResultUpload(false);
    const handleUploadPrescriptionClosed = () => setShowPrescriptionUpload(false);

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
        name: '',
        duration: null,
        labName: '',
        decription: '',
        labResultDocument: null,
    });

    const [prescriptionResult, setPrescriptionResult] = useState({
        name: '',
        inputList: '',
        dose: '',
        duration: null,
        quantity: '',
        noOfDays: '',
        interval: '',
        prescriptionDocument: null,
    });
    const [inputList, setInputList] = useState([{ medicine: '' }]);
    const handleLabResultChange = (e) => {
        if (e.target.type === 'file') {
            const fileSize = e.target.files[0].size;
            console.log('fileSize ::', fileSize);
            const maxSize = 1000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg('');
                setLabResult({ ...labResult, labResultDocument: e.target.value });
            } else {
                document.getElementById('labResultDocument').value = '';
                setErrorMsg('Please upload PDF file with size less than 1mb.');
            }
        } else {
            setLabResult({ ...labResult, [e.target.name]: e.target.value });
        }
    };

    const handlePrescriptionChange = (e) => {
        if (e.target.type === 'file') {
            const fileSize = e.target.files[0].size;
            console.log('fileSize ::', fileSize);
            const maxSize = 1000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg('');
                setPrescriptionResult({
                    ...prescriptionResult,
                    prescriptionDocument: e.target.value,
                });
            } else {
                document.getElementById('prescriptionDocument').value = '';
                setErrorMsg('Please upload PDF file with size less than 1mb.');
            }
        } else {
            setPrescriptionResult({
                ...prescriptionResult,
                [e.target.name]: e.target.value,
            });
        }
    };
    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { medicine: '' }]);
    };

    const showLabDocument = async (val) => {
        const res = await getDocument(val);
        setLabDocumentUrl(res);
    };

    useEffect(() => {
        //console.log(id)
        loadDocuments();
        setDate(0);
    }, []);

    const showDocument = async (val) => {
        const res = await getDocument(val);
        //console.log(res);
        setPrescriptionDocumentUrl(res);
    };

    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);

        const prescriptionDocument = await getDoctorPatientDocuments(
            'Prescription',
            pageNumber - 1,
            doctor.data.id,
            patient.id
        );

        setPresecriptionDocument(prescriptionDocument);

    };
    const clickPaginationForLab = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);

        const documents = await getDoctorPatientDocuments(
            'Lab',
            pageNumber - 1,
            doctor.data.id,
            patient.id
        );

        setLabDocument(documents);

    };

    const handleEditModal = async (item) => {
        const payload = {
            id: item.id,
            patientId: null,
        };
        const res = await getDocumentById(payload);
        if (res && res.data) {
            if (res.data?.documentUrl !== '') {
                setEditDocument(true);
            } else {
                setEditDocument(false);
            }
            setPrescriptionResult(res.data);
            setDoctor(item.doctor);
            setPatient(item.patient);
            setShowPrescriptionUpload(true);
        }
    };

    const handleEditLabModal = async (item) => {
        const payload = {
            id: item.id,
            patientId: null,
        };
        const res = await getDocumentById(payload);
        if (res && res.data) {
            if (res.data?.documentUrl !== '') {
                setEditDocument(true);
            } else {
                setEditDocument(false);
            }
            setLabResult(res.data);
            setShowLabResultUpload(true);
        }
    };

    const [editDocument, setEditDocument] = useState(false);

    const loadDocuments = async () => {
        // GET request using fetch with async/await
        const currentUser = await getCurrentUserInfo();

        const doctor = await getCurrentDoctorInfo(
            currentUser.data.userInfo.id,
            currentUser.data.userInfo.login
        );
        if (doctor) {
            setDoctor(doctor);
        }

        //const patientInfo = await getPatientInfoByPatientId(`${id}`);
        const patientInfo = props.location.state;
        if (patientInfo) {
            setPatient(patientInfo);
        }
        const presecriptionDocument = await getDoctorPatientDocuments(
            'Prescription',
            0,
            doctor.data.id,

            patientInfo && patientInfo.id

        );
        setPresecriptionDocument(presecriptionDocument);
        console.log("presecriptionDocument", presecriptionDocument)

        // const response = await getPatientQuestionnaire(
        //     patientInfo && patientInfo.id
        // );
        // setQuestionnaire(response);
    };

    const handlePrescriptionUploadShow = () => {
        setDate(0);
        setShowPrescriptionUpload(true);
        setPrescriptionResult(null);
    };

    const handleUploadLabResultShow = () => {
        setShowLabResultUpload(true);
        setLabResult(null);
    };

    const [errorMsg, setErrorMsg] = useState('');

    const handlePrescriptionSubmission = async (event) => {
        event.preventDefault();
        setDate(0);
        const startDate = moment(DurationStartDate);
        const endDate = moment(DurationEndDate);
        const diff = endDate.diff(startDate);
        const diffDuration = moment.duration(diff);
        setDate(diffDuration.days());
        console.log('Days:', diffDuration.days());
        setErrorMsg('');
        const data = new FormData(event.target);
        //console.log(data);
        const response = await postDocument(data).catch((err) => {
            console.log('Error :: ', err);
            if (err.response.status === 400) {
                setErrorMsg('Please upload the document in PDF format.');
            }
        });
        if (response) {
            setShowPrescriptionUpload(false);
        }
        const prescriptionDocument = await getDoctorPatientDocuments(
            'Prescription',
            0,
            doctor.data.id,
            patient.id

        );

        setPresecriptionDocument(prescriptionDocument);
    };

    const handleLabResultSubmission = async (event) => {
        event.preventDefault();
        setErrorMsg('');
        const data = new FormData(event.target);
        //console.log(data);
        const response = await postLabDocument(data).catch((err) => {
            if (err.response.status === 400) {
                setErrorMsg('Please upalod the document in PDF format.');
            }
        });
        if (response) {
            setShowLabResultUpload(false);
        }
        const labDocument = await getDoctorPatientDocuments(
            'Lab',
            0,
            doctor.data.id,
            patient.id
        );

        setLabDocument(labDocument);
    };

    const clickTabEvent = async (event) => {
        let documents;
        //console.log('ddddd')
        if (event === 1) {
            documents = await getDoctorPatientDocuments(
                'Lab',
                0,
                doctor.data.id,
                patient.id
            );
            setLabDocument(documents);
        }

        if (event === 0) {
            documents = await getDoctorPatientDocuments(
                'Prescription',
                0,
                doctor.data.id,
                patient.id
            );
            setPresecriptionDocument(documents);
        }
        setPrescriptionDocumentUrl('');
        setLabDocumentUrl('');
        setCurrentPageNumber(1);
    };

    //Start and End Date

    const [date, setDate] = useState({
        DurationStartDate: '',
        DurationEndDate: '',
    });

    const { DurationStartDate, DurationEndDate } = date;


    // code to get the file extension

    function getFileExtension(filename) {
        console.log("filename", filename)
        // get file extension
        const extension = filename.split('.').pop();
        console.log("extension", extension)
        return extension;

    }
    return (
        <>
            <Container>
                <IconButton
                    style={{ margin: '10px 0 -25px', width: '40px', height: '40px' }}
                >
                    <Link to="/doctor/mypatient">
                        <ArrowBackIcon />
                    </Link>
                </IconButton>
                <Row>
                    <Col md={9} id="col">
                        <Tabs onSelect={clickTabEvent}>
                            <TabList>
                                <Tab eventKey="prescription" title="Prescription">
                                    Prescription
                                </Tab>
                                <Tab
                                    eventKey="labResult"
                                    title="Lab Result"
                                    onSelect={clickTabEvent}
                                >
                                    Result
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <div className="row">
                                    <div className="col-lg-10"></div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.65rem' }}
                                            onClick={(e) => handlePrescriptionUploadShow()}
                                        >
                                            Add Prescription
                                        </button>
                                    </div>
                                </div>
                                <br />
                                {/* <div id="prescription-list"> */}

                                {presecriptionDocument?.documentsList ? (
                                    presecriptionDocument?.documentsList.map(
                                        (dataItem, subIndex) => {
                                            return (

                                                <div className="prescription-lab__card-box">
                                                    <h3 className="prescription-lab--main-header mb-3 mt-2">
                                                        {moment(dataItem.docUploadTime).format("MMM")}
                                                    </h3>
                                                    <div className="card-holder">
                                                        <div className="row">

                                                            <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                                <PrescriptionLabCard
                                                                    filetype={getFileExtension(dataItem.name)}
                                                                    name={"Prescription"}
                                                                    apid={"100"}
                                                                    date={dataItem.docUploadTime}
                                                                    time={dataItem.docUploadTime}
                                                                    download={(e) => showDocument(dataItem)}
                                                                />
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <div
                                        className="col-12 ml-2"
                                        style={{ textShadow: 'none', color: 'black' }}
                                    >
                                        No Documents
                                    </div>
                                )}

                                {/* </div> */}
                                {/* <table>
                                        <thead>
                                            <tr>
                                                <th width="100">Action</th>
                                                <th width="100">Name</th>
                                                <th width="100">Date</th>
                                                <th width="200">Description</th>
                                                <th width="100">Duration</th>
                                                <th width="100">Patient</th>
                                                <th width="100">Doctor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {presecriptionDocument?.documentsList ? (
                                                presecriptionDocument?.documentsList.map(
                                                    (dataItem, subIndex) => {
                                                        return (
                                                            <tr key={dataItem.id}>
                                                                <td width="100" style={{ cursor: 'pointer' }}>
                                                                 
                                                                    <VisibilityIcon
                                                                        style={{ color: '#4f80e2' }}
                                                                        title="View"
                                                                        width="20"
                                                                        height="20"
                                                                        onClick={(e) => showDocument(dataItem)}
                                                                    />
                                                                    <img
                                                                        width="15"
                                                                        height="15"
                                                                        onClick={() => handleEditModal(dataItem)}
                                                                        src={editIcon}
                                                                        alt=""
                                                                        style={{
                                                                            marginLeft: '5%',
                                                                            marginRight: '5%',
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td width="100">{dataItem.name}</td>
                                                                <td width="100">
                                                                    {formatDate(dataItem.docUploadTime)}
                                                                </td>
                                                                <td width="200">{dataItem.decription}</td>
                                                                <td width="100">{dataItem.duration}</td>
                                                                <td width="100">
                                                                    {dataItem?.patient
                                                                        ? dataItem?.patient?.firstName +
                                                                        ' ' +
                                                                        dataItem?.patient?.lastName
                                                                        : ''}
                                                                </td>
                                                                <td width="100">
                                                                    {dataItem?.doctor
                                                                        ? dataItem?.doctor?.firstName +
                                                                        ' ' +
                                                                        dataItem?.doctor?.lastName
                                                                        : ''}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <tr></tr>
                                            )}
                                        </tbody>
                                    </table> */}

                                <br />
                                <div>
                                    <Pagination size="sm" style={{ float: 'right' }}>
                                        {presecriptionDocument?.totalPages ? (
                                            Array.from(
                                                Array(presecriptionDocument.totalPages),
                                                (e, i) => {
                                                    return (
                                                        <Pagination.Item
                                                            key={i + 1}
                                                            active={
                                                                i + 1 === currentPageNumber ? true : false
                                                            }
                                                            onClick={(e) => clickPagination(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </Pagination.Item>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <span></span>
                                        )}
                                    </Pagination>
                                </div>
                                <br />
                                <br />
                                <div>
                                    {prescriptionDocumentUrl !== null ||
                                        prescriptionDocumentUrl !== '' ? (
                                        <embed
                                            src={prescriptionDocumentUrl}
                                            type="application/pdf"
                                            frameBorder="0"
                                            height="400px"
                                            width="100%"
                                        />
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-md-10"></div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.65rem' }}
                                            onClick={handleUploadLabResultShow}
                                        >
                                            Add Lab Result
                                        </button>
                                    </div>
                                </div>
                                <br />
                                {labDocument?.documentsList ? (
                                    labDocument?.documentsList.map(
                                        (dataItem, subIndex) => {
                                            return (

                                                <div className="prescription-lab__card-box">
                                                    <h3 className="prescription-lab--main-header mb-3 mt-2">
                                                        {moment(dataItem.docUploadTime).format("MMM")}
                                                    </h3>
                                                    <div className="card-holder">
                                                        <div className="row">

                                                            <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                                <PrescriptionLabCard
                                                                    filetype={getFileExtension(dataItem.name)}
                                                                    name={"Lab"}
                                                                    apid={"100"}
                                                                    date={dataItem.docUploadTime}
                                                                    time={dataItem.docUploadTime}
                                                                    download={(e) => showLabDocument(dataItem)}
                                                                />
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <div
                                        className="col-12 ml-2"
                                        style={{ textShadow: 'none', color: 'black' }}
                                    >
                                        No Documents
                                    </div>
                                )}
                                {/* <div id="prescription-list">
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="100">
                                                <b>Action</b>
                                            </th>
                                            <th width="100">
                                                <b>Name</b>
                                            </th>
                                            <th width="100">
                                                <b>Lab Name</b>
                                            </th>
                                            <th width="100">
                                                <b>Date</b>
                                            </th>
                                            <th width="200">
                                                <b>Description</b>
                                            </th>
                                            <th width="100">
                                                <b>Patient</b>
                                            </th>
                                            <th width="100">
                                                <b>Doctor</b>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labDocument?.documentsList ? (
                                            labDocument.documentsList.map((dataItem, subIndex) => {
                                                return (
                                                    <tr key={dataItem.id}>
                                                        <td width="100" style={{ cursor: 'pointer' }}>
                                                            {/* <img width="30" height="30" onClick={e => showLabDocument(dataItem)}
                                                            src={documentViewImage} alt="" style={{ cursor: 'pointer' }} /> */}
                                {/* <VisibilityIcon
                                                                style={{ color: '#4f80e2' }}
                                                                title="View"
                                                                width="20"
                                                                height="20"
                                                                onClick={(e) => showLabDocument(dataItem)}
                                                            />
                                                            <img
                                                                width="15"
                                                                height="15"
                                                                onClick={() => handleEditLabModal(dataItem)}
                                                                src={editIcon}
                                                                alt=""
                                                                style={{
                                                                    marginLeft: '5%',
                                                                    marginRight: '5%',
                                                                }}
                                                            />
                                                        </td>
                                                        <td width="100">{dataItem.name}</td>
                                                        <td width="100">{dataItem.labName}</td>
                                                        <td width="100">
                                                            {formatDate(dataItem.docUploadTime)}
                                                        </td>
                                                        <td width="200">{dataItem.decription}</td>
                                                        <td width="100">
                                                            {dataItem?.patient
                                                                ? dataItem?.patient?.firstName +
                                                                ' ' +
                                                                dataItem?.patient?.lastName
                                                                : ''}
                                                        </td>
                                                        <td width="100">
                                                            {dataItem?.doctor
                                                                ? dataItem?.doctor?.firstName +
                                                                ' ' +
                                                                dataItem?.doctor?.lastName
                                                                : ''}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>  */}
                                <br />
                                <div>
                                    <Pagination size="sm" style={{ float: 'right' }}>
                                        {labDocument?.totalPages ? (
                                            Array.from(Array(labDocument.totalPages), (e, i) => {
                                                return (
                                                    <Pagination.Item
                                                        key={i + 1}
                                                        active={i + 1 === currentPageNumber}
                                                        onClick={(e) => clickPaginationForLab(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </Pagination.Item>
                                                );
                                            })
                                        ) : (
                                            <span></span>
                                        )}
                                    </Pagination>
                                </div>
                                <br />
                                <br />
                                <div>
                                    {labDocumentUrl &&
                                        (labDocumentUrl !== null || labDocumentUrl !== '') ? (
                                        <embed
                                            src={labDocumentUrl}
                                            type="application/pdf"
                                            frameBorder="0"
                                            height="400px"
                                            width="100%"
                                        />
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                            </TabPanel>
                        </Tabs>
                    </Col>

                    <Col md={3} id="col" className="health-assesment">
                        <div id="patient-ques">
                            <Row id="download-report">
                                <Col xs={12}>
                                    <div style={{ textAlign: 'center' }}>
                                        <b>
                                            {patient?.firstName} {patient?.lastName}
                                        </b>{' '}
                                        <br />
                                    </div>
                                </Col>
                                {/* <Col xs={4}>
                                    <br />
                                    <br />
                                </Col> */}
                            </Row>
                            <br />

                            <Row>
                                <Col md={12}>
                                    <div style={{ fontSize: '0.7rem' }}>
                                        <b style={{ marginLeft: '20%' }}>Health Behaviours</b>
                                        <br />
                                        <span> Do You Suffer from Any of the Following?</span>
                                    </div>

                                    <br />
                                    {questionnaire?.map((item, index) => {
                                        return (
                                            <div style={{ fontSize: '0.6rem' }} key={index}>
                                                <b>{item.description}</b>
                                                {item.topicSubtopicDetails ? (
                                                    Object.entries(item.topicSubtopicDetails).map(
                                                        (dataItem, subIndex) => {
                                                            return (
                                                                <div className="col-md-12" key={subIndex}>
                                                                    <div>
                                                                        <div>
                                                                            <b
                                                                            //style={{ marginLeft: '25%' }}
                                                                            >
                                                                                {topicSet.has(dataItem[0].split('#')[0])
                                                                                    ? ''
                                                                                    : dataItem[0].split('#')[0]}
                                                                            </b>
                                                                        </div>
                                                                        <div>
                                                                            {dataItem[0].split('#').length > 2
                                                                                ? dataItem[0].split('#')[1]
                                                                                : ''}
                                                                        </div>
                                                                        <div hidden="true">
                                                                            {topicSet.add(dataItem[0].split('#')[0])}
                                                                        </div>

                                                                        {dataItem[1].map(
                                                                            (question, questionSubIndex) => {
                                                                                return (
                                                                                    <div key={questionSubIndex}>
                                                                                        <div>
                                                                                            <div
                                                                                                hidden={
                                                                                                    question.questiontype ===
                                                                                                    'TEXT'
                                                                                                }
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-radio"
                                                                                                    disabled="true"
                                                                                                    style={{
                                                                                                        marginRight: '0.5rem',
                                                                                                    }}
                                                                                                    defaultChecked={
                                                                                                        question.answer === 'Y'
                                                                                                            ? true
                                                                                                            : false
                                                                                                    }
                                                                                                    id={question.id}
                                                                                                />
                                                                                                <label
                                                                                                    style={{ marginBottom: 0 }}
                                                                                                    for={question.id}
                                                                                                >
                                                                                                    {question.question}
                                                                                                </label>
                                                                                            </div>

                                                                                            <div
                                                                                                hidden={
                                                                                                    question.questiontype ===
                                                                                                    'BOOLEAN'
                                                                                                }
                                                                                            >
                                                                                                <div>
                                                                                                    <label>
                                                                                                        {question.question}
                                                                                                    </label>

                                                                                                    <p>{question?.answer}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                        <br />
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}

            <Modal
                show={showPrescriptionUpload}
                onHide={handleUploadPrescriptionClosed}
            >
                <form onSubmit={(e) => handlePrescriptionSubmission(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Prescription</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            hidden={true}
                            id="id"
                            name="id"
                            value={prescriptionResult?.id}
                            onChange={(e) => handlePrescriptionChange(e)}
                        ></input>
                        {inputList.map((x, i) => {
                            return (
                                <div className="form-group row">
                                    <label htmlFor="topic" className="col-sm-3 col-form-label">
                                        Medicine
                                    </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            id="medicine"
                                            name="medicine"
                                            className="form-control"
                                            onChange={(e) => handleInputChange(e, i)}
                                            value={x.medicine}
                                            placeholder="Medicine Name"
                                            required
                                        ></input>
                                        <br />
                                        <div className="btn-box">
                                            {inputList.length !== 1 && (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleRemoveClick(i)}
                                                >
                                                    Remove
                                                </Button>
                                            )}

                                            {inputList.length - 1 === i && (
                                                <Button
                                                    className="medicineButton"
                                                    variant="primary"
                                                    onClick={handleAddClick}
                                                >
                                                    Add Medicine
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">
                                Dose
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="dose"
                                    name="dose"
                                    className="form-control"
                                    onChange={(e) => handlePrescriptionChange(e)}
                                    value={prescriptionResult?.dose}
                                    placeholder="Dose"
                                    required
                                ></input>
                            </div>
                        </div>
                        {/* <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">Duration</label>
                            <div className="col-sm-9">
                                <input type="text" id="duration" name="duration" className="form-control"
                                    onChange={e => handlePrescriptionChange(e)}
                                    value={prescriptionResult?.duration}
                                    placeholder="Duration" required></input>
                            </div>
                        </div> */}

                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">
                                Quantity
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="quantity"
                                    name="quantity"
                                    className="form-control"
                                    onChange={(e) => handlePrescriptionChange(e)}
                                    value={prescriptionResult?.quantity}
                                    placeholder="Quantity"
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">
                                Number Of Days
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="noOfDays"
                                    name="noOfDays"
                                    className="form-control"
                                    onChange={(e) => handlePrescriptionChange(e)}
                                    value={date}
                                    placeholder="Number Of Days"
                                    disabled
                                ></input>
                            </div>
                        </div>
                        {/* <div className="form-group row">
                            <label htmlFor="decription" className="col-sm-3 col-form-label">Description</label>
                            <div className="col-sm-9">
                                <input type="text" id="decription" name="decription" className="form-control"
                                    onChange={e => handlePrescriptionChange(e)}
                                    value={prescriptionResult?.decription}
                                    placeholder="Description" required></input>
                            </div>
                        </div> */}

                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">
                                Interval
                            </label>
                            <div className="col-sm-9">
                                <FormControl>
                                    <Select
                                        style={{ width: '340px' }}
                                        id="demo-controlled-open-select"
                                        variant="filled"
                                        name="interval"
                                        value={prescriptionResult?.interval}
                                        inputProps={{ required: true }}
                                        placeholder="interval"
                                        onChange={(e) => handlePrescriptionChange(e)}
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        <MenuItem value="0-0-1">
                                            <em>0-0-1</em>
                                        </MenuItem>
                                        <MenuItem value="1-0-0">
                                            <em>1-0-0</em>
                                        </MenuItem>
                                        <MenuItem value="0-1-0">
                                            <em>0-1-0</em>
                                        </MenuItem>
                                        <MenuItem value="1-0-1">
                                            <em>1-0-1</em>
                                        </MenuItem>
                                        <MenuItem value="1-1-1">
                                            <em>1-1-1</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">
                                Duration
                            </label>
                            <div className="col-sm-4">
                                <TextField
                                    type="date"
                                    onChange={(e) =>
                                        setDate({
                                            ...date,
                                            DurationStartDate:
                                                e.target.value === '' ? '' : new Date(e.target.value),
                                        })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                        min: moment(new Date()).format('YYYY-MM-DD'),
                                    }}
                                    value={moment(new Date(DurationStartDate)).format(
                                        'YYYY-MM-DD'
                                    )}
                                    variant="filled"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="col-sm-4">
                                <TextField
                                    type="date"
                                    onChange={(e) =>
                                        setDate({
                                            ...date,
                                            DurationEndDate:
                                                e.target.value === '' ? '' : new Date(e.target.value),
                                        })
                                    }
                                    className="filterDate"
                                    inputProps={{
                                        min: moment(new Date(DurationStartDate)).format(
                                            'YYYY-MM-DD'
                                        ),
                                    }}
                                    value={moment(new Date(DurationEndDate)).format('YYYY-MM-DD')}
                                    variant="filled"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="prescriptionDocument"
                                className="col-sm-3 col-form-label"
                            >
                                Document
                            </label>
                            <div className="col-sm-9">
                                {errorMsg && (
                                    <label
                                        style={{ fontSize: 12, color: '#ff9393', margin: '5px 0' }}
                                        className="left"
                                    >
                                        {errorMsg}
                                    </label>
                                )}
                                {!prescriptionResult?.id && (
                                    <input
                                        type="file"
                                        id="prescriptionDocument"
                                        name="prescriptionDocument"
                                        className="form-control"
                                        onChange={(e) => handlePrescriptionChange(e)}
                                        placeholder="Document"
                                        accept="application/pdf"
                                        required={prescriptionResult?.id ? false : true}
                                    ></input>
                                )}
                                {prescriptionResult?.id && !editDocument && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => setEditDocument(true)}>
                                            <CancelIcon style={{ color: 'red' }} />
                                        </IconButton>
                                        <input
                                            type="file"
                                            id="prescriptionDocument"
                                            name="prescriptionDocument"
                                            className="form-control"
                                            onChange={(e) => handlePrescriptionChange(e)}
                                            placeholder="Document"
                                            accept="application/pdf"
                                            required={prescriptionResult?.id ? false : true}
                                        ></input>
                                    </div>
                                )}
                                {prescriptionResult?.id && editDocument && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={() => setEditDocument(false)}
                                        >
                                            Edit
                                        </button>
                                        <a
                                            href={prescriptionResult?.documentUrl}
                                            download
                                            className="btn btn-primary"
                                        >
                                            Download
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                        <br />

                        {/* <div className="form-group row">
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
                                    placeholder="Patient Email" readOnly={patient?.email ? true : false}></input>
                                {patient?.id ? <span>Patient Name: <b>{patient?.firstName + ' ' + patient?.lastName}
                                    <input hidden={true} id="patientId" name="patientId"
                                        value={patient?.id} /></b></span> : <span>No Patient found</span>}
                            </div>
                        </div> */}

                        <div className="container">
                            <div className="row"></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleUploadPrescriptionClosed}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={
                                !patient?.id || !prescriptionResult?.prescriptionDocument
                            }
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showLabResultUpload} onHide={handleUploadLabResultClosed}>
                <form onSubmit={(e) => handleLabResultSubmission(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Lab Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            hidden={true}
                            id="id"
                            name="id"
                            value={labResult?.id}
                            onChange={(e) => handleLabResultChange(e)}
                        ></input>
                        <div className="form-group row">
                            <label htmlFor="labName" className="col-sm-3 col-form-label">
                                Lab Name
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="labName"
                                    name="labName"
                                    className="form-control"
                                    onChange={(e) => handleLabResultChange(e)}
                                    value={labResult?.labName}
                                    placeholder="Lab Name"
                                    required
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="decription" className="col-sm-3 col-form-label">
                                Description
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="decription"
                                    name="decription"
                                    className="form-control"
                                    onChange={(e) => handleLabResultChange(e)}
                                    value={labResult?.decription}
                                    placeholder="Description"
                                    required
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="document" className="col-sm-3 col-form-label">
                                Document
                            </label>
                            <div className="col-sm-9">
                                {errorMsg && (
                                    <label
                                        style={{ fontSize: 12, color: '#ff9393', margin: '5px 0' }}
                                        className="left"
                                    >
                                        {errorMsg}
                                    </label>
                                )}
                                {!labResult?.id && (
                                    <input
                                        type="file"
                                        id="labResultDocument"
                                        name="labResultDocument"
                                        className="form-control"
                                        onChange={(e) => handleLabResultChange(e)}
                                        placeholder="Document"
                                        accept="application/pdf"
                                        required={labResult?.id ? false : true}
                                    ></input>
                                )}
                                {labResult?.id && !editDocument && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => setEditDocument(true)}>
                                            <CancelIcon style={{ color: 'red' }} />
                                        </IconButton>
                                        <input
                                            type="file"
                                            id="labResultDocument"
                                            name="labResultDocument"
                                            className="form-control"
                                            onChange={(e) => handleLabResultChange(e)}
                                            placeholder="Document"
                                            accept="application/pdf"
                                            required={labResult?.id ? false : true}
                                        ></input>
                                    </div>
                                )}
                                {labResult?.id && editDocument && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={() => setEditDocument(false)}
                                        >
                                            Edit
                                        </button>
                                        <a
                                            href={prescriptionResult?.documentUrl}
                                            download
                                            className="btn btn-primary"
                                        >
                                            Download
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="doctorEmail" className="col-sm-3 col-form-label">
                                Doctor Email
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="email"
                                    id="doctorEmail"
                                    name="doctorEmail"
                                    className="form-control"
                                    value={doctor?.email}
                                    placeholder="Doctor Email"
                                    readOnly
                                ></input>
                                {doctor?.id ? (
                                    <span>
                                        Doctor Name:{' '}
                                        <b>
                                            {doctor?.firstName + ' ' + doctor?.lastName}
                                            <input
                                                hidden={true}
                                                id="doctorId"
                                                name="doctorId"
                                                value={doctor?.id}
                                            />
                                        </b>
                                    </span>
                                ) : (
                                    <span>No Doctor Found</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="patientEmail" className="col-sm-3 col-form-label">
                                Patient Email
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="email"
                                    id="patientEmail"
                                    name="patientEmail"
                                    className="form-control"
                                    value={patient?.email}
                                    required={true}
                                    placeholder="Patient Email"
                                    readOnly={patient?.email ? true : false}
                                ></input>
                                {patient?.id ? (
                                    <span>
                                        Patient Name:{' '}
                                        <b>
                                            {patient?.firstName + ' ' + patient?.lastName}
                                            <input
                                                hidden={true}
                                                id="patientId"
                                                name="patientId"
                                                value={patient?.id}
                                            />
                                        </b>
                                    </span>
                                ) : (
                                    <span>No Patient found</span>
                                )}
                            </div>
                        </div>

                        <div className="container">
                            <div className="row"></div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleUploadLabResultClosed}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!patient?.id || !labResult?.labResultDocument}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default Healthassessment;
