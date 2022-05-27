import React, { useState } from 'react';

export const Radio = ({ question, followQuestion }) => {
    const [answers, setAnswer] = useState("");

    const handleRadioChange = (e) => {
        setAnswer(e);
        question.answers = e;
        console.log('Event', answers);
        followQuestion();
    }

    return (
        <>
            <div className="form-check mb-3 radio-div">
                <label className="form-check-label col-sm-12 col-form-label">
                    {question.questionTitle}
                </label>

                {question.choices.map((choice, index) => (
                    <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            className="form-check-input"
                            id={question.questionId}
                            value={answers}
                            onChange={() => {
                                handleRadioChange(choice)
                            }}
                            checked={answers === choice}
                        />
                        <label className="form-check-label">{choice}</label>
                    </div>
                ))}
            </div>
        </>
    );
};
