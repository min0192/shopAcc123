import ProductList from "@/components/product/ProductList";

export default async function NickVipPage() {
  const categoryId = '6832edbb15cb99b9141f05ae';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}`, { cache: "no-store" });
  const products = await res.json();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nick liên quân VIP</h1>
      <ProductList products={products} />
    </div>
  );
} 