import { Request, Response } from 'express';
import { PendingDeposit } from '../models/PendingDeposit';
import User  from '../models/UserModel';
import { createPayOSOrder } from '../utils/payosClient';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const verifyChecksum = (data: any, checksumKey: string): boolean => {
  const { checksum, ...rest } = data;
  const sorted = Object.entries(rest).sort((a, b) => a[0].localeCompare(b[0]));
  const rawData = sorted.map(([k, v]) => `${k}=${v}`).join('&');
  const hash = crypto.createHmac('sha256', checksumKey).update(rawData).digest('hex');
  return hash === checksum;
};

export const createPendingDeposit = async (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const idSuffix = req.user.id.slice(-4);
    const random = Math.floor(100000 + Math.random() * 900000);
    const transferContent = `dtm${idSuffix}${random}`;

    const exists = await PendingDeposit.findOne({ transferContent });
    if (exists) return res.status(409).json({ message: 'Duplicate content' });

    const pending = await PendingDeposit.create({
      userId: req.user.id,
      amount,
      transferContent,
      status: 'pending',
    });

    const payosOrder = await createPayOSOrder({ amount, description: transferContent });

    res.status(201).json({ ...pending.toObject(), checkoutUrl: payosOrder.checkoutUrl });
  } catch (e) {
  console.error("❌ Error in createPendingDeposit:", e);
  res.status(500).json({ message: 'Server error' });
}

};

export const handleWebhook = async (req: Request, res: Response) => {
  const body = req.body;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY!;

  // Nếu checksum không hợp lệ → trả về và DỪNG HẲN luồng xử lý
  if (!verifyChecksum(body, checksumKey)) {
    console.warn("Webhook checksum failed:", body);
    return res.status(403).json({ message: 'Invalid checksum' }); // dừng tại đây
  }

  const { description, amount } = body;

  try {
    const deposit = await PendingDeposit.findOne({ transferContent: description, amount, status: 'pending' });
    if (!deposit) {
      console.warn("Deposit not found");
      return res.status(404).json({ message: 'Deposit not found' });
    }

    const user = await User.findById(deposit.userId);
    if (!user) {
      console.warn("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance += amount;
    await user.save();

    deposit.status = 'completed';
    await deposit.save();

    console.log("✅ Updated balance for user", user._id, "with amount", amount);
    return res.status(200).json({ message: 'Balance updated' });

  } catch (e) {
    console.error("Webhook processing error:", e);
    return res.status(500).json({ message: 'Webhook error' });
  }
};

