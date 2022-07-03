import React, { useState } from 'react'
import ConsultationHistoryCard from './ConsultationHistoryCard'
import './ConsultationHistory.css'
import dummyConsultationHistory from './dummyConsulatationHistory.json'
import { consultationHistory } from '../../../service/frontendapiservices'
import { useEffect } from 'react'
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom"
const ConsulatationHistorySection = (props) => {
    const cookies = new Cookies();
    let params = useParams()
    const profilepID = cookies.get("profileDetails");
    console.log("profileDetails", profilepID);
    const [notesData, setNotesData] = useState([])

    const getNotesData = async () => {
        const res = await consultationHistory(params.id, profilepID.id);
        setNotesData(res.data.data)
    }
    useEffect(() => {
        getNotesData();
    }, []);

    return (
        <div className='conhistory__card-box'>
            <h3 className='conhistory--main-header'>Consultation History</h3>
            <div className="conhistory-card-holder">
                <div className='conhistory-card'>
                    {notesData.length > 0 ?
                        notesData.map(
                            (q, index) => {
                                return (
                                    <div key={index}>
                                        <ConsultationHistoryCard
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
                        <div
                            className="col-12 ml-2"
                            style={{ textShadow: 'none', color: '#3e4543' }}
                        >
                            <b>No Consultation Found</b>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default ConsulatationHistorySection