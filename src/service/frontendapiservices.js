import axios from "axios";
import LocalStorageService from "../util/LocalStorageService";
import { commonUtilFunction } from "../util";

export const updateUserAccount = async (userInfo) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: JSON.stringify(userInfo),
    url: `/api/account`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updateRolePatient = async (bodyFormData) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: bodyFormData,
    url: "/api/mobile/patients",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updateRoleDoctor = async (bodyFormDataDoctor) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: bodyFormDataDoctor,
    url: "/api/mobile/doctors",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getUpdatedUserData = async () => {
  var payload = {
    method: "get",
    url: `/api/account`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const rescheduleAppointmentDoctor = async (data) => {
  var payload = {
    method: "post",
    data: data,
    url: `/api/v2/appointment/doctor/reschedule`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const rescheduleAppointmentPatient = async (data) => {
  var payload = {
    method: "post",
    data: data,
    url: `/api/v2/appointment/patient/reschedule`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const getAvailableSlots = async (type) => {
  var payload = {
    method: "post",
    url: `/api/v2/appointments/availableslots?type=${type}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const consultationHistory = async (patientId, doctorId) => {
  var payload = {
    method: "get",
    url: `/api/v2/notes/?patientId=${patientId}&doctorId=${doctorId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const setNextAppointmentDoctor = async (data) => {
  var payload = {
    method: "put",
    data: data,
    url: `/api/v2/next/appointment`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const signupWithEmail = async (userData) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: JSON.stringify(userData),
    url: "/api/mobile/register",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getLoggedInUserDataByUserId = async (userId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/admin/patients?userId.equals=` + userId,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getAppointmentListByPatientId = async (filter) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: filter,
    url: `/api/appointments/filter`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const deleteAppointment = async (appointmentData) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    data: appointmentData,
    url: `/api/v2/appointments`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getLikedDoctorByPatientId = async (
  currentPatient,
  likedOffset
) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url:
      `/api/like-logs?type=DOCTOR&patientId.equals=` +
      currentPatient.id +
      `&page=${likedOffset}&size=20`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getDoctorListByPatientId = async (patientId, limit) => {
  var payload = {
    method: "get",
    url: patientId
      ? `/api/admin/doctors?patientId=${patientId}&page=0&size=${limit}&sort=id,desc`
      : `/api/admin/doctors?page=0&size=${limit}&sort=id,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getNonPaginatedDoctorListByPatientId = async (patientId, limit) => {
  var payload = {
    method: "get",
    url: patientId
      ? `/api/admin/doctors?patientId=${patientId}&size=${limit}&sort=id,desc`
      : `/api/admin/doctors?page=7&size=${limit}&sort=id,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getNutritionDoctorList = async (patientId, page, limit) => {
  var payload = {
    method: "get",
    url: `/api/admin/doctors?page=${page}&size=${limit}&specialitiesId.in=42,33,4&sort=id,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getMoreDoctors = async (currentPatient, limit, offset) => {
  var payload = {
    method: "get",
    url:
      currentPatient && currentPatient.id
        ? `/api/admin/doctors?patientId=${currentPatient.id}&page=${offset}&size=${limit}&sort=id,desc`
        : `/api/admin/doctors?page=${offset}&size=${limit}&sort=id,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getFilteredDoctors = async (URL) => {
  var payload = {
    method: "get",
    url: URL,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getMoreLikedDoctorByPatientId = async (
  currentPatient,
  likedOffset
) => {
  var payload = {
    method: "get",
    url: `/api/like-logs?type=DOCTOR&patientId.equals=${currentPatient.id}&page=${likedOffset}&size=20`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const postLikedDoctor = async (likedData) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: likedData,
    url: `/api/like-logs`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const postUnlikedDoctor = async (likeId) => {
  var payload = {
    method: "delete",
    mode: "no-cors",
    url: `/api/like-logs/` + likeId,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getFilteredAppointmentData = async (data) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    //url: `/api/appointments/filter`,
    url: "/api/appointments/active-past?page=0&size=25&sort=startTime,asc",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getInvalidDates = async (data) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    url: `/api/appointments/invalid`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updatePatientData = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    data: data,
    url: "/api/admin/patients/",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const handleChangePassword = async (passwordData) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: passwordData,
    url: `/api/account/change-password/`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getDoctorAppointment = async (data) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    url: `/api/appointments/filter`,
    //url: '/api/appointments/active-past?sort=startTime,asc',
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getDoctorByUserId = async (userId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/admin/doctors?userId.equals=` + userId,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const createAppointment = async (data) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    url: `/api/appointments`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const deleteAvailableAppointment = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    data: data,
    url: `/api/appointments`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const deleteBookedAppointment = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    data: data,
    url: `/api/appointments`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getPatientChiefComplaint = async (patientId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/mobile-questionnaires/?category=Patient&patientid=` + patientId,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getPatientFamilyAndSocialHistoryData = async (patientId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/mobile-questionnaires?patientid=${patientId}&category=Patient`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const loadActivePatient = async (data, activeOffset, limit) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    url: `/api/appointments/active-past?page=${activeOffset}&size=${limit}&sort=startTime,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const loadPastPatient = async (data, pastOffset, limit) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: data,
    url: `/api/appointments/active-past?page=${pastOffset ? pastOffset : "0"
      }&size=${limit ? limit : "25"}&sort=startTime,desc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updatePatientTimeZone = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    url: `/api/patients/timezone?patientId=${data.id}&patientTimeZone=${data.patientTimeZone}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updateDoctorTimeZone = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    url: `/api/doctors/timezone?doctorId=${data.id}&doctorTimeZone=${data.doctorTimeZone}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getModulesDetailsByIds = (arrayIds, module) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/${module}/profile?${module}Ids=${arrayIds.join()}&page=0&size=${arrayIds.length
      }&sort=firstName,asc=`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  return axios(payload);
};

export const getMyAppointmentListbyModule = (payloadObject) => {
  const data = {
    endTime: commonUtilFunction.addDaysToDate(30),
    startTime: new Date().toISOString(),
    status: "ACCEPTED",
    ...payloadObject,
  };

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
    method: "get",
    mode: "no-cors",
    url: `/api/doctors/quick-search-doctor?page=${offset}&searchKeyword=${queryText}&size=${limit}&sort=firstName%2Casc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  return axios(payload);
};
export const uploadDoctorDocument = async (files, info) => {
  var newData = new FormData();
  newData.append(`doctorDocumentFile`, files);
  newData.append(
    "doctorDocumentInfo",
    new Blob([JSON.stringify(info)], {
      type: "application/json",
    })
  );
  console.log("info", info);
  var payload = {
    method: "post",
    mode: "no-cors",
    data: newData,
    url: `/api/mobile/doctor-documents`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const updateDoctorDocumentNew = async (data) => {
  // var newData = new FormData();
  // newData.append("doctorDocumentDTO", JSON.stringify(info));
  var payload = {
    method: "put",
    mode: "no-cors",
    data: data,
    url: `/api/mobile/doctor-documents/edit`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const updateDoctorDocument = async (files, info) => {
  var newData = new FormData();
  newData.append(`doctorDocumentFile`, files);
  newData.append("doctorDocumentInfo", JSON.stringify(info));

  var payload = {
    method: "put",
    mode: "no-cors",
    data: newData,
    url: `/api/doctor-documents`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

// http://localhost:8081/api/doctor-documents?doctorId.equals=5&page=0&size=10&sort=id%2Cdesc

export const getDoctorDocument = async (doctorId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/doctor-documents?doctorId.equals=${doctorId}&page=0&size=10&sort=id%2Cdesc`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

// https://dev.healthy-u.ae/api/doctor-documents-retrival?docKey=MTYxbnVhbGwxOTUyQHN1cGVycml0by5jb20=.png&email=nuall1952@superrito.com&id=2

export const getDoctorDocumentUrl = async (data) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/doctor-documents-retrival?docKey=${data.documentKey}&email=${data.doctor_email}&id=${data.id}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const getDoctorDocumentUrlForAdmin = async (data) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/doctor-documents?doctorId.equals=${data.doctorId}&id.equals=${data.id}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const updateDoctorDocumentStatus = async (data) => {
  var newData = new FormData();
  newData.append("doctorDocumentInfo", JSON.stringify(data));
  var payload = {
    method: "put",
    mode: "no-cors",
    data: newData,
    url: `/api/doctor-documents`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const deleteDoctorDocument = async (docId) => {
  var payload = {
    method: "delete",
    mode: "no-cors",
    url: `/api/doctor-documents/${docId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getServiceProviders = async (categoryId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/service-providers?categoryId.equals=${categoryId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

// NEW APIS

export const getAllDoctorsForHomepage = async () => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: "/api/mobile/doctorslist",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getUpcomingAppointmentsForHomepage = async () => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/appointments/upcoming`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const getAppointmentsForHomepage = async (
  startTime,
  endTime,
  doctorId
) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/appointments/doctor/mobile?startTime=${startTime}&endTime=${endTime}&doctorId=${doctorId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getAppointmentsBySearch = async (patientName) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/appointments/doctor/search?patientName=${patientName}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const getGlobalMedicalRecordsSearch = async (data) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    url: `/api/v2/medical-documents/filter`,
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
export const addRecurringSLot = async (data) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    url: `/api/v2/appointments/recur`,
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
export const getRecurringSLots = async (data) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    url: `/api/v2/appointments/recur/doctor`,
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
export const toggleRecurSlots = async (data) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    url: `/api/v2/recur/toggle`,
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
// export const getGlobalMedicalRecordsSearch = async (documentType, patientId, resultType, startTime, doctorId, pageNo, endTime, labName, doctorName, pageSize, id) => {
//     var payload = {
//         method: 'get',
//         mode: 'no-cors',
//         url: `/api/v2/medical-documents/filter?documentType=${documentType}
//         &patientId=${patientId}
//         &resultType=${resultType}
//         &startTime=${startTime}
//         &doctorId=${doctorId}
//         &pageNo=${pageNo}
//         &endTime=${endTime}
//         &labName=${labName}
//         &doctorName=${doctorName}
//         &pageSize=${pageSize}
//         &id=${id}`,
//         headers: {
//             'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
//             'Content-Type': 'application/json'
//         }
//     };
//     const response = await axios(payload).then(res => {
//         if (res) {
//             return res;
//         }
//     });
//     return response;
// }
export const getGlobalAppointmentsSearch = async (data) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    url: `/api/v2/appointments/filter`,
    data: data,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const updateDoctorData = async (data) => {
  var payload = {
    method: "put",
    mode: "no-cors",
    data: data,
    url: "/api/mobile/admin/doctors",
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const uploadNote = async (note) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    data: note,
    url: `/api/v2/notes`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const postHealthAssessment = async (method, data, patientId) => {
  var payload = {
    method: method,
    mode: "no-cors",
    data: data,
    url: `/api/v2/assessment?patientId=${patientId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getHealthAssessment = async (patientId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/assessment?patientId=${patientId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getAppointmentsTablistByStatus = async (patientId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/appointments/all?patientId=${patientId}`, // &searchParam=${searchParam}
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
export const getPaymentInfoForDoctor = async (appId) => {
  var payload = {
    method: "get",
    mode: "no-cors",
    url: `/api/v2/appointments/${appId}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getAvailableSlotsForMyDoctors = async (doctorId, type) => {
  var payload = {
    method: 'get',
    mode: 'no-cors',
    url: `/api/v2/appointments/active-past/count?doctorId=${doctorId}&type=${type}`,
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

export const pushNotificationsApi = async (userId) => {
  var payload = {
    method: 'get',
    mode: 'no-cors',
    url: `/api/v2/notifications?userId=${userId}`,
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

export const getFcmTokenApi = async (userId) => {
  var payload = {
    method: 'get',
    mode: 'no-cors',
    url: `/api/notification/fcm-token?id=${userId}&platform=web`,
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


export const getCallUserApi = async (channelId) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    url: `/api/v2/call-user/${channelId}`,
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

export const postNewsletterEmailApi = async (email) => {
  var payload = {
    method: "post",
    mode: "no-cors",
    url: `/api/v2/newsletter/email?email=${email}`,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};

export const getCreatePasswordOtpApi = async (data) => {
  var payload = {
    method: 'post',
    mode: 'no-cors',
    data: data,
    url: `/api/mobile/account/reset-password/verify`,
    headers: {
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