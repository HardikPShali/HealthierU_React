import React from 'react'

export const Radio = ({ question, choices }) => {
    return (
        <>
            <div className="form-check mb-3 radio-div">
                <label className="form-check-label" >
                    {question}
                </label>
                {
                    choices.map((choice, index) => (
                        <div key={index}>
                            <input type="radio" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">{choice}</label>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
