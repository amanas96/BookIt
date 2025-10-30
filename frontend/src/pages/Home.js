import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import ExperienceCard from "../components/ExperienceCard";
import { fetchExperiences } from "../api";
import { useSearch } from "../contexts/searchContext";
const LoadingSpinner = () => (_jsx("div", { className: "flex justify-center items-center h-96", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" }) }));
const Home = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm, setSearchTerm } = useSearch(); // Use context
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchExperiences();
                setExperiences(data);
            }
            catch (e) {
                console.error("Failed to load experiences:", e);
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    // Filter experiences
    const filteredExperiences = experiences.filter((exp) => {
        const search = searchTerm.trim().toLowerCase();
        if (!search)
            return true;
        return (exp.name.toLowerCase().includes(search) ||
            exp.location.toLowerCase().includes(search) ||
            exp.tagline?.toLowerCase().includes(search));
    });
    const clearSearch = () => {
        setSearchTerm("");
    };
    return (_jsxs("div", { className: "max-w-8xl lg:mx-26 p-4 md:p-8", children: [_jsx("h1", { className: "text-4xl font-extrabold text-center text-gray-900 mb-8 hidden md:block", children: "Explore Your Next Adventure" }), _jsx("div", { className: "mb-8 md:hidden", children: _jsxs("div", { className: "relative flex items-center", children: [_jsx(Search, { className: "w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" }), _jsx("input", { type: "text", placeholder: "Search experiences...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 shadow-sm text-base" }), searchTerm && (_jsx("button", { onClick: clearSearch, className: "absolute right-3 p-1 hover:bg-gray-100 rounded-full transition", "aria-label": "Clear search", children: _jsx(X, { className: "w-4 h-4 text-gray-400" }) }))] }) }), searchTerm && !loading && (_jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["Found ", filteredExperiences.length, " experience", filteredExperiences.length !== 1 ? "s" : ""] })), loading ? (_jsx(LoadingSpinner, {})) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [filteredExperiences.map((exp) => (_jsx(ExperienceCard, { experience: exp }, exp.id))), filteredExperiences.length === 0 && (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(Search, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-xl font-semibold text-gray-700 mb-2", children: "No experiences found" }), _jsxs("p", { className: "text-gray-500 mb-6", children: ["Try searching for something else or", " ", _jsx("button", { onClick: clearSearch, className: "text-yellow-600 hover:text-yellow-700 font-medium underline", children: "clear your search" })] })] }))] }))] }));
};
export default Home;
