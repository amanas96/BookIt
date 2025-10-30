import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { connectDB } from "./db";
import experienceRoutes from "./routes/experience";
import bookingRoutes from "./routes/booking";
import promoRoutes from "./routes/promo";
import { fileURLToPath } from "url";

const app: Application = express();

// Database Connection
connectDB();
// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
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

// // 🟢 Serve React build in production
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (_, res) =>
//     res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"))
//   );
// }

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
