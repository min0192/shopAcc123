import { Request, Response } from 'express';
import { PendingDeposit } from '../models/PendingDeposit';
import User from '../models/UserModel';
import { createPayOSOrder } from '../utils/payosClient';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const buildDataString = (data: any): string => {
  return Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');
};

const verifySignature = (data: any, signature: string, key: string): boolean => {
  const rawData = buildDataString(data);
  const hash = crypto.createHmac('sha256', key).update(rawData).digest('hex');
  return hash === signature;
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
  const { data, signature } = req.body;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY!;

  try {
    if (!verifySignature(data, signature, checksumKey)) {
      console.warn("❌ Webhook signature mismatch:", signature);
      return res.status(200).json({ message: 'Invalid signature' }); // Trả về 200 để PayOS không retry
    }

    const { description, amount } = data;

    const deposit = await PendingDeposit.findOne({
      transferContent: description,
      amount,
      status: 'pending',
    });

    if (!deposit) {
      console.warn("⚠️ Deposit not found for:", description, amount);
      return res.status(200).json({ message: 'Deposit not found' });
    }

    const user = await User.findById(deposit.userId);
    if (!user) {
      console.warn("⚠️ User not found for deposit:", deposit._id);
      return res.status(200).json({ message: 'User not found' });
    }

    user.balance += amount;
    await user.save();

    deposit.status = 'completed';
    await deposit.save();

    console.log(`✅ Webhook: Deposit ${description} confirmed. Amount: ${amount}, User: ${user._id}`);
    return res.status(200).json({ message: 'Balance updated' });

  } catch (e) {
    console.error("❌ Webhook handler error:", e);
    return res.status(200).json({ message: 'Webhook error handled gracefully' });
  }
};
