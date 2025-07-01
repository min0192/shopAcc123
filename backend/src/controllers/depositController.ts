import { Request, Response } from 'express';
import { PendingDeposit } from '../models/PendingDeposit';
import User from '../models/UserModel';
import payOS from '../utils/payosClient';
import dotenv from 'dotenv';
dotenv.config();

export const createPendingDeposit = async (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const orderCode = Number(String(new Date().getTime()).slice(-6));
    const transferContent = `dtm${orderCode}`;

    const pending = await PendingDeposit.create({
      userId: req.user.id,
      amount,
      orderCode,
      transferContent,
      status: 'pending',
    });

    const paymentData = {
      orderCode,
      amount,
      description: transferContent,
      returnUrl: `${process.env.CLIENT_URL}`,
      cancelUrl: `${process.env.CLIENT_URL}/nap-tien`,
    };

    const paymentLink = await payOS.createPaymentLink(paymentData);

    res.status(201).json({ ...pending.toObject(), checkoutUrl: paymentLink.checkoutUrl, transferContent });
  } catch (e) {
    console.error("❌ Error in createPendingDeposit:", e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const webhookBody = req.body;
  try {
    const verifiedData = payOS.verifyPaymentWebhookData(webhookBody);
    console.log('✅ Webhook verifiedData:', verifiedData);

    if (verifiedData.code !== '00') {
      console.log(`⚠️ Webhook for order ${verifiedData.orderCode} not successful. Status: ${verifiedData.code}`);
      await PendingDeposit.findOneAndUpdate({ orderCode: verifiedData.orderCode }, { status: 'failed' });
      return res.status(200).json({ message: 'Payment not successful' });
    }

    const deposit = await PendingDeposit.findOne({
      transferContent: verifiedData.description,
      amount: verifiedData.amount,
      status: 'pending',
    });

    if (!deposit) {
      console.warn("⚠️ Deposit not found for:", verifiedData.description, verifiedData.amount);
      return res.status(200).json({ message: 'Deposit not found' });
    }

    const user = await User.findById(deposit.userId);
    if (!user) {
      console.warn("⚠️ User not found for deposit:", deposit._id);
      return res.status(200).json({ message: 'User not found' });
    }

    user.balance += verifiedData.amount;
    await user.save();

    deposit.status = 'completed';
    await deposit.save();

    console.log(`✅ Deposit confirmed. Amount: ${verifiedData.amount}, User: ${user._id}`);
    return res.status(200).json({ message: 'Balance updated' });

  } catch (e) {
    console.error("❌ Webhook handler error:", e, JSON.stringify(req.body));
    return res.status(200).json({ message: 'Webhook error handled gracefully' });
  }
};