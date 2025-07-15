import express, { Request, Response } from 'express';
import multer from 'multer';
import { verifyToken } from '../utils/tokenManager';
import { bucket } from '../utils/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Lưu file vào RAM

router.post('/', verifyToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${uuidv4()}${ext}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file' });
    });

    blobStream.on('finish', async () => {
      // Set file public
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

export default router; 