declare module "*.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

export interface Experience {
  id: string;
  name: string;
  location: string;
  tagline: string;
  basePrice: number;
  description: string;
  image: string;
  minAge: number;
  duration: string;
}

export interface Slot {
  _id: string; // The unique DB ID for the slot
  experienceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM am/pm
  totalCapacity: number;
  bookedSeats: number;
  priceMultiplier?: number;
}

export interface ExperienceDetails extends Experience {
  slotsByDate: Record<string, Slot[]>;
}

interface BookingCart {
  experience?: Experience;
  selectedSlot?: Slot;
  quantity: number;
  promoCode: string;
  promoDiscount: number;
  subtotal: number;
  taxes: number;
  total: number;
  refId?: string;
}

interface CheckoutForm {
  fullName: string;
  email: string;
  agreedToTerms: boolean;
}

interface PromoResult {
  discount: number;
  message: string;
}
