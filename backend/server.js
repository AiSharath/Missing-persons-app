import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import faceRoutes from "./routes/faceRecognition.js";
import missingPersonRoutes from "./routes/missingPersonRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit for base64 images

// mount API routes
app.use("/api/users", userRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/missing-persons", missingPersonRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("This is our main api");
});