"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { saveOnboardingData } from "@/lib/onboarding-storage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Target,
  X,
  Hourglass
} from "lucide-react";

const TOTAL_STEPS = 11;

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
  publicationVoice: "je" | "on_nous";
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
  publicationVoice: "je",
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
              className="h-12 mt-1 bg-white"
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
              className="h-12 mt-1 bg-white"
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
  setData,
  onNext,
  onContinue
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
  onNext: () => void;
  onContinue: React.MutableRefObject<(() => void) | null>;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [websiteScreenshot, setWebsiteScreenshot] = useState<string | null>(null);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);

  useEffect(() => {
    const handleContinueEvent = () => {
      if (data.websiteUrl) {
        setIsLoadingScreenshot(true);
        setShowVerificationModal(true);
        
        setTimeout(() => {
          setWebsiteScreenshot(`https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(data.websiteUrl)}&dimension=1024x768`);
          setIsLoadingScreenshot(false);
        }, 1500);
      } else {
        onNext();
      }
    };
    
    onContinue.current = handleContinueEvent;
  }, [data.websiteUrl, onNext]);

  const handleRejectWebsite = () => {
    setShowVerificationModal(false);
    setWebsiteScreenshot(null);
  };

  return (
    <StepWrapper 
      title="Avez-vous un site internet ?" 
      subtitle="Nous remplirons automatiquement vos informations"
      icon={Globe}
    >
      <div className="space-y-6">
        <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si vous ajoutez l'URL de votre site internet, nous analyserons automatiquement 
                vos informations (adresse, contact, description, couleurs...) pour gagner du temps !
              </p>
            </div>
          </div>
        </div>

        <Input
          type="url"
          placeholder="https://votre-site.fr"
          value={data.websiteUrl}
          onChange={(e) => {
            setData({ ...data, websiteUrl: e.target.value });
            setAnalyzed(false);
          }}
          className="h-14 text-lg"
        />

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border border-primary/20 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Analyse en cours...</p>
                <p className="text-sm text-muted-foreground">Extraction des informations de votre site</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              C'est bien votre site ?
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Vérifiez que nous avons trouvé le bon site internet avant de continuer
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border-2 border-border">
              {isLoadingScreenshot ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Chargement de la capture d'écran...</p>
                </div>
              ) : websiteScreenshot ? (
                <img 
                  src={websiteScreenshot} 
                  alt="Capture d'écran du site" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/1024x768/212737/ffffff?text=${encodeURIComponent(data.websiteUrl)}`;
                  }}
                />
              ) : null}
            </div>

            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-sm font-medium text-foreground mb-1">URL vérifiée :</p>
              <p className="text-sm text-primary font-mono">{data.websiteUrl}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 text-base"
                onClick={handleRejectWebsite}
              >
                <X className="w-5 h-5 mr-2" />
                Non, ce n'est pas ça
              </Button>
              <Button
                className="flex-1 h-14 text-base font-semibold"
                onClick={() => {
                  setShowVerificationModal(false);
                  setIsAnalyzing(true);
                  
                  setTimeout(() => {
                    const extractedPrimaryColor = "#3b82f6";
                    const extractedSecondaryColor = "#1e40af";
                    
                    setData({
                      ...data,
                      address: "15 Rue des Artisans, 75011 Paris",
                      contactEmail: "contact@" + data.companyName.toLowerCase().replace(/\s/g, "") + ".fr",
                      phone: "01 23 45 67 89",
                      description: "Entreprise spécialisée dans la rénovation intérieure et extérieure. Plus de 10 ans d'expérience dans le bâtiment.",
                      primaryColor: extractedPrimaryColor,
                      secondaryColor: extractedSecondaryColor,
                    });
                    setIsAnalyzing(false);
                    setAnalyzed(true);
                    onNext();
                  }, 2500);
                }}
              >
                <Check className="w-5 h-5 mr-2" />
                Oui, c'est bien mon site !
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(',');
    if (parts.length >= 2) {
      const cityPart = parts[parts.length - 1].trim();
      const cityMatch = cityPart.match(/^\d{5}\s+(.+)$/);
      if (cityMatch) {
        return cityMatch[1];
      }
      return cityPart;
    }
    return "";
  };

  const handleAddressChange = (newAddress: string) => {
    setData({ 
      ...data, 
      address: newAddress,
      interventionCity: extractCityFromAddress(newAddress)
    });
  };

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
            onChange={(e) => handleAddressChange(e.target.value)}
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
          <Label className="text-sm font-medium">Votre métier</Label>
          <Input
            placeholder="Ex: Plombier, Électricien, Maçon..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="h-10 mt-1"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function Step5InterventionZone({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const quickDistances = [10, 15, 30, 50];

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
          
          <div className="flex gap-2 mb-4">
            {quickDistances.map((distance) => (
              <Button
                key={distance}
                variant={data.interventionRadius === distance ? "default" : "outline"}
                size="sm"
                onClick={() => setData({ ...data, interventionRadius: distance })}
                className="flex-1"
              >
                {distance} km
              </Button>
            ))}
          </div>

          <input
            type="range"
            min="1"
            max="100"
            value={data.interventionRadius}
            onChange={(e) => setData({ ...data, interventionRadius: parseInt(e.target.value) })}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 km</span>
            <span>+ de 100 km</span>
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

function Step6Tone({ 
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
    </StepWrapper>
  );
}

function Step7Voice({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const voices = [
    { 
      id: "je" as const, 
      label: "Je", 
      example: "Je viens de terminer la réfection complète de cette toiture. Un travail solide et durable." 
    },
    { 
      id: "on_nous" as const, 
      label: "On / Nous", 
      example: "On a refait toute la toiture. Un chantier solide qui tiendra des années." 
    },
  ];

  return (
    <StepWrapper 
      title="En quel nom parler dans vos publications ?" 
      subtitle="Choisissez la voix qui représente le mieux votre entreprise"
      icon={User}
    >
      <div className="space-y-3">
        {voices.map((voice) => (
          <motion.button
            key={voice.id}
            onClick={() => setData({ ...data, publicationVoice: voice.id })}
            className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
              data.publicationVoice === voice.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="font-bold text-lg">{voice.label}</p>
                {data.publicationVoice === voice.id && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
              <div className="pl-3 border-l-4 border-primary/30">
                <p className="text-sm text-muted-foreground italic">
                  Exemple : "{voice.example}"
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </StepWrapper>
  );
}

function Step8Emojis({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  return (
    <StepWrapper 
      title="Utilisation des émojis" 
      subtitle="Rendez vos publications plus vivantes et expressives"
      icon={Sparkles}
    >
      <div className="space-y-3">
        <motion.button
          onClick={() => setData({ ...data, useEmojis: true })}
          className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
            data.useEmojis
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <p className="font-semibold">Oui, j'aime les émojis</p>
              <p className="text-sm text-muted-foreground">Ajoutez une touche conviviale à vos publications</p>
            </div>
            {data.useEmojis && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </div>
        </motion.button>

        <motion.button
          onClick={() => setData({ ...data, useEmojis: false })}
          className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
            !data.useEmojis
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div className="flex-1">
              <p className="font-semibold">Non, style sobre</p>
              <p className="text-sm text-muted-foreground">Gardez un ton professionnel sans émojis</p>
            </div>
            {!data.useEmojis && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </div>
        </motion.button>
      </div>
    </StepWrapper>
  );
}

function Step9LogoColors({ 
  data, 
  setData 
}: { 
  data: OnboardingData; 
  setData: (d: OnboardingData) => void;
}) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 50;
    const lightness = Math.floor(Math.random() * 20) + 40;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const hslToHex = (hsl: string): string => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return hsl;
    
    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handleSuggestColors = () => {
    const color1 = generateRandomColor();
    const color2 = generateRandomColor();
    setData({ 
      ...data, 
      primaryColor: hslToHex(color1), 
      secondaryColor: hslToHex(color2) 
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const extractColorsFromLogo = (logoUrl: string): { primary: string; secondary: string } => {
    const colorPairs = [
      { primary: "#e74c3c", secondary: "#c0392b" },
      { primary: "#3498db", secondary: "#2980b9" },
      { primary: "#2ecc71", secondary: "#27ae60" },
      { primary: "#f39c12", secondary: "#d68910" },
      { primary: "#9b59b6", secondary: "#8e44ad" },
      { primary: "#1abc9c", secondary: "#16a085" },
      { primary: "#34495e", secondary: "#2c3e50" },
      { primary: "#e67e22", secondary: "#d35400" },
    ];
    
    const index = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[index];
  };

  const handleGenerateLogos = () => {
    setShowLogoModal(true);
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockLogos = Array.from({ length: 10 }, (_, i) => {
        const colors = [data.primaryColor, data.secondaryColor];
        const initial = data.companyName.charAt(0).toUpperCase() || 'L';
        return `data:image/svg+xml,${encodeURIComponent(`
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="${colors[i % 2]}" rx="20"/>
            <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
            <text x="100" y="160" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">Style ${i + 1}</text>
          </svg>
        `)}`;
      });
      setGeneratedLogos(mockLogos);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectLogo = async (logoUrl: string) => {
    setLogoPreview(logoUrl);
    
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const file = new File([blob], "generated-logo.svg", { type: "image/svg+xml" });
    
    const extractedColors = extractColorsFromLogo(logoUrl);
    setData({ 
      ...data, 
      logo: file,
      primaryColor: extractedColors.primary,
      secondaryColor: extractedColors.secondary
    });
    
    setShowLogoModal(false);
  };

  return (
    <StepWrapper 
      title="L'identité visuelle de votre entreprise" 
      subtitle="Logo et couleurs pour vos publications"
      icon={Palette}
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Pas de logo sous la main ?</span> Aucun problème ! Vous pourrez ajouter ou modifier votre logo et vos couleurs plus tard dans les paramètres.
          </p>
        </div>

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
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleGenerateLogos}
              >
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

        <Button variant="outline" className="w-full" onClick={handleSuggestColors}>
          <Wand2 className="w-4 h-4 mr-2" />
          Suggérer des couleurs pour mes publications
        </Button>
      </div>

      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Choisissez votre logo</DialogTitle>
            <p className="text-muted-foreground mt-2">
              Sélectionnez le logo qui représente le mieux votre entreprise
            </p>
          </DialogHeader>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-medium">Génération de vos logos...</p>
              <p className="text-sm text-muted-foreground">Création de 10 propositions personnalisées</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-4">
              {generatedLogos.map((logo, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectLogo(logo)}
                  className="aspect-square rounded-xl border-2 border-border hover:border-primary hover:scale-105 transition-all p-2 bg-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={logo} 
                    alt={`Logo ${index + 1}`} 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StepWrapper>
  );
}

function Step10PersonalInfo({ 
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
              className="h-12 mt-1 bg-white"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Nom</Label>
            <Input
              placeholder="Martin"
              value={data.ownerLastName}
              onChange={(e) => setData({ ...data, ownerLastName: e.target.value })}
              className="h-12 mt-1 bg-white"
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
            className="h-12 mt-1 bg-white"
          />
        </div>
      </div>
    </StepWrapper>
  );
}

function Step11Final({ data }: { data: OnboardingData }) {
  const router = useRouter();

  useEffect(() => {
    const saveData = async () => {
      let logoBase64: string | null = null;
      
      if (data.logo) {
        const reader = new FileReader();
        logoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(data.logo as File);
        });
      }
      
      saveOnboardingData({
        ...data,
        logo: logoBase64,
        password: "",
      });
    };
    
    saveData();
  }, [data]);

  const handleContinue = () => {
    router.push("/dashboard/create");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-12 h-12 text-white" strokeWidth={3} />
      </motion.div>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        Bravo {data.ownerFirstName} ! 🎉
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        <span className="text-primary font-semibold">{data.companyName}</span> est prêt à briller sur les réseaux sociaux
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 mb-8"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-left font-medium text-foreground">3 publications suggérées prêtes</p>
          <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-left font-medium text-foreground">IA configurée pour votre entreprise</p>
          <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🏆</span>
          </div>
          <p className="text-left font-medium text-foreground">14 jours d'essai gratuit actifs</p>
          <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold"
          onClick={handleContinue}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Découvrir mon tableau de bord
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Créez votre première publication en moins de 2 minutes
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const step3ContinueRef = useRef<React.MutableRefObject<(() => void) | null>>(null);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleContinueClick = () => {
    if (currentStep === 2 && step3ContinueRef.current) {
      step3ContinueRef.current();
    } else {
      nextStep();
    }
  };

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
      case 8: return true;
      case 9: return true;
      case 10: return true;
      default: return true;
    }
  };

  const getButtonLabel = () => {
    if (currentStep === 2 && !data.websiteUrl) {
      return "Je n'ai pas de site internet";
    }
    return "Continuer";
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
            <Step3MagicOnboarding key="step3" data={data} setData={setData} onNext={nextStep} onContinue={step3ContinueRef} />
          )}
          {currentStep === 3 && (
            <Step4CompanyInfo key="step4" data={data} setData={setData} />
          )}
          {currentStep === 4 && (
            <Step5InterventionZone key="step5" data={data} setData={setData} />
          )}
          {currentStep === 5 && (
            <Step6Tone key="step6" data={data} setData={setData} />
          )}
          {currentStep === 6 && (
            <Step7Voice key="step7" data={data} setData={setData} />
          )}
          {currentStep === 7 && (
            <Step8Emojis key="step8" data={data} setData={setData} />
          )}
          {currentStep === 8 && (
            <Step9LogoColors key="step9" data={data} setData={setData} />
          )}
          {currentStep === 9 && (
            <Step10PersonalInfo key="step10" data={data} setData={setData} />
          )}
          {currentStep === 10 && (
            <Step11Final key="final" data={data} />
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
              onClick={handleContinueClick}
              disabled={!canProceed()}
              className="w-full h-14 text-base font-semibold"
            >
              {getButtonLabel()}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}