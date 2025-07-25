import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { getProductById } from "@/getApi/productApi";
import ProductDetailClient from "./ProductDetailClient";

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

  // Render client component
  return <ProductDetailClient product={product} suggestedProducts={suggestedProducts} />;
}
