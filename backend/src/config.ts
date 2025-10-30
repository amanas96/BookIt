import "dotenv/config";

// Define the interface for your environment variables
interface Config {
  mongoUri: string;
  port: number;
  frontendUrl: string;
}

// Load environment variables with fallback values
if (!process.env.MONGO_URI) {
  throw new Error("❌ Missing MONGO_URI in .env file");
}
const config: Config = {
  mongoUri: process.env.MONGO_URI!,

  port: parseInt(process.env.PORT || "4000", 10),
  frontendUrl: process.env.FRONTEND_URL || "",
};

export default config;
