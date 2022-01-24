import axios from 'axios';
//import properties from '../properties';
import LocalStorageService from '../util/LocalStorageService';

export const getDoctorBySearch = async (keyword) => {

    const payload = {
        method: 'get',
        url: `/api/find-doctors?keyword=${keyword}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const currentSearchResult = await axios(payload);
    return currentSearchResult.data
}

export const getPatientBySearch = async (keyword) => {

    const payload = {
        method: 'get',
        url: `/api/find-patients?keyword=${keyword}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const currentSearchResult = await axios(payload);
    return currentSearchResult.data
}