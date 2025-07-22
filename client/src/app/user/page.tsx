"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/getApi/userApi";
import {userJwtPayload} from "@/types/userJwtPayload";

type DepositHistoryItem = {
  time: string;
  amount: number;
  content: string;
  status: string;
};

type PurchasedProduct = {
  id: string;
  price: number;
  balance: number;
  time: string;
};

type RentedService = {
  name: string;
  time: string;
  status: string;
};

const depositHistory: DepositHistoryItem[] = [
  { time: "2024-06-01 10:00", amount: 100000, content: "Nạp qua Momo", status: "Thành công" },
];
const purchasedProducts: PurchasedProduct[] = [
  { id: "SP001", price: 200000, balance: 300000, time: "2024-06-02 12:00" },
];
const rentedServices: RentedService[] = [
  { name: "Dịch vụ A", time: "2024-06-03 15:00", status: "Đang thuê" },
];

const SIDEBAR_ITEMS = [
  { key: "info", label: "Thông tin tài khoản" },
  { key: "deposit", label: "Lịch sử nạp tiền" },
  { key: "products", label: "Sản phẩm đã mua" },
  { key: "services", label: "Dịch vụ đã thuê" },
];

// Hàm lấy cookie
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfilePage() {
  const [selected, setSelected] = useState("info");
  const [userInfo, setUserInfo] = useState<userJwtPayload | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Chỉ fetch userInfo khi vào tab info
  useEffect(() => {
    if (selected !== "info") return;
    const token = getCookie("infor");
    if (token) {
      setLoading(true); // Bắt đầu loading
      fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setUserInfo(data);
          } else {
            router.push("/login");
          }
        })
        .catch(() => router.push("/login"))
        .finally(() => setLoading(false)); // Kết thúc loading
    }
  }, [selected, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 font-bold text-xl">Tài khoản</div>
        <nav>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              className={`block w-full text-left px-6 py-3 hover:bg-blue-100 ${selected === item.key ? "bg-blue-50 font-semibold" : ""}`}
              onClick={() => setSelected(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {selected === "info" && (
          loading ? <div>Đang tải thông tin tài khoản...</div> : userInfo && <AccountInfo user={userInfo} />
        )}
        {selected === "deposit" && <DepositHistory data={depositHistory} />}
        {selected === "products" && <PurchasedProducts data={purchasedProducts} />}
        {selected === "services" && <RentedServices data={rentedServices} />}
      </main>
    </div>
  );
}

// Thông tin tài khoản + đổi mật khẩu
function AccountInfo({ user }: { user: userJwtPayload }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
      <div className="mb-2">Tên: <span className="font-semibold">{user.name}</span></div>
      <div className="mb-2">Số dư: <span className="font-semibold">{user.balance?.toLocaleString()} VNĐ</span></div>
      {user.email && <div className="mb-2">Email: <span className="font-semibold">{user.email}</span></div>}
      <ChangePasswordForm />
    </div>
  );
}

// Đổi mật khẩu (form mẫu)
function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // Thêm dòng này!
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await changePassword(oldPassword, newPassword);
      setMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message || "Đổi mật khẩu thất bại.");
      } else {
        setMessage("Đổi mật khẩu thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6 max-w-sm space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm">Mật khẩu cũ</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Đang đổi..." : "Đổi mật khẩu"}
      </button>
      {message && <div className="mt-2 text-sm text-red-500">{message}</div>}
    </form>
  );
}

function DepositHistory({ data }: { data: DepositHistoryItem[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lịch sử nạp tiền</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Thời gian</th>
            <th className="p-2 border">Số tiền</th>
            <th className="p-2 border">Nội dung</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{item.time}</td>
              <td className="p-2 border">{item.amount.toLocaleString()} VNĐ</td>
              <td className="p-2 border">{item.content}</td>
              <td className="p-2 border">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchasedProducts({ data }: { data: PurchasedProduct[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sản phẩm đã mua</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Mã số</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Số dư</th>
            <th className="p-2 border">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{item.id}</td>
              <td className="p-2 border">{item.price.toLocaleString()} VNĐ</td>
              <td className="p-2 border">{item.balance.toLocaleString()} VNĐ</td>
              <td className="p-2 border">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RentedServices({ data }: { data: RentedService[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dịch vụ đã thuê</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tên dịch vụ</th>
            <th className="p-2 border">Thời gian</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.time}</td>
              <td className="p-2 border">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}