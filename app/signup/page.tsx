"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", data);
      console.log(response.data);
      setUser(response.data.data);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };
  return (
    <div className="flex items-center justify-center gap-4 min-h-[70vh] flex-col bg-white text-black">
      <h1 className="text-3xl font-bold">Signup Page</h1>
      <p>Fill the form to register</p>

      <form
        className=" flex items-center justify-center gap-2 flex-col"
        onSubmit={signupHandler}
      >
        <Input
          type="text"
          placeholder="Full name"
          name="name"
          value={data.name}
          onChange={changeHandler}
        />
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
          Sign Up
        </Button>
        <Link href="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}
