import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { uploadNote } from "../../../service/frontendapiservices";
import backIcon from '../../../images/svg/close-btn.svg';
import { ToastContainer, toast } from "react-toastify";


import './Notes.css'

const Notes = ({ notes, setNotes, onClose, selectedChatNote }) => {

    console.log({ selectedChatNote })

    const { patientInfo, doctorInfo, latestAppointment } = selectedChatNote;

    const [disableButton, setDisableButton] = useState(false);

    useEffect(() => {
        if (selectedChatNote) {
            setNotes({
                chiefComplaint: '',
                presentIllness: '',
                vitalSigns: '',
                physicalExam: '',
                planAssessment: '',
            })
        }

    }, [selectedChatNote]);


    // const [notes, setNotes] = useState({
    //     chiefComplaint: '',
    //     presentIllness: '',
    //     vitalSigns: '',
    //     physicalExam: '',
    //     planAssessment: '',
    // });

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
        setDisableButton(true);

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
            // setNotes({
            //     chiefComplaint: '',
            //     presentIllness: '',
            //     vitalSigns: '',
            //     physicalExam: '',
            //     planAssessment: '',
            // })
            setDisableButton(false);
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
                                    maxLength={500}
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
                                    maxLength={500}
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
                                    maxLength={500}
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
                                    maxLength={500}
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
                                    maxLength={500}
                                    onChange={(e) => handleInputChange(e)}
                                ></textarea>
                            </div>
                            <input
                                className="btn btn-primary sign-btn"
                                type="submit"
                                value="ADD NOTE"
                                disabled={disableButton}
                                autoFocus={false}
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