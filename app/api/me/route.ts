import { databaseConnection } from "@/config/databseConnection";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  databaseConnection();
  try {
    const decodedToken = await fetchTokenDetails(request);
    if (!decodedToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch me",
      },
      { status: 500 }
    );
  }
}
