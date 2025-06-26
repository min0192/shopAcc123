import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#002766] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shop Info */}
          <div>
            <div className="mb-4">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={200} 
                height={80}
                className="w-[200px] h-auto"
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Shop Nick Game Liên Quân Giá Rẻ</h2>
            <p className="mb-2">Thời gian hỗ trợ:</p>
            <p>Sáng: 8h00 - 11h30</p>
            <p>Chiều: 13h00 - 19h00</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <div className="space-y-2">
              <p>Zalo: 0855809219</p>
              <p>Email: minh11992200@gmail.com</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
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
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} ShopAcc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 