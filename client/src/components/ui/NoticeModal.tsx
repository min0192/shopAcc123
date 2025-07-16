import React from "react";

interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
}

const NoticeModal: React.FC<NoticeModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-slideDown relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Thông báo</h2>
        <div className="text-gray-700 space-y-2">
          <p>CHÀO MỪNG ANH EM ĐẾN VỚI SHOP ACC CỦA TUẤN MINH</p>
          <p>SHOP BÁN ACC UY TÍN - CHẤT LƯỢNG</p>
          <p>
            QUÝ KHÁCH HÀNG VUI LÒNG VÀO MỤC NẠP TIỀN TRƯỚC KHI THANH TOÁN BẰNG ATM/MOMO NHA
          </p>
          <a href="https://zalo.me/0855809219" target="_blank" className="text-blue-500 hover:text-blue-700">
            ZALO: 0855.809.219 (Hỗ Trợ Các Dịch Vụ Game)
          </a>

          <p>CẢM ƠN AE ĐÃ GHÉ ỦNG HỘ SHOP</p>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes slideDown {
          from { transform: translateY(-40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default NoticeModal;