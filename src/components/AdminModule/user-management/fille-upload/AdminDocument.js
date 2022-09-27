import "./admin-document.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
// import documentViewImage from "../../../../images/icons used/document icon@2x.png";
import editIcon from "../../../../images/icons used/edit icon_40 pxl.svg";
import deleteIcon from "../../../../images/icons used/delete_icon_40 pxl.svg";
import Navbar from "../../layout/Navbar";
import "mdbreact/dist/css/mdb.css";
import moment from 'moment';
import { formatDate } from "../../../questionnaire/QuestionnaireService";
import {
  validateEmail,
  deleteDocument,
  getDoctorDetail,
  getDocument,
  getDocuments,
  getMedicalDocuments,
  getPatientDetail,
  postDocument,
  postLabDocument,
  getDocumentById,
  postDocumentAddPrescriptionLabResult
} from "../../../../service/DocumentService";
import { saveDefaultPrescription } from "../../../../service/adminbackendservices";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TransparentLoader from "../../../Loader/transparentloader";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton } from "@material-ui/core";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
const AdminDocument = (props) => {
  useEffect(() => {
    loadDocuments();
  }, []);
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [documentId, setDocumentId] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [
    defaultPrescriptionDocument,
    setDefaultPrescriptionDocument,
  ] = useState();
  const [showDelete, setDeleteShow] = useState(false);
  const [showLabResultUpload, setShowLabResultUpload] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [
    showDefaultPrescriptionUpload,
    setShowDefaultPrescriptionUpload,
  ] = useState(false);
  const [prescriptionDocumentUrl, setPrescriptionDocumentUrl] = useState("");
  const [labDocumentUrl, setLabDocumentUrl] = useState("");
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
    prescriptionDocument: "",
  });

  // const { prescriptionDocument } = prescriptionResult

  const [errorMsg, setErrorMsg] = useState("");

  const handleUploadLabResultShow = () => {
    setShowLabResultUpload(true);
    setLabResult(null);
    setDoctor(null);
    setPatient(null);
  };
  const handleDeleteShow = () => setDeleteShow(true);
  const handleDeleteClose = () => setDeleteShow(false);

  const handleUploadLabResultClosed = () => {
    setShowLabResultUpload(false);
    setErrorMsg("");
  };

  const handleUploadPrescriptionClosed = () => {
    setShowPrescriptionUpload(false);
    setErrorMsg("");
  };
  const handleDefaultUploadPrescriptionClosed = () => {
    setShowDefaultPrescriptionUpload(false);
    setErrorMsg("");
  };

  const handleLabResultChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      const fileSize = e.target.files[0].size;
      const maxSize = 10000000;
      if (e.target.files[0].size > maxSize) {
        document.getElementById("labResultDocument").value = "";
        setErrorMsg("Please upload PDF file with size less than 10mb.");
      } else if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG|pdf|PDF)$/)) {
        setErrorMsg("Document must be PNG, JPG, JPEG or PDF");
        document.getElementById("labUploadForm").reset();
      }
      else {
        setErrorMsg("");
        setLabResult({
          ...labResult,
          labResultDocument: e.target.value,
        });
      }
    } else {
      setLabResult({ ...labResult, [e.target.name]: e.target.value });
    }
  };

  const handlePrescriptionChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      const fileSize = e.target.files[0].size;
      const maxSize = 10000000;
      if (e.target.files[0].size > maxSize) {
        document.getElementById("prescriptionDocument").value = "";
        setErrorMsg("Please upload PDF file with size less than 10mb.");
      } else if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG|pdf|PDF)$/)) {
        setErrorMsg("Document must be PNG, JPG, JPEG or PDF");
        document.getElementById("prepUploadForm").reset();
      } else {
        setErrorMsg("");
        setPrescriptionResult({
          ...prescriptionResult,
          prescriptionDocument: e.target.value,
        });
      }
    } else {
      setPrescriptionResult({
        ...prescriptionResult,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDoctorTag = async (e) => {
    if (validateEmail(e.target.value)) {
      setDoctor(null);
      const data = await getDoctorDetail(e.target.value);
      setDoctor(data);
    }
  };

  const handlePatientTag = async (e) => {
    if (validateEmail(e.target.value)) {
      setPatient(null);
      const data = await getPatientDetail(e.target.value);
      setPatient(data);
    }
  };

  const loadDocuments = async () => {
    setLoading(true);
    // GET request using fetch with async/await
    const presecriptionDocument = await getDocuments("Prescription", 0);
    setPresecriptionDocument(presecriptionDocument);
    setLoading(false);
  };

  const handleLabResultSubmission = async (event) => {
    setLoading(true);
    setErrorMsg("");
    event.preventDefault();
    const data = new FormData(event.target);
    const response = await postLabDocument(data).catch((err) => {
      if (err.response.status === 400 || err.response.status === 500) {
        setLoading(false);
        if (err.response.data.message === null) {
          toast.error("Something went wrong! Please try again.")
        }
        else {
          toast.error("Lab result must have patient email")
        }
      }
    });
    if (response) {
      toast.success("Document successfully Uploaded.");
      setShowLabResultUpload(false);
      setLoading(false);
      setErrorMsg("");
    }
    const labDocument = await getDocuments("LabResult", 0);
    setLabDocument(labDocument);
  };

  const handlePrescriptionSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const data = new FormData(event.target);
    const response = await postDocument(data).catch((err) => {
      if (err.response.status === 400 || err.response.status === 500) {
        setLoading(false);
        if (err.response.data.message === null) {
          toast.error("Something went wrong! Please try again.")
        }
        else {
          toast.error("Prescription must have both doctor email and patient email")
        }
      }
    });
    if (response.status === true) {
      toast.success("Document successfully Uploaded.");
      setShowPrescriptionUpload(false);
      setLoading(false);
      setErrorMsg("");
    }
    const prescriptionDocument = await getDocuments("Prescription", 0);
    setPresecriptionDocument(prescriptionDocument);
  };
  const handleDefaultPrescription = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10000000) {
      setErrorMsg("Document must be less than 10mb");
      document.getElementById("uploadForm").reset();
    } else if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG|pdf|PDF)$/)) {
      setErrorMsg("Document must be PNG, JPG, JPEG or PDF");
      document.getElementById("uploadForm").reset();
    } else {
      setErrorMsg("");
      setDefaultPrescriptionDocument(e.target.files[0]);
    }
  };

  const handleDefaultPrescriptionSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData();
    const medicalDocumentInfo = {
      documentType: "Prescription",
      patientId: patient?.id,
      doctorId: doctor?.id,
    };
    formData.append("medicalDocumentInfo", new Blob([JSON.stringify(medicalDocumentInfo)], {
      type: "application/json"
    }));
    const file = defaultPrescriptionDocument;
    formData.append("file", (file))

    const response = await postDocumentAddPrescriptionLabResult(formData).catch((err) => {
      if (err.response.status === 400 || err.response.status === 500) {
        setLoading(false);
        if (err.response.data.message === null) {
          toast.error("Something went wrong! Please try again.")
        }
        else {
          toast.error("Prescription must have both doctor email and patient email")
        }
      }
    });
    if (response.status === true) {
      toast.success("Document successfully Uploaded.");
      setShowDefaultPrescriptionUpload(false);
      setLoading(false);
      setErrorMsg("");
      history.go(0);
    }
    // const prescriptionDocument = await getDocuments("Prescription", 0);
    // setPresecriptionDocument(prescriptionDocument);
  };

  const showDocument = async (val) => {
    // const res = await getDocument(val);
    // console.log("res ::", res);
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
    // console.log(val)
    setLabDocumentUrl(val.documentUrl);
    const link = document.createElement("a");
    link.href = val.documentUrl;
    link.download = `${val.description}.${val.documentType}`;
    document.body.appendChild(link);
    //link.click();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handlePrescriptionUploadShow = () => {
    setShowPrescriptionUpload(true);
    setPrescriptionResult(null);
    setDoctor(null);
    setPatient(null);
  };

  const handleDefaultPrescriptionUploadShow = () => {
    setShowDefaultPrescriptionUpload(true);
    // setPrescriptionResult(null);
    // setDoctor(null);
    // setPatient(null);
  };

  const clickTabEvent = async (event) => {
    setLoading(true);
    let documents;
    if (event === "labResult") {
      documents = await getDocuments("LabResult", 0);
      setLabDocument(documents);
      setLoading(false);
    }

    if (event === "prescription") {
      documents = await getDocuments("Prescription", 0);
      setPresecriptionDocument(documents);
      setLoading(false);
    }
    setPrescriptionDocumentUrl("");
    setLabDocumentUrl("");
    setCurrentPageNumber(1);
  };

  const clickPagination = async (pageNumber) => {
    setCurrentPageNumber(pageNumber);
    setPresecriptionDocument(null);
    const prescriptionDocument = await getDocuments(
      "Prescription",
      pageNumber - 1
    );
    setPresecriptionDocument(prescriptionDocument);
  };

  const clickPaginationForLab = async (pageNumber) => {
    setCurrentPageNumber(pageNumber);

    const documents = await getDocuments("LabResult", pageNumber - 1);
    setLabDocument(documents);
  };

  const handleDeleteModal = (id) => {
    setDocumentId(id);
    setDeleteShow(true);
  };

  const handleEditModal = async (item) => {
    const payload = {
      id: item.id,
      patientId: null,
    };
    const res = await getDocumentById(payload);
    if (res && res.data) {
      if (res.data?.documentUrl !== "") {
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
      if (res.data?.documentUrl !== "") {
        setEditDocument(true);
      } else {
        setEditDocument(false);
      }
      setLabResult(res.data);
      setDoctor(item.doctor);
      setPatient(item.patient);
      setShowLabResultUpload(true);
    }
  };

  const [editDocument, setEditDocument] = useState(false);

  const handleDeleteDocumentSubmission = async (event) => {
    setPrescriptionDocumentUrl("");
    setLabDocumentUrl("");
    setLoading(true)
    const resp = await deleteDocument(documentId);
    if (resp) {
      toast.success("Document successfully Deleted.");
      setDeleteShow(false);
      setLoading(false)
    }
    const prescriptionDocument = await getDocuments("Prescription", 0);
    setPresecriptionDocument(prescriptionDocument);

    const labDocument = await getDocuments("LabResult", 0);
    setLabDocument(labDocument);
  };

  return (
    <div>
      {loading && <TransparentLoader />}
      <Navbar pageTitle="document" />
      <div className="container">
        <br />
        <br />

        <Tabs
          className="justify-content-center"
          defaultActiveKey="prescription"
          id="uncontrolled-tab-example"
          onSelect={clickTabEvent}
        >
          <Tab eventKey="prescription" title="Prescription">
            <br />
            <div className="row">
              {/* <div className="col-md-2 text-left">
                <button
                  type="button"
                  className="btn btn-primary add-button"
                  onClick={(e) => handleDefaultPrescriptionUploadShow()}
                >
                  Add Default Prescription
                </button>
              </div> */}
              <div className="col-md-10"></div>
              <div className="col-md-2 text-right">
                <button
                  type="button"
                  className="btn btn-primary add-button"
                  onClick={(e) => handlePrescriptionUploadShow()}
                >
                  Add Prescription
                </button>
              </div>
            </div>
            <br />
            <div className="row">
              <table className="table table-responsive shadow panelDocument">
                <thead>
                  <tr>
                    <th width="150"><b>Action</b></th>
                    <th width="150"><b>Name</b></th>
                    <th width="150"><b>Date</b></th>
                    {/* <th width="250"><b>Description</b></th> */}
                    {/* <th width="150"><b>Duration</b></th> */}
                    <th width="150"><b>Patient</b></th>
                    <th width="150"><b>Doctor</b></th>
                  </tr>
                </thead>
                <tbody>
                  {presecriptionDocument?.documentsList ? (
                    presecriptionDocument?.documentsList.map(
                      (dataItem, subIndex) => {
                        return (
                          <tr key={dataItem.id}>
                            <td
                              width="150"
                              key="Sr."
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <VisibilityIcon
                                style={{
                                  color: "#4f80e2",
                                }}
                                title="View"
                                width="20"
                                height="20"
                                onClick={(e) => showDocument(dataItem)}
                              />
                              {/* <img
                                width="15"
                                height="15"
                                onClick={() => handleEditModal(dataItem)}
                                src={editIcon}
                                alt=""
                                style={{
                                  marginLeft: "5%",
                                  marginRight: "5%",
                                }}
                              /> */}

                              <img
                                width="15"
                                height="15"
                                onClick={() => handleDeleteModal(dataItem.id)}
                                src={deleteIcon}
                                alt=""
                                style={{
                                  marginLeft: "5%",
                                  marginRight: "5%",
                                }}
                              />
                            </td>
                            <td width="150">{dataItem.name}</td>
                            <td width="150">
                              {moment(dataItem.docUploadTime).format("YYYY-MM-DD HH:mm")}
                            </td>
                            {/* <td width="250">{dataItem.decription}</td> */}
                            {/* <td width="150">{dataItem.duration}</td> */}
                            <td width="150">
                              {dataItem?.patient
                                ? dataItem?.patient?.firstName +
                                " " +
                                (dataItem?.patient?.lastName || "")
                                : ""}
                            </td>
                            <td width="150">
                              {dataItem?.doctor
                                ? dataItem?.doctor?.firstName +
                                " " +
                                (dataItem?.patient?.lastName || "")
                                : ""}
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <Pagination size="sm" style={{ float: "right" }}>
                {presecriptionDocument?.totalPages ? (
                  Array.from(
                    Array(presecriptionDocument.totalPages),
                    (e, i) => {
                      return (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPageNumber ? true : false}
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
            {/* <div className="row">
              <embed
                src={prescriptionDocumentUrl}
                type="application/pdf"
                frameBorder="0"
                height="400px"
                width="100%"
              />
            </div> */}
          </Tab>
          <Tab eventKey="labResult" title="Lab Result" onSelect={clickTabEvent}>
            <br />

            <div className="row">
              <div className="col-md-10"></div>
              <div className="col-md-2 text-right">
                <button
                  type="button"
                  className="btn btn-primary add-button"
                  onClick={handleUploadLabResultShow}
                >
                  Add Lab Result
                </button>
              </div>
            </div>
            <br />
            <div className="row">
              <table className="table table-responsive shadow panelDocument">
                <thead>
                  <tr>
                    <th width="100">
                      <b>Action</b>
                    </th>
                    <th width="150">
                      <b>Name</b>
                    </th>
                    <th width="150">
                      <b>Result Type</b>
                    </th>
                    <th width="150">
                      <b>Lab Name</b>
                    </th>
                    <th width="150">
                      <b>Date</b>
                    </th>
                    {/* <th width="250">
                      <b>Description</b>
                    </th> */}
                    <th width="150">
                      <b>Patient</b>
                    </th>
                    {/* <th width="150">
                      <b>Doctor</b>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {labDocument?.documentsList ? (
                    labDocument.documentsList.map((dataItem, subIndex) => {
                      return (
                        <tr key={dataItem.id}>
                          <td
                            width="150"
                            key="Sr."
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <VisibilityIcon
                              style={{
                                color: "#4f80e2",
                              }}
                              title="View"
                              width="20"
                              height="20"
                              onClick={(e) => showLabDocument(dataItem)}
                            />

                            {/* <img
                              width="15"
                              height="15"
                              onClick={() => handleEditLabModal(dataItem)}
                              src={editIcon}
                              alt=""
                              style={{
                                marginLeft: "5%",
                                marginRight: "5%",
                              }}
                            /> */}

                            <img
                              width="15"
                              height="15"
                              onClick={() => handleDeleteModal(dataItem.id)}
                              src={deleteIcon}
                              alt=""
                              style={{
                                marginLeft: "5%",
                                marginRight: "5%",
                              }}
                            />
                          </td>
                          <td width="150">{dataItem.name}</td>
                          <td width="150">{dataItem.resultType}</td>
                          <td width="150">{dataItem.labName}</td>
                          <td width="150">
                            {moment(dataItem.docUploadTime).format("YYYY-MM-DD HH:mm")}
                          </td>
                          {/* <td width="250">{dataItem.description}</td> */}
                          <td width="150">
                            {dataItem?.patient
                              ? dataItem?.patient?.firstName +
                              " " +
                              (dataItem?.patient?.lastName || "")
                              : ""}
                          </td>
                          {/* <td width="150">
                            {dataItem?.doctor
                              ? dataItem?.doctor?.firstName +
                              " " +
                              (dataItem?.patient?.lastName || "")
                              : ""}
                          </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <Pagination size="sm" style={{ float: "right" }}>
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

            {/* <div className="row">
              {labDocumentUrl !== null || labDocumentUrl !== "" ? (
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
            </div> */}
          </Tab>
        </Tabs>

        <br />
        <br />

        <Modal
          show={showPrescriptionUpload}
          onHide={handleUploadPrescriptionClosed}
        >
          <form onSubmit={(e) => handlePrescriptionSubmission(e)} id="prepUploadForm">
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
              />
              {/* <div className="form-group row">
                <label htmlFor="topic" className="col-sm-3 col-form-label">
                  Duration
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    maxLength="50"
                    id="duration"
                    name="duration"
                    className="form-control"
                    onChange={(e) => handlePrescriptionChange(e)}
                    value={prescriptionResult?.duration}
                    placeholder="Duration"
                    required
                  />
                </div>
              </div> */}
              {/* <div className="form-group row">
                <label htmlFor="decription" className="col-sm-3 col-form-label">
                  Description
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    maxLength="50"
                    id="decription"
                    name="decription"
                    className="form-control"
                    onChange={(e) => handlePrescriptionChange(e)}
                    value={prescriptionResult?.decription}
                    placeholder="Description"
                    required
                  />
                </div>
              </div> */}
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
                      style={{ padding: '3px' }}
                      type="file"
                      id="prescriptionDocument"
                      name="prescriptionDocument"
                      className="form-control"
                      onChange={(e) => handlePrescriptionChange(e)}
                      placeholder="Document"
                      accept="application/pdf"
                      required={prescriptionResult?.id ? false : true}
                    />
                  )}
                  {prescriptionResult?.id && !editDocument && (
                    <div
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <IconButton onClick={() => setEditDocument(true)}>
                        <CancelIcon style={{ color: "red" }} />
                      </IconButton>
                      <input
                        style={{ padding: '3px' }}
                        type="file"
                        id="prescriptionDocument"
                        name="prescriptionDocument"
                        className="form-control"
                        onChange={(e) => handlePrescriptionChange(e)}
                        placeholder="Document"
                        accept="application/pdf"
                        required={prescriptionResult?.id ? false : true}
                      />
                    </div>
                  )}
                  {prescriptionResult?.id && editDocument && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditDocument(false)}
                      >
                        Edit
                      </button>
                      <a
                        href={prescriptionResult?.documentUrl}
                        target="_blank"
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
                    maxLength="50"
                    id="doctorEmail"
                    name="doctorEmail"
                    className="form-control"
                    validate="true"
                    value={doctor?.email}
                    placeholder="Doctor Email"
                    onChange={(e) => handleDoctorTag(e)}
                  />
                  {doctor?.id ? (
                    <span>
                      Doctor Name:{" "}
                      <b>
                        {doctor?.firstName + " " + (doctor?.lastName || "")}
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
                    maxLength="50"
                    id="patientEmail"
                    name="patientEmail"
                    className="form-control"
                    validate="true"
                    value={patient?.email}
                    placeholder="Patient Email"
                    onChange={(e) => handlePatientTag(e)}
                  />
                  {patient?.id ? (
                    <span>
                      Patient Name:{" "}
                      <b>
                        {patient?.firstName + " " + (patient?.lastName || "")}
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
              // disabled={
              // !patient?.id ||
              // !doctor?.id ||
              //!prescriptionResult.prescriptionDocument
              //}
              >
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        <Modal show={showLabResultUpload} onHide={handleUploadLabResultClosed}>
          <form onSubmit={(e) => handleLabResultSubmission(e)} id="labUploadForm">
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
              />
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
                    id="resultType"
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
                    maxLength="50"
                    id="labName"
                    name="labName"
                    className="form-control"
                    onChange={(e) => handleLabResultChange(e)}
                    value={labResult?.labName}
                    placeholder="Lab Name"
                    required
                  />
                </div>
              </div>

              {/* <div className="form-group row">
                <label htmlFor="decription" className="col-sm-3 col-form-label">
                  Description
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    maxLength="50"
                    id="decription"
                    name="decription"
                    className="form-control"
                    onChange={(e) => handleLabResultChange(e)}
                    value={labResult?.decription}
                    placeholder="Description"
                    required
                  />
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
                      style={{ padding: '3px' }}
                      type="file"
                      id="labResultDocument"
                      name="labResultDocument"
                      className="form-control"
                      onChange={(e) => handleLabResultChange(e)}
                      placeholder="Document"
                      accept="application/pdf"
                      required={labResult?.id ? false : true}
                    />
                  )}
                  {labResult?.id && !editDocument && (
                    <div
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <IconButton onClick={() => setEditDocument(true)}>
                        <CancelIcon style={{ color: "red" }} />
                      </IconButton>
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
                      />
                    </div>
                  )}
                  {labResult?.id && editDocument && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
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
                    maxLength="50"
                    id="doctorEmail"
                    name="doctorEmail"
                    className="form-control"
                    validate="true"
                    value={doctor?.email}
                    placeholder="Doctor Email"
                    onChange={(e) => handleDoctorTag(e)}
                  />
                  {doctor?.id ? (
                    <span>
                      Doctor Name:{" "}
                      <b>
                        {doctor?.firstName + " " + (doctor?.lastName || "")}
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
              </div> */}

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
                    maxLength="50"
                    id="patientEmail"
                    name="patientEmail"
                    className="form-control"
                    validate="true"
                    value={patient?.email}
                    placeholder="Patient Email"
                    onChange={(e) => handlePatientTag(e)}
                  />
                  {patient?.id ? (
                    <span>
                      Patient Name:{" "}
                      <b>
                        {patient?.firstName + " " + (patient?.lastName | "")}
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
              // disabled={
              //   !labResult.labResultDocument
              // }
              >
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal
          show={showDefaultPrescriptionUpload}
          onHide={handleDefaultUploadPrescriptionClosed}
        >
          <form
            onSubmit={(e) => handleDefaultPrescriptionSubmission(e)}
            id="uploadForm"
          >
            <Modal.Header closeButton>
              <Modal.Title>Prescription</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                hidden={true}
                id="id"
                name="id"
                value={prescriptionResult?.id}
                onChange={(e) => handleDefaultPrescription(e)}
              />
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
                    maxLength="50"
                    id="doctorEmail"
                    name="doctorEmail"
                    className="form-control"
                    validate="true"
                    value={doctor?.email}
                    placeholder="Doctor Email"
                    onChange={(e) => handleDoctorTag(e)}
                  />
                  {doctor?.id ? (
                    <span>
                      Doctor Name:{" "}
                      <b>
                        {doctor?.firstName + " " + (doctor?.lastName || "")}
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
                    maxLength="50"
                    id="patientEmail"
                    name="patientEmail"
                    className="form-control"
                    validate="true"
                    value={patient?.email}
                    placeholder="Patient Email"
                    onChange={(e) => handlePatientTag(e)}
                  />
                  {patient?.id ? (
                    <span>
                      Patient Name:{" "}
                      <b>
                        {patient?.firstName + " " + (patient?.lastName || "")}
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
                  <input
                    style={{ padding: '3px' }}
                    type="file"
                    id="prescriptionDocument"
                    name="prescriptionDocument"
                    className="form-control"
                    onChange={(e) => handleDefaultPrescription(e)}
                    placeholder="Document"
                    accept="application/pdf"
                    required={prescriptionResult?.id ? false : true}
                  />
                </div>
              </div>
              <div className="container">
                <div className="row"></div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleDefaultUploadPrescriptionClosed}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal show={showDelete} onHide={handleDeleteShow}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to Delete the Document ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteDocumentSubmission()}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default AdminDocument;
