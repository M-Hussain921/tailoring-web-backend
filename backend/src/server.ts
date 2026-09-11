import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/mongoClient.js";

const port = Number(process.env["PORT"]) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();