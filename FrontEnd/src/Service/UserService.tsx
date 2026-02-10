import axiosInstance from "../Interceptors/AxiosInterceptor";

const registerUser = async (user: any) => {
  return axiosInstance
    .post("api/users/register", user)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};

const loginUser = async (user: any) => {
  return axiosInstance
    .post("api/users/login", user)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response ? error.response.data : error;
    });
};

const getRegistrationCounts = async () => {
  return axiosInstance
    .get("api/users/registrationCounts")
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data;
    });
};
export { registerUser, loginUser, getRegistrationCounts };
