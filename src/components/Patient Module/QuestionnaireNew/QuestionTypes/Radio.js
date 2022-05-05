import React, { useState } from 'react';

export const Radio = ({ question, choices }) => {
    const [selected, setSelected] = useState({});

    return (
        <>
            <div className="form-check mb-3 radio-div">
                <label className="form-check-label col-sm-12 col-form-label">
                    {question}
                </label>

                {choices.map((choice, index) => (
                    <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            className="form-check-input"
                            id={question.id}
                            value={selected}
                            onChange={() => {
                                setSelected(choice);
                            }}
                            checked={selected === choice}
                        />
                        <label className="form-check-label">{choice}</label>
                    </div>
                ))}

                {console.log(selected)}
            </div>
        </>
    );
};
