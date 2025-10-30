"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
const USD_TO_INR = 85;


type Product = {
  _id: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
};

type CartItem = {
  productId: Product;
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart either from DB (if user logged in) or localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const fetchCart = async () => {
      try {
        if (user) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart?userId=${user.id}`, {
            cache: "no-store",
          });
          if (!res.ok) throw new Error("Failed to fetch cart");
          const data = await res.json();
          setCartItems(data.items || []);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartItems(localCart);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Remove item
  // Remove item
  const removeItem = async (id: string) => {
  const updated = cartItems.filter((item) => item.productId._id !== id);
  setCartItems(updated);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    localStorage.setItem("cart", JSON.stringify(updated));
  } else {
    try {
      // ✅ Use relative URL
      const res = await fetch(`/api/cart?userId=${user.id}&productId=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("❌ Delete failed:", data);
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  }

  toast.success("Removed from cart");
};



  // Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + item.productId.productPrice * item.quantity,
    0
  );

  if (loading) return <p className="p-6 text-center">Loading your cart...</p>;

  if (!cartItems.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛍️</h2>
        <p className="text-gray-500 mb-6">Go add something cute to it!</p>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );

  return (
    <div className="px-4 md:px-10 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Cart 🛒</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map(({ productId, quantity }) => (
          <div
            key={productId._id}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center border border-gray-300 rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition"
          >
            <Image
              src={productId.productImage}
              alt={productId.productName}
              width={160}
              height={160}
              className="rounded-xl object-cover w-full sm:w-40 h-40"
            />

            <div className="flex flex-col flex-1 sm:ml-6 mt-3 sm:mt-0">
              <h2 className="text-xl font-semibold">{productId.productName}</h2>
              <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                {productId.productDescription}
              </p>

              <div className="flex flex-wrap justify-between items-center mt-3">
                <p className="text-lg font-bold">
                  ₹{(productId.productPrice * USD_TO_INR).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: <span className="font-medium">{quantity}</span>
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => removeItem(productId._id)}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center border-t pt-6">
        <p className="text-xl font-semibold">
          Total:{" "}
          <span className="text-green-600">₹{(total * USD_TO_INR).toFixed(2)}</span>
        </p>
        <Button className="mt-4 sm:mt-0 w-full sm:w-auto">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
