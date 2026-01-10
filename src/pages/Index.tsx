import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import {
  Search,
  CalendarPlus,
  Building2,
  Stethoscope,
  FileText,
  Phone,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Heart,
  Users,
  Award,
  MapPin,
} from "lucide-react";

const Index = () => {
  const actionCards = [
    {
      title: "Book OPD",
      description: "Schedule your outpatient appointment",
      icon: CalendarPlus,
      path: "/book-opd",
      color: "primary",
    },
    {
      title: "Find Hospitals",
      description: "Explore healthcare facilities near you",
      icon: Building2,
      path: "/hospitals",
      color: "accent",
    },
    {
      title: "Find Doctors",
      description: "Connect with specialist doctors",
      icon: Stethoscope,
      path: "/doctors",
      color: "primary",
    },
    {
      title: "Medical Records",
      description: "Access your health history",
      icon: FileText,
      path: "/records",
      color: "accent",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Quick Appointments",
      description: "Book OPD slots in under 2 minutes",
    },
    {
      icon: Shield,
      title: "Secure Records",
      description: "Your data is encrypted and safe",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Get help anytime, anywhere",
    },
  ];

  const stats = [
    { value: "500+", label: "Partner Hospitals" },
    { value: "10,000+", label: "Verified Doctors" },
    { value: "1M+", label: "Appointments Booked" },
    { value: "4.8", label: "User Rating", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(210_90%_92%_/_0.8),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(168_70%_92%_/_0.6),transparent_50%)]" />
        
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-card border border-border">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
              <span className="text-sm font-medium text-muted-foreground">
                Trusted by 500+ hospitals across India
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Healthcare Without{" "}
              <span className="text-gradient">Long Queues</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Book OPD appointments, consult doctors online, and manage your medical 
              records — all in one place. Quality healthcare, simplified.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="flex gap-3 p-2 bg-card rounded-xl shadow-card border border-border">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search hospitals, doctors, or departments..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <Button variant="hero" size="lg">
                  Search
                </Button>
              </div>
              {/* TODO: connect to GET /api/hospital search */}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/book-opd">Book OPD Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-display font-bold text-foreground">
                    {stat.value}
                  </span>
                  {stat.icon && <Star className="h-6 w-6 text-highlight fill-highlight" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What would you like to do?
            </h2>
            <p className="text-muted-foreground">
              Quick access to all healthcare services you need
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  to={card.path}
                  className="group p-6 bg-card rounded-xl shadow-card border border-border hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl mb-4 ${
                      card.color === "primary"
                        ? "bg-primary-light text-primary"
                        : "bg-accent-light text-accent"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Why choose Medosphere?
                </h2>
                <p className="text-muted-foreground">
                  We're transforming how India accesses healthcare — one appointment at a time.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl gradient-primary p-8 shadow-lg">
                <div className="h-full w-full rounded-xl bg-card/10 backdrop-blur flex flex-col items-center justify-center text-center p-6">
                  <Heart className="h-16 w-16 text-primary-foreground mb-4" />
                  <h3 className="text-2xl font-display font-bold text-primary-foreground mb-2">
                    Your Health, Our Priority
                  </h3>
                  <p className="text-primary-foreground/80">
                    Connecting patients with quality healthcare providers across India
                  </p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-card-hover border border-border animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent-light flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">1M+ Users</p>
                    <p className="text-xs text-muted-foreground">Trust Medosphere</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-card-hover border border-border animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">ISO Certified</p>
                    <p className="text-xs text-muted-foreground">Secure Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-card p-8 md:p-12 rounded-2xl shadow-card border border-border">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to experience better healthcare?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join millions of Indians who've made Medosphere their trusted healthcare partner.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Already have an account?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                  <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold">
                  Medo<span className="text-sidebar-primary">sphere</span>
                </span>
              </div>
              <p className="text-sm text-sidebar-foreground/60">
                Making quality healthcare accessible to every Indian.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/book-opd" className="hover:text-sidebar-foreground transition-colors">Book OPD</Link></li>
                <li><Link to="/doctors" className="hover:text-sidebar-foreground transition-colors">Find Doctors</Link></li>
                <li><Link to="/hospitals" className="hover:text-sidebar-foreground transition-colors">Hospitals</Link></li>
                <li><Link to="/records" className="hover:text-sidebar-foreground transition-colors">Medical Records</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/about" className="hover:text-sidebar-foreground transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-sidebar-foreground transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-sidebar-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><Link to="/help" className="hover:text-sidebar-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/60">
            <p>© 2024 Medosphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
