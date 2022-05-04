import React from 'react'

export const Input = ({ question }) => {
    return (
        <div className="mb-3 input-div">
            <label className="form-label">{question}</label>
            <input type="text" className="form-control" id="exampleInputEmail1" />
        </div>
    )
}
