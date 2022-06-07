import React from 'react'
import './Questions.css'
const Questions = ({ answers }) => {
    console.log("Questions", answers);
    return (
        <div className='Questions__card-box'>
            <h3 className='Questions--main-header'>Health Assestment Report</h3>
            <div className="Questions-card-holder">
                <div className='Questions-card'>

                    <div className='row' >
                        <div className='col-md-12'>
                            {
                                answers ? (
                                    answers.map((answer, index) => (
                                        <div className='Questions-card__card-details' key={index}>
                                            <h6 className='Questions-card__question-title'>{answer.questionId + 1}. {answer.questionTitle}</h6>
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
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Questions