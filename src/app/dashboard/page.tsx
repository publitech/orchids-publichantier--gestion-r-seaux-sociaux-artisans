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
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
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
      <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
        <section>
          <h2 className="text-lg font-bold mb-4">Vue d'ensemble</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={FileText}
              label="Publications ce mois"
              value={12}
              trend="+23%"
              color={companyData?.primaryColor || "#f4862d"}
            />
            <StatCard
              icon={Eye}
              label="Vues totales"
              value="3,456"
              trend="+45%"
              color="#3b82f6"
            />
            <StatCard
              icon={Users}
              label="Engagements"
              value={234}
              trend="+12%"
              color="#10b981"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Publications programmées</CardTitle>
              <CardDescription>Vos prochaines publications à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUpcomingPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {post.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Gagnez du temps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ImagePlus className="w-4 h-4 mr-3" />
                Ajouter des photos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="w-4 h-4 mr-3" />
                Générer une publication
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/calendar")}
              >
                <Calendar className="w-4 h-4 mr-3" />
                Voir le calendrier
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}