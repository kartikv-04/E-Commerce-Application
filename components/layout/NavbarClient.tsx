"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

type User = {
  email: string;
  role: string;
  avatar?: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const loadUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("authChange", loadUser);
    return () => window.removeEventListener("authChange", loadUser);
  }, []);

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, { method: "POST" });
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      setUser(null);
      window.dispatchEvent(new Event("authChange"));
      router.push("/auth/login");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // 👉 Logic for nav links
  const navLinks =
    user?.role === "Admin"
      ? [
          { href: "/", label: "Home" },
          { href: "/inventory", label: "Inventory" },
          { href: "/dashboard", label: "Dashboard" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/wishlist", label: "Wishlist" },
          { href: "/cart", label: "Cart" },
        ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-zinc-300 shadow-sm px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        TalantonCore
      </Link>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        <Menu className="h-6 w-6" />
      </button>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-row items-center gap-5">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-semibold text-sm text-zinc-700 hover:text-zinc-950 hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-white p-4 shadow-md border-b flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="font-semibold text-zinc-700 hover:text-zinc-950 hover:underline"
            >
              {label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 mt-3 border-t pt-3">
            {user ? (
              <Button
                onClick={logout}
                variant="ghost"
                className="text-red-500 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.avatar || ""} alt={user.email} />
                <AvatarFallback>
                  {user.email?.[0]?.toUpperCase() || (
                    <UserIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm text-zinc-700 font-medium truncate">
                  {user.email}
                </p>
                <p className="text-xs text-blue-600 font-medium capitalize pt-1">
                  Role: {user.role}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
