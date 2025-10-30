"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

export default function SignupForm() {
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account created! Redirecting...");
        setTimeout(() => router.push("/auth/login"), 1200);
      } else toast.error(data.message || "Signup failed");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border border-black rounded-xl p-4 shadow-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField id="email" label="Email" type="email" placeholder="you@example.com" icon={<Mail />} />
            <FormField id="password" label="Password" type="password" placeholder="••••••••" icon={<Lock />} />

            <div className="grid gap-1">
              <Label>Role</Label>
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

            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="font-semibold text-black hover:underline">
            Login
          </a>
        </CardFooter>
      </Card>

      <Toaster richColors position="top-center" />
    </div>
  );
}

function FormField({ id, label, type, placeholder, icon }: any) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>
        <Input id={id} name={id} type={type} placeholder={placeholder} required className="pl-10 border border-black h-10" />
      </div>
    </div>
  );
}
