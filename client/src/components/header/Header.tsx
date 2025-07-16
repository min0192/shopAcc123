"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlusIcon, UserIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { userJwtPayload } from "@/types/userJwtPayload";
import { deleteCookie, getCookie } from "cookies-next/client";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";

// Placeholder Menu icon (simple SVG)
const Menu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
    <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
    <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
  </svg>
);

const navLinks = [
  { href: "/nap-tien", label: "NẠP TIỀN" },
  { href: "/tin-tuc", label: "TIN TỨC" },
  { href: "/cay-rank", label: "CÀY RANK" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <header className="w-full min-h-[64px] shadow-md sticky top-0 z-50 bg-white border-b border-[#eee]">
      <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="ShopTmin Logo"
            width={46}
            height={46}
            className="rounded-full bg-[#bcab96]"
          />
          <span className="font-bold text-[22px] text-[#090c12] hidden sm:block">ShopTmin.com</span>
        </Link>
        <nav className="hidden md:flex gap-2 xl:gap-4 mx-2 flex-1 justify-center">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-[#5e383e] font-medium hover:bg-[#bcab96]/10 transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-yellow-400 font-medium flex items-center gap-1 hidden sm:flex">
            <BanknotesIcon className="w-5 h-5" />
            Số dư: {userData?.balance ? userData?.balance.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="h-8 w-8 flex items-center justify-center rounded-full border border-[#eee]"
              >
                <UserIcon className="h-7 w-7 rounded-full text-[#499bd2]" />
              </Link>
              <Button
                variant="outline"
                className="px-4 py-2 border-[#47afc3] text-[#47afc3] font-semibold hover:bg-[#47afc3]/10 rounded-lg hidden sm:block"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-[#499bd2] bg-white rounded px-4 py-1.5 font-bold hover:bg-gray-100 transition-colors hidden sm:block"
              >
                <UserIcon className="w-5 h-5" />
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors hidden sm:block"
              >
                <UserPlusIcon className="w-5 h-5" />
                Đăng ký
              </Link>
            </>
          )}
          <button className="md:hidden ml-2" onClick={() => setMobileOpen(v => !v)}>
            <Menu className="h-7 w-7 text-[#47afc3]" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow flex flex-col items-start p-4 z-40 gap-2 border-b">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="w-full px-3 py-2 rounded-md text-[#5e383e] font-medium hover:bg-[#bcab96]/10 transition-colors text-base"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="text-yellow-400 font-medium flex items-center gap-1 my-2">
            <BanknotesIcon className="w-5 h-5" />
            Số dư: {userData?.balance ? userData?.balance.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-[#499bd2] bg-white rounded px-4 py-1.5 font-bold hover:bg-gray-100 transition-colors w-full"
                onClick={() => setMobileOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                {userData?.name}
              </Link>
              <Button
                variant="outline"
                className="w-full my-1 border-[#47afc3] text-[#47afc3] font-semibold hover:bg-[#47afc3]/10 rounded-lg"
                onClick={() => { handleLogout(); setMobileOpen(false); }}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-[#499bd2] bg-white rounded px-4 py-1.5 font-bold hover:bg-gray-100 transition-colors w-full"
                onClick={() => setMobileOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors w-full"
                onClick={() => setMobileOpen(false)}
              >
                <UserPlusIcon className="w-5 h-5" />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
