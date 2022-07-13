import "./patient-document.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { toast } from "react-toastify";
import PrescriptionLabCard from "../../Doctor Module/Prescription-Lab/PrescriptionLabCard";
import PatientPrescriptionCard from "../../Doctor Module/Prescription-Lab/PatientPrescriptionCard";
import "../../Doctor Module/Prescription-Lab/PrescriptionLab.css";
import {
    getCurrentPatientInfo,
    getCurrentUserInfo,
} from "../../../service/AccountService";
import {
    validateEmail,
    // getDocument,
    postDocument,
    // postLabDocument,
    getDoctorDetail,
    getPatientDocuments,
    getDocumentById,
    postDocumentAddPrescriptionLabResult,
    //getPatientDetail,
    //getDocuments,
} from "../../../service/DocumentService";
import "../../Doctor Module/doctor.css";
import moment from "moment";
import TransparentLoader from "../../Loader/transparentloader";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton } from "@material-ui/core";
import {
    getSearchData,
    getGlobalMedicalRecordsSearch,
} from "../../../service/frontendapiservices";
import Cookies from "universal-cookie";
import SearchBarComponent from "../../Doctor Module/SearchAndFilter/SearchComponent";
import PrescriptionFilter from "../../Doctor Module/SearchAndFilter/PrescriptionFIlter";
import FilterComponent from "../../Doctor Module/SearchAndFilter/FilterComponent";
// import documentViewImage from '../../../images/icons used/document icon@2x.png';
// import Footer from '../Footer';
// import editIcon from "../../../images/Icons/edit icon_40 pxl.svg";
// import { formatDate } from "../../questionnaire/QuestionnaireService";
// import { Form } from "react-bootstrap";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import VisibilityIcon from "@material-ui/icons/Visibility";


const PatientDocument = (props) => {
    useEffect(() => {
        loadDocuments();
        setIsSearch(false)
    }, []);
    const cookies = new Cookies();
    const [loading, setLoading] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [doctor, setDoctor] = useState("");
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
        resultName: "",
        resultType: "",
        duration: null,
        labName: "",
        decription: "",
        labResultDocument: null,
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
    };

    const handleUploadLabResultClosed = () => {
        setShowLabResultUpload(false);
        setErrorMsg("");
    };
    const handleUploadPrescriptionClosed = () => {
        setShowPrescriptionUpload(false);
        setErrorMsg("");
    };

    const handleLabResultChange = (e) => {
        if (e.target.type === "file") {
            const fileSize = e.target.files[0].size;
            console.log("fileSize ::", fileSize);
            const maxSize = 10000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg("");
                setLabResult({ ...labResult, labResultDocument: e.target.files[0] });
            } else {
                document.getElementById("labResultDocument").value = "";
                setErrorMsg("Please upload PDF file with size less than 10mb.");
            }
        } else {
            setLabResult({ ...labResult, [e.target.name]: e.target.value });
        }
    };

    const handlePrescriptionChange = (e) => {
        if (e.target.type === "file") {
            const fileSize = e.target.files[0].size;
            console.log("fileSize ::", fileSize);
            const maxSize = 10000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg("");
                setPrescriptionResult({
                    ...prescriptionResult,
                    prescriptionDocument: e.target.value,
                });
            } else {
                document.getElementById("prescriptionDocument").value = "";
                setErrorMsg("Please upload PDF file with size less than 10mb.");
            }
        } else {
            setPrescriptionResult({
                ...prescriptionResult,
                [e.target.name]: e.target.value,
            });
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
        setLoading(true);
        const currentUser = await getCurrentUserInfo();
        console.log("patientInfo", currentUser);
        // const currentLoggedInUser = cookies.get("currentUser");
        const patientInfo = await getCurrentPatientInfo(
            currentUser.data.userInfo.id,
            currentUser.data.userInfo.login
        );
        setPatient(patientInfo.data);
        let page = "0";
        let size = "3";
        const data = {
            documentType: "Prescription",
            patientId: patientInfo.data.id,
        }
        const presecriptionDocument = await getGlobalMedicalRecordsSearch(page, size, data);
        if (presecriptionDocument.status === 200 || presecriptionDocument.status === 201) {
            setPresecriptionDocument(presecriptionDocument.data.data)
        }
        setLoading(false);
    };

    const handleLabResultSubmission = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg("");
        const medicalDocumentInfo = {
            documentType: "LabResult",
            patientId: patient?.id,
            doctorId: doctor?.id,
            name: labResult?.resultName,
            resultType: labResult?.resultType,
            labName: labResult?.labName,
        };

        const formData = new FormData();
        formData.append(
            "medicalDocumentInfo",
            new Blob([JSON.stringify(medicalDocumentInfo)], {
                type: "application/json",
            })
        );
        console.log("medicalDocumentInfo", JSON.stringify(medicalDocumentInfo));
        formData.append("file", labResult?.labResultDocument);
        //console.log(data);
        const response = await postDocumentAddPrescriptionLabResult(formData).catch(
            (err) => {
                if (err.response.status === 400) {
                    setLoading(false);
                    setErrorMsg("Please upload the document in PDF format.");
                } else if (err.response.status === 500) {
                    setLoading(false);
                    setErrorMsg("Please upload the document with size less than 1mb.");
                }
            }
        );
        if (response) {
            toast.success("Lab Result successfully Uploaded.");
            setShowLabResultUpload(false);
            setLoading(false);
            setErrorMsg("");
        }
        let page = 0;
        let size = 3;
        const info = {
            documentType: "LabResult",
            patientId: patient.id
        }
        const labDocument = await getGlobalMedicalRecordsSearch(page, size, info);
        if (labDocument.status === 200 || labDocument.status === 201) {
            setLabDocument(labDocument.data.data)
        }
    };

    const handlePrescriptionSubmission = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg("");
        const data = new FormData(event.target);
        //console.log(data);
        const response = await postDocument(data).catch((err) => {
            if (err.response.status === 400) {
                setLoading(false);
                setErrorMsg("Please upload the document in PDF format.");
            } else if (err.response.status === 500) {
                setLoading(false);
                setErrorMsg("Please upload the document with size less than 1mb.");
            }
        });
        if (response) {
            setShowPrescriptionUpload(false);
            setLoading(false);
            setErrorMsg("");
        }
        const presecriptionDocument = await getPatientDocuments(
            "Prescription",
            0,
            patient.id
        );
        setPresecriptionDocument(presecriptionDocument);
    };

    const showDocument = async (val) => {
        // const res = await getDocument(val);
        setPrescriptionDocumentUrl(val.documentUrl);
        const link = document.createElement("a");
        link.href = val.documentUrl;
        link.download = `${val.description}.${val.documentType}`;
        document.body.appendChild(link);
        //link.click();
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const showLabDocument = async (val) => {
        // const res = await getDocument(val);
        setLabDocumentUrl(val.documentUrl);
        const link = document.createElement("a");
        link.href = val.documentUrl;
        link.download = `${val.description}.${val.documentType}`;
        document.body.appendChild(link);
        //link.click();
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    // const handlePrescriptionUploadShow = () => {
    //     setShowPrescriptionUpload(true);
    //     setPrescriptionResult(null);
    //     setDoctor(null);
    // }

    const clickTabEvent = async (event) => {
        //let documents;
        // setLoading(true);
        setMedicalRecordData([])
        if (event === "labResult") {
            let page = 0;
            let size = 3;
            const info = {
                documentType: "LabResult",
                patientId: patient.id
            }
            const labDocument = await getGlobalMedicalRecordsSearch(page, size, info);
            if (labDocument.status === 200 || labDocument.status === 201) {
                setLabDocument(labDocument.data.data)
            }
            setLoading(false);
        }

        if (event === "prescription") {
            let page = 0;
            let size = 3;
            const info = {
                documentType: "LabResult",
                patientId: patient.id
            }
            const labDocument = await getGlobalMedicalRecordsSearch(page, size, info);
            if (labDocument.status === 200 || labDocument.status === 201) {
                setPresecriptionDocument(labDocument.data.data)
            }
            setLoading(false);
        }

        setCurrentPageNumber(1);
        setCurrentTab(event);
    };
    const [currentTab, setCurrentTab] = useState("prescription");
    const [searchandFilterData, setSearchandFilterData] = useState();
    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        let page = pageNumber - 1;
        let size = 3;
        let data;
        if (searchandFilterData) {
            data = searchandFilterData
        }
        else {
            data = {
                documentType: 'Prescription',
                patientId: patient.id,
            }
        }
        const response = await getGlobalMedicalRecordsSearch(page, size, data)
        setPresecriptionDocument(response.data.data);
    };

    const clickPaginationForLab = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        let page = pageNumber - 1;
        let size = 3;
        let data;
        if (searchandFilterData) {
            data = searchandFilterData
        }
        else {
            data = {
                documentType: 'LabResult',
                patientId: patient.id,
            }
        }
        const response = await getGlobalMedicalRecordsSearch(page, size, data)
        setLabDocument(response.data.data);
        //console.log(currentPageNumber)
    };

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

    const handleEditLabModal = async (item) => {
        const payload = {
            id: item.id,
            patientId: item.patient.id,
        };
        const res = await getDocumentById(payload);
        if (res && res.data) {
            if (res.data?.documentUrl !== "") {
                setEditDocument(true);
            } else {
                setEditDocument(false);
            }
            setLabResult(res.data);
            setShowLabResultUpload(true);
            setDoctor(item.doctor);
        }
    };

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
            } else {
                setSearchText("");
                setSuggestion([]);
            }
        };
        loadUsers();
    }, []);

    const onChangeHandler = (text) => {
        let matches = [];
        console.log("onChangehandler");
        if (text.length > 0) {
            matches = user.filter((item) => {
                const regex = new RegExp(`${text}`, "gi");
                // console.log('text', text);
                return item.email.match(regex);
            });
        }
        setSuggestion(matches);
        setSearchText(text);
    };

    const onSuggestHandler = async (text) => {
        // setDoctor(null);
        const data = await getDoctorDetail(text);
        // console.log('Data', data);
        setDoctor(data);
        setSearchText(data.firstName);
        // console.log('Text', data.firstName);
        setSuggestion([]);
    };
    function getFileExtension(filename) {
        // get file extension
        const extension = filename.split(".").pop();
        return extension;
    }
    //Search
    const [search, setSearch] = useState("");
    const [medicalRecordData, setMedicalRecordData] = useState([]);
    const [currentPatient, setCurrentPatient] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const getGlobalPrescriptions = async (search, filter = {}) => {
        const currentPatient = cookies.get("profileDetails");
        setCurrentPatient({ ...currentPatient, patientId: currentPatient.id });
        setPresecriptionDocument({ documentsList: null })
        const starttime = new Date();
        const endtime = new Date();
        const data = {
            doctorId: doctor.id,
            patientId: currentPatient.id,
            documentType: "Prescription",
            doctorName: search,
        };
        let page = 0;
        let size = 3;
        if (filter.startTime && filter.startTime !== "") {
            data.startTime = filter.startTime;
        }
        if (filter.endTime && filter.endTime !== "") {
            const endtime = new Date(filter.endTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }
        if (filter.resultType && filter.resultType !== "") {
            data.resultType = filter.resultType;
        }
        setSearchandFilterData(data)
        const responseTwo = await getGlobalMedicalRecordsSearch(page, size, data).catch(
            (err) => {
                if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
                    setLoading(false);
                }
            }
        );
        if (responseTwo.status === 200 || responseTwo.status === 201) {
            setPresecriptionDocument(responseTwo.data.data)
            setCurrentPageNumber(1);
        }
    };

    const getGlobalLabResults = async (search, filter = {}) => {
        const currentPatient = cookies.get("profileDetails");
        setCurrentPatient({ ...currentPatient, patientId: currentPatient.id });
        setLabDocument({ documentsList: null })
        const starttime = new Date();
        const endtime = new Date();
        const data = {
            //doctorId: doctor.id,
            patientId: currentPatient.id,
            documentType: "LabResult",
            labName: search,
        };
        let page = 0;
        let size = 3;
        if (filter.startTime && filter.startTime !== "") {
            data.startTime = filter.startTime;
        }
        if (filter.endTime && filter.endTime !== "") {
            const endtime = new Date(filter.endTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }
        if (filter.resultType && filter.resultType !== "") {
            data.resultType = filter.resultType;
        }
        setSearchandFilterData(data)
        const responseTwo = await getGlobalMedicalRecordsSearch(page, size, data).catch(
            (err) => {
                if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
                    setLoading(false);
                }
            }
        );
        if (responseTwo.status === 200 || responseTwo.status === 201) {
            setLabDocument(responseTwo.data.data)
            setCurrentPageNumber(1);
        }
    };
    const handleFilterChange = (filter) => {
        getGlobalLabResults(search, filter);
    };
    const handleSearchInputChange = (searchValue) => {
        // if (searchValue === "") {
        //   console.log("blank searchValue is | in SearchBarComponent", searchValue);
        // } else {
        //   getGlobalLabResults(searchValue);
        // }
        if (currentTab === "prescription") {
            getGlobalPrescriptions(searchValue);
        } else {
            getGlobalLabResults(searchValue);
        }
        if (searchValue != "") {
            setSearch(searchValue);
        }
    };

    const handleFilterChangePrescription = (filter) => {
        getGlobalPrescriptions(search, filter);
    };
    const handleSearchInputChangePrescription = (searchValue) => {
        if (searchValue === "") {
            console.log("blank searchValue is | in SearchBarComponent", searchValue);
            getGlobalPrescriptions(searchValue);
        } else {
            getGlobalPrescriptions(searchValue);
            setSearch(searchValue);
        }
    };
    return (
        <>
            {loading && <TransparentLoader />}
            <div className="container">
                <div className="row mt-4">
                    <div className="col d-flex justify-content-end">
                        <SearchBarComponent updatedSearch={handleSearchInputChange} />
                        {currentTab === "prescription" ? (
                            <PrescriptionFilter
                                updatedFilter={handleFilterChangePrescription}
                            />
                        ) : (
                            <FilterComponent updatedFilter={handleFilterChange} />
                        )}
                    </div>
                    {/* <div className="col-md-2 text-right">
            <button type="button" className="btn btn-primary"
                                    onClick={e => handlePrescriptionUploadShow()}>Add Prescription
                                </button>
          </div> */}
                </div>
                <br />
                <br />
                <Tabs
                    className="justify-content-center record-tabs"
                    defaultActiveKey="prescription"
                    id="uncontrolled-tab-example"
                    onSelect={clickTabEvent}
                >
                    <Tab eventKey="prescription" title="Prescription">
                        <br />

                        <br />
                        <div>
                            {presecriptionDocument.totalPages ? (
                                presecriptionDocument.documentsList[0].documentsList.map(
                                    (dataItem, subIndex) => {
                                        return (
                                            <div className="prescription-lab__card-box" key={subIndex}>
                                                <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                    {moment.utc(dataItem.docUploadTime).format("MMM")}
                                                </h3>
                                                <div className="card-holder">
                                                    <div className="row">
                                                        <div
                                                            style={{ cursor: "pointer" }}
                                                            className="prescription-lab-card"
                                                        >
                                                            {/* <PrescriptionLabCard
                                                                filetype={getFileExtension(dataItem.documentUrl)}
                                                                name={"Prescription"}
                                                                apid={dataItem.id}
                                                                //docName={dataItem.doctorName}
                                                                date={dataItem.docUploadTime}
                                                                time={dataItem.docUploadTime}
                                                                download={(e) => showDocument(dataItem)}
                                                            /> */}
                                                            <PatientPrescriptionCard
                                                                filetype={getFileExtension(
                                                                    dataItem.documentUrl
                                                                )}
                                                                name={"Prescription"}
                                                                docName={dataItem.doctorName}
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
                                    style={{ textShadow: "none", color: "#3e4543" }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>
                            )}
                        </div>
                        <br />
                        <div style={{ minHeight: '100px' }}>
                            <Pagination size="sm" style={{ float: 'right' }}>
                                {
                                    presecriptionDocument.totalPages ?
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
                        {/* <div>
                            {prescriptionDocumentUrl !== null || prescriptionDocumentUrl !== "" ?
                                <embed src={prescriptionDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" /> : <span></span>}
                        </div> */}
                    </Tab>
                    <Tab eventKey="labResult" title="Lab Result" onSelect={clickTabEvent}>
                        <br />

                        <div className="d-flex justify-content-end">
                            {/* <div className="col-md-10" style={{ display: "flex" }}>
                <SearchBarComponent updatedSearch={handleSearchInputChange} />
              </div> */}
                            <div className="col text-right">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ fontSize: "0.65rem" }}
                                    onClick={handleUploadLabResultShow}
                                >
                                    Add Lab Result
                                </button>
                            </div>
                        </div>
                        <br />
                        <div>
                            {labDocument.totalPages ? (
                                labDocument.documentsList[0].documentsList.map((dataItem, subIndex) => {
                                    return (
                                        <div className="prescription-lab__card-box">
                                            <h3 className="prescription-lab--month-header mb-3 mt-2">
                                                {moment.utc(dataItem.docUploadTime).format("MMM")}
                                            </h3>
                                            <div className="card-holder">
                                                <div className="row">
                                                    <div
                                                        style={{ cursor: "pointer" }}
                                                        className="prescription-lab-card"
                                                    >
                                                        <PrescriptionLabCard
                                                            filetype={getFileExtension(dataItem.documentUrl)}
                                                            name={"Lab Result"}
                                                            //apid={dataItem.id}
                                                            docName={dataItem.labName}
                                                            date={dataItem.docUploadTime}
                                                            time={dataItem.docUploadTime}
                                                            download={(e) => showLabDocument(dataItem)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    className="col-12 ml-2"
                                    style={{ textShadow: "none", color: "#3e4543" }}
                                >
                                    {isSearch === false && "No Documents"}
                                </div>
                            )}
                        </div>
                        <div style={{ minHeight: '100px' }}>
                            <br />
                            <Pagination size="sm" style={{ float: 'right' }}>
                                {
                                    labDocument.totalPages ?
                                        Array.from(Array(labDocument.totalPages), (e, i) => {
                                            return <Pagination.Item key={i + 1}
                                                active={i + 1 === currentPageNumber ? true : false}
                                                onClick={e => clickPaginationForLab(i + 1)}>
                                                {i + 1}
                                            </Pagination.Item>
                                        })
                                        : <span></span>

                                }
                            </Pagination>
                        </div>
                        {/* <div>
                            {labDocumentUrl !== null || labDocumentUrl !== "" ?
                                <embed src={labDocumentUrl} type="application/pdf" frameBorder="0" height="400px"
                                    width="100%" /> : <span></span>}
                        </div> */}
                    </Tab>
                </Tabs>

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
                            <div className="form-group row">
                                <label htmlFor="topic" className="col-sm-3 col-form-label">
                                    Duration
                                </label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        className="form-control"
                                        onChange={(e) => handlePrescriptionChange(e)}
                                        value={prescriptionResult?.duration}
                                        placeholder="Duration"
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
                                        onChange={(e) => handlePrescriptionChange(e)}
                                        value={prescriptionResult?.decription}
                                        placeholder="Description"
                                        required
                                    ></input>
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
                                            style={{
                                                fontSize: 12,
                                                color: "#ff9393",
                                                margin: "5px 0",
                                            }}
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
                                        <div
                                            style={{ display: "inline-flex", alignItems: "center" }}
                                        >
                                            <IconButton onClick={() => setEditDocument(true)}>
                                                <CancelIcon style={{ color: "red" }} />
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

                            <div className="form-group row">
                                <label
                                    htmlFor="doctorEmail"
                                    className="col-sm-3 col-form-label"
                                >
                                    Doctor Email
                                </label>
                                <div className="col-sm-9">
                                    <input
                                        type="email"
                                        id="doctorEmail"
                                        name="doctorEmail"
                                        className="form-control"
                                        validate="true"
                                        value={doctor?.email}
                                        placeholder="Doctor Email"
                                        onChange={(e) => handleDoctorTag(e.target.value)}
                                    ></input>
                                    {doctor?.id ? (
                                        <span>
                                            Doctor Name:{" "}
                                            <b>
                                                {doctor?.firstName + " " + doctor?.lastName}
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
                                <label
                                    htmlFor="patientEmail"
                                    className="col-sm-3 col-form-label"
                                >
                                    Patient Email
                                </label>
                                <div className="col-sm-9">
                                    <input
                                        type="email"
                                        id="patientEmail"
                                        name="patientEmail"
                                        className="form-control"
                                        value={patient?.email}
                                        placeholder="Patient Email"
                                        readOnly
                                    ></input>
                                    {patient?.id ? (
                                        <span>
                                            Patient Name:{" "}
                                            <b>
                                                {patient?.firstName + " " + patient?.lastName}
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
                                    !doctor?.id || !prescriptionResult?.prescriptionDocument
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
                                    Result Name
                                </label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        id="resultName"
                                        name="resultName"
                                        className="form-control"
                                        onChange={(e) => handleLabResultChange(e)}
                                        value={labResult?.resultName}
                                        placeholder="Result Name"
                                        required
                                        autoComplete="off"
                                    ></input>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="labName" className="col-sm-3 col-form-label">
                                    Result Type
                                </label>
                                <div className="col-sm-9">
                                    <select
                                        name="resultType"
                                        value={labResult?.resultType}
                                        onChange={(e) => handleLabResultChange(e)}
                                        required
                                        className="browser-default custom-select"
                                    >
                                        <option>Select Result Type</option>
                                        <option value="Imaging">Imaging</option>
                                        <option value="Blood Tests">Blood Tests</option>
                                    </select>
                                </div>
                            </div>
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
                                        autoComplete="off"
                                    ></input>
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

                            {/* <div className="form-group row">
                                <label
                                    htmlFor="doctorEmail"
                                    className="col-sm-3 col-form-label"
                                >
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
                                        onChange={(e) => handleDoctorTag(e)}
                                    ></input>
                                    {doctor?.id ? (
                                        <span>
                                            Doctor Name:{" "}
                                            <b>
                                                {doctor?.firstName + " " + doctor?.lastName}
                                                <input
                                                    hidden={true}
                                                    id="doctorId"
                                                    name="doctorId"
                                                    value={doctor?.id}
                                                />
                                            </b>
                                        </span>
                                    ) : (
                                        <span>No Doctor found</span>
                                    )}
                                </div>
                            </div> */}
                            {/* <div className="form-group row">
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
                            </div> */}
                            <div className="form-group row">
                                <label htmlFor="document" className="col-sm-3 col-form-label">
                                    Document
                                </label>
                                <div className="col-sm-9">
                                    {errorMsg && (
                                        <label
                                            style={{
                                                fontSize: 12,
                                                color: "#ff9393",
                                                margin: "5px 0",
                                            }}
                                            className="left"
                                        >
                                            {errorMsg}
                                        </label>
                                    )}
                                    {!labResult?.id && (
                                        <input
                                            style={{ padding: "3px" }}
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
                                    {labResult?.id && !editDocument && (
                                        <div
                                            style={{ display: "inline-flex", alignItems: "center" }}
                                        >
                                            <IconButton onClick={() => setEditDocument(true)}>
                                                <CancelIcon style={{ color: "red" }} />
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
                                                href={labResult?.documentUrl}
                                                download
                                                className="btn btn-primary"
                                            >
                                                Download
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* <div className="form-group row">
                                <label htmlFor="patientEmail" className="col-sm-3 col-form-label">Patient Email</label>
                                <div className="col-sm-9">
                                    <input type="email" id="patientEmail" name="patientEmail" className="form-control"
                                        value={patient?.email}
                                        placeholder="Patient Email" readOnly></input> */}

                            {patient?.id ? (
                                <span>
                                    Patient Name:{" "}
                                    <b>
                                        {patient?.firstName + " " + patient?.lastName}
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
                            {/* </div>
                            </div> */}
                            <div className="container">
                                <div className="row"></div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleUploadLabResultClosed}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>

            {/* <Footer /> */}
        </>
    );
};
export default PatientDocument;
