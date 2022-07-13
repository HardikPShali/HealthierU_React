import React from 'react'
import './Questions.css'
import {
    getHealthAssessmentPdf
} from '../../../service/frontendapiservices'
import { useParams } from 'react-router';
const Questions = ({ answers }) => {
    const { id } = useParams();
    const showReport = async () => {
        const url = await getHealthAssessmentPdf(id)
        const link = document.createElement("a");
        link.href = url.data.data;
        link.download = `${url.data.data.message}.$-PDF`;
        document.body.appendChild(link);
        window.open(link, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className='Questions__card-box'>
            <h3 className='Questions--main-header'>Health Assessment Report</h3>
            <div className="Questions-card-holder">
                <div className='Questions-card'>
                    <div className='row' >
                        <div className='col-md-12'>
                            {
                                answers ? (
                                    answers.map((answer, index) => (
                                        <div className='Questions-card__card-details' key={index + 1}>
                                            <h6 className='Questions-card__question-title'>{answer.questionId}. {answer.questionTitle}</h6>
                                            {
                                                answer.answers.map((answer, index) => (
                                                    <h6 className='Questions-card__question-answer' key={index}>{answer}</h6>
                                                ))
                                            }
                                        </div>
                                    ))
                                ) : (

                                    <div
                                        className="col-12 ml-2"
                                        style={{ textShadow: 'none', color: '#3e4543' }}
                                    >
                                        Loading...
                                    </div>

                                )
                            }
                            {
                                answers === null && (
                                    <div>
                                        <h6 className='Questions-card__question-title'>No Data Found</h6>
                                    </div>
                                )
                            }
                            <button
                                className="btn btn-primary view-btn"
                                onClick={() =>
                                    showReport()
                                }
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Questions