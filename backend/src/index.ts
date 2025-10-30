import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { connectDB } from "./db";
import experienceRoutes from "./routes/experience";
import bookingRoutes from "./routes/booking";
import promoRoutes from "./routes/promo";

const app: Application = express();

// Database Connection
connectDB();
// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-it-theta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/images", express.static("public/images"));

// Root Check
app.get("/", (req: Request, res: Response) => {
  res.send("BookIt API is running!");
});

// Start Server
app.listen(config.port, () => {
  console.log(`Backend Server running on http://localhost:${config.port}`);
  console.log("----------------------------------------------------");
  console.log('STEP 1: Ensure you run "npm run seed" first.');
  console.log('STEP 2: Run "npm run dev" in the backend folder.');
  console.log('STEP 3: Run "npm run dev" in the frontend folder.');
  console.log("----------------------------------------------------");
});
export default app;
