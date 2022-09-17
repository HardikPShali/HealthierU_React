import React, { useState } from 'react'
import ConsultationHistoryCard from './ConsultationHistoryCard'
import { consultationHistory } from '../../../service/frontendapiservices'
import { useEffect } from 'react'
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom"
import { CardHolder, ConsultationHistoryCardBox, ConsultationHistoryCardView, MainHeader } from './ConsultationHistory.styles.jsx'
import { Col } from 'react-bootstrap'

const ConsulatationHistorySection = () => {
    const cookies = new Cookies();
    let params = useParams()
    const profilepID = cookies.get("profileDetails");
    const [notesData, setNotesData] = useState([])

    const getNotesData = async () => {
        const res = await consultationHistory(params.id, profilepID.id);
        setNotesData(res.data.data)

    }
    useEffect(() => {
        getNotesData();
    }, []);

    return (
        <ConsultationHistoryCardBox>
            <MainHeader>Consultation History</MainHeader>
            <CardHolder>
                <ConsultationHistoryCardView>
                    {notesData.length > 0 ?
                        notesData.map(
                            (q, index) => {
                                return (
                                    <div key={index}>
                                        <ConsultationHistoryCard
                                            appointmentDetails={q.appointment}
                                            chief_complaint={q.chiefComplaint}
                                            present_illness={q.presentIllness}
                                            vital_signs={q.vitalSigns}
                                            physical_exam={q.physicalExam}
                                            plan_assessment={q.planAssessment}
                                        />
                                    </div>
                                )

                            }
                        )
                        :
                        <Col
                            md={12}
                            className="ml-2"
                            style={{ textShadow: 'none', color: '#3e4543' }}
                        >
                            <b>No Consultation Found</b>
                        </Col>
                    }
                </ConsultationHistoryCardView>
            </CardHolder>
        </ConsultationHistoryCardBox>
    )
}

export default ConsulatationHistorySection