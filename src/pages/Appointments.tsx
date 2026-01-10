import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getMyAppointments } from "@/api/opd.api";
import { Calendar, Clock, Building2, User, Hash } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface Appointment {
  _id: string;
  appointmentId: string;
  hospital: {
    hospitalName: string;
  };
  doctor: {
    doctorName: string;
  };
  schedule: {
    date: string;
    timeSlot: string;
  };
  token: {
    tokenNumber: number;
  };
  status: string;
}

/* ---------------- COMPONENT ---------------- */
const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await getMyAppointments();
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-muted-foreground">
          Loading your appointments...
        </div>
      </DashboardLayout>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>

        {/* EMPTY STATE */}
        {appointments.length === 0 && (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-muted-foreground">
              You have not booked any appointments yet.
            </p>
          </div>
        )}

        {/* APPOINTMENT LIST */}
        {appointments.map((a) => (
          <div
            key={a._id}
            className="border rounded-xl p-5 bg-card shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="flex items-center gap-2 font-semibold">
                  <Building2 className="h-4 w-4 text-primary" />
                  {a.hospital.hospitalName}
                </p>

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Dr. {a.doctor.doctorName}
                </p>
              </div>

              {/* STATUS */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${
                    a.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : a.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {a.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(a.schedule.date).toDateString()}
              </p>

              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {a.schedule.timeSlot}
              </p>

              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Token #{a.token.tokenNumber}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
              Appointment ID: {a.appointmentId}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
