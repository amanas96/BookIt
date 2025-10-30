import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, DollarSign } from "lucide-react";
import { BookingCart, CheckoutForm, PromoResult } from "../types.d";
import { validatePromoCode, createBooking } from "../api";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  </div>
);

// Utility component to show the price summary
interface PriceSummaryProps {
  cart: BookingCart;
  onConfirm: () => void;
  loading: boolean;
  disabled: boolean;
}
const PriceSummaryCheckout: React.FC<PriceSummaryProps> = ({
  cart,
  onConfirm,
  loading,
  disabled,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Price Summary</h2>
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span>Experience</span>
          <span className="font-semibold">{cart.experience?.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span className="font-semibold">
            {cart.selectedSlot?.date
              ? new Date(cart.selectedSlot.date).toLocaleDateString("en-IN")
              : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Time</span>
          <span className="font-semibold">{cart.selectedSlot?.time}</span>
        </div>
        <div className="flex justify-between">
          <span>Qty</span>
          <span className="font-semibold">{cart.quantity}</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-gray-900 font-semibold">
          <span>Subtotal</span>
          <span>₹{cart.subtotal.toLocaleString("en-IN")}</span>
        </div>
        {cart.promoDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium border-t pt-2 border-dashed">
            <span>Discount ({cart.promoCode})</span>
            <span>- ₹{cart.promoDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>+ ₹{cart.taxes.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-300">
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-3xl font-extrabold text-gray-900">
            ₹{cart.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={disabled}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-50 flex items-center justify-center shadow-md text-lg"
      >
        {loading ? <LoadingSpinner /> : "Pay and Confirm"}
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center">
        <DollarSign className="w-3 h-3 inline mr-1" /> Total amount includes
        taxes.
      </p>
    </div>
  );
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // Load cart state from localStorage
  const [cart, setCart] = useState<BookingCart>(
    JSON.parse(localStorage.getItem("cart") || "{}")
  );
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    agreedToTerms: false,
  });
  const [promoInput, setPromoInput] = useState(cart.promoCode || "");
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const TAXES_RATE = 0.06;

  // Recalculate cart totals when cart changes (e.g., promo applied)
  const calculateCartTotals = useCallback(
    (cartToUpdate: BookingCart, discount: number) => {
      if (!cartToUpdate.experience || !cartToUpdate.selectedSlot) return;

      const slotPrice =
        cartToUpdate.experience.basePrice *
        (cartToUpdate.selectedSlot.priceMultiplier || 1);
      let grossSubtotal = Math.round(slotPrice * cartToUpdate.quantity);

      let finalDiscount = Math.min(discount, grossSubtotal);

      const netSubtotal = grossSubtotal - finalDiscount;
      const taxes = Math.round(netSubtotal * TAXES_RATE);
      const total = netSubtotal + taxes;

      const newCart = {
        ...cartToUpdate,
        promoDiscount: finalDiscount,
        subtotal: grossSubtotal,
        taxes,
        total,
      };
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    },
    []
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isEmailValid = formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isFormValid =
    formData.fullName.trim().length > 2 &&
    isEmailValid &&
    formData.agreedToTerms;

  const handleApplyPromo = async () => {
    if (!cart.experience || !cart.selectedSlot) return;

    setLoading(true);
    setPromoMessage("");

    try {
      // Subtotal passed to API is the gross amount before any discount
      const slotPrice =
        cart.experience.basePrice * (cart.selectedSlot.priceMultiplier || 1);
      const grossSubtotal = Math.round(slotPrice * cart.quantity);

      const result: PromoResult = await validatePromoCode(
        promoInput,
        grossSubtotal
      );

      setPromoMessage(result.message);
      calculateCartTotals(
        { ...cart, promoCode: promoInput.toUpperCase() },
        result.discount
      );
    } catch (e: any) {
      setPromoMessage(e.message || "Error applying promo code.");
      // Re-calculate cart with 0 discount if API fails
      calculateCartTotals(cart, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isFormValid || !cart.selectedSlot || !cart.experience) {
      setCheckoutError(
        "Please fill out all required fields and agree to terms."
      );
      return;
    }

    setLoading(true);
    setCheckoutError(null);

    try {
      const result = await createBooking(cart, formData);
      if (result.success) {
        localStorage.removeItem("cart");
        navigate(`/result/${result.refId}`);
      } else {
        throw new Error(
          result.error || "Booking failed. Slot may be sold out."
        );
      }
    } catch (e: any) {
      setCheckoutError(
        e.message || "An unexpected error occurred during booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is invalid (direct navigation to checkout)
  useEffect(() => {
    if (!cart.experience || !cart.selectedSlot) {
      navigate("/", { replace: true });
    }
  }, [cart.experience, cart.selectedSlot, navigate]);

  if (!cart.experience || !cart.selectedSlot) return null; // Wait for redirect

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate(`/details/${cart.experience?.id}`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition duration-150"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Checkout Form (Fidelity: hd pay and continue.png) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Your Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                  required
                />
                {formData.fullName.length > 0 &&
                  formData.fullName.trim().length <= 2 && (
                    <p className="text-xs text-red-500 mt-1">
                      Name must be at least 3 characters.
                    </p>
                  )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                  required
                />
                {formData.email.length > 0 && !isEmailValid && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid email.
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 mt-8 text-gray-900">
              Promo Code
            </h3>
            <div className="flex gap-4 items-start mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                disabled={loading || !promoInput.trim()}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 disabled:opacity-50 shadow-md"
              >
                {loading ? "..." : "Apply"}
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-sm ${cart.promoDiscount > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {promoMessage}
              </p>
            )}

            <div className="mt-8">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="ml-2">
                  I agree to the terms and safety policy
                </span>
              </label>
              {!formData.agreedToTerms && (
                <p className="text-xs text-red-500 mt-1">
                  You must agree to the terms to proceed.
                </p>
              )}
            </div>

            {checkoutError && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
                {checkoutError}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Price Summary */}
        <div className="lg:col-span-1 sticky top-4">
          <PriceSummaryCheckout
            cart={cart}
            onConfirm={handleBooking}
            loading={loading}
            disabled={!isFormValid || loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
