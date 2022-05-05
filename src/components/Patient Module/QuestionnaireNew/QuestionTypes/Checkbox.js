import React from 'react'
// import '../Questionnaire.css'

export const Checkbox = ({ question, choices }) => {
    return (
        <div className="mb-3 form-check checkbox-div">
            <label className="form-check-label col-form-label col-sm-12">{question}</label>
            {
                choices.map((choice, index) => (
                    <div key={index} className='col-sm-12' style={{ marginLeft: '20px' }}>
                        <input type="checkbox" className="form-check-input" />
                        <label className="form-check-label checkbox-container">{choice}</label>
                    </div>
                ))
            }
        </div>
    )
}
