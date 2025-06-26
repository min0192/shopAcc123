"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { createPayOSDeposit } from '@/getApi/depositApi';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [transferContent, setTransferContent] = useState('');
  const [qrImage, setQrImage] = useState('');
  const { toast } = useToast();

  const handleGenerateQR = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ.",
      });
      return;
    }

    try {
      const response = await createPayOSDeposit(Number(amount)) as { transferContent: string };
      const content = response.transferContent;
      setTransferContent(content);

      const qrUrl = `https://img.vietqr.io/image/970422-0855809219-compact2.png?amount=${amount}&addInfo=${content}`;
      setQrImage(qrUrl);

      toast({
        title: "Thành công",
        description: "Đã tạo mã QR, vui lòng chuyển khoản đúng nội dung.",
      });
    } catch (error: unknown) {
      let message = "Không thể tạo đơn nạp tiền. Vui lòng thử lại.";
      if (error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string") {
        message = (error as { message: string }).message;
      }
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: message,
      });
    }
  };
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Nạp tiền - Ngân hàng tự động</h2>

      <Label htmlFor="amount">Số tiền (VNĐ)</Label>
      <Input id="amount" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
      <Button onClick={handleGenerateQR}>Tạo mã QR</Button>

      {transferContent && (
        <div className="space-y-2">
          <p><strong>Nội dung chuyển khoản:</strong></p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 p-2 rounded font-mono">{transferContent}</code>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(transferContent)}>
              <Copy size={16} />
            </Button>
          </div>
        </div>
      )}

      {qrImage && (
        <div className="flex justify-center mt-4">
          <Image src={qrImage} alt="QR Code" className="w-64 h-64" />
        </div>
      )}

      <div className="bg-yellow-50 p-4 text-yellow-800 rounded">
        <ul className="list-disc list-inside space-y-1">
          <li>Chuyển khoản đúng nội dung để được cộng tiền tự động</li>
          <li>Tiền sẽ cộng sau khi hệ thống xác nhận giao dịch</li>
        </ul>
      </div>
    </div>
  );
}
