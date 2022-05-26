import React, { useState } from 'react'

export const Input = ({ question }) => {
    const [answer, setAnswer] = useState('');

    const handleChange = (e) => {
        setAnswer(e.target.value);
        question.answer = e.target.value;
    }

    return (
        <div className="form-group row input-div">
            <label
                htmlFor="description"
                className="col-sm-8 col-form-label"
            >
                {question.questionTitle}
            </label>
            <div className="col-sm-8 input-place">
                <input
                    type="text"
                    className="form-control"
                    value={answer}
                    onChange={handleChange}
                    id={question.questionId}
                ></input>
                <span style={{ marginLeft: '20px' }}>Drinks</span>
            </div>
        </div>
    )
}
