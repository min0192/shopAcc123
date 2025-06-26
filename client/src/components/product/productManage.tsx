'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AddProduct } from './actions/AddProduct';
import { ViewProduct } from './actions/ViewProduct';
import { EditProduct } from './actions/EditProduct';
import { DeleteProduct } from './actions/DeleteProduct';
import { Product } from '@/types/product';
import { getAllProducts, updateProduct, deleteProduct, createProduct } from '@/getApi/productApi';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [codeFilter, setCodeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const filteredProducts = products.filter(product => 
    product.code.toLowerCase().includes(codeFilter.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleAddProduct = async (productData: Omit<Product, '_id' | 'status' | 'seller' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProduct({
        ...productData,
        status: 'available',
      } as Product);
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct({
        _id: id,
        ...productData
      } as Product);

      if (updatedProduct) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error editing product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý acc</h1>
        <AddProduct onAdd={handleAddProduct} />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm theo mã số..."
          value={codeFilter}
          onChange={(e) => setCodeFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Mã số</TableHead>
            <TableHead>Chủ đề</TableHead>    
            <TableHead>Danh mục</TableHead>
            <TableHead>Thông tin bảo mật</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                {typeof product.category === "object" && product.category !== null
                  ? (product.category as { name: string }).name
                  : product.category}
              </TableCell>
              <TableCell>{product.security_information}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ViewProduct product={product} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EditProduct
                      product={product}
                      onEdit={handleEditProduct}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <DeleteProduct
                      onDelete={() => handleDeleteProduct(product._id)}
                    />
                  </motion.div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page as number)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 