import { Application } from "express";
import connectDB from "./config/db";

const startServer = async (app: Application, port: number, nodeEnv: String) => {
  try {
    console.log("Attempting to connect to the database...");
    await connectDB(); // Connects to MongoDB
    console.log("Successfully connected to the database");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port} in ${nodeEnv} mode`);
    });
  } catch (e) {
    console.error("Error starting with server: ", e)
    process.exit(1)
  }
}

export default startServer


