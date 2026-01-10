import API from "@/lib/axios";

/* ================= BOOK OPD ================= */

export interface BookOpdPayload {
  hospital: {
    hospitalId: string;
    hospitalName: string;
    hospitalType: "govt" | "private";
  };
  department: string;
  doctor: {
    doctorId: string;
    doctorName: string;
    qualification?: string;
  };
  schedule: {
    date: string;      // ISO string
    timeSlot: string; // "10:00 - 10:10"
    shift?: "morning" | "evening";
  };
  token: {
    tokenNumber: number;
    queuePosition?: number;
  };
  patient: {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    phone?: string;
    abhaId?: string;
  };
  fees: {
    registrationFee?: number;
    consultationFee?: number;
    totalAmount: number;
  };
  instructions?: string;
  source?: "web" | "mobile" | "kiosk";
}

/* 🔥 BOOK OPD */
export const bookOpd = (data: BookOpdPayload) =>
  API.post("/opd/book", data);

/* 🔥 MY APPOINTMENTS */
export const getMyAppointments = () => {
  return API.get("/opd/my-appointments");
};