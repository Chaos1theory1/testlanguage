/**
 * Types representing the models for Tunisian Mycelium Biotech Startup
 */

export type ProductCategory = 'Grain Spawn' | 'Bio-materials' | 'Starting Cultures' | 'Consulting & Setup';
export type ProductStatus = 'Available' | 'Out of Stock' | 'Pre-order';

export interface Product {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  category: ProductCategory;
  price: string; // e.g. "45 TND / kg"
  status: ProductStatus;
  image: string; // URL or base64 or placeholder
  specifications: string[]; // e.g. ["Grain: Barley", "Inoculation Rate: 10%", "Fruiting Temp: 18-24°C"]
  availableItems?: number;
  productionDate?: string;
  expirationDate?: string;
  certificateUrl?: string; // Optional Google Drive link or other certificate URL
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
  image: string;
  benefits: string[];
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  receivedAt: string; // ISO timestamp
}

export interface LandingHero {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  story: string;
  mission: string;
  vision: string;
  teamFocus: string;
}

export interface FeatureItem {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  address: string;
  locationMapEmbed: string;
  workingHours: string;
}

export interface SiteContent {
  logoUrl?: string;
  hero: LandingHero;
  about: AboutSection;
  features: FeatureItem[];
  contactDetails: ContactDetails;
}

export interface DatabaseState {
  siteContent: SiteContent;
  products: Product[];
  services: Service[];
  messages: ContactMessage[];
}
