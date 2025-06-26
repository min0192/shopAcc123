"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlusIcon, UserIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { userJwtPayload } from "@/types/userJwtPayload";
import { deleteCookie } from "cookies-next/client";
import { getCookie } from "cookies-next/client";
import jwt from "jsonwebtoken";


const Header = () => {
  const [userData, setUserData] = useState<userJwtPayload | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getCookie("infor") as string;
      const decoded = jwt.decode(token) as userJwtPayload;
      setUserData(decoded);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("infor");
    window.location.href = "/";
  };

  const isAuthenticated = !!userData;

  return (
    <header className="bg-[#19171b] text-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Top row with logo and main nav */}
        <div className="flex items-center justify-between h-14">
          {/* Logo Section */}
          <div className="flex items-center">
            <Image 
              src="/images/logo.png"
              alt="shoptmin"
              width={120}
              height={16}
              className="mt-1.5"
            />
            <h2 className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors">ShopTmin.com</h2>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/nap-tien" 
              className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors"
            >
              NẠP TIỀN
            </Link>
            <Link 
              href="/lich-su-nap" 
              className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors"
            >
              LỊCH SỬ NẠP
            </Link>
            <Link 
              href="/tin-tuc" 
              className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors"
            >
              TIN TỨC
            </Link>
            <Link 
              href="/cay-rank" 
              className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors"
            >
              CÀY RANK
            </Link>
            <Link 
              href="/mua-the" 
              className="text-[#fafafa] no-underline font-medium hover:text-blue-400 transition-colors"
            >
              MUA THẺ
            </Link>
          </nav>
        </div>

        {/* Bottom row with auth buttons */}
        <div className="flex items-center justify-end gap-4 h-10 border-t border-gray-700">
          <div className="text-yellow-400 font-medium flex items-center gap-1">
            <BanknotesIcon className="w-5 h-5" />
            Số dư: {userData?.balance ? userData?.balance.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          {isAuthenticated ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 text-[#499bd2] bg-white rounded px-4 py-1.5 font-bold hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                {userData?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
              >
                <UserPlusIcon className="w-5 h-5" />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="flex items-center gap-2 text-[#499bd2] bg-white rounded px-4 py-1.5 font-bold hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
              >
                <UserPlusIcon className="w-5 h-5" />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
