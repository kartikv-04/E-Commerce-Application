import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


// Always fetch fresh data on every request
export const dynamic = "force-dynamic";

type Product = {
  _id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productCategory: string;
  productImage: string;
};

type InventoryData = {
  totalProducts: number;
  totalStock: number;
  totalWorth: number;
  products: Product[];
};

export default async function InventoryPage() {
  let data: InventoryData | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory`, {
      cache: "no-store", // ensures it's fetched freshly for every request (SSR)
    });
    if (!res.ok) throw new Error("Failed to fetch inventory");
    data = await res.json();
  } catch (err) {
    console.error(err);
  }

  if (!data) {
    return (
      <p className="p-8 text-center text-lg text-red-500">
        Failed to load inventory 😢
      </p>
    );
  }

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
            <p className="text-3xl font-bold text-blue-600">{data.totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{data.totalStock}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle>Total Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ₹{(data.totalWorth * 85).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {data.products.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No products found 🕵️‍♀️</p>
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
                  {data.products.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-medium">{p.productName}</TableCell>
                      <TableCell>{p.productCategory}</TableCell>
                      <TableCell className="text-right">
                        ₹{(p.productPrice * 85).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{p.productQuantity}</TableCell>
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
