import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });

  const data = await res.json();
  const products = data.products || [];

  return (
    <main className="px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
      <h1 className="text-3xl font-bold mb-8 mt-10 text-center">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product : any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </main>
  );
}
