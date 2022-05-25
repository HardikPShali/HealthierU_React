import React from 'react'
import downlaod from '../../../images/icons used/download.svg'
import download1 from '../../../images/icons used/download1.svg'
import pdf_filetype_icon from '../../../images/icons used/pdf_filetype_icon.svg'
import jpg_filetype_icon from '../../../images/icons used/jpg_filetype_icon.svg'
import moment from "moment";

const PrescriptionLabCard = (props) => {
    let pdf;
    return (
        
            
            <div className="row align-items-start">

                <div className='col-md-3'>
                    <h5 className='prescription-lab-card__common-date1'> <b>{moment(props.date).format("DD")}</b></h5>
                    <span className='prescription-lab-card__common-span1'>{moment(props.time).format("hh:mm A")}</span>

                </div>
                <div className='col-md-3'>

                    {props.filetype === pdf ? <img width={'80px'} height={'80px'} src={pdf_filetype_icon} alt="pdffiletype" className='prescription-lab-card__img-wrapper' />
                        :
                        <img src={jpg_filetype_icon} width={'80px'} height={'80px'} alt="jpgfiletype" className='prescription-lab-card__img-wrapper' />
                    }
                </div>
                <div className='col-md-3'>
                    <h5 className='prescription-lab-card__common-name1'><b>{props.name}</b></h5>
                    <span className='prescription-lab-card__common-span1'><b>APID : </b>{props.apid}</span>

                </div>
                <div style={{ textAlign: "center" }} className='col-md-3'>

                    <button className='prescription-lab-card__download' onClick={(e) => props.download(props.data)}><img width={'30px'} height={'30px'} src={downlaod} /></button>
                </div>

            </div>
      
    )
}

export default PrescriptionLabCard