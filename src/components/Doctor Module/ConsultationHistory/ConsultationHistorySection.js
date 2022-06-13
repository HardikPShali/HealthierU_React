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
        console.log("res", res.data.data);
        const consultationHistoryArray = [];
        consultationHistoryArray.push(res.data.data)
        notesData.push(res.data.data)
        setNotesData([...notesData, consultationHistoryArray[0]]);
        {
            notesData.map((n) => {
                setNotesData(n)
            })
        }
    }
    useEffect(() => {
        getNotesData();
    }, []);

    return (
        <div className='conhistory__card-box'>
            <h3 className='conhistory--main-header'>Consultation History</h3>
            <div className="conhistory-card-holder">

                <div className='conhistory-card'>
                    {notesData && notesData.map(
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
                    )}
                </div>

            </div>
        </div>
    )
}

export default ConsulatationHistorySection