import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';

export const getInbox = async () => {
    const payload = generatePayLoad('get', '/api/v2/inbox');
    const result =  await axios(payload);
    return result;
}

export const getMessages = async (channelId, pageNo, size) => {
    const payload = generatePayLoad('get', `/api/v2/messages?channelId=${channelId}&page=${pageNo}&size=${size}`);
    const result =  await axios(payload);
    return result;
}

export const sendMessage = async (data) => {
    const payload = generatePayLoad('post', `/api/v2/send-message`);
    payload.data = data;
    const result =  await axios(payload);
    return result;
}

const generatePayLoad = (method, url) => {
    const payload = {
        method: method,
        url: url,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };

    return payload;
}