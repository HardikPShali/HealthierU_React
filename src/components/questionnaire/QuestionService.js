import * as axios from "axios";
//import {getToken} from "../../service/TokenService";
import LocalStorageService from "../../util/LocalStorageService";
import properties from "../../properties";


export const saveQuestion = async (data) => {

    //const url = properties.CORE;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    const methodType =  data.get('id') ? 'PUT' : 'POST';
    let dataObj;
    if(data.get('id')) {
        dataObj = {
            
        }
    }
    const config = {
        method: methodType,
        url: '/api/questions',
        headers: headers,
        data: {
            'id': data.get('id') ? data.get('id') : null,
            'questionnaireId': parseInt(data.get('questionnaireId')),
            'question': data.get('question'),
            'topic': data.get('topic'),
            'subtopic': data.get('subtopic'),
            'questiontype': data.get('questiontype'),
            'topicOrder': parseInt(data.get('topicOrder')),
            'subtopicOrder': parseInt(data.get('subtopicOrder'))
        }
    };

    return await axios(config);

}



export const deleteQuestion = async (questionId) => {

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    const methodType = 'DELETE';
    const config = {
        method: methodType,
        url: '/api/questions/'+questionId,
        headers: headers,
    };

    return await axios(config);

}

