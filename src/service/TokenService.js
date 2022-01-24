import axios from 'axios';
import properties from '../properties';

export const getToken = async() => {

    const userName = "web_app";
    const password = "changeit";
    const config = {
        method: 'post',
        url: properties.UAA +'/oauth/token?username=admin&password=admin&grant_type=password&scope=openid',
        headers: {
            'Authorization': 'Basic '+btoa(userName + ':' + password)
        }
    };

    const token = await axios(config).then(response => {

        return response.data;
    })

    return token.access_token;
};
