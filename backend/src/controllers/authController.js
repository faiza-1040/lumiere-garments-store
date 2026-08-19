const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate random verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({ 
      firstName, 
      lastName, 
      phone, 
      email, 
      password,
      verificationToken
    });

    if (user) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const verificationLink = `${frontendUrl}/verify/${verificationToken}`;
      
      // Real Email Sending via Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"Lumière" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your Lumière Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white text-center">
            <h1 style="color: #292524; font-weight: 300; tracking: 2px;">LUMIÈRE</h1>
            <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
            <p style="color: #555; font-size: 16px;">Welcome to Lumière! Please click the button below to verify your email address and activate your account.</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #292524; color: #fff; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Verify Account</a>
            <p style="color: #999; font-size: 12px; mt-8">If you did not create this account, please ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: 'Registration successful! Please check your actual email inbox to verify your account.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: 'Email successfully verified! You are now logged in.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in. Check your console for the link.' });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, verifyEmail };
