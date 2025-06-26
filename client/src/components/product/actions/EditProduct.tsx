"use client"

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import Image from "next/image";
import { getAllCategories } from "@/getApi/categoryApi";
import { updateProduct } from "@/getApi/productApi";
import { uploadFile } from "@/getApi/uploadApi";
import { useToast } from "@/hooks/use-toast";

interface EditProductProps {
  product: Product;
  onEdit: (id: string, product: Partial<Product>) => Promise<void>;
}

export function EditProduct({ product, onEdit }: EditProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    code: product.code || '',
    account: product.account || '',
    password: product.password || '',
    title: product.title || '',
    security_information: product.security_information || '',
    price: product.price?.toString() || '0',
    level: product.level?.toString() || '0',
    rank: product.rank || '',
    image: product.image || '',
    category: product.category || '',
    status: product.status || 'available'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product.image || '');
  const [subImageUrls, setSubImageUrls] = useState<string[]>(product.subImages || []);
  const { toast } = useToast();

  const securityOptions = [
    "Trắng thông tin",
    "Mỗi số",
    "Mỗi mail(Giao)",
    "Khác(Đổi được số)"
  ];

  const rankOptions = [
    "đồng", "bạc", "vàng", "bạch kim", "kim cương", "tinh anh", "cao thủ", "chiến tướng", "chiến thần", "thách đấu"
  ];

  const statusOptions = [
    { value: 'available', label: 'Còn hàng' },
    { value: 'sold', label: 'Đã bán' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch categories",
        });
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadFile(file);
        urls.push(url);
      } catch (error) {
        console.error('Error uploading sub image:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload sub image",
        });
      }
    }
    setSubImageUrls(prev => [...prev, ...urls]);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image;

      if (selectedImage) {
        try {
          imageUrl = await uploadFile(selectedImage);
        } catch (error) {
          console.error('Error uploading main image:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload main image",
          });
          return;
        }
      }

      const categoryId = typeof formData.category === 'object' ? formData.category._id : formData.category;

      const productData: Product = {
        _id: product._id,
        code: formData.code,
        account: formData.account,
        password: formData.password,
        title: formData.title,  
        security_information: formData.security_information,
        price: Number(formData.price),
        level: Number(formData.level),
        category: categoryId,
        rank: formData.rank,
        image: imageUrl,
        subImages: subImageUrls,
        status: formData.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
      const updatedProduct = await updateProduct(productData);
      
      if (updatedProduct) {
        await onEdit(product._id, updatedProduct);
        setIsOpen(false);
        setSubImageUrls([]);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Sửa thông tin acc</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Mã số</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-account">Tài khoản</Label>
              <Input
                id="edit-account"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Mật khẩu</Label>
              <Input
                id="edit-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Chủ đề</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-security_information">Thông tin bảo mật</Label>
              <Select
                value={formData.security_information}
                onValueChange={(value: string) => setFormData({ ...formData, security_information: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thông tin bảo mật" />
                </SelectTrigger>
                <SelectContent>
                  {securityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select
                value={typeof formData.category === 'object' ? formData.category._id : formData.category}
                onValueChange={(value: string) => {
                  const selectedCategory = categories.find(cat => cat._id === value);
                  setFormData({ ...formData, category: selectedCategory || value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Giá</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) => setFormData({ ...formData, status: value as "available" | "sold" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-level">Cấp độ</Label>
              <Input
                id="edit-level"
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rank">Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(value: string) => setFormData({ ...formData, rank: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn rank" />
                </SelectTrigger>
                <SelectContent>
                  {rankOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Ảnh chính</Label>
              <div className="flex flex-col gap-2">
                {previewUrl && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sub-images">Ảnh phụ</Label>
              <Input
                id="edit-sub-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {subImageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={url}
                      alt={`Sub ${idx + 1}`}
                      width={60}
                      height={60}
                      className="object-contain rounded border"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                      onClick={() => setSubImageUrls(urls => urls.filter((_, i) => i !== idx))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Lưu thay đổi</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}