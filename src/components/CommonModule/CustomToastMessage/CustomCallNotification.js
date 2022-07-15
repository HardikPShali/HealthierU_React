import React, { useEffect, useState } from 'react'
import './CustomCallToast.css'
import callAccept from '../../../images/svg/call-accept-icon.svg'
import callDecline from '../../../images/svg/cancel-cross.svg'
import { useHistory } from 'react-router'
import useRole from '../../../custom-hooks/useRole'
import defaultImage from '../../../images/default_image.png'
import { callRejectApi } from '../../../service/frontendapiservices'


const CustomCallNotification = ({ onAccept, onClose, payload }) => {

    const history = useHistory();
    const role = useRole();
    const [picture, setPicture] = useState("");
    let callerName = payload?.notification?.title;

    useEffect(() => {
        if (payload) {
            let profileImage =
                getRoleName() === "doctor"
                    ? payload?.data?.patientPicture
                    : payload?.data?.doctorPicture;
            setPicture(profileImage);
        }
    }, [payload]);

    const callRejectHandler = async (channelId) => {
        const rejectCallApiResponse = await callRejectApi(channelId).catch(err => console.log({ err }));
        console.log({ rejectCallApiResponse });
    }


    const onDeclineClickHandler = async () => {
        callRejectHandler(payload.data.channelId)
        onClose(true);
    }

    const onAcceptClickHandler = () => {
        onAccept(history, `/${getRoleName()}/chat?channelId=${payload.data.channelId}&openVideo=${true}`)
    }

    const getRoleName = () => {
        return role[0].includes('ROLE_DOCTOR') ? 'doctor' : 'patient'
    }

    return (
        <div className='call-notification-bar'>
            <div className="caller-img-container">
                {
                    picture ? (
                        <img src={picture} alt="profile picture" className="caller-img" />

                    ) : (
                        <img src={defaultImage} alt="profile picture" className="caller-img" />
                    )
                }
            </div>
            <div className='caller-name'>
                <div className='name'>{callerName}</div>
                <div className="call-tag text-small">Incoming Video Call</div>
            </div>
            <div className='call-actions'>
                {/* <p>Accept Call Button</p>
                <p>Reject Call Button</p> */}
                <div className='call-accept__wrapper' onClick={() => onAcceptClickHandler()} title="Accept">
                    <img src={callAccept} alt='call-accept-icon' className='call-accept__image' />
                </div>
                <div className='call-decline__wrapper' onClick={() => onDeclineClickHandler()} title="Reject">
                    <img src={callDecline} alt='call-decline-icon' className='call-decline__icon' />
                </div>
            </div>
        </div>
    )
}

export default CustomCallNotification