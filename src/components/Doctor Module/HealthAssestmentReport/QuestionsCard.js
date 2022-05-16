import React from 'react'
const Questions = (props) => {
    return (
        <div className='row'>
            <div className='col-md-12'>
                <div className='Questions-card__card-details'>
                    <h6 className='Questions-card__doctor-name'>{props.index}.{props.question}</h6>
                    <h6 className='Questions-card__common-span'>{props.answer}</h6>
                </div>
            </div>
        </div>
    )
}

export default Questions