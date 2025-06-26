import mongoose from 'mongoose';

const PendingDepositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transferContent: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

export const PendingDeposit = mongoose.model('PendingDeposit', PendingDepositSchema);