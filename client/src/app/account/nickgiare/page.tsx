import ProductList from "@/components/product/ProductList";
import { getProductsByCategory } from "@/getApi/productApi";
import { Product } from "@/types/product";

export default async function NickGiaRePage() {
  const categoryId = '6832edbb15cb99b9141f05af';
  const products = (await getProductsByCategory(categoryId)) as Product[];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nick Liên Quân Giá Rẻ</h1>
      <ProductList products={products} />
    </div>
  );
} 