"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function DashboardPage() {
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productImage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.productName ||
      !form.productDescription ||
      !form.productPrice ||
      !form.productQuantity ||
      !form.productCategory ||
      !form.productImage
    ) {
      toast.error("Please fill all fields 😅");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productPrice: parseFloat(form.productPrice),
          productQuantity: parseInt(form.productQuantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

      toast.success("🎉 Product added successfully!");
      setForm({
        productName: "",
        productDescription: "",
        productPrice: "",
        productQuantity: "",
        productCategory: "",
        productImage: "",
      });
    } catch (err: any) {
      toast.error(`Oops! ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 mt-6">
      <h1 className="text-3xl font-bold mb-8">🛠️ Add New Product</h1>

      <Card className="max-w-3xl mx-auto shadow-md border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <Label className="mb-3">Product Name</Label>
              <Input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="e.g. Leather Backpack"
              />
            </div>

            <div>
              <Label className="mb-3">Description</Label>
              <Textarea
                name="productDescription"
                value={form.productDescription}
                onChange={handleChange}
                placeholder="Short product description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-3">Price ($)</Label>
                <Input
                  type="number"
                  name="productPrice"
                  value={form.productPrice}
                  onChange={handleChange}
                  placeholder="e.g. 199.99"
                />
              </div>

              <div>
                <Label className="mb-3">Quantity</Label>
                <Input
                  type="number"
                  name="productQuantity"
                  value={form.productQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3">Category</Label>
              <Input
                name="productCategory"
                value={form.productCategory}
                onChange={handleChange}
                placeholder="e.g. men's clothing"
              />
            </div>

            <div>
              <Label className="mb-3">Image URL</Label>
              <Input
                name="productImage"
                value={form.productImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
