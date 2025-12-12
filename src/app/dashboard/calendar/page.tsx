"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import DashboardLayout from "@/components/dashboard-layout";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

const mockScheduledPosts = [
  { id: 1, date: "2024-01-22", title: "Conseil isolation thermique", time: "10:00", type: "Conseil" },
  { id: 2, date: "2024-01-25", title: "Chantier extension Montreuil", time: "14:30", type: "Chantier" },
  { id: 3, date: "2024-01-28", title: "Avant/Après salle de bain", time: "09:00", type: "Avant/Après" },
  { id: 4, date: "2024-02-02", title: "Rénovation toiture Paris", time: "11:00", type: "Chantier" },
  { id: 5, date: "2024-02-05", title: "Conseil choix de peinture", time: "15:30", type: "Conseil" },
];

export default function CalendarPage() {
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

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
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
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
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Upcoming Publications Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Publications à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}