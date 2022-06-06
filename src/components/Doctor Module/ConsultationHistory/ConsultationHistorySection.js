import React, { useState } from 'react'
import ConsultationHistoryCard from './ConsultationHistoryCard'
import './ConsultationHistory.css'
import dummyConsultationHistory from './dummyConsulatationHistory.json'
import { consulatationHistory } from '../../../service/frontendapiservices'
import { useEffect } from 'react'
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom"
const ConsulatationHistorySection = (props) => {
    const cookies = new Cookies();
    let params = useParams()
    const profilepID = cookies.get("profileDetails");
    console.log("profileDetails", profilepID);
    const [notesData, setNotesData] = useState(null)
    const getNotesData = async () => {
        const res = await consulatationHistory(params.id, profilepID.id);
        setNotesData(res.data);
    }
    useEffect(() => {
        getNotesData();
    }, []);

    return (
        <div className='conhistory__card-box'>
            <h3 className='conhistory--main-header'>Consultation History</h3>
            <div className="conhistory-card-holder">
                <div className='conhistory-card'>
                    {dummyConsultationHistory.length > 0 &&
                        dummyConsultationHistory.map(
                            (q, index) => (
                                <div key={index}>
                                    <ConsultationHistoryCard

                                        date={q.Date}
                                        symptomsData={q['Symptoms Description']}
                                        diagnosisData={q['Diagnosis Description']}
                                    />
                                </div>
                            )
                        )}
                </div>
            </div>
        </div>
    )
}

export default ConsulatationHistorySection