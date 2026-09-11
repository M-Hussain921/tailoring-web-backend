import express from "express";
import helmet from "helmet";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminInviteRoutes from "./routes/adminInviteRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/service", servicesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", adminInviteRoutes);

app.use(errorHandler);

export default app;