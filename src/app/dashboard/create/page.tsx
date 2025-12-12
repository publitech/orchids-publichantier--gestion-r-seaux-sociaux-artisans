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
  Video as VideoIcon,
  Type,
  Calendar,
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Camera,
  Film,
  ChevronRight,
  Briefcase,
  Megaphone,
} from "lucide-react";

type MediaType = "photo" | "video" | null;
type IntentionType = "chantier" | "communication" | null;
type PhotoSubType = "classique" | "avant-apres" | "montage" | null;
type CommunicationSubType = "recrutement" | "actualite" | "annonce" | null;
type VideoSubType = "classique" | "avant-apres" | "timelapse" | "montage" | null;

interface PublicationMedia {
  id: string;
  url: string;
  type: "image" | "video";
}

interface Step {
  id: string;
  title: string;
  subtitle?: string;
}

export default function CreatePublicationPage() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<OnboardingData | null>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [intentionType, setIntentionType] = useState<IntentionType>(null);
  const [photoSubType, setPhotoSubType] = useState<PhotoSubType>(null);
  const [videoSubType, setVideoSubType] = useState<VideoSubType>(null);
  const [communicationSubType, setCommunicationSubType] = useState<CommunicationSubType>(null);
  
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

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep((s) => s - 1);
    }
  };

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
      const mockContent = `✨ Transformation complète !

Avant : Un espace vieillissant qui nécessitait une rénovation
Après : Un lieu moderne et chaleureux

📍 ${companyData?.interventionCity || "Paris"}
⏱️ Durée : 3 semaines
${companyData?.useEmojis ? "💪 " : ""}Travaux réalisés : démolition, plomberie, électricité, finitions

${companyData?.useEmojis ? "👉 " : ""}Vous avez un projet similaire ? Contactez-nous !`;

      setContent(mockContent);
      setTitle("Rénovation complète");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Créer une publication</h1>
              <p className="text-sm text-muted-foreground">
                {currentStep === 0 && "Choisissez le type de média"}
                {currentStep === 1 && "Quelle est votre intention ?"}
                {currentStep === 2 && "Précisez le type"}
                {currentStep === 3 && "Ajoutez vos médias et contenu"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Choix Photo/Vidéo */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Type de média</h2>
                <p className="text-muted-foreground">Photo ou vidéo ?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.button
                  onClick={() => {
                    setMediaType("photo");
                    handleNext();
                  }}
                  className="p-8 rounded-2xl border-2 border-border hover:border-primary transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <Camera className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">📸 Photo</p>
                      <p className="text-sm text-muted-foreground">
                        Idéal pour montrer vos réalisations
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setMediaType("video");
                    handleNext();
                  }}
                  className="p-8 rounded-2xl border-2 border-border hover:border-primary transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <Film className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">🎥 Vidéo</p>
                      <p className="text-sm text-muted-foreground">
                        Parfait pour raconter une histoire
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Intention (Chantier ou Communication) */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Quel type de publication {mediaType === "photo" ? "photo" : "vidéo"} ?
                </h2>
                <p className="text-muted-foreground">Choisissez l'objectif de votre publication</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.button
                  onClick={() => {
                    setIntentionType("chantier");
                    handleNext();
                  }}
                  className="p-8 rounded-2xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold mb-2">🏗️ Chantier / Réalisation</p>
                      <p className="text-sm text-muted-foreground">
                        Montrez vos travaux, avant/après, chantiers en cours
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 opacity-70">
                        80% des publications
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setIntentionType("communication");
                    handleNext();
                  }}
                  className="p-8 rounded-2xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Megaphone className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold mb-2">📢 Communication / Annonce</p>
                      <p className="text-sm text-muted-foreground">
                        Recrutement, actualité, information clients
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 opacity-70">
                        Photos optionnelles
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Sous-types selon parcours */}
          {currentStep === 2 && intentionType === "chantier" && mediaType === "photo" && (
            <motion.div
              key="step3-photo-chantier"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Type de chantier photo</h2>
                <p className="text-muted-foreground">Choisissez le format de votre publication</p>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <motion.button
                  onClick={() => {
                    setPhotoSubType("classique");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">📸 Photo classique</p>
                      <p className="text-sm text-muted-foreground">
                        1 à 10 photos de votre chantier avec texte généré par IA
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setPhotoSubType("avant-apres");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-primary/50 bg-primary/5 hover:border-primary transition-all text-left group relative overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Badge className="absolute top-3 right-3 bg-primary">⭐ Populaire</Badge>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">🏠 Avant / Après</p>
                      <p className="text-sm text-muted-foreground">
                        Montrez la transformation : photos avant + photos après
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setPhotoSubType("montage");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                      <Wand2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">✨ Mise en valeur (Design IA)</p>
                      <p className="text-sm text-muted-foreground">
                        Montage premium : grille, couverture magazine, template stylisé
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && intentionType === "communication" && (
            <motion.div
              key="step3-communication"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Type d'annonce</h2>
                <p className="text-muted-foreground">Que voulez-vous communiquer ?</p>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <motion.button
                  onClick={() => {
                    setCommunicationSubType("recrutement");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">👷</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">Recrutement</p>
                      <p className="text-sm text-muted-foreground">
                        Vous cherchez à agrandir votre équipe
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setCommunicationSubType("actualite");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📰</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">Actualité</p>
                      <p className="text-sm text-muted-foreground">
                        Partagez une nouveauté ou une information importante
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setCommunicationSubType("annonce");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📢</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">Annonce libre</p>
                      <p className="text-sm text-muted-foreground">
                        Congés, zone d'intervention, nouveauté...
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Vidéo chantier */}
          {currentStep === 2 && intentionType === "chantier" && mediaType === "video" && (
            <motion.div
              key="step3-video-chantier"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Type de vidéo chantier</h2>
                <p className="text-muted-foreground">Choisissez le format vidéo</p>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <motion.button
                  onClick={() => {
                    setVideoSubType("classique");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <VideoIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">🎥 Vidéo classique</p>
                      <p className="text-sm text-muted-foreground">
                        Vidéo brute de votre chantier avec texte IA
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setVideoSubType("avant-apres");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-primary/50 bg-primary/5 hover:border-primary transition-all text-left group relative"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Badge className="absolute top-3 right-3 bg-primary">⭐ Populaire</Badge>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">🏠 Avant / Après vidéo</p>
                      <p className="text-sm text-muted-foreground">
                        Comparaison animée ou split screen
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setVideoSubType("timelapse");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                      <Film className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">⏱️ Timelapse</p>
                      <p className="text-sm text-muted-foreground">
                        Accéléré du chantier (vidéo ou photos assemblées)
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setVideoSubType("montage");
                    handleNext();
                  }}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-primary transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
                      <Wand2 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">✨ Montage IA premium</p>
                      <p className="text-sm text-muted-foreground">
                        Vidéo stylisée cinématique avec overlay logo et couleurs
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Création finale */}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Médias */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <h2 className="font-bold text-lg">
                        {mediaType === "photo" ? "Photos" : "Vidéos"}
                      </h2>
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
                          accept={mediaType === "photo" ? "image/*" : "video/*"}
                          multiple
                          className="hidden"
                          onChange={handleMediaUpload}
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Contenu */}
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
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Générer
                          </>
                        )}
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Titre</Label>
                      <Input
                        placeholder="Titre..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        placeholder="Décrivez votre publication..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 min-h-[300px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" size="lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Aperçu
                </Button>
                <Button size="lg">
                  <Send className="w-5 h-5 mr-2" />
                  Publier
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
