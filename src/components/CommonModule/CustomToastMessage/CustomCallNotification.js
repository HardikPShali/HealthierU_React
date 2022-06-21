import React from 'react'
import './CustomCallToast.css'
import callAccept from '../../../images/svg/call-accept-icon.svg'
import callDecline from '../../../images/svg/cancel-cross.svg'


const CustomCallNotification = () => {
    return (
        <div className='call-notification-bar'>
            <div className='caller-name'>CALLER NAME</div>
            <div className='call-actions'>
                {/* <p>Accept Call Button</p>
                <p>Reject Call Button</p> */}
                <div className='call-accept__wrapper'>
                    <img src={callAccept} alt='call-accept-icon' className='call-accept__image' />
                </div>
                <div className='call-decline__wrapper'>
                    <img src={callDecline} alt='call-decline-icon' />
                </div>
            </div>
        </div>
    )
}

export default CustomCallNotification