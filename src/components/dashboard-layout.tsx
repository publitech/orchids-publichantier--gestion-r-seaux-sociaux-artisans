"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  Plus,
  Bell,
  LogOut,
  Menu,
  X,
  Users,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    id: "dashboard", 
    label: "Tableau de bord", 
    icon: LayoutDashboard, 
    path: "/dashboard",
    description: "Vue d'ensemble"
  },
  { 
    id: "publications", 
    label: "Publications", 
    icon: FileText, 
    path: "/dashboard/publications",
    description: "Gérer vos posts"
  },
  { 
    id: "calendar", 
    label: "Calendrier", 
    icon: Calendar, 
    path: "/dashboard/calendar",
    description: "Planning éditorial"
  },
  { 
    id: "competitors", 
    label: "Concurrence", 
    icon: Users, 
    path: "/dashboard/competitors",
    description: "Analyser vos concurrents"
  },
  { 
    id: "settings", 
    label: "Paramètres", 
    icon: Settings, 
    path: "/dashboard/settings",
    description: "Configuration"
  },
];

function Sidebar({ 
  isOpen, 
  onClose, 
  company 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  company: OnboardingData | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 lg:translate-x-0 shadow-2xl lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-6">
              <Image 
                src="/logo-light.svg" 
                alt="PubliChantier" 
                width={140} 
                height={32} 
                className="h-8 w-auto" 
              />
              <button 
                onClick={onClose} 
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              {company?.logo ? (
                <img 
                  src={company.logo} 
                  alt={company.companyName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ring-2 ring-primary/20"
                  style={{ backgroundColor: company?.primaryColor || "#f4862d" }}
                >
                  {company?.companyName?.charAt(0) || "P"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm truncate">{company?.companyName || "Mon entreprise"}</h2>
                <p className="text-xs text-muted-foreground">Plan Pro • 14j restants</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-white/20" : "bg-muted group-hover:bg-background"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className={`text-xs transition-colors ${
                        isActive ? "text-white/70" : "text-muted-foreground"
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-5 h-5 opacity-70" />
                    )}
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary -z-10"
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 font-medium"
              onClick={() => handleNavigation("/dashboard/create")}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              Nouvelle publication
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground h-11"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function MobileBottomNav({ company }: { company: OnboardingData | null }) {
  const router = useRouter();
  const pathname = usePathname();

  const mainItems = menuItems.slice(0, 4);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl"
    >
      <div className="grid grid-cols-4 gap-1 p-2">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => router.push(item.path)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isActive ? "bg-primary text-white" : ""
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium transition-all ${
                isActive ? "opacity-100" : "opacity-70"
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

function TopBar({ 
  onMenuClick, 
  company, 
  title = "Tableau de bord" 
}: { 
  onMenuClick: () => void; 
  company: OnboardingData | null;
  title?: string;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">{title}</h1>
            <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">
              Bienvenue {company?.ownerFirstName || ""} 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="relative h-10 w-10"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Button 
            onClick={() => router.push("/dashboard/create")}
            className="hidden sm:flex h-10"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau
          </Button>
          <Button 
            onClick={() => router.push("/dashboard/create")}
            size="icon"
            className="sm:hidden h-10 w-10"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem?.label || "Tableau de bord";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        company={companyData} 
      />

      <main className="flex-1 lg:ml-0 pb-20 lg:pb-0">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          company={companyData}
          title={getCurrentPageTitle()}
        />
        {children}
      </main>

      <MobileBottomNav company={companyData} />
    </div>
  );
}
