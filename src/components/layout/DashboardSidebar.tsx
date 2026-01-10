import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CalendarPlus,
  Video,
  FileText,
  MessageCircle,
  LogOut,
  Heart,
  User,
  Clock,
  Building2,
  Stethoscope,
} from "lucide-react";

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Book OPD", path: "/book-opd", icon: CalendarPlus },
    // { name: "Consult Online", path: "/consult", icon: Video },
    { name: "My Appointments", path: "/appointments", icon: Clock },
    { name: "Hospitals", path: "/hospitals", icon: Building2 },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Medical Records", path: "/records", icon: FileText },
    { name: "MediChat", path: "/medichat", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get user from localStorage
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shadow-md">
            <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-sidebar-foreground">
            Medo<span className="text-sidebar-primary">sphere</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary">
            <User className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60">Patient</p>
          </div>
        </div>
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
