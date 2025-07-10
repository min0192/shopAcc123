import { notFound } from "next/navigation";
import ProductList from "@/components/product/ProductList";
import { Product } from "@/types/product";
import ImageGallery from "@/components/product/ImageGallery";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getProductById } from "@/getApi/productApi";

async function getSuggestedProducts(
  categoryId: string,
  currentProductId: string,
  currentPrice: number
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}`,
    { cache: "no-store" }
  );
  const products = await res.json();
  const minPrice = currentPrice * 0.8;
  const maxPrice = currentPrice * 1.2;
  return products
    .filter(
      (product: Product) =>
        product._id !== currentProductId &&
        product.price >= minPrice &&
        product.price <= maxPrice
    )
    .slice(0, 4);
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id: productId } = await params;
  const product = (await getProductById(productId)) as Product | null;
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: `View details for ${product.title}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id: productId } = await params;
  const product = (await getProductById(productId)) as Product | null;

  if (!product) {
    notFound();
  }

  const categoryId =
    typeof product.category === "object"
      ? product.category._id
      : product.category;
  const suggestedProducts = await getSuggestedProducts(
    categoryId,
    product._id,
    product.price
  );

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageGallery
            images={[product.image, ...(product.subImages || [])]}
            title={product.title}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">
            {product.price.toLocaleString()} VNĐ
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Mã số</h2>
              <p>{product.code}</p>
            </div>
            <div>
              <h2 className="font-semibold">Danh mục</h2>
              <p>
                {typeof product.category === "object" &&
                product.category !== null
                  ? (product.category as { name: string }).name
                  : product.category}
              </p>
            </div>
            <div>
              <h2 className="font-semibold">Thông tin bảo mật</h2>
              <p>{product.security_information}</p>
            </div>
            <Button className="w-full mt-6" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      {suggestedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductList products={suggestedProducts} hideFilter />
          </div>
        </div>
      )}
    </div>
  );
}
