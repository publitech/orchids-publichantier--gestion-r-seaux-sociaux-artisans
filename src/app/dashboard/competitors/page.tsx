"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  ThumbsUp,
  MessageCircle,
  Share2,
  Calendar,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  FileText,
  LayoutDashboard,
  Target,
  ExternalLink,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Loader2,
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

function Sidebar({ isOpen, onClose, company }: { isOpen: boolean; onClose: () => void; company: OnboardingData | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("competitors");

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { id: "publications", label: "Publications", icon: FileText, path: "/dashboard/publications" },
    { id: "calendar", label: "Calendrier", icon: Calendar, path: "/dashboard/calendar" },
    { id: "competitors", label: "Concurrence", icon: Target, path: "/dashboard/competitors" },
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

function AddCompetitorDialog() {
  const [open, setOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<"input" | "analyzing" | "success">("input");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("analyzing");
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep("success");
      
      setTimeout(() => {
        setOpen(false);
        setStep("input");
        setFormData({
          name: "",
          website: "",
          instagram: "",
          facebook: "",
          linkedin: "",
        });
      }, 2000);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un concurrent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Ajouter un concurrent
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label>Nom de l'entreprise *</Label>
              <Input
                placeholder="Ex: Rénovation Pro Paris"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 h-12"
                required
              />
            </div>

            <div>
              <Label>Site internet</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Instagram</Label>
                <Input
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input
                  placeholder="PageName"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  placeholder="company-name"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Notre IA analysera automatiquement les performances de ce concurrent sur les réseaux sociaux
                  pour vous fournir des insights précieux.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1">
                Analyser le concurrent
              </Button>
            </div>
          </form>
        )}

        {step === "analyzing" && (
          <div className="py-12 text-center space-y-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <div>
              <h3 className="text-xl font-bold mb-2">Analyse en cours...</h3>
              <p className="text-muted-foreground">
                Nous analysons les performances de {formData.name} sur les réseaux sociaux
              </p>
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-3 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Extraction des données Instagram...</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Analyse de l'engagement...</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Calcul des statistiques...</span>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold mb-2">Concurrent ajouté !</h3>
              <p className="text-muted-foreground">
                {formData.name} a été ajouté à votre liste de surveillance
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CompetitorsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const filteredCompetitors = competitors.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (engagement: number) => {
    if (engagement >= 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (engagement >= 3) return <TrendingUp className="w-4 h-4 text-orange-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

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
                <h1 className="text-2xl font-bold">Analyse de la concurrence</h1>
                <p className="text-sm text-muted-foreground">
                  Surveillez et analysez {competitors.length} concurrent{competitors.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <AddCompetitorDialog />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{competitors.length}</p>
                <p className="text-sm text-muted-foreground">Concurrents suivis</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {Math.round(competitors.reduce((acc, c) => acc + c.stats.followers, 0) / competitors.length).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Abonnés moyens</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {(competitors.reduce((acc, c) => acc + c.stats.engagement, 0) / competitors.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Engagement moyen</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">2.5x</p>
                <p className="text-sm text-muted-foreground">Publications/semaine</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un concurrent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Competitors List */}
          <div className="space-y-6">
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir le détail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Statistiques
                      </h4>
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
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Activité récente
                      </h4>
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
              <AddCompetitorDialog />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
