import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap'; //Container
// import Cookies from 'universal-cookie';
// import Avatar from 'react-avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogContent from '@material-ui/core/DialogContent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
    uploadDoctorDocument,
    getDoctorDocument,
    getDoctorDocumentUrl,
    updateDoctorDocumentStatus,
    deleteDoctorDocument,
    updateDoctorDocument
} from "../../service/frontendapiservices";
import TransparentLoader from "../Loader/transparentloader";
import GetApp from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
// import { getCurrentUserInfo } from '../../service/AccountService';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { pdfjs } from 'react-pdf';
import "./pdf-viewer.css";
import { useHistory } from "react-router";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DoctorDocumentUpload = ({ currentDoctor, isDoctor }) => {

    const [documentData, setDocumentData] = useState([])
    const [documentName, setDocumentName] = useState("");
    const [documentFile, setDocumentFile] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState();
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState();
    const [viewDocument, setViewDocument] = useState(false);
    const [documentError, setDocumentError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const history = useHistory();
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (currentDoctor?.id) {
            loadDoctorDocument(currentDoctor);
        }
    }, [currentDoctor]);

    const loadDoctorDocument = async (doc) => {
        const doctorId = doc.id;
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

    const [uploadOpen, setUploadOpen] = useState(false);

    const handleUploadClose = () => {
        setUploadOpen(false);
        setErrorMsg("");
    }

    const handleUpdateClick = (doc) => {
        setSelectedDocument(doc);
        setUpdateOpen(true);
    }

    const handleUpdateDocnameChange = (e) => {
        setSelectedDocument({ ...selectedDocument, documentName: e.target.value });
    }

    const [updateOpen, setUpdateOpen] = useState(false);

    const handleUpDateClose = () => {
        setSelectedDocument();
        setUpdateOpen(false);
        setErrorMsg("");
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 1000000) {
            setDocumentError("Document must be less than 1mb");
            document.getElementById("uploadForm").reset();
        }
        else if (!file.name.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG|pdf|PDF)$/)) {
            setDocumentError("Document must be PNG, JPG, JPEG or PDF");
            document.getElementById("uploadForm").reset();
        }
        else {
            setDocumentError("");
            setDocumentFile(e.target.files[0]);
        }
    }

    const handleUpload = async (e) => {
        setLoading(true);
        const info = {
            doctorId: currentDoctor.data.id,
            doctor_email: currentDoctor.data.email,
            documentName: documentName
        }
        const files = documentFile;
        const res = await uploadDoctorDocument(files, info).catch(err => {
            setErrorMsg("Something Went Wrong!");
            setLoading(false);
        });
        if (res && res.status === 201) {
            const existingDoc = documentData;
            existingDoc.push(res.data);
            setDocumentData(existingDoc);
            setUploadOpen(false);
            setLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        setLoading(true);
        let info;
        if (!isDoctor) {
            info = {
                id: selectedDocument.id,
                doctorId: selectedDocument.doctorId,
                doctor_email: selectedDocument.doctor_email,
                documentKey: selectedDocument.documentKey,
                documentName: selectedDocument.documentName,
                documentType: selectedDocument.documentType,
                documentStatus: "UNAPPROVED"
            }
        }
        else if (isDoctor) {
            info = {
                id: selectedDocument.id,
                doctorId: selectedDocument.doctorId,
                doctor_email: selectedDocument.doctor_email,
                documentKey: selectedDocument.documentKey,
                documentName: selectedDocument.documentName,
                documentType: selectedDocument.documentType
            }
        }
        const files = documentFile;
        const res = await updateDoctorDocument(files, info).catch(err => {
            setErrorMsg("Something Went Wrong!");
            setLoading(false);
        });
        if (res && res.status === 200) {
            history.go(0);
        }
    }

    const showDocument = async (data) => {
        setLoading(true);
        setSelectedDocument(data);
        const res = await getDoctorDocumentUrl(data);
        if (res && res.status === 200) {
            setSelectedDocumentUrl(res.data);
            setViewDocument(true);
            setLoading(false);
        }
    }

    const handleViewClose = () => {
        setSelectedDocument({});
        setSelectedDocumentUrl("");
        setViewDocument(false);
    }

    const approveDocument = async (doc) => {
        setLoading(true);
        const payloadData = {
            id: doc.id,
            doctorId: doc.doctorId,
            doctor_email: doc.doctor_email,
            documentKey: doc.documentKey,
            documentName: doc.documentName,
            documentType: doc.documentType,
            documentStatus: "APPROVED"
        }

        const res = await updateDoctorDocumentStatus(payloadData);
        if (res && res.status === 200) {
            history.go(0);
        }
    }

    const unapproveDocument = async (doc) => {
        setLoading(true);
        const payloadData = {
            id: doc.id,
            doctorId: doc.doctorId,
            doctor_email: doc.doctor_email,
            documentKey: doc.documentKey,
            documentName: doc.documentName,
            documentType: doc.documentType,
            documentStatus: "UNAPPROVED"
        }

        const res = await updateDoctorDocumentStatus(payloadData);
        if (res && res.status === 200) {
            history.go(0);
        }
    }

    const downloadDocument = async (data) => {
        setLoading(true);
        const res = await getDoctorDocumentUrl(data);
        if (res && res.status === 200) {
            const link = document.createElement("a");
            link.href = res.data;
            link.download = `${data.documentName}.${data.documentType}`;
            document.body.appendChild(link);
            link.click();
            setLoading(false);
        }
    }

    const deleteDocument = async (docId) => {
        setLoading(true);
        const res = await deleteDoctorDocument(docId);
        if (res && res.status === 204) {
            history.go(0);
        }
    }

    return (
        <>
            {/* {loading && (
                <TransparentLoader />
            )} */}
            <Row style={{ alignItems: "center" }}>
                <Col md={6} className="col-xs-6" style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "15px" }}>Total Documents: {documentData?.length}</span>
                </Col>
                <Col md={6} className="col-xs-6" style={{ textAlign: "right" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setUploadOpen(true)}
                        type="button"
                    >
                        Upload Documents
                    </button>
                </Col>
            </Row>
            {isDoctor && (<br />)}
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
                                <td>{doc.documentName}</td>
                                <td>{doc.documentType}</td>
                                <td>
                                    {doc.documentStatus === "APPROVAL_PENDING" ? "Approval Pending"
                                        : doc.documentStatus === "APPROVED" ? "Approved"
                                            : doc.documentStatus === "UNAPPROVED" ? "Unapproved"
                                                : "N/A"}
                                </td>
                                <td>
                                    {isDoctor ? (<>
                                        {doc.documentStatus === "UNAPPROVED" && (<>
                                            <IconButton color="primary" className="mr-2 p-0" onClick={() => handleUpdateClick(doc)}><CreateIcon /></IconButton>
                                        </>)}
                                        <IconButton color="primary" className="mr-2 p-0" data-title="View" onClick={() => showDocument(doc)}><VisibilityIcon /></IconButton>
                                        <IconButton color="primary" className="mr-2 p-0" data-title="Download" onClick={() => downloadDocument(doc)}><GetApp /></IconButton>
                                        {doc.documentStatus === "UNAPPROVED" && (<>
                                            <IconButton color="secondary" className="mr-2 p-0" onClick={() => deleteDocument(doc.id)}><DeleteIcon /></IconButton>
                                        </>)}
                                    </>) : (<>
                                        {doc.documentStatus === "UNAPPROVED" && (<>
                                            <IconButton color="primary" className="mr-2 p-0" onClick={() => handleUpdateClick(doc)}><CreateIcon /></IconButton>
                                        </>)}
                                        <IconButton color="primary" className="mr-2 p-0" data-title="View" onClick={() => showDocument(doc)}><VisibilityIcon /></IconButton>
                                        <IconButton color="primary" className="mr-2 p-0" data-title="Download" onClick={() => downloadDocument(doc)}><GetApp /></IconButton>
                                        {doc.documentStatus === "APPROVAL_PENDING" && (<>
                                            <IconButton className="text-success mr-2 p-0" data-title="Approve" onClick={() => approveDocument(doc)}><CheckCircleIcon /></IconButton>
                                            <IconButton className="text-danger mr-2 p-0" data-title="Unapprove" onClick={() => unapproveDocument(doc)}><CancelIcon /></IconButton>
                                        </>)}
                                        {doc.documentStatus === "APPROVED" && (<>
                                            <IconButton className="text-danger mr-2 p-0" data-title="Unapprove" onClick={() => unapproveDocument(doc)}><CancelIcon /></IconButton>
                                        </>)}
                                        {doc.documentStatus === "UNAPPROVED" && (<>
                                            <IconButton className="text-success mr-2 p-0" data-title="Approve" onClick={() => approveDocument(doc)}><CheckCircleIcon /></IconButton>
                                        </>)}
                                        <IconButton color="secondary" className="mr-2 p-0" data-title="Delete" onClick={() => deleteDocument(doc.id)}><DeleteIcon /></IconButton>
                                    </>)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No document found...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog aria-labelledby="customized-dialog-title" open={uploadOpen}>
                <DialogTitle id="customized-dialog-title">
                    Upload Document
                </DialogTitle>
                <ValidatorForm onSubmit={(e) => console.log(e)} id="uploadForm">
                    <DialogContent dividers>
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Choose Document:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="docFile"
                                    variant="filled"
                                    name="doctorDocumentFile"
                                    type="file"
                                    inputProps={{
                                        required: true,
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                />
                                {documentError && (<span style={{ color: "red", fontSize: "11px" }}>{documentError}</span>)}
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
                        {errorMsg && (<span style={{ color: "red", fontSize: "11px" }}>{errorMsg}</span>)}
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
                            type="button"
                            onClick={(e) => handleUpload(e)}
                        >
                            Upload
                        </button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>

            {/* Edit Document Form */}

            <Dialog aria-labelledby="customized-dialog-title" open={updateOpen}>
                <DialogTitle id="customized-dialog-title">
                    Upload Document
                </DialogTitle>
                <ValidatorForm onSubmit={(e) => console.log(e)} id="uploadForm">
                    <DialogContent dividers>
                        <Row className="align-items-center">
                            <Col md={4}>
                                <b>Choose Document:</b>
                            </Col>
                            <Col md={8}>
                                <TextValidator
                                    id="docFile"
                                    variant="filled"
                                    name="doctorDocumentFile"
                                    type="file"
                                    inputProps={{
                                        required: true,
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                />
                                {/* {console.log("docFile::", documentFile && documentFile.name)} */}
                                {documentError && (<span style={{ color: "red", fontSize: "11px" }}>{documentError}</span>)}
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
                                    value={selectedDocument?.documentName}
                                    onChange={(e) => handleUpdateDocnameChange(e)}
                                />
                            </Col>
                        </Row>

                        {errorMsg && (<span style={{ color: "red", fontSize: "11px" }}>{errorMsg}</span>)}
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={handleUpDateClose}
                            className="btn btn-danger text-light"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary text-light"
                            type="button"
                            onClick={(e) => handleUpdate(e)}
                        >
                            Upload
                        </button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>

            <Dialog aria-labelledby="customized-dialog-title" open={viewDocument} fullWidth={true} maxWidth={"md"} scroll="paper">
                <DialogTitle id="customized-dialog-title">
                    View Document
                </DialogTitle>
                <DialogContent dividers>
                    {(selectedDocument?.documentType === "png" || selectedDocument?.documentType === "jpg" || selectedDocument?.documentType === "jpeg") && (
                        <div className="row">
                            <img alt="" src={selectedDocumentUrl} frameBorder="0" height="100%" width="100%" />
                        </div>
                    )}
                    {selectedDocument?.documentType === "pdf" && (
                        <div className="row">
                            <div className="pdf-viewer">
                                <Document
                                    file={selectedDocumentUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    renderMode="svg"
                                >
                                    <Page pageNumber={pageNumber} />
                                </Document>
                                <br />
                                {numPages && (
                                    <div class="page-controls">
                                        <button
                                            disabled={pageNumber === 1 ? true : false}
                                            type="button"
                                            onClick={() => setPageNumber(pageNumber - 1)}
                                        >‹</button>
                                        <span>{pageNumber} of {numPages}</span>
                                        <button
                                            disabled={pageNumber === numPages ? true : false}
                                            type="button"
                                            onClick={() => setPageNumber(pageNumber + 1)}
                                        >›</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <br />
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={() => handleViewClose()}
                        className="btn btn-danger text-light"
                        type="button"
                    >
                        Cancel
                    </button>
                    {!isDoctor && (<>
                        <button
                            className="btn btn-success text-light"
                            type="button"
                            onClick={() => approveDocument(selectedDocument)}
                        >
                            Approve
                        </button>
                        <button
                            className="btn btn-danger text-light"
                            type="button"
                            onClick={() => unapproveDocument(selectedDocument)}
                        >
                            Unapprove
                        </button>
                    </>)}
                </DialogActions>
            </Dialog>
        </ >
    )
}

export default DoctorDocumentUpload;
