import React from 'react'
import QuestionsCard from './QuestionsCard'
import './Questions.css'
import dummyQuestions from "./dummyQuestions.json"
const Questions = () => {
    return (
        <div className='Questions__card-box'>
            <h3 className='Questions--main-header'>Health Assestment Report</h3>
            <div className="Questions-card-holder">
                <div className='Questions-card'>
                    {dummyQuestions.length > 0 &&
                        dummyQuestions.map(
                            (q, index) => (
                                <QuestionsCard
                                    index={q.index}
                                    question={q.question}
                                    answer={q.answer}
                                />
                            )
                        )}



                </div>
            </div>
        </div>
    )
}

export default Questions