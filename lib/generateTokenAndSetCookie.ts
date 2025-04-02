import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const generateTokenAndSetCookie = async (
  userId: string,
  response: NextResponse
) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  response.cookies.set("nextToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
};
