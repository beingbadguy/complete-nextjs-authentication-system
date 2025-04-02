"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  });

  return (
    <div className="p-4 flex md:items-center justify-between gap-2 flex-col md:flex-row">
      <div>
        <h1>Profile Page</h1>
        <p>
          Welcome, <span className="font-bold">{user?.name}</span>
        </p>
      </div>
      <Button className="cursor-pointer" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
