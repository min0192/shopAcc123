"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { getAllUsers } from "@/getApi/userApi";
import { getAllProducts } from "@/getApi/productApi";
import AdminSidebar from "@/components/adminSidebar/AdminSidebar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  level: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("infor") as string | undefined;
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwt.decode(token) as { role?: string };
      if (decoded?.role === "admin") {
        setIsAdmin(true);
      } else {
        router.push("/");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersData, productsData] = await Promise.all([
          getAllUsers() as Promise<User[]>,
          getAllProducts() as Promise<Product[]>,
        ]);

        setUsers(usersData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err instanceof Error) {
          if (
            err.message === "Authentication required" ||
            err.message === "No authentication token found"
          ) {
            router.push("/login");
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null; // hoặc loading indicator
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Calculate stats
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalRevenue = products.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const averageProductPrice =
    totalProducts > 0 ? totalRevenue / totalProducts : 0;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Product Price
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${averageProductPrice.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>
    </div>
  );
}
