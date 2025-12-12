export interface OnboardingData {
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
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  interventionRadius: number;
  interventionCity: string;
  tone: "pedagogique" | "direct" | "chaleureux";
  useEmojis: boolean;
}

const STORAGE_KEY = "publichantier_onboarding";

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function getOnboardingData(): OnboardingData | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function clearOnboardingData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
