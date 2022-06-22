import React from 'react'
import { useHistory } from 'react-router-dom';
import useRole from '../../../custom-hooks/useRole';

const CustomToastMessage = ({ title, body, payload }) => {
    const history = useHistory();
    const role = useRole()

    let roleName;

    roleName = role[0].includes('ROLE_DOCTOR') ? 'doctor' : 'patient'

    const chatNotifHandler = () => {
        history.push(`/${roleName}/chat?channelId=${payload.data.channelId}`)
    }

    return (
        <div onClick={() => {
            chatNotifHandler()
        }}
        >
            <p>{title}</p>
            <p>{body}</p>
        </div>
    )
}

export default CustomToastMessage