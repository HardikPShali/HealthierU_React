import React, { useState } from 'react';

export const Radio = ({ question }) => {
    const [answer, setAnswer] = useState({});

    const handleRadioChange = (e) => {
        setAnswer(e);
        question.answer = e;
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
                            value={answer}
                            onChange={() => {
                                handleRadioChange(choice)
                            }}
                            checked={answer === choice}
                        />
                        <label className="form-check-label">{choice}</label>
                    </div>
                ))}
            </div>
        </>
    );
};
