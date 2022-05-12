import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';
import { commonUtilFunction } from '../util';

export const updateUserAccount = async (userInfo) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: JSON.stringify(userInfo),
        url: `/api/account`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updateRolePatient = async (bodyFormData) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: bodyFormData,
        url: '/api/mobile/patients',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updateRoleDoctor = async (bodyFormDataDoctor) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: bodyFormDataDoctor,
        url: '/api/mobile/doctors',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getUpdatedUserData = async () => {
    var payload = {
        method: 'get',
        url: `/api/account`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const signupWithEmail = async (userData) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: JSON.stringify(userData),
        url: '/api/mobile/register',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const getLoggedInUserDataByUserId = async (userId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/admin/patients?userId.equals=` + userId,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getAppointmentListByPatientId = async (filter) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: filter,
        url: `/api/appointments/filter`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const deleteAppointment = async (appointmentData) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: appointmentData,
        url: `/api/appointments`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getLikedDoctorByPatientId = async (currentPatient, likedOffset) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/like-logs?type=DOCTOR&patientId.equals=` + currentPatient.id + `&page=${likedOffset}&size=20`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}



export const getDoctorListByPatientId = async (patientId, limit) => {
    var payload = {
        method: 'get',
        url: patientId ? `/api/admin/doctors?patientId=${patientId}&page=0&size=${limit}&sort=id,desc`
            : `/api/admin/doctors?page=0&size=${limit}&sort=id,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getNutritionDoctorList = async (patientId, page, limit) => {
    var payload = {
        method: 'get',
        url: `/api/admin/doctors?page=${page}&size=${limit}&specialitiesId.in=42,33,4&sort=id,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getMoreDoctors = async (currentPatient, limit, offset) => {
    var payload = {
        method: 'get',
        url: currentPatient && currentPatient.id ? `/api/admin/doctors?patientId=${currentPatient.id}&page=${offset}&size=${limit}&sort=id,desc`
            : `/api/admin/doctors?page=${offset}&size=${limit}&sort=id,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getFilteredDoctors = async (URL) => {
    var payload = {
        method: 'get',
        url: URL,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getMoreLikedDoctorByPatientId = async (currentPatient, likedOffset) => {
    var payload = {
        method: 'get',
        url: `/api/like-logs?type=DOCTOR&patientId.equals=${currentPatient.id}&page=${likedOffset}&size=20`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const postLikedDoctor = async (likedData) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: likedData,
        url: `/api/like-logs`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const postUnlikedDoctor = async (likeId) => {
    var payload = {
        method: 'delete',
        mode: 'no-cors',
        url: `/api/like-logs/` + likeId,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getFilteredAppointmentData = async (data) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        //url: `/api/appointments/filter`,
        url: '/api/appointments/active-past?page=0&size=25&sort=startTime,asc',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getInvalidDates = async (data) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments/invalid`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updatePatientData = async (data) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: data,
        url: '/api/admin/patients/',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const handleChangePassword = async (passwordData) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: passwordData,
        url: `/api/account/change-password/`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getDoctorAppointment = async (data) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments/filter`,
        //url: '/api/appointments/active-past?sort=startTime,asc',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getDoctorByUserId = async (userId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/admin/doctors?userId.equals=` + userId,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const createAppointment = async (data) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const deleteAvailableAppointment = async (data) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const deleteBookedAppointment = async (data) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getPatientChiefComplaint = async (patientId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/mobile-questionnaires/?category=Patient&patientid=` + patientId,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getPatientFamilyAndSocialHistoryData = async (patientId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/mobile-questionnaires?patientid=${patientId}&category=Patient`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const loadActivePatient = async (data, activeOffset, limit) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments/active-past?page=${activeOffset}&size=${limit}&sort=startTime,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const loadPastPatient = async (data, pastOffset, limit) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: data,
        url: `/api/appointments/active-past?page=${pastOffset ? pastOffset : '0'}&size=${limit ? limit : '25'}&sort=startTime,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updatePatientTimeZone = async (data) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        url: `/api/patients/timezone?patientId=${data.id}&patientTimeZone=${data.patientTimeZone}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updateDoctorTimeZone = async (data) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        url: `/api/doctors/timezone?doctorId=${data.id}&doctorTimeZone=${data.doctorTimeZone}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getModulesDetailsByIds = (arrayIds, module) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/${module}/profile?${module}Ids=${arrayIds.join()}&page=0&size=${arrayIds.length}&sort=firstName,asc=`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return axios(payload)
}

export const getMyAppointmentListbyModule = (payloadObject) => {
    const data = { endTime: commonUtilFunction.addDaysToDate(30), startTime: new Date().toISOString(), status: "ACCEPTED", ...payloadObject }

    var payload = {
        method: "post",
        mode: "no-cors",
        url: `/api/appointments/filter`,
        data,
        headers: {
            Authorization: "Bearer " + LocalStorageService.getAccessToken(),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    };
    return axios(payload);
};

export const getSearchData = (queryText, offset, limit) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/doctors/quick-search-doctor?page=${offset}&searchKeyword=${queryText}&size=${limit}&sort=firstName%2Casc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return axios(payload)
}


export const uploadDoctorDocument = async (files, info) => {

    var newData = new FormData();
    newData.append(`doctorDocumentFile`, files);
    newData.append("doctorDocumentInfo", JSON.stringify(info));
    console.log("info", info)
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: newData,
        url: `/api/doctor-documents`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updateDoctorDocument = async (files, info) => {

    var newData = new FormData();
    newData.append(`doctorDocumentFile`, files);
    newData.append("doctorDocumentInfo", JSON.stringify(info));

    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: newData,
        url: `/api/doctor-documents`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

// http://localhost:8081/api/doctor-documents?doctorId.equals=5&page=0&size=10&sort=id%2Cdesc

export const getDoctorDocument = async (doctorId) => {

    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/doctor-documents?doctorId.equals=${doctorId}&page=0&size=10&sort=id%2Cdesc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

// https://dev.healthy-u.ae/api/doctor-documents-retrival?docKey=MTYxbnVhbGwxOTUyQHN1cGVycml0by5jb20=.png&email=nuall1952@superrito.com&id=2

export const getDoctorDocumentUrl = async (data) => {

    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/doctor-documents-retrival?docKey=${data.documentKey}&email=${data.doctor_email}&id=${data.id}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const updateDoctorDocumentStatus = async (data) => {
    var newData = new FormData();
    newData.append("doctorDocumentInfo", JSON.stringify(data));
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: newData,
        url: `/api/doctor-documents`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const deleteDoctorDocument = async (docId) => {
    var payload = {
        method: 'delete',
        mode: 'no-cors',
        url: `/api/doctor-documents/${docId}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getServiceProviders = async (categoryId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/service-providers?categoryId.equals=${categoryId}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}


// NEW APIS

export const getAllDoctorsForHomepage = async () => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: '/api/mobile/doctorslist',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}