import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';
import Cookies from 'universal-cookie';

export const checkAccessToken = (isReload=true) => {

    const cookies = new Cookies();

    var bodyFormData = new FormData();
    bodyFormData.append('refresh_token', cookies.get('refresh_token'));
    bodyFormData.append('grant_type', 'refresh_token');
    var config = {
        method: 'post',
        mode: 'no-cors',
        data: bodyFormData,
        url: `/oauth/token?scope=openid`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cache-control': 'no-cache',
            'Authorization': 'Basic d2ViX2FwcDpjaGFuZ2VpdA==',
        }
    }
    return axios(config).then(response => {
        if (response && response.data) {
            LocalStorageService.setToken(response.data);
            if(isReload){
                window.location.reload();
            }
            
        }
    })
}