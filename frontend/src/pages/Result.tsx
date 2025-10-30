// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { CheckCircle, Home as HomeIcon } from "lucide-react";

// const Result: React.FC = () => {
//   const { refId } = useParams<{ refId: string }>();
//   const navigate = useNavigate();
//   const [isConfirmed, setIsConfirmed] = useState(false);

//   useEffect(() => {
//     // Simple check to ensure a refId exists for confirmation display
//     if (refId) {
//       setIsConfirmed(true);
//     } else {
//       // If navigated here without a refId, redirect home
//       navigate("/", { replace: true });
//     }
//   }, [refId, navigate]);

//   if (!isConfirmed) return null;

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
//       <CheckCircle className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
//       <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
//         Booking Confirmed
//       </h1>
//       <p className="text-xl text-gray-700 mb-8">
//         Ref ID:{" "}
//         <span className="font-mono font-semibold text-gray-800 bg-yellow-100 p-1 rounded-md">
//           {refId}
//         </span>
//       </p>

//       <button
//         onClick={() => navigate("/")}
//         className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md flex items-center"
//       >
//         <HomeIcon className="w-5 h-5 mr-2" /> Back to Home
//       </button>
//     </div>
//   );
// };

// export default Result;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Home as HomeIcon } from "lucide-react";

const Result: React.FC = () => {
  const { refId } = useParams<{ refId: string }>();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // If there's no refId, go home immediately
    if (!refId) {
      navigate("/", { replace: true });
      return;
    }

    setIsConfirmed(true);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refId, navigate]);

  if (!isConfirmed) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Booking Confirmed
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Ref ID:{" "}
        <span className="font-mono font-semibold text-gray-800 bg-yellow-100 p-1 rounded-md">
          {refId}
        </span>
      </p>

      <p className="text-lg text-gray-600 mb-6">
        Redirecting to home in{" "}
        <span className="font-bold text-gray-900">{countdown}</span> seconds...
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-md flex items-center"
      >
        <HomeIcon className="w-5 h-5 mr-2" /> Back to Home
      </button>
    </div>
  );
};

export default Result;
