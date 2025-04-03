import { NextRequest, NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import { passwordResetSuccessMail } from "@/services/sendMail";
databaseConnection();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    // Extract password from request body
    const { password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required", success: false },
        { status: 400 }
      );
    }

    // Proceed with password reset logic (e.g., validate token, update password)

    const user = await User.findOne({
      forgetToken: token,
    });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.forgetToken = null;
    user.forgetTokenExpiry = null;
    await user.save();

    await passwordResetSuccessMail(user.email);

    return NextResponse.json(
      { message: "Password reset successful", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        success: false,
      },
      { status: 500 }
    );
  }
}
