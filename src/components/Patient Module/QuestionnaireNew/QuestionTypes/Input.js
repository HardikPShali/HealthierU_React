import React, { useState } from 'react'

export const Input = ({ question }) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
        question.value = e.target.value;
    }

    return (
        <div className="form-group row input-div">
            <label
                htmlFor="description"
                className="col-sm-8 col-form-label"
            >
                {question.question}
            </label>
            <div className="col-sm-8 input-place">
                <input
                    type="text"
                    className="form-control"
                    value={value}
                    onChange={handleChange}
                ></input>
                <span style={{ marginLeft: '20px' }}>Drinks</span>
            </div>
        </div>
    )
}
