import ProductList from "@/components/product/ProductList";

export default async function NickGiaRePage() {
  const categoryId = '6832edbb15cb99b9141f05af';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}`, { cache: "no-store" });
  const products = await res.json();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nick Liên Quân Giá Rẻ</h1>
      <ProductList products={products} />
    </div>
  );
} 