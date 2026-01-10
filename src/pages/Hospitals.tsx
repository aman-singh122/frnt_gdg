import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Star,
  Building2,
  Phone,
  Clock,
  Stethoscope,
  Bed,
  Ambulance,
} from "lucide-react";

const Hospitals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = ["All", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];

  // TODO: connect to GET /api/hospital
  const hospitals = [
    {
      id: 1,
      name: "Apollo Hospital",
      location: "Sarita Vihar, Delhi",
      city: "Delhi",
      rating: 4.8,
      reviews: 1250,
      departments: 25,
      beds: 700,
      emergency: true,
      phone: "+91 11 2699 2999",
      timing: "24/7",
      specialties: ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
    },
    {
      id: 2,
      name: "Fortis Healthcare",
      location: "Mulund West, Mumbai",
      city: "Mumbai",
      rating: 4.7,
      reviews: 980,
      departments: 22,
      beds: 550,
      emergency: true,
      phone: "+91 22 2568 8888",
      timing: "24/7",
      specialties: ["Cardiology", "Gastroenterology", "Nephrology"],
    },
    {
      id: 3,
      name: "Max Super Specialty",
      location: "Saket, Delhi",
      city: "Delhi",
      rating: 4.6,
      reviews: 890,
      departments: 20,
      beds: 500,
      emergency: true,
      phone: "+91 11 2651 5050",
      timing: "24/7",
      specialties: ["Oncology", "Cardiology", "Neurosurgery"],
    },
    {
      id: 4,
      name: "Medanta Hospital",
      location: "Sector 38, Gurugram",
      city: "Delhi",
      rating: 4.9,
      reviews: 1450,
      departments: 28,
      beds: 800,
      emergency: true,
      phone: "+91 124 4141 414",
      timing: "24/7",
      specialties: ["Heart Care", "Liver Transplant", "Kidney Care", "Cancer Care"],
    },
    {
      id: 5,
      name: "Manipal Hospital",
      location: "HAL Road, Bangalore",
      city: "Bangalore",
      rating: 4.7,
      reviews: 1120,
      departments: 24,
      beds: 600,
      emergency: true,
      phone: "+91 80 2502 4444",
      timing: "24/7",
      specialties: ["Orthopedics", "Neurology", "Cardiology"],
    },
    {
      id: 6,
      name: "AIIMS",
      location: "Ansari Nagar, Delhi",
      city: "Delhi",
      rating: 4.5,
      reviews: 2100,
      departments: 30,
      beds: 1200,
      emergency: true,
      phone: "+91 11 2658 8500",
      timing: "24/7",
      specialties: ["All Specialties"],
    },
  ];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || selectedCity === "All" || hospital.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Find Hospitals
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore healthcare facilities across India
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search hospitals by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* City Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city === "All" ? null : city)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                (city === "All" && !selectedCity) || selectedCity === city
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredHospitals.length} hospitals
        </p>

        {/* Hospitals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300"
            >
              {/* Hospital Header */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{hospital.name}</h3>
                      <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-highlight fill-highlight" />
                        <span className="text-sm font-medium text-foreground">{hospital.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hospital.location}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{hospital.departments}</p>
                    <p className="text-xs text-muted-foreground">Departments</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Bed className="h-5 w-5 text-accent mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{hospital.beds}+</p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Star className="h-5 w-5 text-highlight mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{hospital.reviews}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Top Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.slice(0, 4).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {hospital.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {hospital.timing}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-secondary/30 border-t border-border flex items-center justify-between">
                {hospital.emergency && (
                  <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <Ambulance className="h-4 w-4" />
                    24/7 Emergency
                  </span>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="default" size="sm">
                    Book OPD
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hospitals found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Hospitals;
