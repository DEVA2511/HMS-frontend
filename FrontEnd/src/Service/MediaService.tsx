import axiosInstance from "../Interceptors/AxiosInterceptor";

const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance
    .post("/api/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response?.data || error;
    });
};

const getMedia = async (id: any) => {
  return axiosInstance
    .get(`/api/media/${id}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response?.data || error;
    });
};

const getMediaUrl = (id: any) => {
  if (!id) return "";
  return `http://localhost:8082/api/media/${id}`;
};

export { uploadMedia, getMedia, getMediaUrl };
