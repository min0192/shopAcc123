import React from 'react';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-center text-gray-500">Your cart is empty</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <Link
              href="/shipping"
              className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 