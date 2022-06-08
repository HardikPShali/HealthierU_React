import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { uploadNote } from "../../../service/frontendapiservices";
import { Button } from "react-bootstrap";
import backIcon from '../../../images/svg/arrow-left.svg';

import './Notes.css'

const Notes = ({ onClose }) => {


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
            // patientId: id,
            // doctorId: currentDoctor.id,
            // appointmentId: patientDetailsList[currentSelectedGroup].appointmentDetails,
        }

        // console.log("Note", note);

        const noteResponse = await uploadNote(note).catch(err => {
            console.log(err);
        })

        console.log(noteResponse);
    }
    return (
        <div className="notes-section">
            <Container>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8} className='notes-column'>
                        <Button
                            variant="primary"
                            onClick={onClose}
                            style={{ borderRadius: '48%', marginBottom: '5px' }}
                        >
                            <img src={backIcon} alt='icon' />
                        </Button>

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
                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default Notes