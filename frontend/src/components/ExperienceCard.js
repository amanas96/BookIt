import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const ExperienceCard = ({ experience }) => {
    const { id, name, location, tagline, basePrice, image } = experience;
    return (_jsxs("div", { className: "bg-white  rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1", children: [_jsx("img", { className: "h-50 w-full object-cover", src: image, alt: name, onError: (e) => {
                    e.target.onerror = null;
                    e.target.src =
                        `https://placehold.co/400x300/16a34a/ffffff?text=${name.split(" ")[0]}`;
                } }), _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: name }), _jsx("span", { className: "text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium", children: location })] }), _jsx("p", { className: "text-sm text-gray-500 mb-4 h-10 overflow-hidden", children: tagline }), _jsxs("div", { className: "flex justify-between items-center pt-3 border-t border-gray-100", children: [_jsxs("span", { className: "text-lg font-bold text-gray-900", children: ["From \u20B9", basePrice.toLocaleString("en-IN")] }), _jsx(Link, { to: `/details/${id}`, className: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 shadow-md hover:shadow-lg", children: "View Details" })] })] })] }));
};
export default ExperienceCard;
