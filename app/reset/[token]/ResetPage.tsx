"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPage({ token }: { token: string }) {
  console.log("Token received:", token); // ✅ Debugging

  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6 || password !== confirmPassword) {
      alert(
        "Password must be at least 6 characters long and match the confirmation."
      );
      return;
    }

    try {
      await axios.post(`/api/reset-password/${token}`, { password });
      alert("Password reset successful!");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        alert(error.response?.data?.message || "An error occurred.");
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-col min-h-[70vh]">
      <h1>Change Password</h1>

      <form
        onSubmit={changePassword}
        className="flex items-center justify-center flex-col gap-4"
      >
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
