import React from 'react'
import downlaod from '../../../images/icons used/download.svg'
import pdf_filetype_icon from '../../../images/icons used/pdf_filetype_icon.svg'
import jpg_filetype_icon from '../../../images/icons used/jpg_filetype_icon.svg'
import moment from "moment";

const PrescriptionLabCard = (props) => {
    let pdf;
    return (
        <div className="row align-items-start">
            <div className='col-md-3'>
                <h5 className='prescription-lab-card__common-name'> <b>{moment(props.date).format("DD")}</b></h5>
                <span className='prescription-lab-card__common-span'>{moment(props.time).format("hh:mm A")}</span>

            </div>
            <div className='col-md-3'>

                {props.filetype === pdf ? <img width={'80px'} height={'80px'} src={pdf_filetype_icon} alt="pdffiletype" className='img-fluid' />
                    :
                    <img src={jpg_filetype_icon} width={'80px'} height={'80px'} alt="jpgfiletype" className='img-fluid' />
                }
            </div>
            <div className='col-md-3'>
                <h5 className='prescription-lab-card__filename'><b>{props.name}</b></h5>
                <span className='prescription-lab-card__common-span'>{props.apid}</span>

            </div>
            <div className='col-md-3'>

                <button className='prescription-lab-card__download' onClick={(e) => props.download(props.data)}><img src={downlaod} /></button>
            </div>
            {/* 
            <div className='col-md-8'>
                <div className='prescription-lab-card__card-details'>
                    <div className='prescription-lab-card__card-details--date-div'>
                        <h5 className='prescription-lab-card__common-name'> <b>{moment(props.date).format("DD")}</b></h5>
                        <span className='prescription-lab-card__common-span'>{moment(props.time).format("hh:mm A")}</span>
                        <h5 className='prescription-lab-card__filename'>{props.name}</h5>
                        <span className='prescription-lab-card__common-span'>{props.apid}</span>
                    </div>





                </div>
            </div>
            <div className='col-md-3'>
                <div className='prescription-lab-card__img-wrapper'>
                    {props.filetype == props.pdf ? <img width={'80px'} height={'80px'} src={pdf_filetype_icon} alt="pdffiletype" className='img-fluid' />
                        :
                        <img src={jpg_filetype_icon} width={'80px'} height={'80px'} alt="jpgfiletype" className='img-fluid' />
                    }

                </div>

            </div>
            <div className='col-md-1'>
                <button className='prescription-lab-card__common-span' onClick={() => props.downlaod(props.data)}><img src={downlaod} /></button>
            </div> */}
        </div>
    )
}

export default PrescriptionLabCard