"use client";
import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ProductListProps {
  products: Product[];
  hideFilter?: boolean;
}

const priceRanges = [
  { label: "Tất cả", value: "all" },
  { label: "Dưới 100k", value: "under100" },
  { label: "100k - 500k", value: "100to500" },
  { label: "500k - 1 triệu", value: "500to1000" },
  { label: "Hơn 1 triệu", value: "over1000" },
];

const priceSorts = [
  { label: "Mặc định", value: "default" },
  { label: "Giá tăng dần", value: "asc" },
  { label: "Giá giảm dần", value: "desc" },
];

const securityOptions = [
  "Tất cả",
  "Trắng thông tin",
  "Mỗi số",
  "Mỗi mail(Giao)",
  "Khác(Đổi được số)"
];

const ProductList: React.FC<ProductListProps> = ({ products, hideFilter = false }) => {
  const [code, setCode] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [security, setSecurity] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const handleClearFilter = () => {
    setCode("");
    setPriceRange("all");
    setPriceSort("default");
    setSecurity("Tất cả");
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.status === 'available');
    if (code.trim()) {
      filtered = filtered.filter((p) => p.code.toLowerCase().includes(code.trim().toLowerCase()));
    }
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        if (priceRange === "under100") return p.price < 100000;
        if (priceRange === "100to500") return p.price >= 100000 && p.price <= 500000;
        if (priceRange === "500to1000") return p.price > 500000 && p.price <= 1000000;
        if (priceRange === "over1000") return p.price > 1000000;
        return true;
      });
    }
    if (security !== "Tất cả") {
      filtered = filtered.filter((p) => p.security_information === security);
    }
    if (priceSort === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, code, priceRange, priceSort, security]);

  // Pagination logic
  const totalPages = hideFilter ? 1 : Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = hideFilter
    ? filteredProducts
    : filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Filter Bar */}
      {!hideFilter && (
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Mã số</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded px-2 py-1 min-w-[120px]"
              placeholder="Nhập mã số..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng giá</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {priceRanges.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sắp xếp giá</label>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {priceSorts.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thông tin bảo mật</label>
            <select
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {securityOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={handleClearFilter}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
      {/* Product List */}
      {paginatedProducts.length === 0 ? (
        <div>Không có sản phẩm nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-40 mb-3">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-bold truncate">Mã số: {product.code}</h3>
              <p className="text-gray-600 text-sm truncate">
                Thông tin: <span className="font-semibold">{product.security_information}</span>
              </p>
              <p className="text-blue-600 font-bold mt-2">
                {product.price.toLocaleString()}đ
              </p>
              <Link href={`/product/${product._id}`} className="mt-3 block">
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {!hideFilter && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </>
  );
};

export default ProductList;
