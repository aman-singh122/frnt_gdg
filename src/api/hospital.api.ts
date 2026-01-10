import API from "@/lib/axios";

export const getAllHospitals = () => {
  return API.get("/hospitals");
};

export const getHospitalById = (id: string) => {
  return API.get(`/hospitals/${id}`);
};
