"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  InputHTMLAttributes,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", data);
      console.log(response.data);
      router.push("/profile"); // Redirect to home page after successful login
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="flex items-center justify-center gap-4 min-h-screen flex-col bg-white text-black">
      <h1 className="text-3xl font-bold">Log In Page</h1>
      <p>Fill the form to Log In</p>

      <form
        className=" flex items-center justify-center gap-2 flex-col"
        onSubmit={loginHandler}
      >
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={data.email}
          onChange={changeHandler}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={data.password}
          onChange={changeHandler}
        />
        <Button type="submit" className="bg-black text-white w-full">
          Log In
        </Button>
        <Link href="/signup">Don't have an account? Signup</Link>
      </form>
    </div>
  );
}
