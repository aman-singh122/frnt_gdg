import API from "@/lib/axios";

export const getDoctorsByHospital = (hospitalId: string) => {
  return API.get(`/doctor/hospital/${hospitalId}`);
};
