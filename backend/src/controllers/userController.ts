import { Request, Response } from 'express';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import * as tokenManager from "../utils/tokenManager.js";
import bcrypt from 'bcryptjs';


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, name } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
      name,
    });

    if (user) {
      const token = tokenManager.createToken(
        user._id.toString(),
        user.email,
        user.name,
        user.role,
        user.phone,
        user.balance,
        '1d'
      );
      res.status(201).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    try {
      // Generate token
      const token = tokenManager.createToken(
        user._id.toString(),
        user.email,
        user.name,
        user.role,
        user.phone,
        user.balance,
        '1d'
      );
      res.clearCookie('token', { path: '/' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        token: token,
      });
    } catch (tokenError: any) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({ 
        message: 'Authentication error',
        error: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
      });
    }

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      const token = tokenManager.createToken(
        updatedUser._id.toString(),
        updatedUser.email,
        updatedUser.name,
        updatedUser.role,
        updatedUser.phone,
        updatedUser.balance,
        '1d'
      );
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        token: token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user balance
// @route   PUT /api/users/balance
// @access  Private
export const updateUserBalance = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { amount } = req.body;

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += amount;
    const updatedUser = await user.save();

    res.json({
      message: "Balance updated successfully",
      balance: updatedUser.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, name, balance, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
      name,
      balance,
      role,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, email} = req.body;
    if (email) {
      const existingUser = await User.findOne({ 
        email: { $eq: email },
        _id: { $ne: id } // Exclude current user
      });
      if (existingUser) {
        return res.status(422).json({ 
          error: `Email already in use!` 
        });
      }
    }
       // Update user
       const updatedUser = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found!" });
      }
      await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
  
      res.status(200).json({
        message: "User updated successfully!",
        user: updatedUser
      });
  
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
};

// @desc    Admin delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}; 