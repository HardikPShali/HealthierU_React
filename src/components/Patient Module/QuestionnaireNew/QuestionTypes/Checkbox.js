import React, { useState } from 'react';
// import '../Questionnaire.css'

export const Checkbox = ({ question, followQuestion }) => {
    const [answers, setAnswer] = useState([]);

    const handleCheckboxChange = (e) => {

        console.log('Event', e);

        // setAnswer(!answer);
        const index = answers.indexOf(e);
        if (e === 'None') {
            if (index === -1) {
                setAnswer([e])
                question.answers = [e]
            }
            else {
                setAnswer(answers.filter(item => item !== e));

            }
        }
        else {
            if (answers.indexOf('None') > -1) return;

            if (index === -1) {
                setAnswer([...answers, e]);
                question.answers = [...answers, e];

            }
            else {
                setAnswer(answers.filter(item => item !== e));
            }
        }

        followQuestion();
    }

    return (
        <div className="form-check mb-1 pb-2">
            <label className="form-check-label col-form-label col-sm-12">
                {question.questionTitle}
            </label>
            {question.choices.map((choice, index) => (
                <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={question.questionTitle + index}
                        checked={answers.includes(choice)}
                        onChange={() => handleCheckboxChange(choice)}
                        required='required'
                    />
                    <label htmlFor={question.questionTitle + index} className="form-check-label checkbox-container">
                        {choice}
                    </label>
                </div>
            ))}

        </div>
    );
};
