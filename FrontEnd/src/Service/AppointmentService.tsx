import axiosInstance from "../Interceptors/AxiosInterceptor";

const scheduleAppointment = async (user: any) => {
  console.log(user);
  return axiosInstance
    .post("api/appointment/schedule", user)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const cancelAppointment = async (id: any) => {
  return axiosInstance
    .put("api/appointment/cancel/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const getAppointment = async (id: any) => {
  return axiosInstance
    .get("api/appointment/get/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const getAppointmentDetails = (id: any) => {
  return axiosInstance
    .get("api/appointment/get/details/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getAppointmetsByPatient = (patinetId: number) => {
  return axiosInstance
    .get(`/api/appointment/getAllPatient/${patinetId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getAppointmetsByDoctor = (doctorId: number) => {
  return axiosInstance
    .get(`/api/appointment/getAllDoctor/${doctorId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const updateAppointment = async (appointment: any) => {
  return axiosInstance
    .put("api/appointment/update", appointment)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const createAppointmentReport = async (data: any) => {
  return axiosInstance
    .post("api/appointment/report/create", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const updateAppointmentReport = async (data: any) => {
  return axiosInstance
    .put("api/appointment/report/update", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getAppointmentReport = async (id: any) => {
  return axiosInstance
    .get("api/appointment/report/get/byappointment/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const isReportExists = async (appointmentId: any) => {
  return axiosInstance
    .get("api/appointment/report/exists/" + appointmentId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const getReportByPatinetId = async (patinetId: any) => {
  return axiosInstance
    .get("api/appointment/report/getRecordsByPatinetId/" + patinetId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const getPrescriptionByPatientId = async (patinetId: any) => {
  return axiosInstance
    .get("api/appointment/report/getPrescriptionByPatientId/" + patinetId)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getAllPrescriptions = async () => {
  return axiosInstance
    .get("api/appointment/report/getAllPrescriptions")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getMedicinesByPrescriptionId = async (prescriptionId: any) => {
  return axiosInstance
    .get(
      "api/appointment/report/getMedicinesByPrescriptionId/" + prescriptionId
    )
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};
const getAppointmentCountByPatient = (patientId: number) => {
  return axiosInstance
    .get(`/api/appointment/countBypatinet/${patientId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getAppointmentCountByDoctor = (doctorId: number) => {
  return axiosInstance
    .get(`/api/appointment/countByDoctor/${doctorId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getTodayAppointments = async () => {
  return axiosInstance
    .get("api/appointment/getTodayAppointments")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getReasonCountByPatientId = (patientId: number) => {
  return axiosInstance
    .get(`/api/appointment/countReasonByPatient/${patientId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getReasonCountByDoctorId = (doctorId: number) => {
  return axiosInstance
    .get(`/api/appointment/countReasonByDoctor/${doctorId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getReasonCount = () => {
  return axiosInstance
    .get("/api/appointment/countReason")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getMedicineByPatientId = (patientId: number) => {
  return axiosInstance
    .get(`/api/appointment/getMedicineByPatient/${patientId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getVisitCount = async () => {
  return axiosInstance
    .get("api/appointment/visitCount")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

export {
  scheduleAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointment,
  getAppointmentDetails,
  getAppointmetsByPatient,
  getAppointmetsByDoctor,
  getAppointmentCountByPatient,
  getAppointmentCountByDoctor,
  getTodayAppointments,
  createAppointmentReport,
  updateAppointmentReport,
  getAppointmentReport,
  isReportExists,
  getReportByPatinetId,
  getPrescriptionByPatientId,
  getAllPrescriptions,
  getMedicinesByPrescriptionId,
  getReasonCountByPatientId,
  getReasonCountByDoctorId,
  getReasonCount,
  getMedicineByPatientId,
  getVisitCount,
};
