import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodeType {
  userId: string;
}

export async function fetchTokenDetails(request: NextRequest) {
  try {
    const token = request.cookies.get("nextToken")?.value || " ";
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodeType;
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
  }
}
