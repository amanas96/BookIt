import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import "./types.d";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Checkout from "./pages/Checkout";
import Result from "./pages/Result";
import { Search } from "lucide-react";
import { SearchProvider, useSearch } from "./contexts/searchContext";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearch();

  const showSearch =
    location.pathname === "/" || location.pathname.startsWith("/result");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to home if not already there
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-8xl lg:mx-26 mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center space-x-2 cursor-pointer transition duration-150 hover:opacity-80"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full text-lg font-extrabold text-gray-900">
            hd
          </div>
          <span className="text-lg font-bold text-gray-900 hidden sm:inline">
            highway delite
          </span>
        </Link>

        {/*  Search Bar */}
        {showSearch && (
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md hidden md:flex items-center gap-3 justify-end"
          >
            <input
              type="text"
              placeholder="Search experiences"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 font-semibold py-3  px-5 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-sm flex items-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Header />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/result/:refId" element={<Result />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SearchProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
