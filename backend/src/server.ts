import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/mongoClient.js";

import authRoutes from "./routes/authRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminInviteRoute from "./routes/adminInviteRoutes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/service", servicesRoutes);
app.use("/api/gallery",galleryRoutes);
app.use("/api/review",reviewRoutes);
app.use("/api",adminInviteRoute);

let port = process.env["PORT"] || 3000;

const startServer = async () => {
   await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
};

startServer().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
