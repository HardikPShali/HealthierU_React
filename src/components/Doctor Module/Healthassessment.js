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
import { getGlobalMedicalRecordsSearch } from '../../service/frontendapiservices'
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
import { dateFnsLocalizer } from 'react-big-calendar';
import SearchBarComponent from './SearchAndFilter/SearchComponent';
import PrescriptionFilter from './SearchAndFilter/PrescriptionFIlter'
import FilterComponent from './SearchAndFilter/FilterComponent';
const Healthassessment = (props) => {
    //console.log("Props patient Data ::", props);

    let params = useParams();
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
        // const res = await getDocument(val);
        setLabDocumentUrl(val.documentUrl);
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const showDocument = async (val) => {
        console.log("val", val.documentUrl);
        // const res = await getDocument(val);
        setPrescriptionDocumentUrl(val.documentUrl);
    };

    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);
        setMedicalRecordData(null)
        const prescriptionDocument = await getDoctorPatientDocuments(
            'Prescription',
            pageNumber - 1,
            doctor.id,
            patient
        );
        const data = {
            documentType: 'Prescription',
            doctorId: doctor.id,
            patientId: patient,
            pageNo: pageNumber - 1
        }
        const response = await getGlobalMedicalRecordsSearch(data)
        setMedicalRecordData(response.data.data.documentsList)
        setPresecriptionDocument(prescriptionDocument.data);

    };
    const clickPaginationForLab = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        setPresecriptionDocument(null);
        setMedicalRecordData(null)
        const documents = await getDoctorPatientDocuments(
            'LabResult',
            pageNumber - 1,
            doctor.id,
            patient
        );

        setLabDocument(documents.data);
        const data = {
            documentType: 'LabResult',
            doctorId: doctor.id,
            patientId: patient,
            pageNo: pageNumber - 1
        }
        const response = await getGlobalMedicalRecordsSearch(data)
        setMedicalRecordData(response.data.data.documentsList)

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
    const [appointmentID, setAppointmentID] = useState(0);
    const cookies = new Cookies();
    const loadDocuments = async () => {
        // GET request using fetch with async/await
        const currentUser = await getCurrentUserInfo();

        // const doctor = await getCurrentDoctorInfo(
        //     currentUser.data.userInfo.id,
        //     currentUser.data.userInfo.login
        // );
        const doctor = cookies.get('profileDetails');
        if (doctor) {
            setDoctor(doctor);
        }
        //const patientInfo = await getPatientInfoByPatientId(`${id}`);
        const patientInfo = params.patientID;
        const APID = params.apid;
        if (APID) {
            setAppointmentID(APID)
        }
        if (patientInfo) {
            setPatient(patientInfo);
        }
        const data = {
            documentType: "Prescription",
            doctorId: doctor.id,
            patientId: patientInfo
        }
        const presecriptionDocument = await getGlobalMedicalRecordsSearch(data);
        if (presecriptionDocument.status === 200 || presecriptionDocument.status === 201) {
            const res = []
            const prepData = presecriptionDocument.data.data.documentsList.filter(re => re.documentsList.length)
            prepData.forEach((f) => {
                res.push(...f.documentsList)
            })
            setMedicalRecordData(res)
        }
        // const response = await getPatientQuestionnaire(
        //     patientInfo && patientInfo.id
        // );
        // setQuestionnaire(response);
    };

    const handlePrescriptionUploadShow = () => {
        // setDate(0);
        // setShowPrescriptionUpload(true);
        // setPrescriptionResult(null);
        const patientInfo = params.patientID;
        const ApID = params.apid
        props.history.push({ pathname: `/doctor/addPrescription/${patientInfo}/${ApID}` });
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
        // const labDocument = await getDoctorPatientDocuments(
        //     'Lab Result',
        //     0,
        //     doctor.data.id,
        //     patient
        // );
        const info = {
            documentType: "LabResult",
            patientId: patient
        }
        const labDocument = await getGlobalMedicalRecordsSearch(info);
        if (labDocument.status === 200 || labDocument.status === 201) {
            const res = []
            const prepData = labDocument.data.data.documentsList.filter(re => re.documentsList.length)
            prepData.forEach((f) => {
                res.push(...f.documentsList)
            })
            setMedicalRecordData(res)
        }

        //setLabDocument(labDocument);
    };
    const clearAll = async () => {
        setMedicalRecordData([])
        // const labDocument = await getDoctorPatientDocuments(
        //     'LabResult',
        //     0,
        //     doctor.id,
        //     patient
        // );

        // setLabDocument(labDocument.data);
        const info = {
            documentType: "LabResult",
            patientId: patient
        }
        const labDocument = await getGlobalMedicalRecordsSearch(info);
        if (labDocument.status === 200 || labDocument.status === 201) {
            const res = []
            const prepData = labDocument.data.data.documentsList.filter(re => re.documentsList.length)
            prepData.forEach((f) => {
                res.push(...f.documentsList)
            })
            setMedicalRecordData(res)
        }
        console.log("clearAll", labDocument);
    }

    const clickTabEvent = async (event) => {
        //setMedicalRecordData([])
        let documents;
        if (event === "labResult") {
            // documents = await getDoctorPatientDocuments(
            //     'LabResult',
            //     0,
            //     doctor.id,
            //     patient
            // );
            // setLabDocument(documents.data);
            const info = {
                documentType: "LabResult",
                patientId: patient
            }
            const labDocument = await getGlobalMedicalRecordsSearch(info);
            if (labDocument.status === 200 || labDocument.status === 201) {
                const res = []
                const prepData = labDocument.data.data.documentsList.filter(re => re.documentsList.length)
                prepData.forEach((f) => {
                    res.push(...f.documentsList)
                })
                setMedicalRecordData(res)
            }
        }

        if (event === "prescription") {
            // documents = await getDoctorPatientDocuments(
            //     'Prescription',
            //     0,
            //     doctor.id,
            //     patient
            // );
            // setPresecriptionDocument(documents.data);
            const data = {
                documentType: "Prescription",
                doctorId: doctor.id,
                patientId: patient
            }
            const presecriptionDocument = await getGlobalMedicalRecordsSearch(data);
            if (presecriptionDocument.status === 200 || presecriptionDocument.status === 201) {
                const res = []
                const prepData = presecriptionDocument.data.data.documentsList.filter(re => re.documentsList.length)
                prepData.forEach((f) => {
                    res.push(...f.documentsList)
                })
                setMedicalRecordData(res)
            }
        }
        setPrescriptionDocumentUrl('');
        setLabDocumentUrl('');
        setCurrentPageNumber(1);
        setCurrentTab(event);
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
        // console.log("filename", filename)
        const extension = filename.split('.').pop();
        //console.log("extension", extension)
        return extension;
    }
    //Search
    const [search, setSearch] = useState('');
    const [medicalRecordData, setMedicalRecordData] = useState([]);
    const [currentDoctor, setCurrentDoctor] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const getGlobalPrescriptions = async (search, filter = {}) => {
        const currentDoctor = cookies.get('profileDetails');
        setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctor.id });
        setPresecriptionDocument({ documentsList: null })
        const starttime = new Date();
        const endtime = new Date();
        const data = {
            doctorId: currentDoctor.id,
            patientId: patient,
            documentType: "Prescription",
            //startTime: starttime.toISOString(),
            //endTime: endtime.toISOString(),
            doctorName: search,
            //resultType: search,
            //page: 0,
            //size: 0,
            //labName: search,
            //id: "null"
        };

        if (filter.startTime && filter.startTime !== '') {
            data.startTime = filter.startTime;
        }
        if (filter.endTime && filter.endTime !== '') {
            const endtime = new Date(filter.endTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }
        if (filter.resultType && filter.resultType !== '') {
            data.resultType = filter.resultType;
        }
        const responseTwo = await getGlobalMedicalRecordsSearch(data).catch((err) => {
            if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
                setLoading(false);
            }
        });

        if (responseTwo.status === 200 || responseTwo.status === 201) {
            const res = []
            const prepData = responseTwo.data.data.documentsList.filter(re => re.documentsList.length)
            prepData.forEach((f) => {
                res.push(...f.documentsList)
            })
            if (res.length > 0) {
                setIsSearch(true)
            }
            setMedicalRecordData(res)
            setCurrentPageNumber(1);
        }
    };

    const getGlobalLabResults = async (search, filter = {}) => {
        const currentDoctor = cookies.get('profileDetails');
        setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctor.id });
        setLabDocument({ documentsList: null })
        console.log("labDocument", labDocument);
        const starttime = new Date();
        const endtime = new Date();
        const data = {
            //doctorId: currentDoctor.id,
            patientId: patient,
            documentType: "LabResult",
            //startTime: starttime.toISOString(),
            //endTime: endtime.toISOString(),
            //doctorName: search,
            //resultType: search,
            //page: 0,
            //size: 0,
            labName: search,
            //id: "null"
        };
        if (filter.startTime && filter.startTime !== '') {
            data.startTime = filter.startTime;
        }
        if (filter.endTime && filter.endTime !== '') {
            const endtime = new Date(filter.endTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }
        if (filter.resultType && filter.resultType !== '') {
            data.resultType = filter.resultType;
        }
        if (filter.startTime && filter.endTime && filter.resultType === '') {
            clearAll()
        }
        const responseTwo = await getGlobalMedicalRecordsSearch(data).catch((err) => {
            if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
                setLoading(false);
            }
        });
        if (responseTwo.status === 200 || responseTwo.status === 201) {
            const res = []
            const labData = responseTwo.data.data.documentsList.filter(re => re.documentsList.length)
            labData.forEach((f) => {
                res.push(...f.documentsList)
            })
            if (res.length > 0) {
                setIsSearch(true)
            }
            setMedicalRecordData(res)
            setCurrentPageNumber(1);
        }
    };
    const handleFilterChange = async (filter) => {
        getGlobalLabResults(search, filter);
    };
    const handleSearchInputChange = (searchValue) => {
        if (currentTab === "prescription") {
            getGlobalPrescriptions(searchValue);
        } else {
            getGlobalLabResults(searchValue);
        }
        if (searchValue != "") {
            setSearch(searchValue);
        }
        // if (searchValue === '') {
        //     getGlobalLabResults(searchValue);
        // }
        // else {
        //     getGlobalLabResults(searchValue);
        //     setSearch(searchValue);
        // }
    };

    const handleFilterChangePrescription = (filter) => {
        getGlobalPrescriptions(search, filter);
    };
    const handleSearchInputChangePrescription = (searchValue) => {
        if (searchValue === '') {
            getGlobalPrescriptions(searchValue)
        } else {
            getGlobalPrescriptions(searchValue);
            setSearch(searchValue);
        }
    };
    const [currentTab, setCurrentTab] = useState("prescription");
    return (
        <>
            <div className="container">
                {/* <IconButton
                    style={{ margin: '10px 0 -25px', width: '40px', height: '40px' }}
                >
                    <Link to="/doctor/my-appointments">
                        <ArrowBackIcon />
                    </Link>
                </IconButton> */}
                <div className="row mt-4">
                    <div className="col d-flex justify-content-start">
                        <SearchBarComponent updatedSearch={handleSearchInputChange} />
                        {currentTab === "prescription" ? (
                            <PrescriptionFilter updatedFilter={handleFilterChangePrescription} />
                        ) : (
                            <FilterComponent updatedFilter={handleFilterChange} />
                        )}
                    </div>
                </div>
                <br />
                <br />
                <Tabs className="justify-content-center record-tabs" defaultActiveKey="prescription" id="uncontrolled-tab-example"
                    onSelect={clickTabEvent}>
                    <Tab eventKey="prescription" title="Prescription">
                        <br />
                        {/* <div className="col-md-10" style={{ display: 'flex' }}>
                                <SearchBarComponent updatedSearch={handleSearchInputChangePrescription} />
                                <PrescriptionFilter updatedFilter={handleFilterChangePrescription} />
                            </div> */}
                        <div className="d-flex justify-content-end">
                            <div className="col text-right">
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
                            {/* {presecriptionDocument?.documentsList ? (
                                presecriptionDocument?.documentsList.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box" >
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment.utc(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">

                                                        <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                            <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.documentUrl)}
                                                                name={"Prescription"}
                                                                apid={appointmentID}
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
                                    style={{ textShadow: 'none', color: '#3e4543' }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>
                            )} */}
                            {medicalRecordData ? (
                                medicalRecordData.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box">
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment.utc(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">

                                                        <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                            <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.documentUrl)}
                                                                name={"Prescription"}
                                                                apid={appointmentID}
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
                                )) : (

                                <div
                                    className="col-12 ml-2"
                                    style={{ textShadow: 'none', color: '#3e4543' }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>
                            )
                            }
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
                            <Pagination size="sm" style={{ float: 'right' }}>
                                {
                                    medicalRecordData?.totalPages ?
                                        Array.from(Array(medicalRecordData.totalPages), (e, i) => {
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


                        <div>
                            {prescriptionDocumentUrl !== null || prescriptionDocumentUrl !== "" ?
                                <embed src={prescriptionDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" /> : <span></span>}
                        </div>

                    </Tab>
                    <Tab eventKey="labResult" title="Lab Result" onSelect={clickTabEvent}>
                        <br />
                        <div className="row">
                            <div className="col-md-10">

                            </div>
                            {/* <div className="d-flex mt-2 justify-content-between">
                                <SearchBarComponent updatedSearch={handleSearchInputChange} />
                                <FilterComponent updatedFilter={handleFilterChange} />
                            </div> */}
                        </div>
                        <br />

                        <div>

                            {/* {labDocument?.documentsList ? (
                                labDocument?.documentsList.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box">
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment.utc(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">

                                                        <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                            <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.documentUrl)}
                                                                name={"Lab Result"}
                                                                //apid={dataItem.id}
                                                                docName={dataItem.doctorName}
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
                                    style={{ textShadow: 'none', color: '#3e4543' }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>

                            )} */}

                            {medicalRecordData ? (
                                medicalRecordData.map(
                                    (dataItem, subIndex) => {
                                        return (

                                            <div className="prescription-lab__card-box">
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment.utc(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">

                                                        <div style={{ cursor: 'pointer' }} className='prescription-lab-card'>

                                                            <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.documentUrl)}
                                                                name={"Lab Result"}
                                                                docName={"Dr" + " " + doctor?.firstName + " " + (doctor?.lastName || "")}
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
                                )) : (

                                <div
                                    className="col-12 ml-2"
                                    style={{ textShadow: 'none', color: '#3e4543' }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>
                            )
                            }
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
                            <Pagination size="sm" style={{ float: 'right' }}>
                                {
                                    medicalRecordData?.totalPages ?
                                        Array.from(Array(medicalRecordData.totalPages), (e, i) => {
                                            return <Pagination.Item key={i + 1} active={i + 1 === currentPageNumber}
                                                onClick={e => clickPaginationForLab(i + 1)}>
                                                {i + 1}
                                            </Pagination.Item>
                                        }) : <span></span>

                                }
                            </Pagination>
                        </div>
                        <br />
                        <div>
                            {labDocumentUrl !== null || labDocumentUrl !== "" ?
                                <embed src={labDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" /> : <span></span>}
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
