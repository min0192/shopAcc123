"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import Image from "next/image";
import { getAllCategories } from "@/getApi/categoryApi";
import { uploadFile } from "@/getApi/uploadApi";
import { useToast } from "@/hooks/use-toast";

interface AddProductProps {
  onAdd: (product: Omit<Product, '_id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function AddProduct({ onAdd }: AddProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    account: '',
    password: '',
    title: '',
    security_information: '',
    price: '',
    level: '',
    rank: '',
    image: '',
    category: '' as string | Category
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [subImageUrls, setSubImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const securityOptions = [
    "Trắng thông tin",
    "Mỗi số",
    "Mỗi mail(Giao)",
    "Khác(Đổi được số)"
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
      let imageUrl = '';

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

      const productData: Omit<Product, '_id' | 'status' | 'createdAt' | 'updatedAt'> = {
        code: formData.code,
        title: formData.title,
        account: formData.account,
        password: formData.password,
        security_information: formData.security_information,
        price: Number(formData.price),
        level: Number(formData.level),
        category: formData.category,
        rank: formData.rank || undefined,
        image: imageUrl,
        subImages: subImageUrls
      };

      await onAdd(productData);
      setIsOpen(false);
      setFormData({
        code: '',
        account: '',
        password: '',
        title: '',
        security_information: '',
        price: '',
        level: '',
        rank: '',
        image: '',
        category: ''
      });
      setSelectedImage(null);
      setPreviewUrl('');
      setSubImageUrls([]);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm ACC
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Thêm acc mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Mã số</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account">Tài khoản</Label>
              <Input
                id="account"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="security_information">Thông tin bảo mật</Label>
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
              <Label htmlFor="category">Danh mục</Label>
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
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="image">Ảnh chính</Label>
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
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub-images">Ảnh phụ</Label>
              <Input
                id="sub-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
              />
              <div className="flex gap-2 mt-2">
                {subImageUrls.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    alt={`Sub ${idx + 1}`}
                    width={60}
                    height={60}
                    className="object-contain rounded border"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Add Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 