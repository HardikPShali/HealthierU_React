import * as axios from "axios";
import LocalStorageService from "../util/LocalStorageService";
// import properties from "../properties";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
//import "firebase/analytics";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";

//const fs = require('fs');
export const getAllDocument = async (documentType) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url: "/api/medical-documents?documentType=" + documentType,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getDocuments = async (documentType, pageNumber) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url:
      "/api/medical-documents?documentType=" +
      documentType +
      "&size=10&page=" +
      pageNumber,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};
export const getMedicalDocuments = async () => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url:
      "/api/v2/mobile/medical-documents",
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};
export const getPatientDocuments = async (
  documentType,
  pageNumber,
  patientId
) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url:
      "/api/medical-documents/patients/" +
      patientId +
      "?documentType=" +
      documentType +
      "&size=3&page=" +
      pageNumber,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getDoctorDocuments = async (
  documentType,
  pageNumber,
  doctorId
) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url:
      "/api/medical-documents/doctor/?documentType=" +
      documentType +
      "&size=5&page=" +
      pageNumber +
      "&doctorId=" +
      doctorId,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getDoctorPatientDocuments = async (
  documentType,
  pageNumber,
  doctorId,
  patientId
) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url:
      "/api/v2/medical-documents/doctor/?documentType=" +
      documentType +
      "&size=5&page=" +
      pageNumber +
      "&doctorId=" +
      doctorId +
      "&patientId=" +
      patientId,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getDocument = async (doc) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  var config = {
    method: "get",
    url: "/api/v2/mobile/medical-documents?docIdUser=" + doc.id + doc.uploadedBy,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const postDocument = async (data) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  // const methodType = data.get("id") ? "PUT" : "POST";
  // const medicalInfo = [{
  //   id: data.get("id") ? data.get("id") : null,
  //   duration: data.get("duration"),
  //   medicineName: data.get("medicineName"),
  //   dose: data.get("dose"),
  //   numberOfDays: data.get("numberOfDays"),
  //   interval: data.get("interval"),
  // }];
  const medicalDocumentInfo = {
    // decription: data.get("decription") ? data.get("decription") : null,
    // duration: data.get("duration"),
    documentType: "Prescription",
    patientId: data.get("patientId"),
    doctorId: data.get("doctorId"),
  };

  const formData = new FormData();
  // formData.append("medicalInfo", new Blob([JSON.stringify(medicalInfo)], {
  //   type: "application/json"
  // }));
  formData.append("medicalDocumentInfo", new Blob([JSON.stringify(medicalDocumentInfo)], {
    type: "application/json"
  }));
  formData.append("file", data.get("prescriptionDocument"));

  var config = {
    method: 'post',
    url: "/api/v2/medical-document-upload",
    headers: headers,
    data: formData,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const postDocumentAddPrescriptionLabResult = async (data) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };
  var config = {
    method: 'post',
    url: "/api/v2/medical-document-upload",
    headers: headers,
    data: data,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const postLabDocument = async (data) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  const methodType = data.get("id") ? "PUT" : "POST";
  // const medicalInfo = {
  //   id: data.get("id") ? data.get("id") : null,
  //   // decription: data.get("decription"),
  //   labName: data.get("labName"),
  //   documentType: "Lab",
  //   patientId: data.get("patientId"),
  //   doctorId: data.get("doctorId"),
  // };
  const medicalDocumentInfo = {
    // decription: data.get("decription") ? data.get("decription") : null,
    duration: data.get("duration"),
    documentType: "LabResult",
    patientId: data.get("patientId"),
    doctorId: data.get("doctorId"),
    labName: data.get("labName"),
    resultType: data.get("resultType"),
    name: data.get("resultName")
  };
  const formData = new FormData();
  formData.append("file", data.get("labResultDocument"));
  // formData.append("medicalInfo", new Blob([JSON.stringify(medicalInfo)], {
  //   type: "application/json"
  // }));
  formData.append("medicalDocumentInfo", new Blob([JSON.stringify(medicalDocumentInfo)], {
    type: "application/json"
  }));

  var config = {
    method: methodType,
    url: "/api/v2/medical-document-upload",
    headers: headers,
    data: formData,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};
export const deleteDocument = async (documentId) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  const config = {
    method: "delete",
    url: "/api/v2/medical-documents/" + documentId,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getDoctorDetail = async (emailId) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  const config = {
    method: "get",
    url: "/api/find-doctor?emailId=" + emailId,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const getPatientDetail = async (emailId) => {
  const headers = {
    mode: "no-cors",
    Authorization: "Bearer " + LocalStorageService.getAccessToken(),
  };

  const config = {
    method: "get",
    url: "/api/find-patient?emailId=" + emailId,
    headers: headers,
  };

  return await axios(config).then((response) => {
    return response.data;
  });
};

export const validateEmail = (mail) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      mail
    )
  ) {
    return true;
  }
  return false;
};

export const getDefaultPrescription = async () => {
  var payload = {
    method: "get",
    url: `/api/medical-document-retrival?docIdUser=medicalPrescription`,
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
// http://localhost:8081/api/medical-document?docId=1&patId=13

export const getDocumentById = async (payload) => {
  const config = {
    method: "get",
    url:
      payload.patientId !== null
        ? "/api/medical-document?docId=" +
        payload.id +
        "&patId=" +
        payload.patientId
        : "/api/medical-document?docId=" + payload.id,
    headers: {
      mode: "no-cors",
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios(config).then((res) => {
    if (res) {
      return res;
    }
  });
  return response;
};
