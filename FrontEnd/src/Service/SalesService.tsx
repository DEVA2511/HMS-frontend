import axiosInstance from "../Interceptors/AxiosInterceptor";

const addsales = async (data: any) => {
  return axiosInstance
    .post("/api/pharmacy/sales/create", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const updatesales = async (data: any) => {
  return axiosInstance
    .put("/api/pharmacy/sales/update", data)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const deletesales = async (id: number) => {
  return axiosInstance
    .delete("/api/pharmacy/sales/delete/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getSaleItems = async (id: any) => {
  return axiosInstance
    .get("/api/pharmacy/sales/getSaleItems/" + id)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};

const getAllsales = async () => {
  const response = await axiosInstance.get("/api/pharmacy/sales/getAll");
  return response.data;
};

export { addsales, updatesales, deletesales, getSaleItems, getAllsales };
