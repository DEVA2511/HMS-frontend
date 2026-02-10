import axiosInstance from "../Interceptors/AxiosInterceptor";

const getDoctor = async (id: any) => {
  return axiosInstance
    .get(`api/profile/doctor/get/${id}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const updateDoctor = async (doctor: any) => {
  return axiosInstance
    .put(`/api/profile/doctor/update`, doctor)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const getDoctorDropDown = async () => {
  return axiosInstance
    .get(`api/profile/doctor/dropdown`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};
const getAllDoctor = async () => {
  return axiosInstance
    .get(`api/profile/doctor/getAll`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

export { getDoctor, updateDoctor, getDoctorDropDown, getAllDoctor };
