"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Eye,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ImagePlus,
  RefreshCw,
  Filter,
} from "lucide-react";

const mockSuggestedPosts = [
  {
    id: 1,
    title: "Conseil : Comment choisir le bon revêtement de sol ?",
    type: "Conseil",
    status: "ready",
    preview: "💡 Parquet, carrelage ou vinyle ? On vous aide à faire le bon choix selon vos besoins et votre budget.",
    image: null,
    scheduledFor: null,
  },
  {
    id: 2,
    title: "Tutoriel : Installer un robinet thermostatique",
    type: "Tutoriel",
    status: "ready",
    preview: "🔧 Apprenez à installer un robinet thermostatique en 5 étapes simples. Économies d'énergie garanties !",
    image: null,
    scheduledFor: null,
  },
  {
    id: 3,
    title: "Actualité : Nouvelles normes d'isolation 2024",
    type: "Actualité",
    status: "ready",
    preview: "📰 Les nouvelles normes d'isolation thermique entrent en vigueur ce mois-ci. Ce qui change pour vos projets.",
    image: null,
    scheduledFor: null,
  },
  {
    id: 4,
    title: "Avis : Client satisfait à Montreuil",
    type: "Avis",
    status: "ready",
    preview: "⭐ Découvrez le témoignage de M. Dupont sur notre rénovation complète de sa salle de bain. 5 étoiles !",
    image: null,
    scheduledFor: null,
  },
  {
    id: 5,
    title: "Conseil : Optimiser l'isolation de votre maison",
    type: "Conseil",
    status: "draft",
    preview: "🏡 Les meilleures techniques pour améliorer votre isolation et réduire vos factures d'énergie.",
    image: null,
    scheduledFor: "2024-01-25",
  },
];

function SuggestedPostCard({ post, onRegenerate }: { post: typeof mockSuggestedPosts[0]; onRegenerate: () => void }) {
  const typeColors = {
    "Avis": "#fbbf24",
    "Conseil": "#3b82f6",
    "Tutoriel": "#8b5cf6",
    "Actualité": "#ef4444",
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
          <Button size="sm" variant="outline" className="h-9 px-3" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4" />
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

export default function PublicationsPretesPage() {
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const categories = ["Tous", "Conseil", "Tutoriel", "Actualité", "Avis"];

  const filteredPosts = selectedCategory === "Tous" 
    ? mockSuggestedPosts 
    : mockSuggestedPosts.filter(post => post.type === selectedCategory);

  const handleRegenerate = (postId: number) => {
    console.log("Régénérer publication", postId);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-lg font-bold">Publications Prêtes</h2>
              <p className="text-sm text-muted-foreground">Personnalisez et publiez en un clic</p>
            </div>
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Générer plus
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <SuggestedPostCard key={post.id} post={post} onRegenerate={() => handleRegenerate(post.id)} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
