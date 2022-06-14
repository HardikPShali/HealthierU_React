import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { uploadNote } from "../../../service/frontendapiservices";
import backIcon from '../../../images/svg/arrow-left.svg';
import { ToastContainer, toast } from "react-toastify";


import './Notes.css'

const Notes = ({ onClose, selectedChatNote }) => {

    console.log({ selectedChatNote })

    const { patientInfo, doctorInfo, latestAppointment } = selectedChatNote;


    const [notes, setNotes] = useState({
        chiefComplaint: '',
        presentIllness: '',
        vitalSigns: '',
        physicalExam: '',
        planAssessment: '',
    });

    const {
        chiefComplaint,
        presentIllness,
        vitalSigns,
        physicalExam,
        planAssessment,
    } = notes;

    const handleInputChange = (e) => {
        setNotes({ ...notes, [e.target.name]: e.target.value });
    };

    const sendNotesDetails = async (e) => {
        e.preventDefault();
        // console.log(notes);

        // const { currentDoctor, patientDetailsList } = props;
        // console.log(patientDetailsList[currentSelectedGroup]);
        // // console.log(currentDoctor);

        // const appointmentId = patientDetailsList[currentSelectedGroup].appointmentDetails
        // console.log(appointmentId);


        const note = {
            chiefComplaint: notes.chiefComplaint,
            presentIllness: notes.presentIllness,
            vitalSigns: notes.vitalSigns,
            physicalExam: notes.physicalExam,
            planAssessment: notes.planAssessment,
            patientId: patientInfo.id,
            doctorId: doctorInfo.id,
            appointmentId: latestAppointment.id
        }

        // console.log("Note", note);

        const noteResponse = await uploadNote(note).catch(err => {
            console.log(err);
        })

        console.log(noteResponse);
        if (noteResponse.status === 200) {
            toast.success(`Notes Added Successfully`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onClose();
        }

    }
    return (
        <div className="notes-section">
            <Container>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8} className='notes-column'>
                        <button
                            className='btn'
                            variant="primary"
                            onClick={onClose}
                            style={{ borderRadius: '50%', marginBottom: '5px' }}
                        >
                            <img src={backIcon} alt='icon' />
                        </button>

                        <form onSubmit={(e) => sendNotesDetails(e)}>
                            <div className="form-group">
                                <label htmlFor="chief-complaint">Chief Complaint</label>
                                <textarea
                                    className="form-control"
                                    id="chief-complaint"
                                    rows="1"
                                    name='chiefComplaint'
                                    value={chiefComplaint}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="present-illness">Present Illness</label>
                                <textarea
                                    className="form-control"
                                    id="present-illness"
                                    rows="3"
                                    name='presentIllness'
                                    value={presentIllness}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="vital-signs">Vital Signs</label>
                                <textarea
                                    className="form-control"
                                    id="vital-signs"
                                    rows="2"
                                    name='vitalSigns'
                                    value={vitalSigns}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="physical-exam">Physical Exam</label>
                                <textarea
                                    className="form-control"
                                    id="physical-exam"
                                    rows="2"
                                    name='physicalExam'
                                    value={physicalExam}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="plan-assessment">Plan/Assessment</label>
                                <textarea
                                    className="form-control"
                                    id="plan-assessment"
                                    rows="3"
                                    name='planAssessment'
                                    value={planAssessment}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <input
                                className="btn btn-primary sign-btn"
                                type="submit"
                                value="ADD NOTE"
                            />

                        </form>
                        <ToastContainer
                            position="top-right"
                            autoClose={1000}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default Notes