import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#002766] text-white py-6 text-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Shop Info */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <div className="mb-2">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={120} 
                height={40}
                className="w-[100px] h-auto"
              />
            </div>
            <h2 className="text-base md:text-lg font-bold mb-2">Shop Nick Game Liên Quân Giá Rẻ</h2>
            <p className="mb-1">Thời gian hỗ trợ:</p>
            <p className="leading-tight">Sáng: 8h00 - 11h30</p>
            <p className="leading-tight">Chiều: 13h00 - 19h00</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-2">Liên hệ</h3>
            <div className="space-y-1">
              <p>Zalo: 0855809219</p>
              <p>Email: minh11992200@gmail.com</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-2">Liên kết nhanh</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:text-blue-300">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/accounts" className="hover:text-blue-300">
                  Shop Acc
                </Link>
              </li>
              <li>
                <Link href="/topup" className="hover:text-blue-300">
                  Nạp tiền
                </Link>
              </li>
              <li>
                <Link href="/accounts/price" className="hover:text-blue-300">
                  Acc theo giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 or Socials (example) */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-2">Kết nối</h3>
            <ul className="space-y-1">
              <li>
                <a href="https://zalo.me/0855809219" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Zalo Chat</a>
              </li>
              <li>
                <a href="mailto:minh11992200@gmail.com" className="hover:text-blue-300">Gửi Email</a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=Hà+Nội" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Bản đồ</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-3 border-t border-gray-700 text-center text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} ShopAcc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 