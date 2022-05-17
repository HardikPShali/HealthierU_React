import React from 'react'
const ConsulatationHistoryCard = (props) => {
    return (
        <div className='row'>
            <div className='col-md-12'>
                <div className='conhistory-card__card-details'>
                    <h6 className='conhistory-card__doctor-name'>{props.date}</h6>

                    <h6 className='conhistory-card__common-span'>Symptoms Description:</h6>
                    <ul>
                        {props.symptomsData && props.symptomsData.map((item, index) => (
                            <li className='conhistory-data' key={index}>{item}</li>
                        ))}
                    </ul>
                    <h6 className='conhistory-card__common-span'>Diagnosis Description:</h6>
                    <p className='conhistory-data'>{props.diagnosisData}</p>
                </div>
            </div>
        </div>
    )
}

export default ConsulatationHistoryCard