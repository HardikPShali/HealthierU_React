import React from 'react'
import './CustomCallToast.css'
import callAccept from '../../../images/svg/call-accept-icon.svg'
import callDecline from '../../../images/svg/cancel-cross.svg'
import { useHistory } from 'react-router'
import useRole from '../../../custom-hooks/useRole'


const CustomCallNotification = ({ onClose }) => {

    const history = useHistory();

    const role = useRole()

    console.log({ role })

    let roleName;

    roleName = role[0].includes('ROLE_DOCTOR') ? 'doctor' : 'patient'

    const onDeclineClickHandler = () => {
        onClose(true);
    }

    const onAcceptClickHandler = () => {
        history.push(`/${roleName}/chat`)   // ?cId=1
    }

    return (
        <div className='call-notification-bar'>
            <div className='caller-name'>CALLER NAME</div>
            <div className='call-actions'>
                {/* <p>Accept Call Button</p>
                <p>Reject Call Button</p> */}
                <div className='call-accept__wrapper' onClick={() => onAcceptClickHandler()}>
                    <img src={callAccept} alt='call-accept-icon' className='call-accept__image' />
                </div>
                <div className='call-decline__wrapper' onClick={() => onDeclineClickHandler()}>
                    <img src={callDecline} alt='call-decline-icon' />
                </div>
            </div>
        </div>
    )
}

export default CustomCallNotification