"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { getAllUsers } from "@/getApi/userApi";
import { getAllProducts } from "@/getApi/productApi";

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
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users and products using existing API functions
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
            console.log("Auth error, redirecting to login"); // Debug log
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

    fetchData();
  }, [token, user, router]);

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
    <div className="container mx-auto p-6">
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

      <div className="mt-8">
        <Button onClick={() => router.push("/admin/product-manager")}>
          Manage Products
        </Button>
      </div>
      <div className="mt-8">
        <Button onClick={() => router.push("/admin/user-manager")}>
          Manage Users
        </Button>
      </div>
    </div>
  );
}
