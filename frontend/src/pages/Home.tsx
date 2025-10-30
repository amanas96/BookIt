import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import ExperienceCard from "../components/ExperienceCard";
import { fetchExperiences } from "../api";
import { Experience } from "../types.d";
import { useSearch } from "../contexts/searchContext";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
  </div>
);

const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch(); // Use context

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchExperiences();
        setExperiences(data);
      } catch (e) {
        console.error("Failed to load experiences:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter experiences
  const filteredExperiences = experiences.filter((exp) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    return (
      exp.name.toLowerCase().includes(search) ||
      exp.location.toLowerCase().includes(search) ||
      exp.tagline?.toLowerCase().includes(search)
    );
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="max-w-8xl lg:mx-26 p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 hidden md:block">
        Explore Your Next Adventure
      </h1>

      {/* Mobile Search Bar (visible on small screens where header search is hidden) */}
      <div className="mb-8 md:hidden">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 shadow-sm text-base"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Count */}
      {searchTerm && !loading && (
        <p className="text-sm text-gray-500 mb-4">
          Found {filteredExperiences.length} experience
          {filteredExperiences.length !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
          {filteredExperiences.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                No experiences found
              </p>
              <p className="text-gray-500 mb-6">
                Try searching for something else or{" "}
                <button
                  onClick={clearSearch}
                  className="text-yellow-600 hover:text-yellow-700 font-medium underline"
                >
                  clear your search
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
