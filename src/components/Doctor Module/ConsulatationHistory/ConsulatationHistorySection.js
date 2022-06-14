import React from 'react'
import ConsulatationHistoryCard from './ConsulatationHistoryCard'
import './ConsulatationHistory.css'
import dummyConsulatationHistory from './dummyConsulatationHistory.json'
const ConsulatationHistorySection = () => {


    return (
        <div className='conhistory__card-box'>
            <h3 className='conhistory--main-header'>Consulatation History</h3>
            <div className="conhistory-card-holder">
                <div className='conhistory-card'>
                    {dummyConsulatationHistory.length > 0 &&
                        dummyConsulatationHistory.map(
                            (q, index) => (
                                <div key={index}>
                                    <ConsulatationHistoryCard
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