import axiosInstance from "../Interceptors/AxiosInterceptor";

const getPatient = async (id: any) => {
  return axiosInstance
    .get(`api/profile/patient/get/${id}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const updatePatient = async (patient: any) => {
  return axiosInstance
    .put("/api/profile/patient/update", patient)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const getPatientDropDown = async () => {
  return axiosInstance
    .get(`api/profile/patient/dropdown`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const getAllPatients = async () => {
  return axiosInstance
    .get(`api/profile/patient/getAll`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

export { getPatient, updatePatient, getPatientDropDown, getAllPatients };
