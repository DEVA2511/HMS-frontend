import axiosInstance from "../Interceptors/AxiosInterceptor";

const addStock = async (data: any) => {
  return axiosInstance
    .post("/api/pharmacy/inventory/add", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const updateStock = async (data: any) => {
  return axiosInstance
    .put("/api/pharmacy/inventory/update", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const deleteStock = async (id: number) => {
  return axiosInstance
    .delete("/api/pharmacy/inventory/delete/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getStock = async (id: number) => {
  return axiosInstance
    .get("/api/pharmacy/inventory/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getAllStock = async () => {
  const response = await axiosInstance.get("/api/pharmacy/inventory/getAll");
  return response.data;
};

export { addStock, updateStock, deleteStock, getStock, getAllStock };
