"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/auth/Loginfrom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

  

      // 1. Check if the response is NOT OK (401, 500, etc.)
      if (!res.ok) {
        // Try to parse the error message, but have a fallback
        let errorMessage = "Invalid credentials";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // This catches the "Unexpected end of JSON input" error
          // and uses the fallback message.
          console.warn("Could not parse error response JSON.");
        }
        throw new Error(errorMessage);
      }

      // 2. If the response IS OK (200)
      // Now it's safe to parse the success JSON
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar || null,
        }));
        toast.success("Login successful! Redirecting...");
        window.dispatchEvent(new Event("authChange")); // Good for updating other components
        setTimeout(() => router.push("/"), 1000);
      } else {
        // This handles cases where res.ok is true, but your API
        // sends back { success: false, message: "..." }
        throw new Error(data.message || "Login failed");
      }

    } catch (err: any) { // 'err' will now be the Error we threw
      console.error("Login failed:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <LoginForm onLogin={handleLogin} loading={loading} />
    </div>
  );
}