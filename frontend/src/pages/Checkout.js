import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign } from "lucide-react";
import { validatePromoCode, createBooking } from "../api";
const LoadingSpinner = () => (_jsx("div", { className: "flex justify-center items-center", children: _jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }) }));
const PriceSummaryCheckout = ({ cart, onConfirm, loading, disabled, }) => {
    return (_jsxs("div", { className: "w-full bg-white p-6 rounded-xl shadow-2xl border border-gray-100", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-gray-900", children: "Price Summary" }), _jsxs("div", { className: "space-y-3 text-gray-700", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Experience" }), _jsx("span", { className: "font-semibold", children: cart.experience?.name })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Date" }), _jsx("span", { className: "font-semibold", children: cart.selectedSlot?.date
                                    ? new Date(cart.selectedSlot.date).toLocaleDateString("en-IN")
                                    : "-" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Time" }), _jsx("span", { className: "font-semibold", children: cart.selectedSlot?.time })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Qty" }), _jsx("span", { className: "font-semibold", children: cart.quantity })] }), _jsx("hr", { className: "border-gray-200" }), _jsxs("div", { className: "flex justify-between text-gray-900 font-semibold", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["\u20B9", cart.subtotal.toLocaleString("en-IN")] })] }), cart.promoDiscount > 0 && (_jsxs("div", { className: "flex justify-between text-green-600 font-medium border-t pt-2 border-dashed", children: [_jsxs("span", { children: ["Discount (", cart.promoCode, ")"] }), _jsxs("span", { children: ["- \u20B9", cart.promoDiscount.toLocaleString("en-IN")] })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Taxes" }), _jsxs("span", { children: ["+ \u20B9", cart.taxes.toLocaleString("en-IN")] })] }), _jsxs("div", { className: "flex justify-between pt-4 border-t border-gray-300", children: [_jsx("span", { className: "text-xl font-bold text-gray-900", children: "Total" }), _jsxs("span", { className: "text-3xl font-extrabold text-gray-900", children: ["\u20B9", cart.total.toLocaleString("en-IN")] })] })] }), _jsx("button", { onClick: onConfirm, disabled: disabled, className: "w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-50 flex items-center justify-center shadow-md text-lg", children: loading ? _jsx(LoadingSpinner, {}) : "Pay and Confirm" }), _jsxs("p", { className: "text-xs text-gray-500 mt-2 text-center flex items-center justify-center", children: [_jsx(DollarSign, { className: "w-3 h-3 inline mr-1" }), " Total amount includes taxes."] })] }));
};
const Checkout = () => {
    const navigate = useNavigate();
    // Load cart state from localStorage
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "{}"));
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        agreedToTerms: false,
    });
    const [promoInput, setPromoInput] = useState(cart.promoCode || "");
    const [promoMessage, setPromoMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const TAXES_RATE = 0.06;
    // Recalculate cart totals when cart changes (e.g., promo applied)
    const calculateCartTotals = useCallback((cartToUpdate, discount) => {
        if (!cartToUpdate.experience || !cartToUpdate.selectedSlot)
            return;
        const slotPrice = cartToUpdate.experience.basePrice *
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
    }, []);
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const isEmailValid = formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const isFormValid = formData.fullName.trim().length > 2 &&
        isEmailValid &&
        formData.agreedToTerms;
    const handleApplyPromo = async () => {
        if (!cart.experience || !cart.selectedSlot)
            return;
        setLoading(true);
        setPromoMessage("");
        try {
            // Subtotal passed to API is the gross amount before any discount
            const slotPrice = cart.experience.basePrice * (cart.selectedSlot.priceMultiplier || 1);
            const grossSubtotal = Math.round(slotPrice * cart.quantity);
            const result = await validatePromoCode(promoInput, grossSubtotal);
            setPromoMessage(result.message);
            calculateCartTotals({ ...cart, promoCode: promoInput.toUpperCase() }, result.discount);
        }
        catch (e) {
            setPromoMessage(e.message || "Error applying promo code.");
            // Re-calculate cart with 0 discount if API fails
            calculateCartTotals(cart, 0);
        }
        finally {
            setLoading(false);
        }
    };
    const handleBooking = async () => {
        if (!isFormValid || !cart.selectedSlot || !cart.experience) {
            setCheckoutError("Please fill out all required fields and agree to terms.");
            return;
        }
        setLoading(true);
        setCheckoutError(null);
        try {
            const result = await createBooking(cart, formData);
            if (result.success) {
                localStorage.removeItem("cart");
                navigate(`/result/${result.refId}`);
            }
            else {
                throw new Error(result.error || "Booking failed. Slot may be sold out.");
            }
        }
        catch (e) {
            setCheckoutError(e.message || "An unexpected error occurred during booking.");
        }
        finally {
            setLoading(false);
        }
    };
    // Redirect if cart is invalid (direct navigation to checkout)
    useEffect(() => {
        if (!cart.experience || !cart.selectedSlot) {
            navigate("/", { replace: true });
        }
    }, [cart.experience, cart.selectedSlot, navigate]);
    if (!cart.experience || !cart.selectedSlot)
        return null; // Wait for redirect
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => navigate(`/details/${cart.experience?.id}`), className: "flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition duration-150", children: [_jsx(ArrowLeft, { className: "w-5 h-5 mr-2" }), " Checkout"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg border border-gray-100", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: "Your Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("input", { type: "text", name: "fullName", placeholder: "Full name", value: formData.fullName, onChange: handleFormChange, className: "w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150", required: true }), formData.fullName.length > 0 &&
                                                    formData.fullName.trim().length <= 2 && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Name must be at least 3 characters." }))] }), _jsxs("div", { children: [_jsx("input", { type: "email", name: "email", placeholder: "Email", value: formData.email, onChange: handleFormChange, className: "w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150", required: true }), formData.email.length > 0 && !isEmailValid && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Please enter a valid email." }))] })] }), _jsx("h3", { className: "text-xl font-bold mb-4 mt-8 text-gray-900", children: "Promo Code" }), _jsxs("div", { className: "flex gap-4 items-start mb-6", children: [_jsx("div", { className: "relative flex-grow", children: _jsx("input", { type: "text", name: "promoCode", placeholder: "Promo code", value: promoInput, onChange: (e) => setPromoInput(e.target.value), className: "w-full py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150" }) }), _jsx("button", { onClick: handleApplyPromo, disabled: loading || !promoInput.trim(), className: "bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 disabled:opacity-50 shadow-md", children: loading ? "..." : "Apply" })] }), promoMessage && (_jsx("p", { className: `text-sm ${cart.promoDiscount > 0 ? "text-green-600" : "text-red-600"}`, children: promoMessage })), _jsxs("div", { className: "mt-8", children: [_jsxs("label", { className: "flex items-center text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", name: "agreedToTerms", checked: formData.agreedToTerms, onChange: handleFormChange, className: "h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500" }), _jsx("span", { className: "ml-2", children: "I agree to the terms and safety policy" })] }), !formData.agreedToTerms && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "You must agree to the terms to proceed." }))] }), checkoutError && (_jsx("div", { className: "mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200", children: checkoutError }))] }) }), _jsx("div", { className: "lg:col-span-1 sticky top-4", children: _jsx(PriceSummaryCheckout, { cart: cart, onConfirm: handleBooking, loading: loading, disabled: !isFormValid || loading }) })] })] }));
};
export default Checkout;
