import React from 'react'
// import '../Questionnaire.css'

export const Checkbox = ({ question, choices }) => {
    return (
        <div className="mb-3 form-check checkbox-div">
            <label className="form-check-label question-label">{question}</label>
            {
                choices.map((choice, index) => (
                    <div key={index}>
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label checkbox-container" htmlFor="exampleCheck1">{choice}</label>
                    </div>
                ))
            }
        </div>
    )
}
