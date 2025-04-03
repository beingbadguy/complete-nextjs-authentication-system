import bcrypt from "bcrypt";
import User from "@/models/user.model";
import { databaseConnection } from "@/config/databseConnection";
import { NextRequest, NextResponse } from "next/server";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";
import { sendEmailVerificationMail } from "@/services/sendMail";
import crypto from "crypto";
databaseConnection();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide email and password",
        },
        { status: 404 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 404 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }
    if (!user.isVerified) {
      const verificationToken = crypto.randomInt(100000, 999999).toString();
      user.verificationToken = verificationToken;
      user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();

      await sendEmailVerificationMail(user.email, verificationToken);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });

    user.passsword = undefined;
    generateTokenAndSetCookie(user._id, user.isVerified, response);
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to log in user",
      },
      { status: 404 }
    );
  }
}
