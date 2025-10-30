import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Tag,
  Minus,
  Plus,
} from "lucide-react";
import { fetchExperienceDetails } from "../api";
import { ExperienceDetails, Slot, BookingCart } from "../types.d";

// Utility component to show the price summary
interface PriceSummaryProps {
  cart: BookingCart;
  onConfirm: () => void;
  disabled: boolean;
}
const PriceSummary: React.FC<PriceSummaryProps> = ({
  cart,
  onConfirm,
  disabled,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between text-xl font-semibold text-gray-900">
          <span>Starts at</span>
          <span>₹{cart.experience?.basePrice?.toLocaleString("en-IN")}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between">
          <span>Quantity</span>
          <span className="font-semibold">{cart.quantity}</span>
        </div>
        {cart.selectedSlot?.priceMultiplier &&
          cart.selectedSlot?.priceMultiplier > 1 && (
            <div className="flex justify-between text-yellow-600 text-sm font-medium">
              <span>Peak Time Surcharge</span>
              <span>
                +{(cart.selectedSlot.priceMultiplier * 100 - 100).toFixed(0)}%
              </span>
            </div>
          )}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">
            ₹{cart.subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span className="font-semibold">
            + ₹{cart.taxes.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-300">
          <span className="text-2xl font-bold text-gray-900">Total</span>
          <span className="text-3xl font-extrabold text-yellow-600">
            ₹{cart.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={disabled}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-50 flex items-center justify-center shadow-md text-lg"
      >
        Continue to Checkout
      </button>
    </div>
  );
};

// Main Details Page Component
const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ExperienceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- Mock Cart State Management (In a real app, use Context/Redux) ---
  const [cart, setCart] = useState<BookingCart>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cart") ||
          '{"quantity": 1, "promoCode": "", "promoDiscount": 0, "subtotal": 0, "taxes": 0, "total": 0}'
      );
    } catch {
      return {
        quantity: 1,
        promoCode: "",
        promoDiscount: 0,
        subtotal: 0,
        taxes: 0,
        total: 0,
      };
    }
  });

  const TAXES_RATE = 0.06;

  const calculateCartTotals = useCallback(
    (
      experience: ExperienceDetails,
      slot: Slot,
      qty: number,
      discount: number
    ) => {
      const slotPrice = experience.basePrice * (slot.priceMultiplier || 1);
      let grossSubtotal = Math.round(slotPrice * qty);

      let finalDiscount = Math.min(discount, grossSubtotal);

      const netSubtotal = grossSubtotal - finalDiscount;
      const taxes = Math.round(netSubtotal * TAXES_RATE);
      const total = netSubtotal + taxes;

      const newCart = {
        experience,
        selectedSlot: slot,
        quantity: qty,
        promoCode: cart.promoCode,
        promoDiscount: finalDiscount,
        subtotal: grossSubtotal,
        taxes,
        total,
      };
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    },
    [cart.promoCode]
  );

  const selectSlot = useCallback(
    (slot: Slot, experience: ExperienceDetails, quantity: number) => {
      calculateCartTotals(experience, slot, quantity, 0);
    },
    [calculateCartTotals]
  );

  const updateQuantity = useCallback(
    (qty: number) => {
      const safeQty = Math.max(1, qty);
      if (details && cart.selectedSlot) {
        calculateCartTotals(
          details,
          cart.selectedSlot,
          safeQty,
          cart.promoDiscount
        );
      } else {
        const newCart = { ...cart, quantity: safeQty };
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    },
    [details, cart, calculateCartTotals]
  );

  // Data Fetching - ONLY runs when ID changes
  useEffect(() => {
    if (!id) return;

    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExperienceDetails(id);
        if (data) {
          setDetails(data);
          const dates = Object.keys(data.slotsByDate).sort();
          const firstDate = dates[0] || null;
          setSelectedDate(firstDate);
        } else {
          setError("Experience details not found.");
        }
      } catch (e) {
        console.error("Failed to load details:", e);
        setError("Failed to load experience details from the server.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]); // ONLY depends on id

  // Initialize slot selection ONCE when data loads
  useEffect(() => {
    if (isInitialLoad && details && selectedDate) {
      const slots = details.slotsByDate[selectedDate];
      if (slots && slots.length > 0) {
        const firstSlot = [...slots].sort((a, b) =>
          a.time.localeCompare(b.time)
        )[0];
        selectSlot(firstSlot, details, cart.quantity);
      }
      setIsInitialLoad(false);
    }
  }, [details, selectedDate, isInitialLoad, selectSlot, cart.quantity]);

  // Handle date changes (after initial load)
  useEffect(() => {
    if (!isInitialLoad && selectedDate && details) {
      const slots = details.slotsByDate[selectedDate];
      if (slots && slots.length > 0) {
        const firstSlot = [...slots].sort((a, b) =>
          a.time.localeCompare(b.time)
        )[0];
        selectSlot(firstSlot, details, cart.quantity);
      } else {
        // Clear selection if no slots available
        const newCart = { ...cart, selectedSlot: undefined };
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    }
  }, [selectedDate]); // Only trigger on date change

  const handleSlotClick = (slot: Slot) => {
    if (details) {
      selectSlot(slot, details, cart.quantity);
    }
  };

  const isSlotSelected = (slot: Slot) => cart.selectedSlot?._id === slot._id;

  const availableDates = details ? Object.keys(details.slotsByDate).sort() : [];
  const availableSlots =
    selectedDate && details?.slotsByDate[selectedDate]
      ? [...details.slotsByDate[selectedDate]].sort((a: Slot, b: Slot) =>
          a.time.localeCompare(b.time)
        )
      : [];

  const isBookable =
    cart.selectedSlot &&
    cart.selectedSlot.bookedSeats + cart.quantity <=
      cart.selectedSlot.totalCapacity;

  if (loading)
    return (
      <div className="min-h-screen">
        <PriceSummaryLoading />
      </div>
    );
  if (error || !details)
    return (
      <div className="text-center p-8 text-red-600">
        {error || "Experience not found."}
      </div>
    );

  const { name, location, image, description, minAge, duration } = details;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition duration-150"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Details and Selection */}
        <div className="lg:col-span-2">
          <img
            className="w-full h-80 object-cover rounded-xl shadow-lg mb-6"
            src={image}
            alt={name}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                `https://placehold.co/800x320/16a34a/ffffff?text=${name.split(" ")[0]}`;
            }}
          />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
          <p className="text-gray-500 mb-6">{location}</p>

          <div className="text-lg text-gray-800 mb-8 leading-relaxed">
            <p>{description}</p>
          </div>

          {/* Date Picker */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-yellow-500" /> Choose date
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm ${
                  selectedDate === date
                    ? "bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>

          {/* Time Picker */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" /> Choose time
          </h2>
          <div className="flex flex-wrap gap-3 mb-10">
            {availableSlots.map((slot: Slot) => {
              const isSoldOut = slot.bookedSeats >= slot.totalCapacity;
              const isSelected = isSlotSelected(slot);
              const spotsLeft = slot.totalCapacity - slot.bookedSeats;

              return (
                <button
                  key={slot._id}
                  onClick={() => !isSoldOut && handleSlotClick(slot)}
                  disabled={isSoldOut}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 relative shadow-sm ${
                    isSelected
                      ? "bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400"
                      : isSoldOut
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {slot.time}
                  {spotsLeft > 0 && spotsLeft <= 3 && !isSoldOut && (
                    <span
                      className={`text-xs ml-2 ${isSelected ? "text-gray-900" : "text-red-500"}`}
                    >
                      {" "}
                      | {spotsLeft} left
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="absolute inset-0 bg-gray-900/10 rounded-lg flex items-center justify-center text-xs text-red-600 font-bold backdrop-blur-[1px]">
                      Sold Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* About Section */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="font-semibold">Group Size:</span> Curated
                small-group experience.
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="font-semibold">Duration:</span> {duration}.
              </div>
              <div className="flex items-center text-sm">
                <Tag className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="font-semibold">Minimum Age:</span> {minAge}.
              </div>
              <p className="text-xs text-gray-500 mt-4">
                All times are in IST (GMT +5:30)
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Summary and Quantity */}
        <div className="lg:col-span-1 sticky top-4">
          <div className="bg-[#EFEFEF] p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Booking Summary
            </h2>

            {/* Experience name */}
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Experience:</span>
              <span className="font-medium text-gray-800">
                {cart.experience?.name}
              </span>
            </div>

            {/* Selected slot */}
            {cart.selectedSlot && (
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Slot:</span>
                <span className="font-medium text-gray-800">
                  {cart.selectedSlot.date} — {cart.selectedSlot.time}
                </span>
              </div>
            )}

            {/* Quantity  */}
            <div className="flex justify-between items-center text-sm  mb-3">
              <span>Quantity:</span>
              <div className="flex items-center  rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() => updateQuantity(cart.quantity - 1)}
                  disabled={cart.quantity <= 1}
                  className="text-gray-900 px-1 py-1 hover:text-black transition disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  value={cart.quantity}
                  onChange={(e) =>
                    updateQuantity(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  className="w-10 text-center ml-2 text-gray-900 font-semibold  bg-[#EFEFEF] text-lg focus:outline-none border-0 p-0 m-0"
                  readOnly
                />

                <button
                  onClick={() => updateQuantity(cart.quantity + 1)}
                  className=" py-1 hover:text-black transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price calculation */}
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Base Price:</span>
              <span>₹{cart.experience?.basePrice || 0}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Total Price:</span>
              <span className="font-semibold text-gray-900">
                ₹{(cart.experience?.basePrice || 0) * cart.quantity}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => navigate("/checkout")}
              disabled={!cart.selectedSlot || !isBookable}
              className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition ${
                !cart.selectedSlot || !isBookable
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Confirm Booking
            </button>

            {/* Warning message */}
            {!isBookable && cart.selectedSlot && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
                Booking quantity exceeds available capacity for this slot.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy component for loading state fidelity
const PriceSummaryLoading = () => (
  <div className="max-w-7xl mx-auto p-8">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="w-full h-80 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="lg:col-span-1 sticky top-4 p-6 space-y-4 bg-white rounded-xl shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default Details;
