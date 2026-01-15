# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


BookOpd.js
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookOpd } from "@/api/opd.api";
import { getAllHospitals } from "@/api/hospital.api";
import { getDoctorsByHospital } from "@/api/doctor.api";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { cn } from "@/lib/utils";


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
  Sparkles,
  Search,
  ChevronRight,
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

  // LOGIC (Untouched)
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
      slots.push(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
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
        <div className="max-w-xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-cyan-400" />
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Booking Success!</h2>
            <p className="text-slate-500 mb-8 font-medium">Your appointment has been secured.</p>
            
            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200 mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Token No.</span>
                <span className="text-3xl font-black text-primary">#{appointmentData.token.tokenNumber}</span>
              </div>
              <div className="space-y-3">
                <p className="flex justify-between text-sm font-medium"><span className="text-slate-400">Hospital:</span> <span className="text-slate-700">{appointmentData.hospital.hospitalName}</span></p>
                <p className="flex justify-between text-sm font-medium"><span className="text-slate-400">Specialist:</span> <span className="text-slate-700">{appointmentData.doctor.doctorName}</span></p>
                <p className="flex justify-between text-sm font-medium"><span className="text-slate-400">Time:</span> <span className="text-slate-700 font-bold">{appointmentData.schedule.timeSlot}</span></p>
              </div>
            </div>

            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" onClick={() => (window.location.href = "/dashboard")}>
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Step Header */}
        <div className="mb-12">
            <div className="flex justify-between mb-8">
                {steps.map((s) => (
                    <div key={s.number} className="flex flex-col items-center flex-1 relative">
                        {/* Progress Line */}
                        {s.number < steps.length && (
                             <div className={cn(
                                "absolute top-6 left-1/2 w-full h-[2px] -z-10 transition-colors duration-500",
                                currentStep > s.number ? "bg-primary" : "bg-slate-200"
                             )} />
                        )}
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
                            currentStep >= s.number ? "bg-primary border-primary/20 text-white shadow-lg shadow-primary/30 scale-110" : "bg-white border-slate-100 text-slate-300"
                        )}>
                            <s.icon size={20} />
                        </div>
                        <span className={cn("text-[10px] mt-3 font-black uppercase tracking-tighter", currentStep >= s.number ? "text-primary" : "text-slate-300")}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Set Appointment</h1>
                <p className="text-slate-400 font-medium">Step {currentStep}: Choose your preferred {steps[currentStep-1].title.toLowerCase()}</p>
            </div>
        </div>

        {/* Content Box with Stable Height */}
        <div className="min-h-[500px] bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/60 p-2 md:p-8 transition-all duration-500">
          
          {/* STEP 1: HOSPITALS */}
          {currentStep === 1 && (
            <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {hospitals.map((h) => (
                <Card 
                  key={h._id} 
                  onClick={() => setSelectedHospital(h._id)}
                  className={cn(
                    "p-6 cursor-pointer border-2 transition-all group rounded-3xl",
                    selectedHospital === h._id ? "border-primary bg-primary/[0.03] shadow-xl shadow-primary/10" : "border-slate-100 hover:border-primary/30 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-5 items-center">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", selectedHospital === h._id ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>
                        <Building2 size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-800">{h.name}</h3>
                        <div className="flex items-center text-sm text-slate-400 font-medium mt-1"><MapPin size={14} className="mr-1"/> {h.address?.city}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-4 py-1 rounded-full uppercase text-[10px] font-bold tracking-widest">{h.type}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* STEP 2: DEPARTMENTS */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {departments.map((d) => (
                <div 
                  key={d} 
                  onClick={() => setSelectedDepartment(d)}
                  className={cn(
                    "p-8 border-2 rounded-[2rem] cursor-pointer text-center transition-all duration-300 flex flex-col items-center gap-3",
                    selectedDepartment === d ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 -translate-y-1" : "bg-white border-slate-50 hover:border-primary/20"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", selectedDepartment === d ? "bg-white/20" : "bg-slate-50 text-primary")}>
                    <Sparkles size={20} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-wide leading-tight">{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: DOCTORS */}
          {currentStep === 3 && (
            <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {doctors.map((d) => (
                <Card 
                  key={d._id} 
                  onClick={() => setSelectedDoctor(d._id)}
                  className={cn(
                    "p-6 cursor-pointer border-2 transition-all flex items-center justify-between rounded-3xl",
                    selectedDoctor === d._id ? "border-primary bg-primary/[0.03]" : "border-slate-50"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800">{d.name}</h3>
                      <p className="text-sm font-bold text-primary/70 uppercase tracking-tighter">{d.qualification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 flex items-center justify-end"><IndianRupee size={18}/>{d.consultationFee}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* STEP 4: SLOTS */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {generateTimeSlots().map((slot) => (
                  <button 
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-4 rounded-2xl text-sm font-black transition-all border-2",
                      selectedSlot === slot ? "bg-primary border-primary text-white shadow-lg -translate-y-1" : "bg-white border-slate-100 text-slate-600 hover:border-primary/30"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION */}
          {currentStep === 5 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <CalendarCheck className="text-primary" size={24}/>
                        <h2 className="text-xl font-black uppercase tracking-widest">Verify Details</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-white/40 text-xs font-bold uppercase">Hospital</span>
                            <span className="font-bold">{hospitals.find(h => h._id === selectedHospital)?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-white/40 text-xs font-bold uppercase">Doctor</span>
                            <span className="font-bold text-primary">{doctors.find(d => d._id === selectedDoctor)?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-white/40 text-xs font-bold uppercase">Time Slot</span>
                            <span className="font-black text-xl">{selectedSlot}</span>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* Floating Navigation */}
        <div className="mt-8 flex justify-between items-center px-4">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1}
            className="rounded-2xl h-14 px-8 font-bold text-slate-400"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-300 uppercase mr-4">Step {currentStep} of 5</span>
            {currentStep < 5 ? (
                <Button 
                onClick={handleNext} 
                disabled={
                    (currentStep === 1 && !selectedHospital) ||
                    (currentStep === 2 && !selectedDepartment) ||
                    (currentStep === 3 && !selectedDoctor) ||
                    (currentStep === 4 && !selectedSlot)
                }
                className="rounded-2xl h-14 px-10 font-bold shadow-xl shadow-primary/20"
                >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            ) : (
                <Button 
                onClick={handleConfirm} 
                className="rounded-2xl h-14 px-12 font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all hover:scale-105"
                >
                Confirm Now
                </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookOPD;


//doctor.model

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    name: {
      type: String,
      required: true,
      trim: true
    },

    qualification: {
      type: String,
      required: true
    },

    specialization: {
      type: String
    },

    registrationNumber: {
      type: String
    },

    /* ---------------- HOSPITAL MAPPING ---------------- */
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    /* ---------------- DEPARTMENTS ---------------- */
    departments: [
      {
        type: String,
        required: true
      }
    ],

    /* ---------------- OPD SCHEDULE ---------------- */
    opdSchedule: {
      days: [
        {
          type: String,
          enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        }
      ],
      shift: {
        type: String,
        enum: ["morning", "evening"],
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      slotDuration: {
        type: Number,
        default: 10
      }
    },

    /* ---------------- FEES ---------------- */
    consultationFee: {
      type: Number,
      default: 0
    },

    /* ---------------- STATUS ---------------- */
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive"],
      default: "active"
    },

    /* ---------------- EXPERIENCE ---------------- */
    experienceYears: {
      type: Number
    },

    /* ---------------- META ---------------- */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Doctor", doctorSchema);


//current consultaion.tsx
import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  ArrowLeft, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare
} from "lucide-react";

// --- Expanded Mock Data ---
const mockConsultations = [
  { id: "room-101", doctor: "Dr. Amit Kumar", date: "10 Jan 2026", time: "6:00 PM", department: "Cardiology", initials: "AK", status: "online", color: "bg-blue-500" },
  { id: "room-102", doctor: "Dr. Neha Sharma", date: "11 Jan 2026", time: "10:30 AM", department: "Dermatology", initials: "NS", status: "online", color: "bg-purple-500" },
  { id: "room-103", doctor: "Dr. Vikram Seth", date: "10 Jan 2026", time: "4:15 PM", department: "Neurology", initials: "VS", status: "online", color: "bg-emerald-500" },
  { id: "room-104", doctor: "Dr. Sarah Jones", date: "12 Jan 2026", time: "09:00 AM", department: "Pediatrics", initials: "SJ", status: "offline", color: "bg-slate-400" },
  { id: "room-105", doctor: "Dr. Rajesh Iyer", date: "15 Jan 2026", time: "11:00 AM", department: "Orthopedics", initials: "RI", status: "offline", color: "bg-slate-400" },
];

const ConsultOnline = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const currentConsult = mockConsultations.find((c) => c.id === activeRoom);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* 🔹 SIDEBAR */}
      <aside className="hidden lg:flex w-20 flex-col items-center py-8 bg-white border-r border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-100">
          <Activity className="text-white w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-8">
          <Video className="text-indigo-600 cursor-pointer" size={24} />
          <Calendar className="text-slate-300 hover:text-indigo-400 cursor-pointer transition-colors" size={24} />
          <MessageSquare className="text-slate-300 hover:text-indigo-400 cursor-pointer transition-colors" size={24} />
        </nav>
      </aside>

      {/* 🔹 MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeRoom && (
              <button 
                onClick={() => setActiveRoom(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              {activeRoom ? "Telehealth Consultation" : "Medical Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm uppercase">
              U
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {!activeRoom ? (
            /* 🔹 VIEW: DOCTOR LIST */
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900">Available Specialists</h2>
                <p className="text-slate-500 mt-1">Select a doctor to begin your high-definition video call.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockConsultations.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative bg-white rounded-[1.5rem] p-6 border border-slate-200 transition-all duration-300 
                      ${c.status === 'online' ? 'hover:shadow-xl' : 'opacity-70 grayscale bg-slate-50'}`}
                  >
                    <div className="absolute top-6 right-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                        {c.status === 'online' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                        {c.status}
                      </div>
                    </div>

                    <div className={`w-16 h-16 ${c.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-inner`}>
                      {c.initials}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-1">{c.doctor}</h3>
                    <p className="text-indigo-600 font-medium text-sm mb-4">{c.department}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                        <Calendar size={14} /> {c.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                        <Clock size={14} /> {c.time}
                      </div>
                    </div>

                    <button 
                      disabled={c.status === 'offline'}
                      onClick={() => setActiveRoom(c.id)}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                        ${c.status === 'online' 
                          ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg' 
                          : 'bg-slate-200 text-slate-400'}`}
                    >
                      {c.status === 'online' ? 'Join Call' : 'Unavailable'}
                      {c.status === 'online' && <ChevronRight size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 🔹 VIEW: CLEAN VIDEO INTERFACE (No overlay buttons here) */
            <div className="h-full max-w-7xl mx-auto flex flex-col">
              <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-white">
                <iframe
                  src={`http://localhost:3000/?room=${activeRoom}`}
                  className="w-full h-full bg-slate-800"
                  allow="camera; microphone"
                  title="WebRTC Video Room"
                />
              </div>

              {/* Secure Info Bar */}
              <div className="mt-6 flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${currentConsult?.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                    {currentConsult?.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{currentConsult?.doctor}</p>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{currentConsult?.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <ShieldCheck size={16} /> 256-BIT ENCRYPTION ACTIVE
                  </div>
                  <button 
                    onClick={() => setActiveRoom(null)}
                    className="px-6 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-sm transition-colors"
                  >
                    Close Portal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConsultOnline;



//current DashBoard.tsx

import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  CalendarPlus,
  Video,
  FileText,
  MessageCircle,
  Clock,
  Building2,
  Stethoscope,
  Bell,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Get user from localStorage
const { user, loading } = useAuth();

  const quickActions = [
    {
      title: "Book OPD",
      description: "Schedule an outpatient appointment",
      icon: CalendarPlus,
      path: "/book-opd",
      color: "primary",
    },
    {
      title: "Online Consultation",
      description: "Consult with a doctor virtually",
      icon: Video,
      path: "/consult",
      color: "accent",
    },
    {
      title: "Medical Records",
      description: "View your health history",
      icon: FileText,
      path: "/records",
      color: "primary",
    },
    {
      title: "MediChat",
      description: "AI-powered health assistant",
      icon: MessageCircle,
      path: "/medichat",
      color: "accent",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      type: "OPD",
    },
    {
      id: 2,
      doctor: "Dr. Rajesh Kumar",
      specialty: "General Physician",
      hospital: "Fortis Healthcare",
      date: "Jan 18, 2024",
      time: "2:00 PM",
      type: "Online",
    },
  ];

  const healthTips = [
    "Stay hydrated - drink at least 8 glasses of water daily",
    "Take a 30-minute walk every day for better heart health",
    "Get 7-8 hours of quality sleep each night",
  ];

  if (loading) {
  return <div>Loading...</div>;
}

if (!user) {
  return <div>User not found</div>;
}


  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Hello, {user.name}! 
            </h1>
            <p className="text-muted-foreground mt-1">
              How can we help you today?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-card border border-border hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <Button variant="default" size="default" asChild>
              <Link to="/book-opd">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="group p-5 bg-card rounded-xl shadow-card border border-border hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${
                      action.color === "primary"
                        ? "bg-primary-light text-primary"
                        : "bg-accent-light text-accent"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </h2>
              <Link
                to="/appointments"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                      {appointment.type === "Online" ? (
                        <Video className="h-6 w-6 text-primary-foreground" />
                      ) : (
                        <Stethoscope className="h-6 w-6 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {appointment.doctor}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.specialty} • {appointment.hospital}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {appointment.date}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.type === "Online"
                          ? "bg-accent-light text-accent"
                          : "bg-primary-light text-primary"
                      }`}
                    >
                      {appointment.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button variant="default" size="sm" className="mt-4" asChild>
                  <Link to="/book-opd">Book Now</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Health Tips */}
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent" />
              Health Tips
            </h2>
            <div className="space-y-4">
              {healthTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-accent-light/50"
                >
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl shadow-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                <CalendarPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent-light flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Doctors Visited</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Hospitals Visited</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent-light flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Medical Records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


