import { Application } from "express";
import connectDB from "./config/db";

const startServer = async (app: Application, port: number, nodeEnv: String) => {
  console.log("Attempting to connect to the database...");
  await connectDB(); // Connects to MongoDB
  console.log("Successfully connected to the database");

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port} in ${nodeEnv} mode`);
  });
};

export default startServer


