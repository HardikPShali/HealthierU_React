//import React from 'react';
import axios from 'axios';
//import {Redirect} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
export const handleGoogleAuth = async (googleUserData, history) => {

    var config = {
        method: 'post',
        mode: 'no-cors',
        data: googleUserData,
        url: '/oauth/google',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const googleResponse = await axios(config).then(response => {
        if (response.status === 201 || response.status === 200) {
            if (response && response.data) {
                return response.data
            }
        }
    }).catch(error => {
        // const history = useHistory();
        // if (error.response && error.response.status === 500) {
        //     history.push('/signupform');
        // } else
        if (error.response && error.response.status === 500 || error.response.data.title === "User role required.") {
            history.push(`/signupform?form-google=${true}`);
        } else if (error.response && error.response.status === 405) {
            history.push('/signupform');
        }

    })
    return googleResponse;
}