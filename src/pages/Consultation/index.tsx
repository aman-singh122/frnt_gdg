import { useEffect, useState } from "react";
import DoctorCard from "@/components/doctor/DoctorCard";
import { getOnlineDoctors } from "@/api/doctor.api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


const Consultation = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getOnlineDoctors(city);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      // Small delay for smooth transition
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header & Search Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Find Specialist <span className="text-primary-light text-blue-400">Doctors</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Book online consultations with verified specialists from the comfort of your home.
            </p>

            {/* Search Bar Group */}
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Enter city or area..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                  className="bg-white border-none text-slate-900 h-12 pl-10 focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                />
              </div>
              <Button 
                onClick={fetchDoctors} 
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Doctors
              </Button>
            </div>
          </div>
          
          {/* Abstract Design Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent hidden md:block" />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {loading ? "Searching..." : `${doctors.length} Doctors available`}
              </h2>
              <p className="text-sm text-slate-500">All doctors are verified & highly rated</p>
            </div>
            
            <Button variant="outline" size="sm" className="rounded-lg gap-2 text-slate-600 border-slate-200">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 p-6 border border-slate-100 rounded-2xl">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No doctors found</h3>
              <p className="text-slate-500">Try searching for a different city or specialty.</p>
              <Button variant="link" onClick={() => {setCity(""); fetchDoctors();}} className="mt-2 text-blue-600">
                View all doctors
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Consultation;