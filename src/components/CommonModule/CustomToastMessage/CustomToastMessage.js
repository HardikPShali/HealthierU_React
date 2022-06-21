import React from 'react'
import { useHistory } from 'react-router-dom';
import useRole from '../../../custom-hooks/useRole';

const CustomToastMessage = ({ title, body }) => {
    const history = useHistory();
    const role = useRole()

    console.log({ role })

    let roleName;

    roleName = role[0].includes('ROLE_DOCTOR') ? 'doctor' : 'patient'

    // if (role[0].includes('ROLE_DOCTOR')) {
    //     roleName = 'doctor'
    // }
    // else {
    //     roleName = 'patient'
    // }

    console.log({ roleName })

    const chatNotifHandler = () => {
        history.push(`/${roleName}/chat`)
    }

    return (
        <div onClick={() => chatNotifHandler()}>
            <p>{title}</p>
            <p>{body}</p>
        </div>
    )
}

export default CustomToastMessage