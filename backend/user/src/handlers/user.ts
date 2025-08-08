// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../validators/user.validators.js';
import { User } from '../model/user.model.js';
import { redisClient } from '../index.js';
import { randomInt } from 'crypto' 

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User(parsedData);
    await user.save();

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();

    // Create short-lived verification token with user id
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );

    // Store OTP in Redis with expiration
    await redisClient.setEx(`verify:${user._id}`, 15 * 60, otp);

    // TODO: Send OTP to user via email
    console.log(`OTP for ${user.email}: ${otp}`);

    return res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      verificationToken,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(parsedData.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {id: user._id,  name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { otp, token } = req.body;

    // Verify token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    // Get stored OTP from Redis
    const storedOtp = await redisClient.get(`verify_otp:${userId}`);
    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified
    await User.findByIdAndUpdate(userId, { isEmailVerified: true });

    // Delete OTP from Redis
    await redisClient.del(`verify:${userId}`);

    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
};