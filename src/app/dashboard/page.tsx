"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import DashboardLayout from "@/components/dashboard-layout";
import {
  TrendingUp,
  Eye,
  FileText,
  Users,
  Sparkles,
  Calendar,
  ImagePlus,
  Settings,
  Heart,
  MessageCircle,
  Star,
  BarChart3,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { useRouter } from "next/navigation";

const mockUpcomingPosts = [
  { id: 1, date: "2024-01-22", title: "Conseil isolation thermique", time: "10:00" },
  { id: 2, date: "2024-01-25", title: "Tutoriel installation robinet", time: "14:30" },
  { id: 3, date: "2024-01-28", title: "Avis client Montreuil", time: "09:00" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  small = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  small?: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={small ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between mb-2">
          <div className={`${small ? "w-9 h-9" : "w-10 h-10"} rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
            <Icon className={`${small ? "w-4 h-4" : "w-5 h-5"}`} style={{ color }} />
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {trend}
            </Badge>
          )}
        </div>
        <p className={`${small ? "text-2xl" : "text-2xl"} font-bold mb-0.5`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-5">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold">Statistiques</h2>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <StatCard
              icon={Eye}
              label="Vues ce mois"
              value="3.5k"
              trend="+45%"
              color="#3b82f6"
              small
            />
            <StatCard
              icon={Heart}
              label="J'aime"
              value={234}
              trend="+23%"
              color="#ef4444"
              small
            />
            <StatCard
              icon={MessageCircle}
              label="Commentaires"
              value={89}
              trend="+12%"
              color="#10b981"
              small
            />
            <StatCard
              icon={Star}
              label="Note moyenne"
              value="4.8"
              color="#fbbf24"
              small
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard
              icon={FileText}
              label="Publications ce mois"
              value={12}
              trend="+8%"
              color={companyData?.primaryColor || "#f4862d"}
              small
            />
            <StatCard
              icon={Users}
              label="Nouveaux abonnés"
              value={156}
              trend="+34%"
              color="#8b5cf6"
              small
            />
            <StatCard
              icon={BarChart3}
              label="Taux d'engagement"
              value="8.2%"
              trend="+2.1%"
              color="#06b6d4"
              small
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Publications programmées</CardTitle>
              <CardDescription className="text-xs">Vos prochaines publications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockUpcomingPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} • {post.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Modifier
                    </Button>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-3 h-9 text-sm"
                onClick={() => router.push("/dashboard/calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Voir le calendrier complet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
              <CardDescription className="text-xs">Gagnez du temps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start h-9 text-sm"
                onClick={() => router.push("/dashboard/publications")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Publications prêtes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-9 text-sm"
                onClick={() => router.push("/dashboard/create")}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Créer une publication
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-9 text-sm"
                onClick={() => router.push("/dashboard/calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendrier
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-9 text-sm"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}