import React, { useState } from 'react'

export const Input = ({ question, followQuestion, isError }) => {
    const [answers, setAnswer] = useState('');

    const handleChange = (e) => {
        setAnswer(e.target.value);
        question.answers = e.target.value;
        if (e.target.value) {
            question.isError = false;
        }
        followQuestion();
    }

    return (
        <div className={`form-group row mb-1 pb-2 input-div ${isError ? 'error-field' : ''}`}>
            <label
                htmlFor="description"
                className="col-sm-8 col-form-label"
            >
                {question.questionTitle}
            </label>
            <div className="col-sm-8 input-place">
                <input
                    type="number"
                    className="form-control"
                    value={answers}
                    onChange={handleChange}
                    id={question.questionId}
                    required='required'
                ></input>
                {/* <span style={{ marginLeft: '20px' }}>Drinks</span> */}
            </div>
        </div>
    )
}
