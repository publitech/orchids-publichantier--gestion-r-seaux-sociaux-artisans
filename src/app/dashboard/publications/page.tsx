"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

const mockPublications = [
  {
    id: 1,
    title: "Rénovation complète cuisine Paris 11ème",
    type: "Avant/Après",
    status: "published",
    date: "2024-01-15",
    thumbnail: null,
    networks: ["instagram", "facebook"],
    stats: { likes: 156, comments: 23, shares: 12, views: 1245 },
  },
  {
    id: 2,
    title: "Conseil : Choisir le bon revêtement de sol",
    type: "Conseil",
    status: "published",
    date: "2024-01-12",
    thumbnail: null,
    networks: ["linkedin", "facebook"],
    stats: { likes: 89, comments: 15, shares: 8, views: 876 },
  },
  {
    id: 3,
    title: "Extension maison Montreuil - En cours",
    type: "Chantier",
    status: "scheduled",
    date: "2024-01-25",
    thumbnail: null,
    networks: ["instagram"],
    stats: { likes: 0, comments: 0, shares: 0, views: 0 },
  },
  {
    id: 4,
    title: "Transformation salle de bain vintage",
    type: "Avant/Après",
    status: "draft",
    date: null,
    thumbnail: null,
    networks: [],
    stats: { likes: 0, comments: 0, shares: 0, views: 0 },
  },
];

export default function PublicationsPage() {
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [filterType, setFilterType] = useState<"all" | "Avant/Après" | "Conseil" | "Chantier">("all");
  const router = useRouter();

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const filteredPublications = mockPublications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || pub.status === filterStatus;
    const matchesType = filterType === "all" || pub.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Publié
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500">
            <Clock className="w-3 h-3 mr-1" /> Programmé
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="secondary">
            <Edit className="w-3 h-3 mr-1" /> Brouillon
          </Badge>
        );
      default:
        return null;
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "instagram":
        return "📸";
      case "facebook":
        return "👍";
      case "linkedin":
        return "💼";
      default:
        return "🌐";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Publications</h3>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{mockPublications.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Publiées</h3>
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{mockPublications.filter(p => p.status === "published").length}</p>
              <p className="text-xs text-muted-foreground">Actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Programmées</h3>
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{mockPublications.filter(p => p.status === "scheduled").length}</p>
              <p className="text-xs text-muted-foreground">À venir</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Brouillons</h3>
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Edit className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{mockPublications.filter(p => p.status === "draft").length}</p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher une publication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="scheduled">Programmé</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Avant/Après">Avant/Après</SelectItem>
              <SelectItem value="Conseil">Conseil</SelectItem>
              <SelectItem value="Chantier">Chantier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPublications.map((pub) => (
            <Card key={pub.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted flex items-center justify-center border-b border-border">
                  <ImageIcon className="w-16 h-16 text-muted-foreground opacity-30" />
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold mb-2 line-clamp-2">{pub.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(pub.status)}
                        <Badge variant="outline">{pub.type}</Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {pub.date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(pub.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}

                  {pub.networks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Réseaux :</span>
                      {pub.networks.map((network) => (
                        <span key={network} className="text-base">
                          {getNetworkIcon(network)}
                        </span>
                      ))}
                    </div>
                  )}

                  {pub.status === "published" && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <ThumbsUp className="w-3 h-3" />
                        </div>
                        <p className="font-bold text-sm">{pub.stats.likes}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <MessageCircle className="w-3 h-3" />
                        </div>
                        <p className="font-bold text-sm">{pub.stats.comments}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Eye className="w-3 h-3" />
                        </div>
                        <p className="font-bold text-sm">{pub.stats.views}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aucune publication trouvée</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== "all" || filterType !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par créer votre première publication"}
            </p>
            <Button onClick={() => router.push("/dashboard/create")}>
              <Plus className="w-5 h-5 mr-2" />
              Créer une publication
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}