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
  CheckCircle2,
  Clock,
  ImagePlus,
  Settings,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const mockSuggestedPosts = [
  {
    id: 1,
    title: "Avant/Après : Rénovation complète d'une cuisine à Paris 11ème",
    type: "Avant/Après",
    status: "ready",
    preview: "🏠 Transformation complète d'une cuisine de 15m². De l'ancien au moderne en 3 semaines ! ✨",
    image: null,
    scheduledFor: null,
  },
  {
    id: 2,
    title: "Conseil : Comment choisir le bon revêtement de sol ?",
    type: "Conseil",
    status: "ready",
    preview: "💡 Parquet, carrelage ou vinyle ? On vous aide à faire le bon choix selon vos besoins et votre budget.",
    image: null,
    scheduledFor: null,
  },
  {
    id: 3,
    title: "Chantier en cours : Extension de maison à Montreuil",
    type: "Chantier",
    status: "draft",
    preview: "🚧 Découvrez l'avancement de notre projet d'extension. 40m² supplémentaires pour une famille qui s'agrandit !",
    image: null,
    scheduledFor: "2024-01-25",
  },
];

const mockUpcomingPosts = [
  { id: 1, date: "2024-01-22", title: "Conseil isolation thermique", time: "10:00" },
  { id: 2, date: "2024-01-25", title: "Chantier extension Montreuil", time: "14:30" },
  { id: 3, date: "2024-01-28", title: "Avant/Après salle de bain", time: "09:00" },
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

function SuggestedPostCard({ post }: { post: typeof mockSuggestedPosts[0] }) {
  const typeColors = {
    "Avant/Après": "#f4862d",
    "Conseil": "#3b82f6",
    "Chantier": "#10b981",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge style={{ backgroundColor: typeColors[post.type as keyof typeof typeColors] + "20", color: typeColors[post.type as keyof typeof typeColors] }}>
            {post.type}
          </Badge>
          <Badge variant={post.status === "ready" ? "default" : "secondary"}>
            {post.status === "ready" ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" /> Prêt
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" /> Brouillon
              </>
            )}
          </Badge>
        </div>

        {post.image && (
          <div className="w-full h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{post.preview}</p>

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1 h-9">
            <Sparkles className="w-4 h-4 mr-2" />
            Personnaliser
          </Button>
          <Button size="sm" variant="outline" className="h-9 px-3">
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {post.scheduledFor && (
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Programmé le {new Date(post.scheduledFor).toLocaleDateString("fr-FR")}
          </div>
        )}
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

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Publications suggérées</h2>
              <p className="text-sm text-muted-foreground">Personnalisez et publiez en un clic</p>
            </div>
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Générer plus
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSuggestedPosts.map((post) => (
              <SuggestedPostCard key={post.id} post={post} />
            ))}
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