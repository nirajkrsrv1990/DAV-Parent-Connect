import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured in .env");
}

export interface AuthPayload {
  id: string;
  role: "admin" | "teacher" | "parent";
}

export const generateToken = (
  payload: AuthPayload,
  rememberMe: boolean
) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "1d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};