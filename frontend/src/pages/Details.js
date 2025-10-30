import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Tag, Minus, Plus, } from "lucide-react";
import { fetchExperienceDetails } from "../api";
const PriceSummary = ({ cart, onConfirm, disabled, }) => {
    return (_jsxs("div", { className: "w-full bg-white p-6 rounded-xl shadow-2xl border border-gray-100", children: [_jsxs("div", { className: "space-y-3 text-gray-700", children: [_jsxs("div", { className: "flex justify-between text-xl font-semibold text-gray-900", children: [_jsx("span", { children: "Starts at" }), _jsxs("span", { children: ["\u20B9", cart.experience?.basePrice?.toLocaleString("en-IN")] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Quantity" }), _jsx("span", { className: "font-semibold", children: cart.quantity })] }), cart.selectedSlot?.priceMultiplier &&
                        cart.selectedSlot?.priceMultiplier > 1 && (_jsxs("div", { className: "flex justify-between text-yellow-600 text-sm font-medium", children: [_jsx("span", { children: "Peak Time Surcharge" }), _jsxs("span", { children: ["+", (cart.selectedSlot.priceMultiplier * 100 - 100).toFixed(0), "%"] })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { className: "font-semibold", children: ["\u20B9", cart.subtotal.toLocaleString("en-IN")] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Taxes" }), _jsxs("span", { className: "font-semibold", children: ["+ \u20B9", cart.taxes.toLocaleString("en-IN")] })] }), _jsxs("div", { className: "flex justify-between pt-4 border-t border-gray-300", children: [_jsx("span", { className: "text-2xl font-bold text-gray-900", children: "Total" }), _jsxs("span", { className: "text-3xl font-extrabold text-yellow-600", children: ["\u20B9", cart.total.toLocaleString("en-IN")] })] })] }), _jsx("button", { onClick: onConfirm, disabled: disabled, className: "w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-150 disabled:opacity-50 flex items-center justify-center shadow-md text-lg", children: "Continue to Checkout" })] }));
};
// Main Details Page Component
const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    // --- Mock Cart State Management (In a real app, use Context/Redux) ---
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cart") ||
                '{"quantity": 1, "promoCode": "", "promoDiscount": 0, "subtotal": 0, "taxes": 0, "total": 0}');
        }
        catch {
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
    const calculateCartTotals = useCallback((experience, slot, qty, discount) => {
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
    }, [cart.promoCode]);
    const selectSlot = useCallback((slot, experience, quantity) => {
        calculateCartTotals(experience, slot, quantity, 0);
    }, [calculateCartTotals]);
    const updateQuantity = useCallback((qty) => {
        const safeQty = Math.max(1, qty);
        if (details && cart.selectedSlot) {
            calculateCartTotals(details, cart.selectedSlot, safeQty, cart.promoDiscount);
        }
        else {
            const newCart = { ...cart, quantity: safeQty };
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    }, [details, cart, calculateCartTotals]);
    // Data Fetching - ONLY runs when ID changes
    useEffect(() => {
        if (!id)
            return;
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
                }
                else {
                    setError("Experience details not found.");
                }
            }
            catch (e) {
                console.error("Failed to load details:", e);
                setError("Failed to load experience details from the server.");
            }
            finally {
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
                const firstSlot = [...slots].sort((a, b) => a.time.localeCompare(b.time))[0];
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
                const firstSlot = [...slots].sort((a, b) => a.time.localeCompare(b.time))[0];
                selectSlot(firstSlot, details, cart.quantity);
            }
            else {
                // Clear selection if no slots available
                const newCart = { ...cart, selectedSlot: undefined };
                setCart(newCart);
                localStorage.setItem("cart", JSON.stringify(newCart));
            }
        }
    }, [selectedDate]); // Only trigger on date change
    const handleSlotClick = (slot) => {
        if (details) {
            selectSlot(slot, details, cart.quantity);
        }
    };
    const isSlotSelected = (slot) => cart.selectedSlot?._id === slot._id;
    const availableDates = details ? Object.keys(details.slotsByDate).sort() : [];
    const availableSlots = selectedDate && details?.slotsByDate[selectedDate]
        ? [...details.slotsByDate[selectedDate]].sort((a, b) => a.time.localeCompare(b.time))
        : [];
    const isBookable = cart.selectedSlot &&
        cart.selectedSlot.bookedSeats + cart.quantity <=
            cart.selectedSlot.totalCapacity;
    if (loading)
        return (_jsx("div", { className: "min-h-screen", children: _jsx(PriceSummaryLoading, {}) }));
    if (error || !details)
        return (_jsx("div", { className: "text-center p-8 text-red-600", children: error || "Experience not found." }));
    const { name, location, image, description, minAge, duration } = details;
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => navigate("/"), className: "flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition duration-150", children: [_jsx(ArrowLeft, { className: "w-5 h-5 mr-2" }), " Details"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("img", { className: "w-full h-80 object-cover rounded-xl shadow-lg mb-6", src: image, alt: name, onError: (e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        `https://placehold.co/800x320/16a34a/ffffff?text=${name.split(" ")[0]}`;
                                } }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: name }), _jsx("p", { className: "text-gray-500 mb-6", children: location }), _jsx("div", { className: "text-lg text-gray-800 mb-8 leading-relaxed", children: _jsx("p", { children: description }) }), _jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx(Calendar, { className: "w-5 h-5 mr-2 text-yellow-500" }), " Choose date"] }), _jsx("div", { className: "flex flex-wrap gap-3 mb-8", children: availableDates.map((date) => (_jsx("button", { onClick: () => setSelectedDate(date), className: `px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm ${selectedDate === date
                                        ? "bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`, children: new Date(date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    }) }, date))) }), _jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx(Clock, { className: "w-5 h-5 mr-2 text-yellow-500" }), " Choose time"] }), _jsx("div", { className: "flex flex-wrap gap-3 mb-10", children: availableSlots.map((slot) => {
                                    const isSoldOut = slot.bookedSeats >= slot.totalCapacity;
                                    const isSelected = isSlotSelected(slot);
                                    const spotsLeft = slot.totalCapacity - slot.bookedSeats;
                                    return (_jsxs("button", { onClick: () => !isSoldOut && handleSlotClick(slot), disabled: isSoldOut, className: `px-4 py-2 rounded-lg text-sm font-medium transition duration-150 relative shadow-sm ${isSelected
                                            ? "bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400"
                                            : isSoldOut
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`, children: [slot.time, spotsLeft > 0 && spotsLeft <= 3 && !isSoldOut && (_jsxs("span", { className: `text-xs ml-2 ${isSelected ? "text-gray-900" : "text-red-500"}`, children: [" ", "| ", spotsLeft, " left"] })), isSoldOut && (_jsx("span", { className: "absolute inset-0 bg-gray-900/10 rounded-lg flex items-center justify-center text-xs text-red-600 font-bold backdrop-blur-[1px]", children: "Sold Out" }))] }, slot._id));
                                }) }), _jsxs("div", { className: "pt-4 border-t border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-3", children: "About" }), _jsxs("div", { className: "space-y-2 text-gray-700", children: [_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Users, { className: "w-4 h-4 mr-2 text-yellow-500" }), _jsx("span", { className: "font-semibold", children: "Group Size:" }), " Curated small-group experience."] }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Clock, { className: "w-4 h-4 mr-2 text-yellow-500" }), _jsx("span", { className: "font-semibold", children: "Duration:" }), " ", duration, "."] }), _jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Tag, { className: "w-4 h-4 mr-2 text-yellow-500" }), _jsx("span", { className: "font-semibold", children: "Minimum Age:" }), " ", minAge, "."] }), _jsx("p", { className: "text-xs text-gray-500 mt-4", children: "All times are in IST (GMT +5:30)" })] })] })] }), _jsx("div", { className: "lg:col-span-1 sticky top-4", children: _jsxs("div", { className: "bg-[#EFEFEF] p-6 rounded-xl shadow-lg border border-gray-100", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Booking Summary" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-3", children: [_jsx("span", { children: "Experience:" }), _jsx("span", { className: "font-medium text-gray-800", children: cart.experience?.name })] }), cart.selectedSlot && (_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-3", children: [_jsx("span", { children: "Slot:" }), _jsxs("span", { className: "font-medium text-gray-800", children: [cart.selectedSlot.date, " \u2014 ", cart.selectedSlot.time] })] })), _jsxs("div", { className: "flex justify-between items-center text-sm  mb-3", children: [_jsx("span", { children: "Quantity:" }), _jsxs("div", { className: "flex items-center  rounded-lg overflow-hidden w-fit", children: [_jsx("button", { onClick: () => updateQuantity(cart.quantity - 1), disabled: cart.quantity <= 1, className: "text-gray-900 px-1 py-1 hover:text-black transition disabled:opacity-50", children: _jsx(Minus, { className: "w-4 h-4" }) }), _jsx("input", { type: "number", value: cart.quantity, onChange: (e) => updateQuantity(parseInt(e.target.value) || 1), min: "1", className: "w-10 text-center ml-2 text-gray-900 font-semibold text-lg focus:outline-none border-0 p-0 m-0", readOnly: true }), _jsx("button", { onClick: () => updateQuantity(cart.quantity + 1), className: " py-1 hover:text-black transition", children: _jsx(Plus, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-3", children: [_jsx("span", { children: "Base Price:" }), _jsxs("span", { children: ["\u20B9", cart.experience?.basePrice || 0] })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-3", children: [_jsx("span", { children: "Total Price:" }), _jsxs("span", { className: "font-semibold text-gray-900", children: ["\u20B9", (cart.experience?.basePrice || 0) * cart.quantity] })] }), _jsx("button", { onClick: () => navigate("/checkout"), disabled: !cart.selectedSlot || !isBookable, className: `w-full mt-4 py-3 rounded-lg text-white font-semibold transition ${!cart.selectedSlot || !isBookable
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"}`, children: "Confirm Booking" }), !isBookable && cart.selectedSlot && (_jsx("div", { className: "mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200", children: "Booking quantity exceeds available capacity for this slot." }))] }) })] })] }));
};
// Dummy component for loading state fidelity
const PriceSummaryLoading = () => (_jsxs("div", { className: "max-w-7xl mx-auto p-8", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsx("div", { className: "w-full h-80 bg-gray-200 rounded-xl animate-pulse" }), _jsx("div", { className: "h-8 bg-gray-200 rounded w-3/4 animate-pulse" }), _jsx("div", { className: "h-6 bg-gray-200 rounded w-1/2 animate-pulse" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-full animate-pulse" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-full animate-pulse" }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("div", { className: "h-10 w-20 bg-gray-200 rounded-lg animate-pulse" }), _jsx("div", { className: "h-10 w-20 bg-gray-200 rounded-lg animate-pulse" })] })] }), _jsxs("div", { className: "lg:col-span-1 sticky top-4 p-6 space-y-4 bg-white rounded-xl shadow-lg", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-1/2 animate-pulse" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 animate-pulse" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 animate-pulse" }), _jsx("div", { className: "h-12 bg-gray-300 rounded-lg animate-pulse" })] })] })] }));
export default Details;
