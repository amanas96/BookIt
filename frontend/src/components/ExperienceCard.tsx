import React from "react";
import { Experience } from "../types.d";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { id, name, location, tagline, basePrice, image } = experience;

  return (
    <div className="bg-white  rounded-xl shadow-lg overflow-hidden  transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <img
        className="h-48 w-full object-cover"
        src={image}
        alt={name}
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            `https://placehold.co/400x300/16a34a/ffffff?text=${name.split(" ")[0]}`;
        }}
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
            {location}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">
          {tagline}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            From ₹{basePrice.toLocaleString("en-IN")}
          </span>
          <Link
            to={`/details/${id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
