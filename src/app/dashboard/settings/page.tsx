"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getOnboardingData, saveOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  FileText,
  LayoutDashboard,
  Calendar,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Palette,
  MessageSquare,
  User,
  Upload,
  Wand2,
  Save,
  Check,
  Target,
} from "lucide-react";

function Sidebar({ isOpen, onClose, company }: { isOpen: boolean; onClose: () => void; company: OnboardingData | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { id: "publications", label: "Publications", icon: FileText, path: "/dashboard/publications" },
    { id: "calendar", label: "Calendrier", icon: Calendar, path: "/dashboard/calendar" },
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

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
    if (data?.logo) {
      setLogoPreview(data.logo);
    }
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && companyData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setCompanyData({ ...companyData, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (companyData) {
      saveOnboardingData(companyData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const tones = [
    { id: "pedagogique" as const, label: "Pédagogique", emoji: "📚" },
    { id: "direct" as const, label: "Direct", emoji: "💪" },
    { id: "chaleureux" as const, label: "Chaleureux", emoji: "😊" },
  ];

  const voices = [
    { id: "je" as const, label: "Je" },
    { id: "on_nous" as const, label: "On / Nous" },
  ];

  if (!companyData) {
    return null;
  }

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
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-sm text-muted-foreground">Gérez les informations de votre entreprise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button onClick={handleSave} disabled={saveSuccess}>
                {saveSuccess ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Enregistré
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom de l'entreprise</Label>
                <Input
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Site internet</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={companyData.websiteUrl}
                    onChange={(e) => setCompanyData({ ...companyData, websiteUrl: e.target.value })}
                    placeholder="https://votre-site.fr"
                  />
                </div>
              </div>

              <div>
                <Label>Adresse</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    placeholder="15 Rue des Artisans, 75011 Paris"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Email de contact</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={companyData.contactEmail}
                      onChange={(e) => setCompanyData({ ...companyData, contactEmail: e.target.value })}
                      placeholder="contact@entreprise.fr"
                    />
                  </div>
                </div>

                <div>
                  <Label>Téléphone</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Description de votre activité</Label>
                <Textarea
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  placeholder="Ex: Plombier, Électricien, Maçon..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Zone d'intervention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ville principale</Label>
                <Input
                  value={companyData.interventionCity}
                  onChange={(e) => setCompanyData({ ...companyData, interventionCity: e.target.value })}
                  placeholder="Paris"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Rayon d'intervention : {companyData.interventionRadius} km</Label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={companyData.interventionRadius}
                  onChange={(e) => setCompanyData({ ...companyData, interventionRadius: parseInt(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Identité visuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Logo de l'entreprise</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="cursor-pointer">
                    <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                      logoPreview ? "border-primary" : "border-border hover:border-primary/50"
                    }`}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      Formats acceptés : PNG, JPG, SVG
                    </p>
                    <Button variant="outline" size="sm">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Générer un logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Couleur principale</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={companyData.primaryColor}
                      onChange={(e) => setCompanyData({ ...companyData, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
                    />
                    <Input
                      value={companyData.primaryColor}
                      onChange={(e) => setCompanyData({ ...companyData, primaryColor: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={companyData.secondaryColor}
                      onChange={(e) => setCompanyData({ ...companyData, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
                    />
                    <Input
                      value={companyData.secondaryColor}
                      onChange={(e) => setCompanyData({ ...companyData, secondaryColor: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ton de communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ton des publications</Label>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setCompanyData({ ...companyData, tone: tone.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        companyData.tone === tone.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tone.emoji}</span>
                        <p className="font-semibold">{tone.label}</p>
                        {companyData.tone === tone.id && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Voix des publications</Label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {voices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setCompanyData({ ...companyData, publicationVoice: voice.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        companyData.publicationVoice === voice.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg">{voice.label}</p>
                        {companyData.publicationVoice === voice.id && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border-2 border-border rounded-xl">
                <Checkbox
                  id="use-emojis"
                  checked={companyData.useEmojis}
                  onCheckedChange={(checked) => setCompanyData({ ...companyData, useEmojis: checked as boolean })}
                />
                <Label htmlFor="use-emojis" className="font-medium cursor-pointer">
                  Utiliser des émojis dans les publications
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={companyData.ownerFirstName}
                    onChange={(e) => setCompanyData({ ...companyData, ownerFirstName: e.target.value })}
                    placeholder="Jean"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Nom</Label>
                  <Input
                    value={companyData.ownerLastName}
                    onChange={(e) => setCompanyData({ ...companyData, ownerLastName: e.target.value })}
                    placeholder="Martin"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Téléphone personnel</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={companyData.ownerPhone}
                    onChange={(e) => setCompanyData({ ...companyData, ownerPhone: e.target.value })}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave} disabled={saveSuccess}>
              {saveSuccess ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Modifications enregistrées
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
