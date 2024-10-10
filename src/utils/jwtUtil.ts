import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = "15m"; // Access token expiration
const REFRESH_TOKEN_EXPIRES_IN = "30d"; // Refresh token expiration

// Function to generate access token
export const generateAccessToken = (userData: { id: number; email: string }) => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Function to generate refresh token
export const generateRefreshToken = (userData: { id: number; email: string }) => {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};


