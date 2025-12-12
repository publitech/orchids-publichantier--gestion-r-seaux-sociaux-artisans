"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  ThumbsUp,
  MessageCircle,
  Share2,
  ExternalLink,
  Instagram,
  Facebook,
  Linkedin,
  Eye,
  Calendar,
  Loader2,
  Target,
  BarChart3,
  Globe,
} from "lucide-react";

interface Competitor {
  id: number;
  name: string;
  website: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  addedDate: string;
  stats: {
    followers: number;
    avgLikes: number;
    avgComments: number;
    postFrequency: string;
    engagement: number;
  };
  recentPosts: Array<{
    date: string;
    likes: number;
    comments: number;
  }>;
}

const mockCompetitors: Competitor[] = [
  {
    id: 1,
    name: "Rénovation Pro Paris",
    website: "https://renovationpro-paris.fr",
    instagram: "renovationpro_paris",
    facebook: "RenovationProParis",
    addedDate: "2024-01-10",
    stats: {
      followers: 3420,
      avgLikes: 127,
      avgComments: 18,
      postFrequency: "3x/semaine",
      engagement: 4.2,
    },
    recentPosts: [
      { date: "2024-01-15", likes: 145, comments: 23 },
      { date: "2024-01-12", likes: 132, comments: 19 },
      { date: "2024-01-09", likes: 104, comments: 12 },
    ],
  },
  {
    id: 2,
    name: "Artisan BTP Expert",
    website: "https://artisan-btp-expert.fr",
    instagram: "artisanbtp",
    linkedin: "artisan-btp-expert",
    addedDate: "2024-01-08",
    stats: {
      followers: 1850,
      avgLikes: 89,
      avgComments: 12,
      postFrequency: "2x/semaine",
      engagement: 5.5,
    },
    recentPosts: [
      { date: "2024-01-14", likes: 98, comments: 15 },
      { date: "2024-01-11", likes: 87, comments: 11 },
      { date: "2024-01-07", likes: 82, comments: 10 },
    ],
  },
];

export default function CompetitorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [competitors, setCompetitors] = useState(mockCompetitors);
  
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const filteredCompetitors = competitors.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (engagement: number) => {
    if (engagement >= 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (engagement >= 3) return <TrendingUp className="w-4 h-4 text-orange-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Concurrents suivis</CardTitle>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{competitors.length}</div>
              <CardDescription className="text-sm text-muted-foreground">Concurrents suivis</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Abonnés moyens</CardTitle>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {Math.round(competitors.reduce((acc, c) => acc + c.stats.followers, 0) / competitors.length).toLocaleString()}
              </div>
              <CardDescription className="text-sm text-muted-foreground">Abonnés moyens</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement moyen</CardTitle>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {(competitors.reduce((acc, c) => acc + c.stats.engagement, 0) / competitors.length).toFixed(1)}%
              </div>
              <CardDescription className="text-sm text-muted-foreground">Engagement moyen</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Publications/semaine</CardTitle>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">2.5x</div>
              <CardDescription className="text-sm text-muted-foreground">Publications/semaine</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un concurrent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 w-full"
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex-1 sm:flex-none">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un concurrent
          </Button>
        </div>

        {/* Competitors List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCompetitors.map((competitor) => (
            <Card key={competitor.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                      {competitor.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{competitor.name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {competitor.website && (
                          <a
                            href={competitor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Globe className="w-3 h-3" />
                            Site web
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <span>•</span>
                        <span>Ajouté le {new Date(competitor.addedDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stats */}
                  <div>
                    <CardTitle className="text-sm font-medium mb-4">Statistiques</CardTitle>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Abonnés</span>
                        </div>
                        <span className="font-bold">{competitor.stats.followers.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">J'aime moyens</span>
                        </div>
                        <span className="font-bold">{competitor.stats.avgLikes}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Commentaires moyens</span>
                        </div>
                        <span className="font-bold">{competitor.stats.avgComments}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Fréquence</span>
                        </div>
                        <span className="font-bold">{competitor.stats.postFrequency}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(competitor.stats.engagement)}
                          <span className="text-sm font-medium">Taux d'engagement</span>
                        </div>
                        <span className="font-bold text-primary">{competitor.stats.engagement}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <CardTitle className="text-sm font-medium mb-4">Activité récente</CardTitle>
                    <div className="space-y-3">
                      {competitor.recentPosts.map((post, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {competitor.instagram && (
                      <div className="mt-4 p-3 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">📸</span>
                          <span className="text-sm font-medium">Instagram</span>
                        </div>
                        <a
                          href={`https://instagram.com/${competitor.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          @{competitor.instagram}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompetitors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aucun concurrent trouvé</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Essayez de modifier votre recherche"
                : "Commencez par ajouter votre premier concurrent"}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un concurrent
            </Button>
          </div>
        )}
      </div>

      {/* Add Competitor Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Ajouter un concurrent
            </DialogTitle>
            <DialogDescription>
              Notre IA analysera automatiquement les performances de ce concurrent sur les réseaux sociaux
              pour vous fournir des insights précieux.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 py-4">
            <div>
              <Label>Nom de l'entreprise *</Label>
              <Input
                placeholder="Ex: Rénovation Pro Paris"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                className="mt-1 h-12"
                required
              />
            </div>

            <div>
              <Label>Site internet</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={newCompetitor.website}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, website: e.target.value })}
                className="mt-1 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Instagram</Label>
                <Input
                  placeholder="@username"
                  value={newCompetitor.instagram}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, instagram: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input
                  placeholder="PageName"
                  value={newCompetitor.facebook}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, facebook: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  placeholder="company-name"
                  value={newCompetitor.linkedin}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, linkedin: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Analyser le concurrent
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}