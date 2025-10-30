import axios from "axios";
import {
  Experience,
  ExperienceDetails,
  BookingCart,
  CheckoutForm,
  PromoResult,
} from "./types.d";

// const API_BASE_URL = "http://localhost:4000/api";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchExperiences = async (): Promise<Experience[]> => {
  const response = await api.get("/api/experiences");
  return response.data;
};

export const fetchExperienceDetails = async (
  id: string
): Promise<ExperienceDetails> => {
  const response = await api.get(`/api/experiences/${id}`);
  const data = response.data;
  return { ...data.experience, slotsByDate: data.slotsByDate };
};

export const validatePromoCode = async (
  code: string,
  subtotal: number
): Promise<PromoResult> => {
  try {
    const response = await api.post("/api/promo/validate", {
      code: code.toUpperCase(),
      subtotal,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Backend returns 440 for invalid/expired promo codes
      if (error.response.status === 440) {
        // Return the error message but don't throw - it's a valid response
        return {
          discount: 0,
          message:
            error.response.data.message || "Invalid or expired promo code.",
        };
      }
      // For other errors, throw
      throw new Error(
        error.response.data.message || "Failed to validate promo code."
      );
    }
    throw new Error("Network error during promo validation.");
  }
};

export const createBooking = async (
  cart: BookingCart,
  checkout: CheckoutForm
): Promise<{ success: boolean; refId?: string; error?: string }> => {
  console.log("=== BOOKING DEBUG START ===");
  console.log("Full cart object:", cart);
  console.log("Full checkout object:", checkout);

  // Validate cart data before sending
  if (!cart.experience) {
    return {
      success: false,
      error: "Experience information is missing from cart.",
    };
  }
  if (!cart.selectedSlot) {
    return { success: false, error: "Slot information is missing from cart." };
  }

  const slotId = cart.selectedSlot._id;

  console.log("Extracted slotId:", slotId);

  if (!slotId) {
    console.error("❌ Cart slot object:", cart.selectedSlot);
    return { success: false, error: "Slot ID not found in cart." };
  }

  // Get the experienceId from the slot - it should already be the MongoDB _id string
  const experienceId = cart.selectedSlot.experienceId;

  if (!experienceId) {
    console.error("❌ Slot experienceId missing:", cart.selectedSlot);
    return { success: false, error: "Experience ID not found in slot." };
  }

  const bookingPayload = {
    experienceId: experienceId, // From slot.experienceId
    slotId: slotId,
    quantity: cart.quantity,
    fullName: checkout.fullName,
    email: checkout.email,
    totalPaid: cart.total,
    promoCode: cart.promoCode || "",
  };

  console.log(
    "📤 Booking payload being sent:",
    JSON.stringify(bookingPayload, null, 2)
  );

  try {
    const response = await api.post("/api/bookings", bookingPayload);
    console.log("✅ Booking success:", response.data);
    return { success: true, refId: response.data.refId };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ Booking API error response:", error.response.data);
      console.error("❌ Status code:", error.response.status);
      console.error("❌ Full error:", error.response);

      // Return error instead of throwing
      return {
        success: false,
        error:
          error.response.data.message ||
          "Booking failed due to a server error.",
      };
    }
    console.error("❌ Network error:", error);
    return {
      success: false,
      error: "Network error or server unreachable.",
    };
  }
};
