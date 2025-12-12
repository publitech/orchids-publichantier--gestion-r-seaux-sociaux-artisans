"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Instagram,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

const mockPublishedPosts = [
  {
    id: 1,
    title: "Conseil : Comment choisir le bon revêtement de sol ?",
    type: "Conseil",
    publishedAt: "2024-01-18",
    platform: "Instagram",
    image: null,
    stats: {
      views: 482,
      likes: 34,
      comments: 8,
    },
  },
  {
    id: 2,
    title: "Tutoriel : Installer un robinet thermostatique",
    type: "Tutoriel",
    publishedAt: "2024-01-15",
    platform: "Instagram",
    image: null,
    stats: {
      views: 721,
      likes: 56,
      comments: 12,
    },
  },
  {
    id: 3,
    title: "Actualité : Nouvelles normes d'isolation 2024",
    type: "Actualité",
    publishedAt: "2024-01-12",
    platform: "Instagram",
    image: null,
    stats: {
      views: 638,
      likes: 45,
      comments: 15,
    },
  },
  {
    id: 4,
    title: "Avis : Client satisfait à Montreuil",
    type: "Avis",
    publishedAt: "2024-01-10",
    platform: "Instagram",
    image: null,
    stats: {
      views: 892,
      likes: 78,
      comments: 23,
    },
  },
  {
    id: 5,
    title: "Conseil : Optimiser l'isolation de votre maison",
    type: "Conseil",
    publishedAt: "2024-01-08",
    platform: "Instagram",
    image: null,
    stats: {
      views: 543,
      likes: 41,
      comments: 9,
    },
  },
];

function PublishedPostCard({ post }: { post: typeof mockPublishedPosts[0] }) {
  const typeColors = {
    "Avis": "#fbbf24",
    "Conseil": "#3b82f6",
    "Tutoriel": "#8b5cf6",
    "Actualité": "#ef4444",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge style={{ backgroundColor: typeColors[post.type as keyof typeof typeColors] + "20", color: typeColors[post.type as keyof typeof typeColors] }} className="text-xs">
            {post.type}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <h3 className="font-semibold text-sm mb-3 line-clamp-2">{post.title}</h3>

        <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{post.stats.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-medium">{post.stats.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium">{post.stats.comments}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Régénérer
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
            <Instagram className="w-3.5 h-3.5 mr-1.5" />
            Story
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HistoriquePage() {
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-lg font-bold">Historique des publications</h2>
              <p className="text-sm text-muted-foreground">Publications déjà publiées sur vos réseaux</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPublishedPosts.map((post) => (
              <PublishedPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}