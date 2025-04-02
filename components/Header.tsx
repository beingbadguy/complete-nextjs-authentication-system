"use client";
import { useAuthStore } from "@/store/store";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect } from "react";

const Header = () => {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser(); // Fetch user when the component mounts
  }, [fetchUser]);

  return (
    <div className="p-4 border-b border-gray-400">
      <nav className="flex items-center justify-between">
        <ul className="flex items-center gap-5">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <div>
          {user ? (
            <div>
              <p className="border border-gray-300  rounded-full p-1 size-12 flex items-center justify-center cursor-pointer">
                <Link href={"/profile"}>
                  {" "}
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              </p>
            </div>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer">Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
