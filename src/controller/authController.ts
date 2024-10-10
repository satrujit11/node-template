import { Request, Response } from "express";
import { SuccessResponseSchema } from "../types/apiResponse";
import { loginSchema, refreshAccessTokenSchema, registerSchema } from "../validations/userValidation";
import User from "../models/User";
import { CustomError } from "../utils/customError";
import { ErrorCodes } from "../constants/errorCodes";
import { comparePassword, hashPassword } from "../utils/bcryptUtil";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil";
import RefreshToken from "../models/RefreshToken";
import { UserRoles } from "../constants/enums/userEnum";


export const login = async (req: Request, res: Response) => {
  const userData = loginSchema.parse(req.body);
  const { email, password } = userData;

  let user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS, 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS, 401);
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  await RefreshToken.create({ token: refreshToken, userId: user.id });


  const response = SuccessResponseSchema.parse({
    message: "User logged in successfully",
    data: {
      ...user.toJSON(),
      accessToken,
      refreshToken,
    },
  });

  return res.status(201).json(response);
};


export const register = async (req: Request, res: Response) => {
  const userData = registerSchema.parse(req.body);
  const { email, password, role } = userData;

  let user = await User.findOne({ email });
  if (user) {
    throw new CustomError("User already exists", ErrorCodes.USER_EXISTS, 400);
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    email,
    password: hashedPassword,
    role: role || UserRoles.FOUNDER
  })

  await newUser.save()
  const response = SuccessResponseSchema.parse({
    message: "User registered successfully",
    data: newUser.toJSON()
  });

  return res.status(201).json(response);
};



export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken, userId } = refreshAccessTokenSchema.parse(req.body);

  const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenDoc) {
    throw new CustomError("Refresh token does not exist", ErrorCodes.INVALID_CREDENTIALS, 403);
  }

  if (userId && userId !== tokenDoc.userId.toString()) {
    throw new CustomError("User ID does not match the refresh token", ErrorCodes.INVALID_CREDENTIALS, 403);
  }
  const validUserId = userId || tokenDoc.userId.toString();

  const tokenUser = await User.findById(validUserId);
  if (!tokenUser) {
    throw new CustomError("User not found", ErrorCodes.INVALID_CREDENTIALS, 404);
  }

  const accessToken = generateAccessToken({ id: tokenUser.id, email: tokenUser.email });

  const response = SuccessResponseSchema.parse({
    message: "Access token refreshed successfully",
    data: {
      accessToken
    }
  })
  return res.status(200).json(response);
};
