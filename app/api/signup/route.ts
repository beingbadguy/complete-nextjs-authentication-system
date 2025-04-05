import User from "@/models/user.model";
import { databaseConnection } from "@/config/databseConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "@/lib/generateTokenAndSetCookie";
import { sendEmailVerificationMail } from "@/services/sendMail";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  databaseConnection();
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
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
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
    });
    await newUser.save();
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: newUser,
      },
      {
        status: 200,
      }
    );
     sendEmailVerificationMail(newUser.email, verificationToken);
    generateTokenAndSetCookie(
      newUser._id,
      newUser.isVerified,
      newUser.role,
      response
    );
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 401 }
    );
  }
}
