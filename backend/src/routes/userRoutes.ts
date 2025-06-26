import express, { Request } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserBalance,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { verifyToken } from "../utils/tokenManager";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", verifyToken, getAllUsers as any);
router
  .route("/profile")
  .get(verifyToken, getUserProfile as any)
  .put(verifyToken, updateUserProfile as any);
router.put("/balance", verifyToken, updateUserBalance as any);
router.route("/").get(verifyToken, getAllUsers).post(verifyToken, createUser);
router
  .route("/:id")
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);
export default router;
