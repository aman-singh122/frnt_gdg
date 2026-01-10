import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Added Card for better structure
import { Badge } from "@/components/ui/badge"; // Added for hospital/doctor types
import { bookOpd } from "@/api/opd.api";
import { getAllHospitals } from "@/api/hospital.api";
import { getDoctorsByHospital } from "@/api/doctor.api";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { cn } from "@/lib/utils"; // Standard shadcn utility

import {
  Building2,
  Stethoscope,
  User,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  IndianRupee,
  CalendarCheck,
} from "lucide-react";

/* ================= TYPES ================= */
interface Hospital {
  _id: string;
  name: string;
  type: "govt" | "private";
  address?: { city?: string };
  departments: string[];
}

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  departments: string[];
  opdSchedule?: { shift: "morning" | "evening" };
  consultationFee: number;
}

const steps = [
  { number: 1, title: "Hospital", icon: Building2 },
  { number: 2, title: "Specialty", icon: Stethoscope },
  { number: 3, title: "Doctor", icon: User },
  { number: 4, title: "Schedule", icon: Clock },
  { number: 5, title: "Confirm", icon: CheckCircle2 },
];

const BookOPD = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // LOGIC PRESERVED (Existing UseEffects & Handlers)
  useEffect(() => {
    const loadHospitals = async () => {
      const res = await getAllHospitals();
      setHospitals(res.data.hospitals);
    };
    loadHospitals();
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;
    const hospital = hospitals.find((h) => h._id === selectedHospital);
    setDepartments(hospital?.departments || []);
    setSelectedDepartment(null);
    setSelectedDoctor(null);
  }, [selectedHospital, hospitals]);

  useEffect(() => {
    if (!selectedHospital || !selectedDepartment) return;
    const loadDoctors = async () => {
      const res = await getDoctorsByHospital(selectedHospital);
      const filtered = res.data.doctors.filter((d: Doctor) =>
        d.departments.includes(selectedDepartment)
      );
      setDoctors(filtered);
    };
    loadDoctors();
  }, [selectedHospital, selectedDepartment]);

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const generateTimeSlots = (start = 10, end = 18, gap = 30) => {
    const slots: string[] = [];
    const d = new Date();
    d.setHours(start, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(end, 0, 0, 0);
    while (d < endTime) {
      slots.push(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
      d.setMinutes(d.getMinutes() + gap);
    }
    return slots;
  };

  const handleConfirm = async () => {
    if (!selectedHospital || !selectedDoctor || !selectedSlot) return;
    const hospital = hospitals.find((h) => h._id === selectedHospital)!;
    const doctor = doctors.find((d) => d._id === selectedDoctor)!;
    try {
      const res = await bookOpd({
        hospital: { hospitalId: hospital._id, hospitalName: hospital.name, hospitalType: hospital.type },
        department: selectedDepartment!,
        doctor: { doctorId: doctor._id, doctorName: doctor.name, qualification: doctor.qualification },
        schedule: { date: new Date().toISOString(), timeSlot: selectedSlot, shift: doctor.opdSchedule?.shift || "morning" },
        token: { tokenNumber: Math.floor(Math.random() * 100) + 1 },
        patient: { name: user.name, age: 25, gender: "male", phone: user.phone },
        fees: { registrationFee: 50, consultationFee: doctor.consultationFee, totalAmount: 50 + doctor.consultationFee },
        source: "web",
      });
      setAppointmentData(res.data.data);
      setBookingSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (bookingSuccess && appointmentData) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-16 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-green-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">Your token has been generated.</p>
            
            <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <div className="flex justify-between"><span>Token:</span><span className="font-bold text-primary">#{appointmentData.token.tokenNumber}</span></div>
              <div className="flex justify-between"><span>Hospital:</span><span className="font-medium text-right">{appointmentData.hospital.hospitalName}</span></div>
              <div className="flex justify-between"><span>Doctor:</span><span className="font-medium">{appointmentData.doctor.doctorName}</span></div>
              <div className="flex justify-between"><span>Time:</span><span className="font-medium">{appointmentData.schedule.timeSlot}</span></div>
            </div>

            <Button className="w-full mt-8 rounded-xl h-12 text-lg" onClick={() => (window.location.href = "/dashboard")}>
              Go to Appointments
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Progress Header */}
        <div className="mb-12 relative flex justify-between">
          <div className="absolute top-6 left-0 w-full h-1 bg-slate-200 -z-10" />
          <div 
            className="absolute top-6 left-0 h-1 bg-primary transition-all duration-500 -z-10" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep >= s.number;
            const isCurrent = currentStep === s.number;
            return (
              <div key={s.number} className="flex flex-col items-center">
                <div className={cn(
                  "h-12 w-12 rounded-full border-4 border-background flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-slate-200 text-slate-500",
                  isCurrent && "ring-4 ring-primary/20"
                )}>
                  <Icon size={20} />
                </div>
                <span className={cn("text-[10px] mt-2 font-semibold uppercase tracking-wider", isActive ? "text-primary" : "text-slate-400")}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="min-h-[400px] transition-all duration-300">
          {/* STEP 1: HOSPITALS */}
          {currentStep === 1 && (
            <div className="grid gap-4 animate-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Building2 className="text-primary"/> Select Hospital</h2>
              {hospitals.map((h) => (
                <Card 
                  key={h._id} 
                  onClick={() => setSelectedHospital(h._id)}
                  className={cn(
                    "p-5 cursor-pointer transition-all hover:border-primary/50 flex items-center justify-between group",
                    selectedHospital === h._id ? "ring-2 ring-primary border-transparent bg-primary/5" : ""
                  )}
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10">
                      <Building2 className="text-slate-600 group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{h.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground"><MapPin size={14} className="mr-1"/> {h.address?.city}</div>
                    </div>
                  </div>
                  <Badge variant={h.type === "govt" ? "secondary" : "outline"}>{h.type.toUpperCase()}</Badge>
                </Card>
              ))}
            </div>
          )}

          {/* STEP 2: DEPARTMENTS */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4">
               <h2 className="col-span-2 text-xl font-bold flex items-center gap-2 mb-2"><Stethoscope className="text-primary"/> Choose Department</h2>
               {departments.map((d) => (
                <div 
                  key={d} 
                  onClick={() => setSelectedDepartment(d)}
                  className={cn(
                    "p-6 border rounded-2xl cursor-pointer text-center font-semibold transition-all hover:bg-slate-50 hover:shadow-md",
                    selectedDepartment === d ? "bg-primary text-white hover:bg-primary shadow-primary/25" : "bg-white"
                  )}
                >
                  {d}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: DOCTORS */}
          {currentStep === 3 && (
            <div className="grid gap-4 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><User className="text-primary"/> Select Doctor</h2>
              {doctors.length > 0 ? doctors.map((d) => (
                <Card 
                  key={d._id} 
                  onClick={() => setSelectedDoctor(d._id)}
                  className={cn(
                    "p-5 cursor-pointer transition-all flex items-center justify-between",
                    selectedDoctor === d._id ? "ring-2 ring-primary bg-primary/5 shadow-lg" : ""
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100">
                      <User className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{d.name}</h3>
                      <p className="text-sm text-muted-foreground">{d.qualification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-primary font-bold text-lg"><IndianRupee size={16}/>{d.consultationFee}</div>
                    <span className="text-[10px] text-muted-foreground uppercase">Consultation Fee</span>
                  </div>
                </Card>
              )) : <p className="text-center text-muted-foreground py-10">No doctors available for this department.</p>}
            </div>
          )}

          {/* STEP 4: SLOTS */}
          {currentStep === 4 && (
            <div className="animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Clock className="text-primary"/> Available Time Slots</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {generateTimeSlots().map((slot) => (
                  <button 
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-3 px-2 border rounded-xl text-sm font-medium transition-all hover:border-primary",
                      selectedSlot === slot ? "bg-primary text-white border-primary shadow-md" : "bg-white"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION PREVIEW */}
          {currentStep === 5 && (
            <div className="animate-in zoom-in-95">
               <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><CalendarCheck className="text-primary"/> Review Details</h2>
               <div className="bg-slate-50 border rounded-3xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium">{user?.name}</p></div>
                    <div><p className="text-xs text-muted-foreground">Contact</p><p className="font-medium">{user?.phone}</p></div>
                    <hr className="col-span-2"/>
                    <div><p className="text-xs text-muted-foreground">Hospital</p><p className="font-medium">{hospitals.find(h => h._id === selectedHospital)?.name}</p></div>
                    <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{selectedDepartment}</p></div>
                    <div><p className="text-xs text-muted-foreground">Doctor</p><p className="font-medium">{doctors.find(d => d._id === selectedDoctor)?.name}</p></div>
                    <div><p className="text-xs text-muted-foreground">Scheduled Time</p><p className="font-medium text-primary uppercase font-bold">{selectedSlot}</p></div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-12 pt-6 border-t">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1}
            className="rounded-xl px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          
          {currentStep < 5 ? (
            <Button 
              onClick={handleNext} 
              disabled={
                (currentStep === 1 && !selectedHospital) ||
                (currentStep === 2 && !selectedDepartment) ||
                (currentStep === 3 && !selectedDoctor) ||
                (currentStep === 4 && !selectedSlot)
              }
              className="rounded-xl px-8 shadow-lg shadow-primary/20"
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleConfirm} 
              className="rounded-xl px-8 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
            >
              Confirm Appointment
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookOPD;