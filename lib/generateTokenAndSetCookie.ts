import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = async (
  userId: string,
  response: any
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
