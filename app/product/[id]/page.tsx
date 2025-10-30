"use client";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setProduct(data.product);
    };
    fetchProduct();
  }, [id]);

  // Load wishlist
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((item) => item !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const isWishlisted = wishlist.includes(product?._id);

  if (!product)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-medium">
        Loading product details...
      </div>
    );

  return (
    <section className="mt-10">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div
          className="
            grid md:grid-cols-2 gap-10 items-center
            bg-white dark:bg-gray-900 rounded-3xl
            shadow-lg hover:shadow-xl transition-shadow
            p-6 md:p-10
          "
        >
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.productImage}
              alt={product.productName}
              className="
                rounded-2xl shadow-md 
                w-full max-w-[480px] h-[400px] object-cover
                hover:scale-[1.02] transition-transform duration-300
              "
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {product.productName}
                </h1>
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`p-2 rounded-lg border ${
                    isWishlisted
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
                  } transition`}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? "white" : "none"}
                    strokeWidth={2}
                  />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {product.productDescription}
              </p>

              <p className="text-2xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
                ${product.productPrice.toFixed(2)}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              className="
                w-full md:w-auto
                bg-black text-white px-8 py-3 rounded-xl
                hover:bg-gray-800 active:scale-95 transition
                font-medium shadow-sm
              "
              onClick={() =>
                console.log(`Added ${quantity} x ${product.productName} to cart`)
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
