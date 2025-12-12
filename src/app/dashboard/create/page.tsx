"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOnboardingData, type OnboardingData } from "@/lib/onboarding-storage";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Wand2,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  X,
  Camera,
  Film,
  ChevronRight,
  Briefcase,
  Megaphone,
  Mic,
  Type as TypeIcon,
  Info,
  Phone,
  Mail,
  MapPin,
  Globe,
  Check,
  RefreshCw,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";

type MediaType = "photo" | "video" | null;
type IntentionType = "chantier" | "communication" | null;
type PhotoSubType = "classique" | "avant-apres" | "montage" | null;
type CommunicationSubType = "recrutement" | "actualite" | "annonce" | null;
type VideoSubType = "classique" | "avant-apres" | "timelapse" | "montage" | null;
type RetoucheLevel = "original" | "intense" | "smart";

interface PublicationMedia {
  id: string;
  url: string;
  type: "image" | "video";
  file: File;
}

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  caption: string;
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
  const [vocalDescription, setVocalDescription] = useState("");
  const [writtenDescription, setWrittenDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [addCompanyInfo, setAddCompanyInfo] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [retoucheLevel, setRetoucheLevel] = useState<RetoucheLevel>("smart");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([
    { id: "instagram", name: "Instagram", icon: "📸", caption: "" },
    { id: "facebook", name: "Facebook", icon: "👍", caption: "" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", caption: "" },
  ]);
  const [selectedNetwork, setSelectedNetwork] = useState("instagram");
  
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    website: "",
  });
  
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const data = getOnboardingData();
    setCompanyData(data);
    if (data) {
      setContactInfo({
        phone: data.phone || "",
        email: data.contactEmail || "",
        address: data.address || "",
        website: data.websiteUrl || "",
      });
    }
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
    
    if (media.length + files.length > 10) {
      alert("Maximum 10 photos autorisées");
      return;
    }

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";
      setMedia((prev) => [...prev, { 
        id: Date.now().toString() + Math.random(), 
        url, 
        type,
        file 
      }]);
    });
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    setVocalDescription("Transcription automatique : Rénovation complète d'une salle de bain à Paris 11ème, durée du chantier 3 semaines, client très satisfait...");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGeneratePublication = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const baseCaption = `✨ Transformation complète !

${companyData?.useEmojis ? "📍 " : ""}${contactInfo.address || companyData?.interventionCity || "Paris"}
${companyData?.useEmojis ? "⏱️ " : ""}Durée : 3 semaines
${companyData?.useEmojis ? "💪 " : ""}Travaux réalisés : démolition, plomberie, électricité, finitions
${companyData?.useEmojis ? "😊 " : ""}Client satisfait à 100%

${addCompanyInfo ? `\n📞 ${contactInfo.phone}\n📧 ${contactInfo.email}\n📍 ${contactInfo.address}\n🌐 ${contactInfo.website}\n` : ""}

#renovation #batiment #artisan #chantier #travaux #${companyData?.interventionCity?.toLowerCase().replace(/\s/g, "")}`;

      setGeneratedCaption(baseCaption);
      
      setSocialNetworks([
        { id: "instagram", name: "Instagram", icon: "📸", caption: baseCaption },
        { id: "facebook", name: "Facebook", icon: "👍", caption: baseCaption.replace(/#/g, "") + "\n\nRetrouvez-nous sur Facebook pour plus de réalisations !" },
        { id: "linkedin", name: "LinkedIn", icon: "💼", caption: "Projet de rénovation complète réalisé à " + (companyData?.interventionCity || "Paris") + ". Notre équipe a effectué une transformation complète en 3 semaines. Expertise en démolition, plomberie, électricité et finitions." },
      ]);
      
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  const handleRegenerateCaption = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const variations = [
        "🏠 Avant/Après spectaculaire !",
        "🔨 Nouveau projet terminé avec succès !",
        "✅ Rénovation complète livrée !",
      ];
      const randomStart = variations[Math.floor(Math.random() * variations.length)];
      setGeneratedCaption(randomStart + generatedCaption.substring(generatedCaption.indexOf("\n")));
      
      const currentNetwork = socialNetworks.find(n => n.id === selectedNetwork);
      if (currentNetwork) {
        setSocialNetworks(prev => prev.map(n => 
          n.id === selectedNetwork 
            ? { ...n, caption: randomStart + currentNetwork.caption.substring(currentNetwork.caption.indexOf("\n")) }
            : n
        ));
      }
      
      setIsGenerating(false);
    }, 1500);
  };

  const getCurrentCaption = () => {
    const network = socialNetworks.find(n => n.id === selectedNetwork);
    return network?.caption || generatedCaption;
  };

  const updateNetworkCaption = (caption: string) => {
    setSocialNetworks(prev => prev.map(n => 
      n.id === selectedNetwork ? { ...n, caption } : n
    ));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + media.length) % media.length);
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
                {currentStep === 3 && "Ajoutez vos photos"}
                {currentStep === 4 && "Décrivez votre publication"}
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

          {/* Step 3: Upload photos (1-10) */}
          {currentStep === 3 && (
            <motion.div
              key="step3-upload"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Ajoutez vos photos</h2>
                <p className="text-muted-foreground">
                  De 1 à 10 photos maximum • {media.length}/10
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {media.map((item) => (
                  <div key={item.id} className="relative aspect-square group">
                    <img
                      src={item.url}
                      alt="Photo"
                      className="w-full h-full object-cover rounded-xl border-2 border-border"
                    />
                    <button
                      onClick={() => removeMedia(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {media.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">
                      Ajouter une photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMediaUpload}
                    />
                  </label>
                )}
              </div>

              {media.length > 0 && (
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleNext}>
                    Continuer
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Description (vocal ET écrit ENSEMBLE) */}
          {currentStep === 4 && (
            <motion.div
              key="step4-description"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Décrivez votre chantier</h2>
                <p className="text-muted-foreground">
                  Choisissez votre méthode préférée
                </p>
              </div>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Pour booster le SEO :</p>
                    <p className="text-sm text-blue-800">
                      Mentionnez ville, travaux réalisés, durée du chantier, objectifs, satisfaction client...
                    </p>
                  </div>
                </div>
              </Card>

              {/* Zone vocale */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Description vocale</p>
                    <p className="text-sm text-muted-foreground">Enregistrez votre description à l'oral</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 py-6">
                  {!isRecording && !vocalDescription && (
                    <motion.button
                      onClick={handleStartRecording}
                      className="w-24 h-24 bg-primary rounded-full flex items-center justify-center group hover:scale-105 transition-all shadow-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mic className="w-12 h-12 text-white" />
                    </motion.button>
                  )}

                  {isRecording && (
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <Mic className="w-12 h-12 text-white" />
                      </motion.div>
                      <p className="text-2xl font-bold text-red-500">{formatTime(recordingTime)}</p>
                      <Button onClick={handleStopRecording} variant="destructive" size="lg">
                        Arrêter l'enregistrement
                      </Button>
                    </div>
                  )}

                  {vocalDescription && (
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <p className="font-bold">Transcription terminée</p>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                        {vocalDescription}
                      </p>
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" onClick={() => {
                          setVocalDescription("");
                          setRecordingTime(0);
                        }}>
                          Recommencer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Zone écrite */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Description écrite</p>
                    <p className="text-sm text-muted-foreground">Rédigez votre description manuellement</p>
                  </div>
                </div>

                <Textarea
                  placeholder="Exemple : Rénovation complète d'une salle de bain à Paris 11ème. Le chantier a duré 3 semaines. Nous avons fait la démolition, la plomberie, l'électricité et les finitions. Le client est très satisfait du résultat..."
                  value={writtenDescription}
                  onChange={(e) => setWrittenDescription(e.target.value)}
                  className="min-h-[200px] text-base"
                />
              </Card>

              {(vocalDescription || writtenDescription.trim()) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border-2 border-border rounded-xl">
                    <Checkbox
                      id="company-info"
                      checked={addCompanyInfo}
                      onCheckedChange={(checked) => {
                        setAddCompanyInfo(checked as boolean);
                        if (checked) {
                          setShowContactModal(true);
                        }
                      }}
                    />
                    <Label htmlFor="company-info" className="font-medium cursor-pointer">
                      Ajouter les coordonnées de mon entreprise à la publication
                    </Label>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleGeneratePublication}>
                    Générer la publication
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal confirmation coordonnées */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmez vos coordonnées</DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Ces informations seront ajoutées à votre publication
              </p>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" /> Téléphone
                </Label>
                <Input
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="contact@entreprise.fr"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" /> Adresse
                </Label>
                <Input
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="15 Rue des Artisans, 75011 Paris"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" /> Site internet
                </Label>
                <Input
                  type="url"
                  value={contactInfo.website}
                  onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                  placeholder="https://votre-site.fr"
                />
              </div>

              <Button onClick={() => setShowContactModal(false)} className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Confirmer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Écran de chargement génération */}
        <Dialog open={isGenerating && !showPreview} onOpenChange={() => {}}>
          <DialogContent className="max-w-md" hideClose>
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="text-xl font-bold mb-2">Génération en cours...</p>
                <p className="text-sm text-muted-foreground">
                  L'IA rédige votre publication professionnelle
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Aperçu de la publication */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Votre publication est prête 🎉</DialogTitle>
              <p className="text-muted-foreground">
                Vérifiez et ajustez avant de publier
              </p>
            </DialogHeader>

            <div className="grid lg:grid-cols-[2fr,3fr] gap-8 py-6">
              {/* Preview style mobile Instagram */}
              <div className="space-y-4">
                <Card className="overflow-hidden border-2">
                  {/* Header type Instagram */}
                  <div className="flex items-center gap-3 p-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                      {companyData?.companyName?.charAt(0).toUpperCase() || "E"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{companyData?.companyName || "Votre entreprise"}</p>
                      <p className="text-xs text-muted-foreground">{companyData?.interventionCity || "Votre ville"}</p>
                    </div>
                  </div>

                  {/* Carousel photos avec navigation */}
                  <div className="relative aspect-square bg-muted group">
                    {media.length > 0 && (
                      <>
                        <img 
                          src={media[currentPhotoIndex].url} 
                          alt={`Photo ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Boutons navigation */}
                        {media.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevPhoto}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeftIcon className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={handleNextPhoto}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                          </>
                        )}
                        
                        {/* Indicateurs */}
                        {media.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {media.map((_, idx) => (
                              <div 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  idx === currentPhotoIndex ? "bg-white w-6" : "bg-white/40"
                                }`} 
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Compteur de photos */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                          {currentPhotoIndex + 1}/{media.length}
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Options retouche juste en dessous de l'image */}
                <Card className="p-5">
                  <p className="font-bold mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    Niveau de retouche
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setRetoucheLevel("original")}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        retoucheLevel === "original"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-xs font-semibold">Original</p>
                    </button>
                    <button
                      onClick={() => setRetoucheLevel("intense")}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        retoucheLevel === "intense"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-2xl mb-1">✨</p>
                      <p className="text-xs font-semibold">Intense</p>
                    </button>
                    <button
                      onClick={() => setRetoucheLevel("smart")}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        retoucheLevel === "smart"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-2xl mb-1">🤖</p>
                      <p className="text-xs font-semibold">Smart IA</p>
                    </button>
                  </div>
                </Card>
              </div>

              {/* Édition du texte */}
              <div className="space-y-5">
                {/* Tabs réseaux sociaux */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {socialNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                        selectedNetwork === network.id
                          ? "bg-primary text-white shadow-lg scale-105"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {network.icon} {network.name}
                    </button>
                  ))}
                </div>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg">Texte de publication</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Modifiez le texte ou régénérez-le avec l'IA
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateCaption}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Régénérer
                    </Button>
                  </div>

                  <Textarea
                    value={getCurrentCaption()}
                    onChange={(e) => updateNetworkCaption(e.target.value)}
                    className="min-h-[400px] text-base leading-relaxed font-sans"
                  />

                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>{getCurrentCaption().length} caractères</span>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1"
                    onClick={() => setShowPreview(false)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    size="lg"
                    className="flex-1 text-lg font-bold"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Publier maintenant
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}