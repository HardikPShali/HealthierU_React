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
import { Tab, TabList, TabPanel, Tabs } from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import IconButton from '@material-ui/core/IconButton';
import Cookies from 'universal-cookie';
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
import { useHistory } from 'react-router';
const Healthassessment = (props) => {
    //console.log("Props patient Data ::", props);

    //const { id } = useParams();
    const history = useHistory();
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
        loadDocuments();
    }, []);

    const showDocument = async (val) => {
        // const res = await getDocument(val);
        setPrescriptionDocumentUrl(val.documentUrl);
    };

    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);

        const prescriptionDocument = await getDoctorPatientDocuments(
            'Prescription',
            pageNumber - 1,
            doctor.id,
            patient.id
        );

        setPresecriptionDocument(prescriptionDocument.data);

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
    const cookies = new Cookies();
    const loadDocuments = async () => {
        // GET request using fetch with async/await
        const currentUser = await getCurrentUserInfo();

        // const doctor = await getCurrentDoctorInfo(
        //     currentUser.data.userInfo.id,
        //     currentUser.data.userInfo.login
        // );
        const doctor = cookies.get('currentUser');
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
            doctor.id,

            patientInfo && patientInfo.id

        );
        setPresecriptionDocument(presecriptionDocument.data);
        // const response = await getPatientQuestionnaire(
        //     patientInfo && patientInfo.id
        // );
        // setQuestionnaire(response);
    };

    const handlePrescriptionUploadShow = () => {
        // setDate(0);
        // setShowPrescriptionUpload(true);
        // setPrescriptionResult(null);
        const patientInfo = props.location.state;
        props.history.push({ pathname: `/doctor/addPrescription/${patientInfo.id}`, state: patientInfo });
    };
    const handleUploadLabResultShow = () => {
        setShowLabResultUpload(true);
        setLabResult(null);
    };
    const [errorMsg, setErrorMsg] = useState('');
    const handleLabResultSubmission = async (event) => {
        event.preventDefault();
        setErrorMsg('');
        const data = new FormData(event.target);
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
        if (event === 1) {
            documents = await getDoctorPatientDocuments(
                'Lab',
                0,
                doctor.id,
                patient.id
            );
            setLabDocument(documents);
        }

        if (event === 0) {
            documents = await getDoctorPatientDocuments(
                'Prescription',
                0,
                doctor.id,
                patient.id
            );
            setPresecriptionDocument(documents.data);
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
        // get file extension
        const extension = filename.split('.').pop();
        console.log("extension", extension)
        return extension;


    }
    function getDateTime(data) {
        var date = new Date(data);
        date.toISOString().substring(0, 10);

    }
    return (
        <>
            <div className="container">
                <IconButton
                    style={{ margin: '10px 0 -25px', width: '40px', height: '40px' }}
                >
                    <Link to="/doctor/mypatient">
                        <ArrowBackIcon />
                    </Link>
                </IconButton>
                <br />
                <br />
                <Tabs className="justify-content-center record-tabs" defaultActiveKey="prescription" id="uncontrolled-tab-example"
                    onSelect={clickTabEvent}>
                    <Tab eventKey="prescription" title="Prescription">
                        <br />


                        <div className="row">
                            <div className="col-md-10"></div>
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
                        <div>
                            {presecriptionDocument?.documentsList ? (
                                presecriptionDocument?.documentsList.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box" >
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">

                                                        <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                            <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.name)}
                                                                name={"Prescription"}
                                                                apid={dataItem.id}
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
                        <br />
                        <br />


                        <div >
                            <embed src={prescriptionDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                width="100%" />
                        </div>
                    </Tab>
                    <Tab eventKey="labResult" title="Lab Result" onSelect={clickTabEvent}>
                        <br />

                        <div className="row">
                            <div className="col-md-10"></div>
                            {/* <div className="col-md-2 text-right">
                                <button type="button" className="btn btn-primary"
                                    onClick={handleUploadLabResultShow}>Add
                                    Lab Result
                                </button>
                            </div> */}
                        </div>
                        <br />
                        <div className="bg-white">
                            {labDocument?.documentsList ? (
                                labDocument?.documentsList.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box">
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
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

                <br />
                <br />


            </div>
        </>
    );
};

export default Healthassessment;
