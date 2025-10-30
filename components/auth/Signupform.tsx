"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import logger from "@/lib/logger";

export default function SignupForm() {
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login"); // 👈 Redirect to login after signup
        }, 1500);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      console.error("Error signing up user:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[410px] border border-black shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-center text-zinc-900">
            Sign up
          </CardTitle>
          <CardDescription className="text-center text-zinc-600">
            Create your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-zinc-800">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 border border-black h-10 text-[15px]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold text-zinc-800">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 border border-black h-10 text-[15px]"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="grid gap-2">
              <Label htmlFor="role" className="font-semibold text-zinc-800">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border border-black h-10 text-[15px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 text-base font-semibold rounded-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-600">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-black underline-offset-4 hover:underline"
            >
              Login
            </a>
          </p>
        </CardFooter>
      </Card>

      {/* Toasts */}
      <Toaster richColors position="top-center" />
    </div>
  );
}
