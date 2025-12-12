"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  FileText,
  LayoutDashboard,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const mockScheduledPosts = [
  { id: 1, date: "2024-01-22", title: "Conseil isolation thermique", time: "10:00", type: "Conseil" },
  { id: 2, date: "2024-01-25", title: "Chantier extension Montreuil", time: "14:30", type: "Chantier" },
  { id: 3, date: "2024-01-28", title: "Avant/Après salle de bain", time: "09:00", type: "Avant/Après" },
  { id: 4, date: "2024-02-02", title: "Rénovation toiture Paris", time: "11:00", type: "Chantier" },
  { id: 5, date: "2024-02-05", title: "Conseil choix de peinture", time: "15:30", type: "Conseil" },
];

function Sidebar({ isOpen, onClose, company }: { isOpen: boolean; onClose: () => void; company: OnboardingData | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("calendar");

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { id: "publications", label: "Publications", icon: FileText, path: "/dashboard/publications" },
    { id: "calendar", label: "Calendrier", icon: CalendarIcon, path: "/dashboard/calendar" },
    { id: "settings", label: "Paramètres", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 lg:translate-x-0 lg:static"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {company?.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.companyName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: company?.primaryColor || "#f4862d" }}
                  >
                    {company?.companyName?.charAt(0) || "P"}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-sm">{company?.companyName || "Mon entreprise"}</h2>
                  <p className="text-xs text-muted-foreground">Plan Pro</p>
                </div>
              </div>
              <button onClick={onClose} className="lg:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.push(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="w-5 h-5 mr-3" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default function CalendarPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockScheduledPosts.filter((post) => post.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} company={companyData} />

      <main className="flex-1">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Calendrier</h1>
                <p className="text-sm text-muted-foreground">Gérez vos publications programmées</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button onClick={() => router.push("/dashboard/create")}>
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle publication
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
            <div>
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Aujourd'hui
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                      <div key={day} className="text-center text-sm font-bold text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const posts = getPostsForDate(day);
                      const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                      return (
                        <motion.div
                          key={day}
                          className={`aspect-square border-2 rounded-xl p-2 cursor-pointer transition-all hover:border-primary ${
                            isToday ? "border-primary bg-primary/5" : "border-border"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex flex-col h-full">
                            <span className={`text-sm font-bold mb-1 ${isToday ? "text-primary" : ""}`}>
                              {day}
                            </span>
                            <div className="flex-1 space-y-1">
                              {posts.slice(0, 2).map((post) => (
                                <div
                                  key={post.id}
                                  className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate"
                                  title={post.title}
                                >
                                  {post.time}
                                </div>
                              ))}
                              {posts.length > 2 && (
                                <div className="text-xs text-muted-foreground">+{posts.length - 2}</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <div className="p-5 border-b border-border">
                  <h3 className="font-bold text-lg">Publications à venir</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockScheduledPosts.length} publication{mockScheduledPosts.length > 1 ? "s" : ""} programmée
                    {mockScheduledPosts.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-5 space-y-3">
                  {mockScheduledPosts.map((post) => (
                    <Card key={post.id} className="p-4 hover:shadow-md transition-all">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1 line-clamp-2">{post.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {post.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.time}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="flex-1 h-8">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1 h-8">
                            <Edit className="w-3 h-3 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
