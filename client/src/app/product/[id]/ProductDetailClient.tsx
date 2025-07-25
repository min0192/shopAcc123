"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoticeProduct from "@/components/ui/NoticeProduct";
import ImageGallery from "@/components/product/ImageGallery";
import ProductList from "@/components/product/ProductList";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";

export default function ProductDetailClient({ product, suggestedProducts }: { product: Product, suggestedProducts: Product[] }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<'insufficient' | 'confirm' | null>(null);


  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && user.balance < product.price) {
      setNoticeType('insufficient');
      setNoticeOpen(true);
    } else {
      setNoticeType('confirm');
      setNoticeOpen(true);
    }
  };

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
            <Button className="w-full mt-6" size="lg" onClick={handleBuyNow}>
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
          <ProductList products={suggestedProducts} hideFilter />
        </div>
      )}
      {/* NoticeProduct modal */}
      <NoticeProduct
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        title={noticeType === 'insufficient' ? 'Số dư không đủ' : 'Xác nhận mua hàng'}
        description={noticeType === 'insufficient'
          ? 'Số dư tài khoản của bạn không đủ để mua sản phẩm này.'
          : `Bạn có chắc chắn muốn mua sản phẩm "${product.title}" với giá ${product.price.toLocaleString()} VNĐ?`}
      >
        {noticeType === 'insufficient' ? (
          <div className="flex flex-col gap-3 mt-4">
            <a href="/nap-tien" className="bg-blue-600 text-white px-4 py-2 rounded text-center">Nạp tiền</a>
            <a href="https://zalo.me/0855809219" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded text-center">Liên hệ trả góp qua Zalo</a>
          </div>
        ) : (
          <div className="flex gap-4 mt-4 justify-center">
            <button onClick={() => { setNoticeOpen(false); }} className="bg-blue-600 text-white px-4 py-2 rounded">Có</button>
            <button onClick={() => setNoticeOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Không</button>
          </div>
        )}
      </NoticeProduct>
    </div>
  );
} 