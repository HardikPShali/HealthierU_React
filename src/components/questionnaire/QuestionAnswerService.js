import * as axios from "axios";
//import { getToken } from "../../service/TokenService";
import LocalStorageService from "../../util/LocalStorageService";
// import properties from "../../properties";

async function saveQuestionAnswer(data) {

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    const methodType = data.id ? 'PUT' : 'POST';
    const config = {
        method: methodType,
        url: '/api/question-answers',
        headers: headers,
        data: data
    };

    return await axios(config).then(response => {
        if (document.getElementById(data.questionId)) {
            document.getElementById(data.questionId).name = response.data.id;
            return response.data;
        }
    })

}

export { saveQuestionAnswer }


async function getQuestionAnswerPatient(patientId) {

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }


    const body = {
        "patientId": patientId
    }

    const config = {
        method: 'POST',
        url: '/api/question-answers/filter',
        headers: headers,
        data: JSON.stringify(body)
    };

    return await axios(config).then(response => {
        return response.data;
    })

}

export { getQuestionAnswerPatient }
