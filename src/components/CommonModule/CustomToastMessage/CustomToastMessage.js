import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import useRole from '../../../custom-hooks/useRole';
import { Howl } from 'howler';

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

    let sound;

    const soundNotification = () => {
        sound = new Howl({
            src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
            html5: true
        })
        sound.play()
    }

    // soundNotification()

    const chatNotifHandler = () => {

        history.push(`/${roleName}/chat`)
        sound.pause();
    }

    useEffect(() => {
        // soundNotification()
    }, [sound])

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