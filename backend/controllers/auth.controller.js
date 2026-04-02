import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';


export const register = async (req, res) => {
  try {
    const { name, email, password, roll } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields: name, email, and password.' });
    }

    // 2. Email Domain Validation
    if (!email.endsWith('@student.nitw.ac.in') && email !== 'admin123@nitw.ac.in') {
      return res.status(400).json({ success: false, message: 'Only @student.nitw.ac.in emails are allowed to register.' });
    }

    // 3. Password Validation
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // 4. Check if User Exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    // 5. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Save to Database
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      roll: email === 'admin123@nitw.ac.in' ? null : (roll || null),
      role: email === 'admin123@nitw.ac.in' ? 'admin' : 'student'
    });
    await newUser.save();

    // 7. Success Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser.toSafeObject()
    });

  } catch (error) {
    console.error('Error in register controller:', error.message);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    // 2. Locate User
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Check Account Status
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is blocked' });
    }

    // 5. Generate JWT
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback-secret-key-dev', 
      { expiresIn: '7d' }
    );

    // 6. Success Response
    res.status(200).json({
      success: true,
      token,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Error in login controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
