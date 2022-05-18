import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
// import Footer from './Footer';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from '@material-ui/core/FormControl';
// import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import '../doctor.css';
// import DatePicker from 'react-date-picker';
import Pagination from 'react-bootstrap/Pagination';
// import documentViewImage from '../../images/icons used/document icon@2x.png';
// import editIcon from '../../images/Icons/edit icon_40 pxl.svg';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    formatDate,
    getPatientQuestionnaire,
} from '../../questionnaire/QuestionnaireService';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import {
    getCurrentDoctorInfo,
    getCurrentUserInfo,
    // getPatientInfoByPatientId
} from '../../../service/AccountService';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    getDoctorPatientDocuments,
    getDocument,
    postDocument,
    postLabDocument,
    getDocumentById,
} from '../../../service/DocumentService';
import CancelIcon from '@material-ui/icons/Cancel';
import './PrescriptionLab.css'

const AddPrescription = () => {
    const [prescriptionResult, setPrescriptionResult] = useState({
        prescriptionList: []
    });
    const [date, setDate] = useState({
        DurationStartDate: '',
        DurationEndDate: '',
    });
    const [countOfDays, setcountOfDays] = useState(0);
    const [prescriptionList, setprescriptionList] = useState([{
        // name: '',
        medicineName: '',
        dose: '',
        duration: '',
        quantity: '',
        numberOfDays: '',
        interval: '',
        prescriptionDocument: null,
    }]);
    // const noOfDaysInput = useRef(null);


    // handle input change
    const handleInputChange = (e, index) => {
        // const startDate = moment(DurationStartDate);
        // const endDate = moment(DurationEndDate);
        // const diff = endDate.diff(startDate);
        // const diffDuration = moment.duration(diff);
        // setcountOfDays(diffDuration.days());
        if (e.target.type === 'file') {
            const fileSize = e.target.files[0].size;
            console.log('fileSize ::', fileSize);
            const maxSize = 1000000;
            if (e.target.files[0].size <= maxSize) {
                setErrorMsg('');
                setprescriptionList({
                    ...prescriptionList,
                    prescriptionDocument: e.target.value,
                });
            } else {
                document.getElementById('prescriptionDocument').value = '';
                setErrorMsg('Please upload PDF file with size less than 1mb.');
            }
        } else {
            setprescriptionList({
                ...prescriptionList,
                [e.target.name]: e.target.value,

            });

        }
        const { name, value } = e.target;
        const list = [...prescriptionList];
        list[index][name] = value;
        setprescriptionList(list);
        console.log("prescriptionList", prescriptionList);



    };
    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...prescriptionList];
        list.splice(index, 1);
        setprescriptionList(list);
    };
    // handle click event of the Add button
    const handleAddClick = () => {
        setDate(0);
        setprescriptionList([...prescriptionList, {
            // name: '',
            medicineName: '',
            dose: '',
            duration: null,
            quantity: '',
            numberOfDays: '',
            interval: '',
            prescriptionDocument: null,
        }]);
    };
    const handleUploadPrescriptionClosed = () => setShowPrescriptionUpload(false);
    const [editDocument, setEditDocument] = useState(false);
    const [presecriptionDocument, setPresecriptionDocument] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        documentsList: [],
    });
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);

    // useEffect(() => {

    // }, []);
    const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
    const { DurationStartDate, DurationEndDate } = date;
    const [errorMsg, setErrorMsg] = useState('');

    const handlePrescriptionSubmission = async (event) => {
        event.preventDefault();
        // handleInputChange();
        setErrorMsg('');
        const data = new FormData(event.target);


        // const response = await postDocument(data).catch((err) => {
        //     console.log('Error :: ', err);
        //     if (err.response.status === 400) {
        //         setErrorMsg('Please upload the document in PDF format.');
        //     }
        // });
        // if (response) {
        //     setShowPrescriptionUpload(false);
        // }
        // const prescriptionDocument = await getDoctorPatientDocuments(
        //     'Prescription',
        //     0,
        //     doctor.data.id,
        //     patient.id

        // );

        // setPresecriptionDocument(prescriptionDocument);
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
    return (

        <div>
            <h3 className="prescription-lab--main-header mb-3 mt-2">
                Add Prescription
            </h3>
            <div className="prescription-lab__card-box">
                <div className="card-holder">
                    <div className='row'>

                        {prescriptionList.map((x, i) => {
                            return (
                                <div className="col-md-4 mb-2 mt-2 cursor-pointer">
                                    <div className="prescription-lab-card">
                                        <form onSubmit={(e) => handlePrescriptionSubmission(e)}>


                                            <div>
                                                <input
                                                    hidden={true}
                                                    id="id"
                                                    name="id"
                                                    value={x.id}
                                                    onChange={(e) => handleInputChange(e, i)}
                                                ></input>
                                                <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Medicine
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            id="medicineName"
                                                            name="medicineName"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            value={x.medicineName}
                                                            placeholder="Medicine Name"
                                                            required
                                                            variant="filled"
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Duration
                                                    </label>
                                                    <div className="col-sm-9">
                                                        {/* <TextField
                                                            type="date"
                                                            onChange={(e) =>
                                                                setDate({
                                                                    ...date,
                                                                    // duration : e.target.value,
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
                                                        /> */}
                                                        <input
                                                            type="text"
                                                            id="duration"
                                                            name="duration"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            value={x.duration}
                                                            placeholder="Duration"
                                                            required
                                                            variant="filled"
                                                        ></input>
                                                    </div>
                                                    <br />
                                                    {/* <div style={{ marginTop: '10px', marginLeft: '102px' }} className="col-sm-9">
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
                                                    </div> */}
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Dose
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            id="dose"
                                                            name="dose"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            value={x.dose}
                                                            placeholder="Dose"
                                                            variant="filled"
                                                            required
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Number Of Days
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="number"
                                                            id="numberOfDays"
                                                            name="numberOfDays"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            value={x.numberOfDays}
                                                            inputProps={{
                                                                min: 1,
                                                                // max: 65
                                                            }}
                                                            placeholder="Number Of Days"
                                                        ></input>
                                                    </div>
                                                </div>

                                                {/* <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Quantity
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            id="quantity"
                                                            name="quantity"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            value={x.quantity}
                                                            placeholder="Quantity"
                                                            variant="filled"
                                                            required
                                                        ></input>
                                                    </div>
                                                </div> */}


                                                <div className="form-group row">
                                                    <label htmlFor="topic" className="col-sm-3 prescription-lab-card__common-name">
                                                        Interval
                                                    </label>
                                                    <div className="col-sm-3">
                                                        <FormControl>
                                                            <Select
                                                                style={{ width: '280px' }}
                                                                id="demo-controlled-open-select"
                                                                variant="filled"
                                                                name="interval"
                                                                value={x.interval}
                                                                inputProps={{ required: true }}
                                                                placeholder="interval"
                                                                onChange={(e) => handleInputChange(e, i)}
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
                                                    <label
                                                        htmlFor="prescriptionDocument"
                                                        className="col-sm-3 prescription-lab-card__common-name"
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
                                                        {!prescriptionList?.id && (
                                                            <input
                                                                type="file"
                                                                style={{ padding: '3px' }}
                                                                id="prescriptionDocument"
                                                                name="prescriptionDocument"
                                                                className="form-control"
                                                                onChange={(e) => handleInputChange(e, i)}
                                                                placeholder="Document"
                                                                accept="application/pdf"
                                                                required={prescriptionList?.id ? false : true}
                                                            ></input>
                                                        )}
                                                        {prescriptionList?.id && !editDocument && (
                                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                                <IconButton onClick={() => setEditDocument(true)}>
                                                                    <CancelIcon style={{ color: 'red' }} />
                                                                </IconButton>
                                                                <input
                                                                    type="file"
                                                                    id="prescriptionDocument"
                                                                    name="prescriptionDocument"
                                                                    className="form-control"
                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                    placeholder="Document"
                                                                    accept="application/pdf"
                                                                    required={prescriptionList?.id ? false : true}
                                                                ></input>
                                                            </div>
                                                        )}
                                                        {prescriptionList?.id && editDocument && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary mr-2"
                                                                    onClick={() => setEditDocument(false)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <a
                                                                    href={prescriptionList?.documentUrl}
                                                                    download
                                                                    className="btn btn-primary"
                                                                >
                                                                    Download
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>


                                                <div className="btn-box">
                                                    {prescriptionList.length !== 1 && (
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => handleRemoveClick(i)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}

                                                    {prescriptionList.length - 1 === i && (
                                                        <Button
                                                            className="medicineButton"
                                                            variant="primary"
                                                            onClick={handleAddClick}
                                                        // disabled
                                                        >
                                                            Add Medicine
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>




                                            <br />
                                            <div className="container">
                                                <div className="row"></div>
                                            </div>


                                            <Button style={{ marginLeft: '80%' }}
                                                variant="primary"
                                                type="submit"
                                            // disabled={
                                            //     !prescriptionList ?.prescriptionDocument
                                            // }
                                            >
                                                Save
                                            </Button>

                                        </form>
                                    </div>
                                </div>
                            );
                        })
                        }

                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddPrescription;