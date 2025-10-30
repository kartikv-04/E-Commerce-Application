"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
const USD_TO_INR = 85;

type Product = {
  _id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productCategory: string;
  productImage: string;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.productQuantity || 0), 0);
  const totalWorth =
    products.reduce(
      (sum, p) => sum + (p.productPrice || 0) * (p.productQuantity || 0),
      0
    ) * USD_TO_INR;

  if (loading) return <p className="p-8 text-center text-lg">Loading inventory...</p>;

  return (
    <div className="px-6 md:px-12 py-12 mt-6">
      <h1 className="text-3xl font-bold mb-8">📦 Inventory Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle>Total Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalWorth.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{totalStock}</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No products in inventory 🕵️‍♀️</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-medium">{p.productName}</TableCell>
                      <TableCell>{p.productCategory}</TableCell>
                      <TableCell className="text-right">
                        ₹{(p.productPrice * USD_TO_INR).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.productQuantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
