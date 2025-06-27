import ProductList from "@/components/product/ProductList";
import { getProductsByCategory } from "@/getApi/productApi";
import { Product } from "@/types/product";

export default async function FreeFirePage() {
  const categoryId = '6832edbb15cb99b9141f05ac';
  const products = (await getProductsByCategory(categoryId)) as Product[];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Free Fire</h1>
      <ProductList products={products} />
    </div>
  );
} 