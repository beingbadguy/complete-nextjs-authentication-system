"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useState } from "react";

export default function ForgetPage() {
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userEmail) {
      return alert("Please enter your email");
    }
    try {
      const response = await axios.post("/api/forget", { email: userEmail });
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error?.response?.data);
      } else {
        console.error("An error occurred:", error);
      }
    }
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center flex-col gap-2 ">
      <p>Enter Your email</p>
      <Input
        type="email"
        placeholder="Email"
        className=" w-[90%] md:w-[50%]"
        value={userEmail}
        onChange={(e) => {
          setUserEmail(e.target.value);
        }}
      />
      <Button className="bg-green-400" onClick={handleSubmit}>
        Forget Password
      </Button>
    </div>
  );
}
