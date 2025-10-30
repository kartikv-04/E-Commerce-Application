"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

export default function LoginForm({
  onLogin,
  loading,
}: {
  onLogin: (email: string, password: string, role: string) => void;
  loading: boolean;
}) {
  const [role, setRole] = useState("User");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    onLogin(email, password, role);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 py-8">
      <Card className="w-full max-w-sm sm:max-w-md border border-black rounded-xl shadow-sm p-2">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-zinc-900">Login</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <InputField id="email" label="Email" icon={<Mail />} type="email" />
            <InputField id="password" label="Password" icon={<Lock />} type="password" />

            <div className="grid gap-2">
              <Label className="font-semibold text-zinc-800">Role</Label>
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

            <Button
              type="submit"
              className="w-full h-10 font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-zinc-600 text-center">
          Not registered?{" "}
          <a href="/auth/signup" className="ml-1 font-semibold text-black hover:underline">
            Sign up
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

function InputField({
  id,
  label,
  icon,
  type,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="font-semibold text-zinc-800">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={type === "email" ? "you@example.com" : "••••••••"}
          required
          className="pl-10 border border-black h-10 text-[15px]"
        />
      </div>
    </div>
  );
}
