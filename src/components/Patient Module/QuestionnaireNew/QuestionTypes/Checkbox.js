import React, { useState } from 'react';
// import '../Questionnaire.css'

export const Checkbox = ({ question }) => {
    const [selected, setSelected] = useState([]);

    const handleCheckboxChange = (e) => {

        console.log('Event', e);

        // setSelected(!selected);
        const index = selected.indexOf(e);
        if (index === -1) {
            setSelected([...selected, e]);
            question.selected = [...selected, e];

        }
        else {
            setSelected(selected.filter(item => item !== e));
        }
    }

    return (
        <div className="mb-3 form-check checkbox-div">
            <label className="form-check-label col-form-label col-sm-12">
                {question.question}
            </label>
            {question.choices.map((choice, index) => (
                <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={question.id}
                        checked={selected.includes(choice)}
                        onChange={() => handleCheckboxChange(choice)}
                    />
                    <label className="form-check-label checkbox-container">
                        {choice}
                    </label>
                </div>
            ))}

        </div>
    );
};
