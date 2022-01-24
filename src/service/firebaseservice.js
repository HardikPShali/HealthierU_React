import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';
import { SERVER_KEY_PROD } from '../util/configurations';
//import { checkAccessToken } from './RefreshTokenService';

export const sendFcmTokenToServer = async (tokenObj) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: tokenObj,
        url: `/api/notification/fcm-token`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return await axios(payload).then(response => {
        // //console.log(response.status);
        if (response.status === 200 || response.status === 201) {
            return true;
        }
        else {
            return false;
        }
    })
    // .catch(error => {
    //     if (error.response && error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })
}

export const __sendPushNotification = async (token, msg) => {
    const data = JSON.stringify({
        "notification": {
            "title": "Appointment Booked!",
            "body": msg,
            "click_action": "https://dev.healthy-u.ae/doctor/appointment",
            "icon": "https://dev.healthy-u.ae/favicon.svg"
        },
        "to": token
    });

    const config = {
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'authorization': `key=${SERVER_KEY_PROD}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    await axios(config)  
        .then((response) => {
            //console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            //console.log(error);
        });
}

export const __getFCMtokenByUserId = async (id) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/notification/fcm-token?id=${id}&plateform=web`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return await axios(payload).then(response => {
        // //console.log(response.status);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        }
    })
}