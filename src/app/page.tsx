"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Palette, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Upload,
  Wand2,
  Target
} from "lucide-react";

const TOTAL_STEPS = 8;

interface OnboardingData {
  authMethod: "google" | "email" | null;
  email: string;
  password: string;
  companyName: string;
  websiteUrl: string;
  address: string;
  contactEmail: string;
  phone: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  description: string;
  logo: File | null;
  primaryColor: string;
  secondaryColor: string;
  interventionRadius: number;
  interventionCity: string;
  tone: "pedagogique" | "direct" | "chaleureux";
  useEmojis: boolean;
}

const initialData: OnboardingData = {
  authMethod: null,
  email: "",
  password: "",
  companyName: "",
  websiteUrl: "",
  address: "",
  contactEmail: "",
  phone: "",
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  description: "",
  logo: null,
  primaryColor: "#f4862d",
  secondaryColor: "#212737",
  interventionRadius: 30,
  interventionCity: "",
  tone: "chaleureux",
  useEmojis: true,
};

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              i < currentStep
                ? "bg-primary text-white"
                : i === currentStep
                ? "bg-primary text-white ring-4 ring-primary/20"
                : "bg-muted text-muted-foreground"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: i === currentStep ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </motion.div>
        ))}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StepWrapper({ 
  children, 
  title, 
  subtitle,
  icon: Icon 
}: { 
  children: React.ReactNode; 
  title: string; 
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Icon className="w-8 h-8 text-primary" />
          </motion.div>
        )}
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function Step1Auth({ 
  data, 
  setData, 
  onNext 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
  onNext: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData({ ...data, authMethod: "google", email: "utilisateur@gmail.com" });
      setIsLoading(false);
      onNext();
    }, 1500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.email && data.password) {
      setData({ ...data, authMethod: "email" });
      onNext();
    }
  };

  return (
    <StepWrapper 
      title="Bienvenue sur PubliChantier" 
      subtitle="Créez votre compte en quelques secondes"
      icon={Sparkles}
    >
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full h-14 text-base font-medium border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          ) : (
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continuer avec Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">ou</span>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="h-12 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="h-12 mt-1"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-base font-semibold"
            disabled={!data.email || !data.password}
          >
            Créer mon compte
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </StepWrapper>
  );
}

function Step2CompanyName({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  return (
    <StepWrapper 
      title="Quel est le nom de votre entreprise ?" 
      subtitle="C'est le nom qui apparaîtra sur vos publications"
      icon={Building2}
    >
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Ex: Rénovation Martin"
          value={data.companyName}
          onChange={(e) => setData({ ...data, companyName: e.target.value })}
          className="h-14 text-lg text-center font-medium"
          autoFocus
        />
        <p className="text-sm text-muted-foreground text-center">
          Vous pourrez modifier ce nom plus tard dans les paramètres
        </p>
      </div>
    </StepWrapper>
  );
}

function Step3MagicOnboarding({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!data.websiteUrl) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setData({
        ...data,
        address: "15 Rue des Artisans, 75011 Paris",
        contactEmail: "contact@" + data.companyName.toLowerCase().replace(/\s/g, "") + ".fr",
        phone: "01 23 45 67 89",
        description: "Entreprise spécialisée dans la rénovation intérieure et extérieure. Plus de 10 ans d'expérience dans le bâtiment.",
      });
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <StepWrapper 
      title="Avez-vous un site internet ?" 
      subtitle="On peut récupérer automatiquement vos informations"
      icon={Globe}
    >
      <div className="space-y-6">
        <div className="relative">
          <Input
            type="url"
            placeholder="https://votre-site.fr"
            value={data.websiteUrl}
            onChange={(e) => {
              setData({ ...data, websiteUrl: e.target.value });
              setAnalyzed(false);
            }}
            className="h-14 text-lg pr-32"
          />
          {data.websiteUrl && !analyzed && (
            <Button
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          )}
        </div>

        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <Check className="w-5 h-5" />
              Informations récupérées avec succès !
            </div>
            <p className="text-sm text-green-600">
              Nous avons pré-rempli vos informations. Vous pourrez les vérifier à l'étape suivante.
            </p>
          </motion.div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Pas de site ? Pas de souci, vous pourrez tout remplir manuellement.
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

function Step4CompanyInfo({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  return (
    <StepWrapper 
      title="Les informations de votre entreprise" 
      subtitle="Ces données apparaîtront dans vos publications"
      icon={MapPin}
    >
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Adresse
          </Label>
          <Input
            placeholder="15 Rue des Artisans, 75011 Paris"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="h-12 mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email de contact
          </Label>
          <Input
            type="email"
            placeholder="contact@votre-entreprise.fr"
            value={data.contactEmail}
            onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
            className="h-12 mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4" /> Téléphone
          </Label>
          <Input
            type="tel"
            placeholder="01 23 45 67 89"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="h-12 mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Description de votre activité</Label>
          <Textarea
            placeholder="Décrivez en quelques lignes votre activité..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="mt-1 min-h-[100px]"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function Step5PersonalInfo({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  return (
    <StepWrapper 
      title="Vos informations personnelles" 
      subtitle="Pour personnaliser votre expérience"
      icon={User}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Prénom</Label>
            <Input
              placeholder="Jean"
              value={data.ownerFirstName}
              onChange={(e) => setData({ ...data, ownerFirstName: e.target.value })}
              className="h-12 mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Nom</Label>
            <Input
              placeholder="Martin"
              value={data.ownerLastName}
              onChange={(e) => setData({ ...data, ownerLastName: e.target.value })}
              className="h-12 mt-1"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4" /> Téléphone personnel
          </Label>
          <Input
            type="tel"
            placeholder="06 12 34 56 78"
            value={data.ownerPhone}
            onChange={(e) => setData({ ...data, ownerPhone: e.target.value })}
            className="h-12 mt-1"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function Step6LogoColors({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <StepWrapper 
      title="L'identité visuelle de votre entreprise" 
      subtitle="Logo et couleurs pour vos publications"
      icon={Palette}
    >
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Logo de votre entreprise</Label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer group">
              <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                logoPreview ? "border-primary" : "border-border hover:border-primary/50"
              }`}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Formats acceptés : PNG, JPG, SVG
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Wand2 className="w-4 h-4 mr-2" />
                Générer un logo
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Couleur principale</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.primaryColor}
                onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                className="h-12 font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Couleur secondaire</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.secondaryColor}
                onChange={(e) => setData({ ...data, secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
              />
              <Input
                value={data.secondaryColor}
                onChange={(e) => setData({ ...data, secondaryColor: e.target.value })}
                className="h-12 font-mono"
              />
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Wand2 className="w-4 h-4 mr-2" />
          Suggérer des couleurs depuis mon site
        </Button>
      </div>
    </StepWrapper>
  );
}

function Step7InterventionZone({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  return (
    <StepWrapper 
      title="Votre zone d'intervention" 
      subtitle="Où intervenez-vous principalement ?"
      icon={Target}
    >
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Ville principale</Label>
          <Input
            placeholder="Paris"
            value={data.interventionCity}
            onChange={(e) => setData({ ...data, interventionCity: e.target.value })}
            className="h-12 mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Rayon d'intervention : <span className="text-primary font-bold">{data.interventionRadius} km</span>
          </Label>
          <input
            type="range"
            min="5"
            max="100"
            value={data.interventionRadius}
            onChange={(e) => setData({ ...data, interventionRadius: parseInt(e.target.value) })}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Carte interactive</p>
            <p className="text-xs">(Visualisation de la zone)</p>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

function Step8Tone({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const tones = [
    { id: "pedagogique" as const, label: "Pédagogique", emoji: "📚", description: "Expliquez et éduquez vos clients" },
    { id: "direct" as const, label: "Direct", emoji: "💪", description: "Allez droit au but, efficace" },
    { id: "chaleureux" as const, label: "Chaleureux", emoji: "😊", description: "Créez une relation de confiance" },
  ];

  return (
    <StepWrapper 
      title="Le ton de vos publications" 
      subtitle="Comment voulez-vous communiquer ?"
      icon={MessageSquare}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {tones.map((tone) => (
            <motion.button
              key={tone.id}
              onClick={() => setData({ ...data, tone: tone.id })}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                data.tone === tone.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tone.emoji}</span>
                <div>
                  <p className="font-semibold">{tone.label}</p>
                  <p className="text-sm text-muted-foreground">{tone.description}</p>
                </div>
                {data.tone === tone.id && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
          <div>
            <p className="font-medium">Utiliser des émojis</p>
            <p className="text-sm text-muted-foreground">Rendez vos publications plus vivantes</p>
          </div>
          <Checkbox
            checked={data.useEmojis}
            onCheckedChange={(checked) => setData({ ...data, useEmojis: checked as boolean })}
            className="w-6 h-6"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function StepFinal({ data }: { data: OnboardingData }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useState(() => {
    setShowConfetti(true);
  });

  return (
    <StepWrapper 
      title="Tout est prêt ! 🎉" 
      subtitle="Votre compte PubliChantier est configuré"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="space-y-6"
      >
        <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: data.primaryColor }}>
              {data.companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{data.companyName || "Votre entreprise"}</h3>
              <p className="text-sm text-muted-foreground">{data.address || "Adresse non renseignée"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{data.contactEmail || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{data.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{data.interventionRadius} km autour de {data.interventionCity || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="capitalize">{data.tone}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Des publications suggérées vous attendent déjà dans votre tableau de bord !
          </p>
          <Button size="lg" className="w-full h-14 text-lg font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            Découvrir mon espace
          </Button>
        </div>
      </motion.div>
    </StepWrapper>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.authMethod !== null;
      case 1: return data.companyName.trim().length > 0;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return true;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Image src="/logo-light.svg" alt="PubliChantier" width={160} height={40} className="h-10 w-auto" />
            {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
              <button
                onClick={prevStep}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </button>
            )}
          </div>
          {currentStep < TOTAL_STEPS - 1 && <ProgressBar currentStep={currentStep} />}
        </div>
      </div>

      <main className="pt-40 pb-32 px-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <Step1Auth key="step1" data={data} setData={setData} onNext={nextStep} />
          )}
          {currentStep === 1 && (
            <Step2CompanyName key="step2" data={data} setData={setData} />
          )}
          {currentStep === 2 && (
            <Step3MagicOnboarding key="step3" data={data} setData={setData} />
          )}
          {currentStep === 3 && (
            <Step4CompanyInfo key="step4" data={data} setData={setData} />
          )}
          {currentStep === 4 && (
            <Step5PersonalInfo key="step5" data={data} setData={setData} />
          )}
          {currentStep === 5 && (
            <Step6LogoColors key="step6" data={data} setData={setData} />
          )}
          {currentStep === 6 && (
            <Step7InterventionZone key="step7" data={data} setData={setData} />
          )}
          {currentStep === 7 && (
            <Step8Tone key="step8" data={data} setData={setData} />
          )}
          {currentStep === TOTAL_STEPS - 1 && (
            <StepFinal key="final" data={data} />
          )}
        </AnimatePresence>
      </main>

      {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border"
        >
          <div className="max-w-lg mx-auto px-6 py-4">
            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full h-14 text-base font-semibold"
            >
              Continuer
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
