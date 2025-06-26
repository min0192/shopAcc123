import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Product } from "@/types/product";

interface ViewProductProps {
  product: Product;
}

export function ViewProduct({ product }: ViewProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>(product.image);

  // Reset mainImage về ảnh chính khi mở modal
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setMainImage(product.image);
    }
  };

  // Danh sách ảnh: ảnh chính + các ảnh phụ (nếu có)
  const allImages = [product.image, ...(product.subImages || [])];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết acc</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {mainImage && (
            <div className="col-span-2">
              <Image
                src={mainImage}
                alt={product.title}
                width={800}
                height={400}
                className="w-full max-h-72 object-contain bg-gray-100 rounded-lg border mb-2"
              />
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
                  {allImages.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      width={80}
                      height={80}
                      className={`object-contain rounded border cursor-pointer ${mainImage === img ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <h3 className="font-semibold">Mã số</h3>
            <p>{product.code}</p>
          </div>
          <div>
            <h3 className="font-semibold">Chủ đề</h3>
            <p>{product.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Tài khoản</h3>
            <p>{product.account}</p>
          </div>
          <div>
            <h3 className="font-semibold">Mật khẩu</h3>
            <p>{product.password}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Giá</h3>
            <p>{product.price} VNĐ</p>
          </div>
          <div>
            <h3 className="font-semibold">Danh mục</h3>
            <p>{typeof product.category === "object" && product.category !== null
                  ? (product.category as { name: string }).name
                  : product.category}</p>
          </div>
          <div>
            <h3 className="font-semibold">Trạng thái</h3>
            <p>{product.status}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold">Thông tin bảo mật</h3>
            <p>{product.security_information}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
