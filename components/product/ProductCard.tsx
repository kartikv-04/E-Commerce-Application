"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const USD_TO_INR = 85;
const FALLBACK_IMG = "/placeholder.png"; // place a placeholder in /public

export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const toggleWishlist = (id: string) => {
    let updated: string[] = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    try {
      if (user) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            productId: product._id,
            quantity: 1,
          }),
        });
        if (!res.ok) throw new Error("Failed to add to cart");
      } else {
        const existing = JSON.parse(localStorage.getItem("cart") || "[]");
        const index = existing.findIndex(
          (item: any) => item.productId._id === product._id
        );
        if (index >= 0) existing[index].quantity += 1;
        else existing.push({ productId: product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(existing));
      }

      toast.success(`Added to cart`);
      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong adding to cart!");
    }
  };

  const isWishlisted = wishlist.includes(product._id);

  return (
    <div
      onClick={() => router.push(`/product/${product._id}`)}
      className="flex flex-col border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition bg-white dark:bg-gray-900 cursor-pointer h-full"
    >
      <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={product.productImage || FALLBACK_IMG}
          alt={product.productName || "Product Image"}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col flex-grow mt-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {product.productName || "Unnamed Product"}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-3">
          {product.productDescription || "No description provided."}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-50">
            ₹
            {product.productPrice
              ? (product.productPrice * USD_TO_INR).toFixed(2)
              : "0.00"}
          </p>

          <div className="flex gap-3">
            <button
              className={`p-2 rounded-lg border transition ${
                isWishlisted
                  ? "bg-red-500 text-white border-red-500"
                  : "border-gray-800 text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
            >
              <Heart size={18} fill={isWishlisted ? "white" : "none"} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <ShoppingCart size={18} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
