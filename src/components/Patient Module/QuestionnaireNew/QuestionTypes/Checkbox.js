import React, { useState } from 'react';
// import '../Questionnaire.css'

export const Checkbox = ({ question, followQuestion }) => {
    const [answers, setAnswer] = useState([]);

    const handleCheckboxChange = (e) => {

        console.log('Event', e);

        // setAnswer(!answer);
        const index = answers.indexOf(e);
        if (index === -1) {
            setAnswer([...answers, e]);
            question.answers = [...answers, e];

        }
        else {
            setAnswer(answers.filter(item => item !== e));
        }

        followQuestion();
    }

    return (
        <div className="mb-3 form-check checkbox-div">
            <label className="form-check-label col-form-label col-sm-12">
                {question.questionTitle}
            </label>
            {question.choices.map((choice, index) => (
                <div key={index} className="col-sm-12" style={{ marginLeft: '20px' }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={question.questionId}
                        checked={answers.includes(choice)}
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
