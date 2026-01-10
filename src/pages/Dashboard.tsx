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
