import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Calendar,
  User,
  Building2,
  Download,
  Eye,
  ChevronRight,
  Filter,
  Pill,
  TestTube,
  Heart,
  X,
} from "lucide-react";

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const recordTypes = [
    { id: "all", label: "All Records", icon: FileText },
    { id: "prescription", label: "Prescriptions", icon: Pill },
    { id: "lab", label: "Lab Reports", icon: TestTube },
    { id: "diagnosis", label: "Diagnoses", icon: Heart },
  ];

  // TODO: connect to GET /api/record
  const records = [
    {
      id: 1,
      type: "prescription",
      title: "General Consultation",
      doctor: "Dr. Priya Sharma",
      hospital: "Apollo Hospital, Delhi",
      date: "Jan 10, 2024",
      description: "Prescription for fever and cold symptoms",
      medicines: ["Paracetamol 500mg", "Cetirizine 10mg", "Vitamin C"],
    },
    {
      id: 2,
      type: "lab",
      title: "Complete Blood Count",
      doctor: "Dr. Rajesh Kumar",
      hospital: "Fortis Healthcare, Mumbai",
      date: "Jan 5, 2024",
      description: "Routine blood test - All parameters normal",
      results: { hemoglobin: "14.2 g/dL", wbc: "7500/µL", platelets: "250000/µL" },
    },
    {
      id: 3,
      type: "diagnosis",
      title: "Cardiology Checkup",
      doctor: "Dr. Vikram Singh",
      hospital: "Medanta Hospital, Gurugram",
      date: "Dec 20, 2023",
      description: "Annual heart checkup - ECG and Echo normal",
      notes: "Heart function normal. Continue with regular exercise.",
    },
    {
      id: 4,
      type: "prescription",
      title: "Dermatology Visit",
      doctor: "Dr. Anita Desai",
      hospital: "Max Hospital, Bangalore",
      date: "Dec 15, 2023",
      description: "Treatment for skin allergy",
      medicines: ["Hydrocortisone cream", "Antihistamine tablets"],
    },
    {
      id: 5,
      type: "lab",
      title: "Lipid Profile",
      doctor: "Dr. Suresh Reddy",
      hospital: "Apollo Hospital, Chennai",
      date: "Dec 1, 2023",
      description: "Cholesterol test - Slightly elevated LDL",
      results: { totalCholesterol: "210 mg/dL", ldl: "140 mg/dL", hdl: "45 mg/dL" },
    },
  ];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || selectedType === "all" || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return Pill;
      case "lab":
        return TestTube;
      case "diagnosis":
        return Heart;
      default:
        return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case "prescription":
        return "bg-primary-light text-primary";
      case "lab":
        return "bg-accent-light text-accent";
      case "diagnosis":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Medical Records
            </h1>
            <p className="text-muted-foreground mt-1">
              Access your complete health history
            </p>
          </div>
          <Button variant="default">
            <FileText className="h-4 w-4 mr-2" />
            Upload Record
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* Record Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {recordTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id === "all" ? null : type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  (type.id === "all" && !selectedType) || selectedType === type.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Records List */}
        <div className="grid gap-4">
          {filteredRecords.map((record) => {
            const Icon = getRecordIcon(record.type);
            return (
              <div
                key={record.id}
                className="bg-card rounded-xl shadow-card border border-border p-5 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${getRecordColor(record.type)}`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRecordColor(record.type)}`}>
                        {record.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {record.doctor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {record.hospital}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {record.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
            <p className="text-muted-foreground">
              Your medical records will appear here
            </p>
          </div>
        )}

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
            <div className="bg-card rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">{selectedRecord.title}</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedRecord.doctor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedRecord.date}
                  </span>
                </div>
                <p className="text-foreground">{selectedRecord.description}</p>
                
                {selectedRecord.medicines && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Medicines</h4>
                    <ul className="space-y-2">
                      {selectedRecord.medicines.map((med: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Pill className="h-4 w-4 text-primary" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedRecord.results && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Test Results</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedRecord.results).map(([key, value]) => (
                        <div key={key} className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="font-medium text-foreground">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div className="p-4 bg-accent-light rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Doctor's Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="default" className="flex-1" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
