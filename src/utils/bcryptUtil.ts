import bcrypt from 'bcryptjs';

const saltRounds = 10; // The number of rounds to use for hashing

// Function to hash a password
export const hashPassword = async (plainTextPassword: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
  return hashedPassword;
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
};

