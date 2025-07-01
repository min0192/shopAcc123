import mongoose from 'mongoose';

const PendingDepositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    orderCode: { type: Number, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export const PendingDeposit = mongoose.model('PendingDeposit', PendingDepositSchema);