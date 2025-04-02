import { NextRequest, NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import crypto from "crypto";
import { forgetPasswordMail } from "@/services/sendMail";
databaseConnection();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide an email",
        },
        { status: 404 }
      );
    }
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return NextResponse.json(
        {
          success: true,
          message: "Invalid credentials",
        },
        { status: 404 }
      );
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 60 * 60 * 24 * 1000;
    userExists.forgetToken = verificationToken;
    userExists.forgetTokenExpiry = verificationTokenExpiry;
    await userExists.save();
    await forgetPasswordMail(userExists.email, verificationToken);
    return NextResponse.json(
      {
        success: true,
        message: "Reset password link has been sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the request",
      },
      { status: 500 }
    );
  }
}
