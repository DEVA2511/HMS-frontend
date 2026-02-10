import axiosInstance from "../Interceptors/AxiosInterceptor";

const addMedicine = async (data: any) => {
  return axiosInstance
    .post("/api/pharmacy/medicines/add", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const updateMedicine = async (data: any) => {
  return axiosInstance
    .put("/api/pharmacy/medicines/update", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const deleteMedicine = async (id: number) => {
  return axiosInstance
    .delete("/api/pharmacy/medicines/delete/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getMedicine = async (id: number) => {
  return axiosInstance
    .get("/api/pharmacy/medicines/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getAllMedicines = async () => {
  const response = await axiosInstance.get("/api/pharmacy/medicines/getAll");
  return response.data;
};

export {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicine,
  getAllMedicines,
};
