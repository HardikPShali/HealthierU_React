import React from 'react'
const ConsulatationHistoryCard = (props) => {
    // console.log({props})
    return (
        <div className='row'>
            <div className='col-md-12'>
                <div className='conhistory-card__card-details'>
                    {/* <h6 className='conhistory-card__doctor-name'>{props.date}</h6> */}

                    {/* <h6 className='conhistory-card__common-span'>Chief Complaint:</h6> */}
                    {/* <ul>
                        {props.Chief_Complaint && props.Chief_Complaint.map((item, index) => (
                            <li className='conhistory-data' key={index}>{item}</li>
                        ))}
                    </ul> */}
                    <h6 className='conhistory-card__common-span'>Chief Complaint:</h6>
                    <p className='conhistory-data'>{props.chief_complaint}</p>
                    <h6 className='conhistory-card__common-span'>Present Illness:</h6>
                    <p className='conhistory-data'>{props.present_illness}</p>
                    <h6 className='conhistory-card__common-span'>Vital Signs:</h6>
                    <p className='conhistory-data'>{props.vital_signs}</p>
                    <h6 className='conhistory-card__common-span'>Physical Exam:</h6>
                    <p className='conhistory-data'>{props.physical_exam}</p>
                    <h6 className='conhistory-card__common-span'>Plan Assessment:</h6>
                    <p className='conhistory-data'>{props.plan_assessment}</p>
                </div>
            </div>
        </div>
    )
}

export default ConsulatationHistoryCard