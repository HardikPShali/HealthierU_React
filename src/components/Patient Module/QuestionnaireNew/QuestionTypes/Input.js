import React, { useState } from 'react'

export const Input = ({ question, followQuestion }) => {
    const [answers, setAnswer] = useState('');

    const handleChange = (e) => {
        setAnswer(e.target.value);
        question.answers = e.target.value;
        followQuestion();
    }

    return (
        <div className="form-group row mb-1 pb-2 input-div">
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
                    value={answers}
                    onChange={handleChange}
                    id={question.questionId}
                ></input>
                {/* <span style={{ marginLeft: '20px' }}>Drinks</span> */}
            </div>
        </div>
    )
}
