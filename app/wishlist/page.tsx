"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
const USD_TO_INR = 85;


export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, []);

  // Fetch products in wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }
      const data = await Promise.all(
        wishlist.map(async (id) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`);
          const json = await res.json();
          return json.product;
        })
      );
      setProducts(data.filter(Boolean));
      setLoading(false);
    };
    fetchProducts();
  }, [wishlist]);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-medium">
        Loading your wishlist...
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Heart size={60} className="text-gray-400 mb-4" />
        <p className="text-lg text-gray-500">Your wishlist is empty</p>
        <Link
          href="/"
          className="mt-4 text-blue-600 font-medium hover:underline transition"
        >
          Browse Products
        </Link>
      </div>
    );

  return (
    <section className="mt-10 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
          Your Wishlist 
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="
                bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                rounded-2xl shadow-md hover:shadow-xl transition
                overflow-hidden group relative
              "
            >
              <Link href={`/product/${product._id}`}>
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 truncate">
                  {product.productName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.productDescription}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mb-4">
                  ₹{product.productPrice.toFixed(2) * USD_TO_INR} 
                </p>

                <div className="flex justify-between items-center">
                  <Link
                    href={`/product/${product._id}`}
                    className="
                      bg-black text-white px-4 py-2 rounded-lg 
                      hover:bg-gray-800 transition text-sm font-medium
                    "
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="
                      p-2 rounded-lg border border-gray-300 hover:bg-red-50
                      dark:border-gray-700 dark:hover:bg-red-900/30 transition
                    "
                  >
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
