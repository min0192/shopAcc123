"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { register } from "@/getApi/userApi";
import { useRouter } from "next/navigation";
import {useToast }from "@/hooks/use-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast({
        title: "Đăng ký thành công",
        description: "Bạn có thể đăng nhập ngay.",
      });
      router.push("/login");
    } catch (err: unknown) {
      let message = "Đăng ký thất bại";
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
        message = errorObj.response?.data?.message || errorObj.message || message;
      } else if (err instanceof Error) {
        message = err.message || message;
      }
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Create Account</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Bạn đã có Tài khoản?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}