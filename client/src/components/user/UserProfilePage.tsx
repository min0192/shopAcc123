"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUserDeposits, changePassword } from "@/getApi/userApi";
import { userJwtPayload } from "@/types/userJwtPayload";
import { DepositHistoryItem } from "@/types/deposit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SIDEBAR_ITEMS = [
  { key: "info", label: "Thông tin tài khoản" },
  { key: "deposit", label: "Lịch sử nạp tiền" },
];

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [selected, setSelected] = useState("info");
  const [userInfo, setUserInfo] = useState<userJwtPayload | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [depositData, setDepositData] = useState<DepositHistoryItem[]>([]);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Thêm state sidebarOpen

  const router = useRouter();
  useEffect(() => {
    if (tab && SIDEBAR_ITEMS.find(item => item.key === tab)) {
      setSelected(tab);
    }
  }, [tab]);

  useEffect(() => {
    const token = getCookie("infor");
    if (!token) return router.push("/login");

    setLoadingUser(true);
    fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : router.push("/login")))
      .then((data) => data && setUserInfo(data))
      .finally(() => setLoadingUser(false));
  }, [router]);

  useEffect(() => {
    console.log("selected:", selected, "userInfo:", userInfo);
    if (selected === "deposit" && userInfo?._id) {
      const fetchDeposits = async () => {
        setLoadingDeposit(true);
        try {
          const response = await getUserDeposits(userInfo?._id);
          console.log("Deposit data:", response);
          setDepositData(response);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu nạp tiền:", error);
        } finally {
          setLoadingDeposit(false);
        }
      };
      fetchDeposits();
    }
  }, [selected, userInfo]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Nút mở sidebar cho mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-blue-600 text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-40
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:block
        `}
      >
        <div className="p-6 font-bold text-xl flex justify-between items-center">
          Tài khoản
          {/* Nút đóng sidebar trên mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng menu"
          >
            ×
          </button>
        </div>
        <nav>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`block w-full text-left px-6 py-3 hover:bg-blue-100 ${
                selected === item.key ? "bg-blue-50 font-semibold" : ""
              }`}
              onClick={() => {
                setSelected(item.key);
                setSidebarOpen(false); // Đóng sidebar khi chọn menu trên mobile
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay khi sidebar mở trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 p-8 md:ml-64">
        {selected === "info" &&
          (loadingUser ? (
            <div className="text-gray-500">Đang tải thông tin tài khoản...</div>
          ) : (
            userInfo && <AccountInfo user={userInfo} />
          ))}

        {selected === "deposit" &&
          (loadingDeposit ? (
            <div className="text-gray-500">Đang tải lịch sử nạp tiền...</div>
          ) : (
            <DepositHistory data={depositData} />
          ))}
      </main>
    </div>
  );
}

function AccountInfo({ user }: { user: userJwtPayload }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
      <div className="mb-2">
        Tên: <span className="font-semibold">{user.name}</span>
      </div>
      <div className="mb-2">
        Số dư: {" "}
        <span className="font-semibold">
          {user.balance?.toLocaleString()} VNĐ
        </span>
      </div>
      {user.email && (
        <div className="mb-2">
          Email: <span className="font-semibold">{user.email}</span>
        </div>
      )}
      <ChangePasswordForm />
    </div>
  );
}

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (oldPassword.length < 6 || newPassword.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm">Mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Đang đổi..." : "Đổi mật khẩu"}
      </button>
      {message && <div className="mt-2 text-sm text-red-500">{message}</div>}
    </form>
  );
}

function DepositHistory({ data }: { data: DepositHistoryItem[] }) {
  const mapStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "completed":
        return "Thành công";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lịch sử nạp tiền</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Thời gian</th>
              <th className="p-3 border">Số tiền</th>
              <th className="p-3 border">Nội dung</th>
              <th className="p-3 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="p-3 border text-blue-700 font-semibold">
                  {item.amount.toLocaleString()} VNĐ
                </td>
                <td className="p-3 border">{item.transferContent}</td>
                <td className="p-3 border">{mapStatus(item.status)}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Chưa có lịch sử nạp tiền.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 