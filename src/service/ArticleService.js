import axios from 'axios';
//import { rawListeners } from 'process';
import properties from '../properties';
//import Cookies from 'universal-cookie';
import LocalStorageService from '../util/LocalStorageService';



export const getArticles = async () => {

    var config = {
        method: 'get',
        url: '/api/information-articles',
        // headers: {
        //     //'Access-Control-Allow-Origin': '*',
        //     'Content-Type': 'application/json'
        // }
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}

export const getArticle = async (id) => {

    var config = {
        method: 'get',
        url: '/api/information-articles/' + id,
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}

export const deleteArticle = async (id) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'delete',
        url: '/api/information-articles/' + id,
        headers: headers
    };

    return await axios(config).then(response => {
        return response;
    })

}


export const postArticle = async (data) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    const methodType = data.get('id') ? 'PUT' : 'POST';
    const articleData = {
        "id": data.get('id'),
        "title": data.get('title'),
        "publishTime": new Date().toISOString(),
        "name": data.get('name'),
        "source": data.get('source'),
        "published": data.get('published')
    }

    const articleDescription = data.get('description');
    const formData = new FormData();
    formData.append('articlePicture', data.get('articlePicture'));
    formData.append('articleData', JSON.stringify(articleData));
    formData.append('articleDescription', articleDescription);

    var config = {
        method: methodType,
        url: '/api/information-articles',
        headers: headers,
        data: formData
    };

    return await axios(config).then(response => {
        return response.data;
    })
}