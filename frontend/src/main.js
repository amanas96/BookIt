import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, } from "react-router-dom";
import "./index.css";
import "./types.d";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Checkout from "./pages/Checkout";
import Result from "./pages/Result";
import { Search } from "lucide-react";
import { SearchProvider, useSearch } from "./contexts/searchContext";
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = useSearch();
    const showSearch = location.pathname === "/" || location.pathname.startsWith("/result");
    const handleSearch = (e) => {
        e.preventDefault();
        // Navigate to home if not already there
        if (location.pathname !== "/") {
            navigate("/");
        }
    };
    return (_jsx("header", { className: "sticky top-0 z-10 bg-white shadow-md border-b border-gray-200", children: _jsxs("div", { className: "max-w-8xl lg:mx-26 mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2 cursor-pointer transition duration-150 hover:opacity-80", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full text-lg font-extrabold text-gray-900", children: "hd" }), _jsx("span", { className: "text-lg font-bold text-gray-900 hidden sm:inline", children: "highway delite" })] }), showSearch && (_jsxs("form", { onSubmit: handleSearch, className: "w-full max-w-md hidden md:flex items-center gap-3 justify-end", children: [_jsx("input", { type: "text", placeholder: "Search experiences", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" }), _jsx("button", { type: "submit", className: "bg-yellow-500 text-gray-900 font-semibold py-3  px-5 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-sm flex items-center", children: _jsx(Search, { className: "w-5 h-5" }) })] }))] }) }));
};
const App = () => {
    return (_jsx(SearchProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(Header, {}), _jsx("main", { className: "pb-12", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/details/:id", element: _jsx(Details, {}) }), _jsx(Route, { path: "/checkout", element: _jsx(Checkout, {}) }), _jsx(Route, { path: "/result/:refId", element: _jsx(Result, {}) }), _jsx(Route, { path: "*", element: _jsx(Home, {}) })] }) })] }) }));
};
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
