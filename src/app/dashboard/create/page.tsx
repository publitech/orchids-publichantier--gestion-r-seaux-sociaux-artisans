"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Wand2,
  Image as ImageIcon,
  Type,
  Calendar,
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";

interface PublicationMedia {
  id: string;
  url: string;
  type: "image" | "video";
}

export default function CreatePublicationPage() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  const [postType, setPostType] = useState<"avant-apres" | "conseil" | "chantier" | null>(null);
  const [media, setMedia] = useState<PublicationMedia[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
  }, []);

  const postTypes = [
    {
      id: "avant-apres" as const,
      label: "Avant/Après",
      emoji: "🏠",
      color: "#f4862d",
      description: "Montrez la transformation d'un chantier",
    },
    {
      id: "conseil" as const,
      label: "Conseil",
      emoji: "💡",
      color: "#3b82f6",
      description: "Partagez votre expertise",
    },
    {
      id: "chantier" as const,
      label: "Chantier",
      emoji: "🚧",
      color: "#10b981",
      description: "Présentez un projet en cours",
    },
  ];

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";
      setMedia((prev) => [...prev, { id: Date.now().toString() + Math.random(), url, type }]);
    });
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleGenerateContent = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const mockContent = {
        "avant-apres": `✨ Transformation complète d'une ${["cuisine", "salle de bain", "salon"][Math.floor(Math.random() * 3)]} !

Avant : Un espace vieillissant qui nécessitait une rénovation complète
Après : Un lieu moderne, fonctionnel et chaleureux

📍 ${companyData?.interventionCity || "Paris"}
⏱️ Durée : ${Math.floor(Math.random() * 4 + 1)} semaines
${companyData?.useEmojis ? "💪 " : ""}Notre équipe a réalisé l'ensemble des travaux : démolition, plomberie, électricité, pose et finitions.

${companyData?.useEmojis ? "👉 " : ""}Vous avez un projet similaire ? Contactez-nous pour un devis gratuit !`,

        conseil: `💡 Conseil de pro : ${["bien choisir ses matériaux", "optimiser votre budget rénovation", "préparer votre chantier"][Math.floor(Math.random() * 3)]}

Après ${Math.floor(Math.random() * 15 + 5)} ans d'expérience, voici ce que nous recommandons à nos clients :

${companyData?.useEmojis ? "✓" : "•"} Point 1 : La qualité prime toujours sur le prix
${companyData?.useEmojis ? "✓" : "•"} Point 2 : Anticiper les imprévus (prévoir 10-15% de budget supplémentaire)
${companyData?.useEmojis ? "✓" : "•"} Point 3 : Bien choisir ses artisans

${companyData?.useEmojis ? "💬 " : ""}Des questions ? N'hésitez pas à nous contacter !

📞 ${companyData?.phone || "01 23 45 67 89"}`,

        chantier: `🚧 Chantier en cours : ${["Extension de maison", "Rénovation complète", "Aménagement de combles"][Math.floor(Math.random() * 3)]}

📍 Localisation : ${companyData?.interventionCity || "Paris"}
⏱️ Durée estimée : ${Math.floor(Math.random() * 8 + 2)} semaines

${companyData?.useEmojis ? "🎯 " : ""}Objectif : Créer ${Math.floor(Math.random() * 30 + 20)}m² supplémentaires pour ${["une famille qui s'agrandit", "un espace de travail", "une chambre parentale"][Math.floor(Math.random() * 3)]}

Nos équipes sont à pied d'œuvre pour respecter les délais et offrir une prestation de qualité ${companyData?.useEmojis ? "✨" : "!"}

${companyData?.useEmojis ? "👉 " : ""}Suivez l'évolution du projet !`,
      };

      setContent(mockContent[postType!] || "");
      setTitle(
        postType === "avant-apres"
          ? "Avant/Après : Rénovation complète"
          : postType === "conseil"
          ? "Conseil de pro"
          : "Chantier en cours"
      );
      setIsGenerating(false);
    }, 2000);
  };

  const canPublish = postType && title && content;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Créer une publication</h1>
              <p className="text-sm text-muted-foreground">Générez du contenu en quelques clics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!canPublish}>
              <Eye className="w-5 h-5 mr-2" />
              Aperçu
            </Button>
            <Button disabled={!canPublish}>
              <Send className="w-5 h-5 mr-2" />
              Publier
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Configuration */}
          <div className="space-y-6">
            {/* Type de publication */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Type de publication</h2>
                </div>
                <div className="grid gap-3">
                  {postTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setPostType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        postType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        {postType === type.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Médias */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Photos & Vidéos</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {media.map((item) => (
                    <div key={item.id} className="relative aspect-square group">
                      <img
                        src={item.url}
                        alt="Media"
                        className="w-full h-full object-cover rounded-xl border-2 border-border"
                      />
                      <button
                        onClick={() => removeMedia(item.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleMediaUpload}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Programmation */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Programmer</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Heure</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {!scheduledDate && (
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour publier immédiatement
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Content */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">Contenu</h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={!postType || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Générer avec l'IA
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Label className="text-sm font-medium">Titre</Label>
                  <Input
                    placeholder="Titre de votre publication..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 h-12 text-base"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    placeholder="Décrivez votre publication..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 min-h-[400px] text-base"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {content.length} caractères
                    </p>
                    {content.length > 0 && (
                      <p className="text-xs text-primary">
                        Excellent ! {companyData?.useEmojis ? "✨" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {!postType && (
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez un type de publication pour générer du contenu automatiquement
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border max-w-md w-full max-h-[80vh] overflow-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Aperçu</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  {companyData?.logo ? (
                    <img
                      src={companyData.logo}
                      alt={companyData.companyName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: companyData?.primaryColor || "#f4862d" }}
                    >
                      {companyData?.companyName?.charAt(0) || "P"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{companyData?.companyName || "Votre entreprise"}</p>
                    <p className="text-xs text-muted-foreground">Il y a quelques instants</p>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-bold text-lg mb-2">{title}</h4>
                  <p className="text-sm whitespace-pre-wrap">{content}</p>
                </div>

                {/* Media */}
                {media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {media.slice(0, 4).map((item, idx) => (
                      <div key={item.id} className={media.length === 1 ? "col-span-2" : ""}>
                        <img
                          src={item.url}
                          alt={`Media ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Type badge */}
                {postType && (
                  <Badge
                    style={{
                      backgroundColor:
                        postTypes.find((t) => t.id === postType)?.color + "20",
                      color: postTypes.find((t) => t.id === postType)?.color,
                    }}
                  >
                    {postTypes.find((t) => t.id === postType)?.label}
                  </Badge>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
