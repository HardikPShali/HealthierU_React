import * as axios from "axios";
import LocalStorageService from "../../util/LocalStorageService";
// import properties from "../../properties";

// import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

export const getPatientQuestionnaire = async (patientId) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/questionnaires?category=Patient&patientid=' + patientId,
        headers: headers,
    };

    return await axios(config).then(response => {
        return response.data;
    })

}

export const getQuestionnaireByCategory = async (category) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/questionnaires?category=' + category,
        headers: headers,
    };

    return await axios(config).then(response => {
        return response.data;
    })

}

export const getQuestionnaires = async () => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/questionnaires',
        headers: headers,
    };

    return await axios(config).then(response => {
        return response.data;
    })

}




export const getAllDocument = async () => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/admin-documents',
        headers: headers,
    };

    //console.log('Yasir ')
    return await axios(config).then(response => {
        return response.data;
    })

}

export const getQuestionnaire = async (questionnaireId) => {

    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken()
    }

    var config = {
        method: 'get',
        url: '/api/questionnaires/' + questionnaireId,
        headers: headers,
    };

    return await axios(config).then(response => {
        return response;
    })

}


export const saveQuestionnaire = async (data) => {


    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json'
    }



    const methodType = 'POST';
    const config = {
        method: methodType,
        url: '/api/questionnaires',
        headers: headers,
        data: {
            'description': data.get('description'),
            'published': data.get('published'),
            'category': data.get('category')
        }
    };

    return axios(config);

}

export const editQuestionnaire = async (id, data) => {


    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json'
    }

    //console.log(data)

    const methodType = 'PUT';
    const config = {
        method: methodType,
        url: '/api/questionnaires',
        headers: headers,
        data: {
            'id': id,
            'description': data.get('description'),
            'category': data.get('category'),
            'published': data.get('published')
        }
    };

    return axios(config);

}


export const deleteQuestionnaire = async (data) => {


    const headers = {
        'mode': 'no-cors',
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json'
    }



    const methodType = 'DELETE';
    const config = {
        method: methodType,
        url: '/api/questionnaires/' + data.id,
        headers: headers
    };

    return axios(config);

}

export const formatDate = (dateTime) => {

    const date = new Date(dateTime);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
}