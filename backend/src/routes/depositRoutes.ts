import express from 'express';
import { createPendingDeposit, handleWebhook } from '../controllers/depositController';
import { verifyToken } from '../utils/tokenManager';

const router = express.Router();

router.post('/deposit/pending', verifyToken, createPendingDeposit);
router.post('/webhook/payos', handleWebhook);

export default router;