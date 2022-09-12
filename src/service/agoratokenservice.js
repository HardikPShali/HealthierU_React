//import React from 'react';
import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';
import Cookies from 'universal-cookie';
//import { checkAccessToken } from './RefreshTokenService';

export const handleAgoraAccessToken = async (pId, dId, openVideo) => {
    // const channelName = currentGroup.replace(/[^\d.-]/g, '')
    const cookies = new Cookies();
    // const currentUser = cookies.get("currentUser");
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: '/oauth/agora/' + pId + '/' + dId,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
        }
    };
    function setData(response) {
        if (response.status === 201 || response.status === 200) {
            if (response && response.data) {
                cookies.set('agora_access_token', response.data.data.token, { path: '/' });
                cookies.set('channel', response.data.data.channelName, { path: '/' });
                openVideo(response.data.data)
            }
        }
    }
    axios(payload).then(res => {
        setData(res)
    })
    // .catch(error => {
    //     if (error.response && error.response.status === 401) {
    //         checkAccessToken(false).then(_ => {
    //             return axios(payload)
    //         }).then(_rs => {
    //             setData(_rs)
    //         }).catch(_ => {
    //             window.location.reload()
    //         })
    //     }
    // })
}

export const generateRTMToken = async (pID, dID) => {
    const payload = {
        method: 'get',
        mode: 'no-cors',
        url: '/oauth/agora/rtm/' + pID + '/' + dID,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
        }
    };

    return axios(payload);
}