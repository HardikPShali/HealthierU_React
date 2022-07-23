import React, { useState } from 'react'
import './Questions.css'
import Cookies from 'universal-cookie'
import {
    getHealthAssessmentPdf
} from '../../../service/frontendapiservices'
import { useParams } from 'react-router';
const Questions = ({ answers, enableDownload }) => {
    const { id } = useParams();
    const cookies = new Cookies()
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

                            {answers ? (
                                answers.map((answer, index) => (
                                    (answer.answers.length && answer.answers.every((ans) => ans != undefined && ans != null && ans !== "") && <div className='Questions-card__card-details' key={index + 1}>
                                        <h6 className='Questions-card__question-title'>{index + 1}. {answer.questionTitle}</h6>
                                        {answer.answers.map((answer, index1) => (
                                            (answer && answer !== "" && <h6 className='Questions-card__question-answer' key={index1}>{answer}</h6>)
                                        ))
                                        }
                                    </div>)
                                ))
                            ) : (

                                cookies.get('currentUser').questionCompleted === false ? (
                                    <div
                                        className="col-12 ml-2"
                                        style={{ textShadow: 'none', color: '#3e4543' }}
                                    >
                                        No Data Found
                                    </div>
                                )
                                    : <div
                                        className="col-12 ml-2"
                                        style={{ textShadow: 'none', color: '#3e4543' }}
                                    >
                                        Loading...
                                    </div>
                            )
                            }
                            {enableDownload === true && <button
                                className="btn btn-primary view-btn"
                                onClick={() =>
                                    showReport()
                                }
                            >
                                Download
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Questions