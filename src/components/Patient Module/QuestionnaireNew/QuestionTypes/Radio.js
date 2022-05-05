import React, { useState } from 'react';

export const Radio = ({ question }) => {
    const [selected, setSelected] = useState({});

    const handleRadioChange = (e) => {
        setSelected(e);
        question.selected = e;
    }

    return (
        <>
            <div className="form-check mb-3 radio-div">
                <label className="form-check-label col-sm-12 col-form-label">
                    {question.question}
                </label>

                {question.choices.map((choice, index) => (
                    <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            className="form-check-input"
                            id={question.id}
                            value={selected}
                            onChange={() => {
                                handleRadioChange(choice)
                            }}
                            checked={selected === choice}
                        />
                        <label className="form-check-label">{choice}</label>
                    </div>
                ))}
            </div>
        </>
    );
};
