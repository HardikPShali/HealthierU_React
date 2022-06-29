import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../doctor.css';
import { Container, Row, Col } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import Loader from '../../Loader/Loader';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import Avatar from 'react-avatar';
import SearchBarComponent from '../../CommonModule/SearchAndFilter/SearchBarComponent';
import FilterComponent from '../../CommonModule/SearchAndFilter/FilterComponent';
import {
    getGlobalAppointmentsSearch,
    consultationHistory
} from '../../../service/frontendapiservices';
import rightIcon from '../../../images/svg/right-icon.svg';
import conHistory from '../../../images/icons used/Component 15.svg';
import HealthAssessment from '../../../images/icons used/Component 16.svg';
import calendarSmall from '../../../images/svg/calendar-white.svg';
import timeSmall from '../../../images/svg/time-white.svg';
import chatButtonIcon from '../../../images/svg/chat-button-icon.svg';


const MyPatients = (props) => {

    const [activeAppointments, setActiveAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const cookies = new Cookies();

    const [SelectedPatient, setSelectedPatient] = useState();
    const [currentDoctor, setCurrentDoctor] = useState({
        doctorId: '',
    });
    const { doctorId } = currentDoctor;
    const [age, setAge] = useState(0);


    useEffect(() => {
        // getCurrentDoctor();
        getGlobalAppointments();
    }, []);

    const calculate_age = (dob) => {
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const age = new Date(difference);

        setAge(Math.abs(age.getUTCFullYear() - 1970));
    };

    const handleConsultationClick = (slot, slot1EndTime) => {
        console.log("slot1EndTime", slot1EndTime);
        slot.endTime = slot1EndTime;
        setSelectedPatient(slot);
        // getNotesData(slot.patient.id)
    };


    //NEW DESIGN CODE
    const [search, setSearch] = useState('');
    const [appointmentDets, setAppointmentDets] = useState([]);

    const getGlobalAppointments = async (search, filter = {}) => {
        const currentDoctor = cookies.get('profileDetails');
        setCurrentDoctor({ ...currentDoctor, doctorId: currentDoctor.id });

        // const starttime = new Date().getFullYear();
        // const startTimeFromPrevYear = starttime - 1;
        // console.log({ startTimeFromPrevYear });
        // startTime.setHours(0, 0, 0).toISOString();
        // const endTime = new Date()
        // endTime().setHours(23, 59, 59).toISOString();
        const data = {
            doctorId: currentDoctor.id,
            status: 'ACCEPTED',
            // startTime: startTimeFromPrevYear,
            endTime: new Date(),
            patientName: search,
        };
        if (filter.patientSlot && filter.patientSlot !== '') {
            data.unifiedAppointment = filter.patientSlot;
        }
        if (filter.patientStartTime && filter.patientStartTime !== '') {
            data.startTime = filter.patientStartTime;
        }
        if (filter.patientEndTime && filter.patientEndTime !== '') {
            const endtime = new Date(filter.patientEndTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }
        const responseTwo = await getGlobalAppointmentsSearch(data).catch((err) => {
            if (err.responseTwo.status === 500 || err.responseTwo.status === 504) {
                setLoading(false);
            }
        });
        if (responseTwo.status === 200 || responseTwo.status === 201) {
            if (responseTwo && responseTwo.data) {



                setLoading(false);
                const appointmentDetails = responseTwo.data.data;
                //console.log('appointmentDetails', appointmentDetails);
                const reversedAppointments = appointmentDetails.reverse();
                const updateArray = [];
                reversedAppointments.map((value, index) => {
                    if (value.status === 'ACCEPTED') {
                        if (
                            value.unifiedAppointment ===
                            (reversedAppointments[index + 1] &&
                                reversedAppointments[index + 1].unifiedAppointment)
                        ) {
                            updateArray.push({
                                id: value.id,
                                patientId: value.patientId,
                                doctorId: value.doctorId,
                                doctor: value.doctor,
                                title: `Appointment booked with Dr. ${value?.doctor?.firstName
                                    } with ${value.urgency ? value.urgency : 'no'
                                    } urgency, comments : ${value.remarks ? value.remarks : 'no comments'
                                    }`,
                                startTime: new Date(value.startTime),
                                endTime: new Date(reversedAppointments[index + 1].endTime),
                                remarks: value.remarks,
                                status: value.status,
                                appointmentId: value.appointmentId,
                                unifiedAppointment: value.unifiedAppointment,
                                appointmentMode: value.appointmentMode,
                                patient: value.patient,
                            });
                        } else if (
                            value.unifiedAppointment !==
                            (reversedAppointments[index + 1] &&
                                reversedAppointments[index + 1].unifiedAppointment) &&
                            value.unifiedAppointment ===
                            (responseTwo[index - 1] &&
                                responseTwo[index - 1].unifiedAppointment)
                        ) {
                            return false;
                        } else if (
                            value.unifiedAppointment !==
                            (reversedAppointments[index + 1] &&
                                reversedAppointments[index + 1].unifiedAppointment) &&
                            value.unifiedAppointment !==
                            (reversedAppointments[index - 1] &&
                                reversedAppointments[index - 1].unifiedAppointment)
                        ) {
                            updateArray.push({
                                id: value.id,
                                patientId: value.patientId,
                                doctorId: value.doctorId,
                                doctor: value.doctor,
                                startTime: new Date(value.startTime),
                                endTime: new Date(value.endTime),
                                remarks: value.remarks,
                                status: value.status,
                                appointmentId: value.appointmentId,
                                unifiedAppointment: value.unifiedAppointment,
                                appointmentMode: value.appointmentMode,
                                patient: value.patient,
                            });
                        }
                    }
                });
                console.log('updateArray | My Patient', updateArray);
                setAppointmentDets(updateArray.reverse());
            }
        }
    };

    const handleSearchInputChange = async (searchValue) => {
        //console.log("searchValue :::::::", searchValue);
        if (searchValue === '') {
            console.log('blank searchValue is | in SearchBarComponent', searchValue);
            // loadPatient(currentDoctor.id);
            getGlobalAppointments(searchValue);

            // setSearchText(searchValue);
        } else {
            getGlobalAppointments(searchValue);
            setSearch(searchValue);
            // console.log("searchValue is | in SearchBarComponent", searchValue);
        }
    };

    const handleFilterChange = (filter) => {
        getGlobalAppointments(search, filter);
    };
    const [notesData, setNotesData] = useState([])
    let count = 0;
    const getNotesData = async (id) => {
        const docId = cookies.get("profileDetails")
        const res = await consultationHistory(id, docId.id);
        const consultationHistoryArray = [];
        consultationHistoryArray.push(res.data.data)
        setNotesData(res.data.data[0])
    }

    return (
        <div className="bg-grey">
            {loading && <Loader />}
            <Container>
                <Row>
                    <Col lg={6} md={6} id="col">
                        <div id="patient-col-1">
                            <div id="patient-heading">My Patients</div>
                            <div className="d-flex mt-2 justify-content-between">
                                <SearchBarComponent updatedSearch={handleSearchInputChange} />
                                <FilterComponent updatedFilter={handleFilterChange} />
                            </div>
                            <div id="patient-list">
                                <div className="patient-list__card-box scroller-cardlist">
                                    <div className="patient-list__card-holder">
                                        <div className="row">
                                            {/* MAP HERE */}
                                            {appointmentDets.length !== 0 ? (
                                                appointmentDets.map((details, index) => {
                                                    if (
                                                        details.unifiedAppointment ===
                                                        (activeAppointments[index + 1] &&
                                                            activeAppointments[index + 1].unifiedAppointment)
                                                    ) {
                                                        if (details && details.patient) {
                                                            return (
                                                                <div
                                                                    className="col-md-12 mb-2 mt-2 cursor-pointer"
                                                                    key={index}
                                                                >
                                                                    <h6 style={{ color: '#3e4543', textShadow: 'none', marginLeft: '12px' }}>
                                                                        {moment.utc(details.startTime).format("MMM")}
                                                                    </h6>
                                                                    <div
                                                                        className="patient-list__card-completed"
                                                                        onClick={async () => {
                                                                            handleConsultationClick(
                                                                                details,
                                                                                activeAppointments[index + 1].endTime
                                                                            );
                                                                            //getNotesData(details.patient.id)
                                                                            Object.keys(details.patient).map(
                                                                                (patientData) => {
                                                                                    return calculate_age(
                                                                                        details.patient.dateOfBirth &&
                                                                                        details.patient.dateOfBirth

                                                                                    );
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        <div className="row align-items-start py-1">
                                                                            <div className="col-md-2  d-flex flex-column mt-3 ml-3">
                                                                                <h5 className="patient-list__common-date">
                                                                                    <b>
                                                                                        {moment(details.startTime).format(
                                                                                            'DD'
                                                                                        )}
                                                                                    </b>
                                                                                </h5>
                                                                                <span className="patient-list__common-span">
                                                                                    {moment(details.startTime).format(
                                                                                        'hh:mm A'
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-md-3  ml-3 mt-2 pb-2">
                                                                                {details.patient.picture ? (
                                                                                    <img
                                                                                        src={details.patient.picture}
                                                                                        alt="profile"
                                                                                        className="patient-list__img-circle "
                                                                                    />
                                                                                ) : (
                                                                                    <Avatar
                                                                                        round={true}
                                                                                        name={
                                                                                            details.patient.firstName +
                                                                                            ' ' +
                                                                                            (details.patient.lastName || "")
                                                                                        }
                                                                                        size={60}
                                                                                        className="my-appointment-avatar"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="col-md-7  d-flex flex-column mt-3">
                                                                                <h5 className="patient-list__common-name">
                                                                                    <>
                                                                                        {details.patient.firstName +
                                                                                            ' ' +
                                                                                            (details.patient.lastName || "")}
                                                                                    </>
                                                                                </h5>
                                                                                <span className="patient-list__common-span-consult">
                                                                                    {details.appointmentMode}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    } else if (
                                                        details.unifiedAppointment !==
                                                        (activeAppointments[index + 1] &&
                                                            activeAppointments[index + 1]
                                                                .unifiedAppointment) &&
                                                        details.unifiedAppointment ===
                                                        (activeAppointments[index - 1] &&
                                                            activeAppointments[index - 1]
                                                                .unifiedAppointment)
                                                    ) {
                                                        if (details && details.patient) {
                                                            return false;
                                                        }
                                                    } else if (
                                                        details.unifiedAppointment !==
                                                        (activeAppointments[index + 1] &&
                                                            activeAppointments[index + 1]
                                                                .unifiedAppointment) &&
                                                        details.unifiedAppointment !==
                                                        (activeAppointments[index - 1] &&
                                                            activeAppointments[index - 1]
                                                                .unifiedAppointment)
                                                    ) {
                                                        if (details && details.patient) {
                                                            return (
                                                                <div
                                                                    className="col-md-12 mb-2 mt-2 cursor-pointer"
                                                                    key={index}
                                                                >
                                                                    <h6 style={{ color: '#3e4543', textShadow: 'none', marginLeft: '12px' }}>
                                                                        {moment.utc(details.startTime).format("MMM")}
                                                                    </h6>
                                                                    <div
                                                                        className="patient-list__card-completed"
                                                                        onClick={async () => {
                                                                            setSelectedPatient(details);
                                                                            getNotesData(details.patient.id);
                                                                            Object.keys(details.patient).map(
                                                                                (patientData) => {
                                                                                    return calculate_age(
                                                                                        details.patient.dateOfBirth &&
                                                                                        details.patient.dateOfBirth, details.patient
                                                                                    );

                                                                                }
                                                                            );


                                                                        }}
                                                                    >
                                                                        <div className="row align-items-start py-1">
                                                                            <div className="patient-list_common-date-wrap col-md-3 col-lg-3 col-xl-3 d-flex flex-column">
                                                                                <h5 className="patient-list__common-date">
                                                                                    <b>
                                                                                        {moment(details.startTime).format(
                                                                                            'DD'
                                                                                        )}
                                                                                    </b>
                                                                                </h5>
                                                                                <span className="patient-list__common-span">
                                                                                    {moment(details.startTime).format(
                                                                                        'hh:mm A'
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <div className="patient-list_common-pic-wrap col-md-3 col-lg-3 col-xl-3">
                                                                                {details.patient.picture ? (
                                                                                    <img
                                                                                        src={details.patient.picture}
                                                                                        alt="profile"
                                                                                        className="patient-list__img-circle "
                                                                                    />
                                                                                ) : (
                                                                                    <Avatar
                                                                                        round={true}
                                                                                        name={
                                                                                            details.patient.firstName +
                                                                                            ' ' +
                                                                                            (details.patient.lastName || "")
                                                                                        }
                                                                                        size={60}
                                                                                        className="my-appointment-avatar"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="patient-list_common-name-wrap col-md-6 col-lg-6 col-xl-6 d-flex flex-column">
                                                                                <h5 className="patient-list__common-name">
                                                                                    <>
                                                                                        {details.patient.firstName +
                                                                                            ' ' +
                                                                                            (details.patient.lastName || "")}
                                                                                    </>
                                                                                </h5>
                                                                                <span className="patient-list__common-span-consult">
                                                                                    {details.appointmentMode}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                })
                                            ) : (
                                                <div
                                                    className="col-12 ml-2"
                                                    style={{ textShadow: 'none', color: '#3e4543', }}
                                                >
                                                    No Patients Found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/doctor/appointment">
                            <button className="btn btn-primary calendar-btn">
                                My Calendar
                            </button>
                        </Link>
                    </Col>
                    <Col lg={6} md={6} id="col">
                        {dataLoading && (
                            <>
                                <div
                                    id="request-box"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <p className="text-center">Loading ...</p>
                                </div>
                            </>
                        )}
                        {!dataLoading && (
                            <>
                                {SelectedPatient ? (
                                    <>
                                        <div id="request-box">
                                            <div id="appointment-request">
                                                <Row>
                                                    <Col xs={8}>
                                                        <div id="req-name">
                                                            <b style={{ fontSize: '16px' }}>
                                                                APID : {SelectedPatient.id} |{' '}
                                                                {SelectedPatient.appointmentMode}
                                                            </b>
                                                        </div>
                                                    </Col>
                                                    <Col xs={4} className="text-right">
                                                        <button
                                                            className={
                                                                'btn btn-primary ' + SelectedPatient.urgency
                                                            }
                                                        >
                                                            {SelectedPatient.urgency}
                                                        </button>
                                                        <br />
                                                        <br />
                                                    </Col>
                                                </Row>
                                                <Row style={{ alignItems: 'center' }}>
                                                    <Col xs={4}>
                                                        {SelectedPatient &&
                                                            SelectedPatient.patient &&
                                                            (SelectedPatient.patient.picture ? (
                                                                <div
                                                                    className="img-box"
                                                                    style={{
                                                                        background: `url(${SelectedPatient.patient.picture})`,
                                                                    }}
                                                                >
                                                                    {/*<img src={SelectedPatient.patient.picture} alt="" style={{ width: "auto", height: 214, borderRadius: 10 }} />*/}
                                                                </div>
                                                            ) : (
                                                                <Avatar
                                                                    name={
                                                                        SelectedPatient.patient.firstName +
                                                                        ' ' +
                                                                        (SelectedPatient.patient.lastName || "")
                                                                    }
                                                                    size="113"
                                                                    className="my-patient-avatar"
                                                                />
                                                            ))}
                                                    </Col>
                                                    <Col xs={8} style={{ textAlign: 'center' }}>
                                                        <b>
                                                            <p className="pclass">Last Appointment</p>
                                                        </b>
                                                        <div className="my-patient-card__card-details--date-div">
                                                            <div className="my-patient-card__card-time-row">
                                                                <img src={calendarSmall} />
                                                                <span className="my-patient-card__common-span">
                                                                    {moment(SelectedPatient.startTime).format(
                                                                        'DD/MM/YY'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="my-patient-card__card-time-row ml-4">
                                                                <img src={timeSmall} />
                                                                <span className="my-patient-card__common-span">
                                                                    {moment(SelectedPatient.startTime).format(
                                                                        'hh:mm A'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row style={{ alignItems: 'center', marginTop: '5px' }}>
                                                    <Col xs={4} style={{ textAlign: 'center' }}>
                                                        <div id="req-name">
                                                            <b>
                                                                {SelectedPatient &&
                                                                    SelectedPatient.patient &&
                                                                    SelectedPatient.patient.firstName +
                                                                    ' ' +
                                                                    (SelectedPatient.patient.lastName || "")}
                                                            </b>
                                                            <br />
                                                            {age} Years Old
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div id="req-info" className="my-patients__view scroller-cardlist">
                                                <div className="consultation-history-display">
                                                    {notesData ?
                                                        <div className="diagnosis-description">
                                                            <Row>
                                                                <Col md={6}>
                                                                    <p><b>Chief Complaint</b></p>
                                                                    <p className='diagnosis-desc__p-tag'>
                                                                        {notesData.chiefComplaint}
                                                                    </p>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <p><b>Present Illness</b></p>
                                                                    <p className='diagnosis-desc__p-tag'>
                                                                        {notesData.presentIllness}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4}>
                                                                    <p><b>Vital Signs</b></p>
                                                                    <p className='diagnosis-desc__p-tag'>
                                                                        {notesData.vitalSigns}
                                                                    </p>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <p><b>Physical Exam</b></p>
                                                                    <p className='diagnosis-desc__p-tag'>
                                                                        {notesData.physicalExam}
                                                                    </p>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <p><b>Plan Assessment</b></p>
                                                                    <p className='diagnosis-desc__p-tag'>
                                                                        {notesData.planAssessment}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        :
                                                        <div
                                                            className="col-12 ml-2"
                                                            style={{ textShadow: 'none', color: '#3e4543' }}
                                                        >
                                                            <b>No Consultation Found</b>
                                                        </div>
                                                    }
                                                </div>
                                                <br />
                                                <Link to={{ pathname: `/doctor/consultationhistory/${SelectedPatient.patientId}` }}>
                                                    <div style={{ display: 'flex', alignItem: 'center' }}>
                                                        <div style={{ width: '100%' }}>
                                                            <img
                                                                width="40"
                                                                height="40"
                                                                fontWeight="300"
                                                                src={conHistory}
                                                                alt=""
                                                                style={{ marginLeft: '5%', marginRight: '5%' }}
                                                            />
                                                            Consultation History
                                                        </div>
                                                        <img
                                                            src={rightIcon}
                                                            alt="right-icon"
                                                            style={{ marginRight: '35px' }}
                                                        />
                                                    </div>
                                                </Link>

                                                <Link
                                                    to={{
                                                        pathname: `/doctor/healthassesment-report/${SelectedPatient.patientId}`,
                                                        state: SelectedPatient.patient,
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItem: 'center' }}>
                                                        <div style={{ width: '100%' }}>
                                                            <img
                                                                width="40"
                                                                height="40"
                                                                src={HealthAssessment}
                                                                alt=""
                                                                style={{ marginLeft: '5%', marginRight: '5%' }}
                                                            />
                                                            Health Assessment Report
                                                        </div>
                                                        <img
                                                            src={rightIcon}
                                                            alt="right-icon"
                                                            style={{ marginRight: '35px' }}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                            <Row>
                                                <Col className="profile-btn">
                                                    <Link
                                                        to={`/doctor/chat?chatgroup=P${SelectedPatient?.patient?.id}_D${doctorId}`}
                                                        title="Chat"
                                                    >
                                                        <button className="btn btn-primary view-btn">
                                                            <img
                                                                src={chatButtonIcon}
                                                                alt="chat-button-icon"
                                                                style={{ marginRight: 10, marginLeft: -10 }}
                                                            />
                                                            Chat
                                                        </button>

                                                    </Link>
                                                </Col>
                                            </Row>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            id="request-box"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <p className="text-center">
                                                No Patient Datacard Selected ...
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyPatients;
