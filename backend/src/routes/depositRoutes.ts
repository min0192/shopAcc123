import express from 'express';
import { createPendingDeposit, handleWebhook } from '../controllers/depositController';
import { verifyToken } from '../utils/tokenManager';
import {getUserDeposits} from '../controllers/depositController';

const router = express.Router();

router.post('/deposit/pending', verifyToken, createPendingDeposit);
router.post('/webhook/payos', handleWebhook);
router.get('/deposit/:userId',verifyToken, getUserDeposits);

export default router;