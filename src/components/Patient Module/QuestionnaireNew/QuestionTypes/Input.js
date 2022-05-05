import React from 'react'

export const Input = ({ question }) => {
    return (
        // <div className="mb-3 input-div">
        //     <label className="form-label col-sm-12">{question}</label>
        //     <input type="text" className="form-control col-sm-12" id="exampleInputEmail1" style={{ marginLeft: '20px' }} />
        // </div>

        <div className="form-group row input-div">
            <label
                htmlFor="description"
                className="col-sm-8 col-form-label"
            >
                {question}
            </label>
            <div className="col-sm-8 input-place">
                <input
                    type="text"
                    className="form-control"
                //placeholder={question.question}
                ></input>
                <span style={{ marginLeft: '20px' }}>Drinks</span>
            </div>
        </div>
    )
}
