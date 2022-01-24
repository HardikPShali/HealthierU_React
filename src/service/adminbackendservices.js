import axios from 'axios';
//import properties from '../properties';
import LocalStorageService from '../util/LocalStorageService';
import moment from "moment";


export const getDoctorByUserID = async (user) => {

    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/admin/doctors?userId.equals=` + user.id,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(payload).then(res => {
        if (res && res.data) {
            return res.data;
        }
    })
    return response;
}

export const getPaginatedUserList = async (offset, limit) => {
    var payload = {
        method: 'get',
        url: `/api/users?page=${offset}&size=${limit}&sort=createdDate,desc`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    }
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    })
    return response;
}

export const getPaginatedDoctorList = async (offset, limit) => {
    var payload = {
        method: 'get',
        url: `/api/admin/doctors?page=${offset}&size=${limit}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    }
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    })
    return response;
}

export const getPaginatedPatientList = async (offset, limit) => {
    var payload = {
        method: 'get',
        url: `/api/admin/patients?page=${offset}&size=${limit}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    }
    const response = await axios(payload).then(res => {
        if (res) {
            return res;
        }
    })
    return response;
}

export const approveDoctorByAdmin = async (userData) => {
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: userData,
        url: `/api/account/approve`,
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

export const updateApprovedDoctorRRate = async (formData) => {
    var config = {
        method: 'put',
        mode: 'no-cors',
        data: formData,
        url: '/api/admin/doctors/',
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getUserByUserId = async (apiName, selectedId) => {
    var payload = {
        method: 'get',
        mode: 'no-cors',
        url: `/api/admin/${apiName}?userId.equals=` + selectedId,
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

export const getCountryList = async () => {
    var payload = {
        method: 'get',
        url: `/api/countries`,
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

export const getSpecialityList = async () => {
    var payload = {
        method: 'get',
        url: `/api/specialities/all`,
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

export const getLanguageList = async () => {
    var payload = {
        method: 'get',
        url: `/api/languages`,
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

export const updateRolePatient = async (bodyFormData) => {
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: bodyFormData,
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
/*
PUT 

 @RequestBody UserDTO
*/
export const updateUserData = async (data) => {
    const userDTO = {
        id: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        login: data.login,
        langKey: data.langKey,
        authorities: data.authorities
    }
    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: userDTO,
        url: '/api/users',
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

export const updateRoleDoctor = async (bodyFormData) => {

    var payload = {
        method: 'put',
        mode: 'no-cors',
        data: bodyFormData,
        url: '/api/admin/doctors/',
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

export const getDoctorList = async () => {
    var payload = {
        method: 'get',
        url: `/api/admin/doctors`,
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

export const getPatientList = async () => {
    var payload = {
        method: 'get',
        url: `/api/admin/patients`,
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

export const getWorkoutCategoryList = async () => {
    var payload = {
        method: 'get',
        url: `/api/admin/workout-categories`,
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

export const getWorkoutList = async () => {
    var payload = {
        method: 'get',
        url: `/api/admin/workouts`,
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

export const getWorkoutById = async (id) => {
    var payload = {
        method: 'get',
        url: `/api/admin/workouts/${id}`,
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

export const postWorkout = async (data) => {
    var payload = {
        method: 'post',
        url: `/api/admin/workouts`,
        data: data,
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

export const updateWorkout = async (data) => {
    var payload = {
        method: 'put',
        url: `/api/admin/workouts`,
        data: data,
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
export const changeDoctorStatusOnUserTable = async (data) => {
    var payload = {
        method: 'post',
        url: `/api/account/activate-deactivate`,
        data: data,
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

export const changeDoctorStatusOnDoctorTable = async (data) => {
    var payload = {
        method: 'post',
        url: `/api/doctors/activate-deactivate`,
        data: data,
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

export const getServiceProviders = async () => {
    var payload = {
        method: 'get',
        url: `/api/service-providers`,
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

export const getServiceProviderById = async (id) => {
    var payload = {
        method: 'get',
        url: `/api/service-providers/${id}`,
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

export const saveServiceProvider = async (data) => {
    const newData = {
        'title': data.get('title'),
        'description': data.get('description'),
        'active': data.get('active') === 'true' ? true : false,
        'lat': data.get('lat'),
        'lon': data.get('lon'),
    };

    const formData = new FormData();
    formData.append("serviceProviderData", JSON.stringify(newData));
    const config = {
        method: "post",
        url: '/api/service-providers',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const updateServiceProvider = async (id, data, category) => {
    const newData = {
        'id': parseInt(id),
        'title': data.get('title'),
        'description': data.get('description'),
        'active': data.get('active') === 'true' ? true : false,
        'lat': data.get('lat'),
        'lon': data.get('lon'),
        'categories': category
    };
    const formData = new FormData();
    formData.append("serviceProviderData", JSON.stringify(newData));

    const config = {
        method: "put",
        url: '/api/service-providers',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const deleteServiceProvider = async (id) => {

    const config = {
        method: "delete",
        url: '/api/service-providers/' + id,
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const addContacts = async (id, data) => {
    let method;
    let newData;
    const formId = data.get('id');
    if (formId === "") {
        method = "post";
        newData = {
            'number': data.get('number'),
            'email': data.get('email'),
            "doctorId": null,
            "patientId": null,
            "serviceProviderId": parseInt(id),
            "type": data.get('type')
        };
    }
    else if (formId !== "") {
        method = "put";
        newData = {
            'id': parseInt(data.get('id')),
            'number': data.get('number'),
            'email': data.get('email'),
            "doctorId": null,
            "patientId": null,
            "serviceProviderId": parseInt(id),
            "type": data.get('type')
        };
    }

    const config = {
        method: method,
        url: '/api/contacts',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        },
        data: newData,
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const deleteContact = async (id) => {

    const config = {
        method: "delete",
        url: '/api/contacts/' + id,
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const addLocation = async (id, data) => {
    let method;
    let newData;
    const formId = data.get('id');
    if (formId === "") {
        method = "post";
        newData = {
            'description': data.get('description'),
            'lon': data.get('lon'),
            "serviceProviderId": parseInt(id),
            "lat": data.get('lat')
        };
    }
    else if (formId !== "") {
        method = "put";
        newData = {
            'id': parseInt(data.get('id')),
            'description': data.get('description'),
            'lon': data.get('lon'),
            "serviceProviderId": parseInt(id),
            "lat": data.get('lat')
        };
    }

    const config = {
        method: method,
        url: '/api/addresses',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        },
        data: newData,
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const addOpeningHours = async (id, data) => {
    let method;
    let newData;
    const day = moment(new Date()).format("YYYY-MM-DD");

    const formId = data.id;
    if (formId === "") {
        method = "post";
        newData = {
            'day': data.day,
            'openTime': new Date(day + "T" + data.openTime).toISOString(),
            "serviceProviderId": parseInt(id),
            "closeTime": new Date(day + "T" + data.closeTime).toISOString()
        };
    }
    else if (formId !== "") {
        method = "put";
        newData = {
            'id': parseInt(data.id),
            'day': data.day,
            'openTime': new Date(day + "T" + data.openTime).toISOString(),
            "serviceProviderId": parseInt(id),
            "closeTime": new Date(day + "T" + data.closeTime).toISOString()
        };
    }

    const config = {
        method: method,
        url: '/api/service-provider-hours',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        },
        data: newData,
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const getServiceCategory = async () => {
    var payload = {
        method: 'get',
        url: `/api/service-categories`,
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

export const getServiceCategoryById = async (id) => {
    var payload = {
        method: 'get',
        url: `/api/service-categories/${id}`,
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

export const addServiceCategory = async (data) => {
    let method;
    let newData;
    const formId = data.get("id");
    if (formId === "") {
        method = "post";
        newData = {
            'title': data.get("title"),
            'description': data.get("description")
        };
    }
    else if (formId !== "") {
        method = "put";
        newData = {
            'id': parseInt(data.get("id")),            
            'title': data.get("title"),
            'description': data.get("description")
        };
    }

    const config = {
        method: method,
        url: '/api/service-categories',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        },
        data: newData,
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}

export const deleteServiceCategory = async (id) => {

    const config = {
        method: "delete",
        url: '/api/service-categories/' + id,
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        }
    };

    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

export const saveDefaultPrescription = async (data) => {
    const formData = new FormData();
    formData.append('defaultPrescription',data);
    const config = {
        method: "post",
        url: '/api/medical-prescription-upload',
        headers: {
            'mode': 'no-cors',
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };
    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;

}

// https://dev.healthieru.ae/api/medical-documents/155

