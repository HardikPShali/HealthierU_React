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
            <div className="form-check mb-1 pb-2">
                <label className="form-check-label col-sm-12 col-form-label">
                    {question.questionTitle}
                </label>

                {question.choices.map((choice, index) => (
                    <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            className="form-check-input"
                            id={question.questionTitle + index}
                            value={answers}
                            onChange={() => {
                                handleRadioChange(choice)
                            }}
                            checked={answers === choice}
                        />
                        <label htmlFor={question.questionTitle + index} className="form-check-label">{choice}</label>
                    </div>
                ))}
            </div>
        </>
    );
};
