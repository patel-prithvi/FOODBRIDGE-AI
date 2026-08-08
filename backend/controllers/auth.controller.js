import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'foodbridge_ai_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// Format user payload to exclude sensitive fields
const sanitizeUser = (user) => {
  return {
    id: user._id,
    _id: user._id,
    role: user.role,
    email: user.email,
    organizationName: user.organizationName,
    name: user.name || undefined,
    contactPerson: user.contactPerson || undefined,
    phone: user.phone,
    location: user.location,
    verificationStatus: user.verificationStatus || undefined,
    createdAt: user.createdAt
  };
};

/**
 * @desc    Register a new user (DONOR or RECEIVER)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const {
      role,
      email,
      password,
      organizationName,
      name,
      contactPerson,
      phone,
      location
    } = req.body;

    // Validate role
    if (!role || !['DONOR', 'RECEIVER'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Role must be DONOR or RECEIVER.'
      });
    }

    // Role specific required field checks
    if (role === 'DONOR') {
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required for DONOR registration.' });
      }
    }

    if (role === 'RECEIVER') {
      if (!contactPerson || !contactPerson.trim()) {
        return res.status(400).json({ success: false, message: 'Contact person is required for RECEIVER registration.' });
      }
    }

    if (!organizationName || !organizationName.trim()) {
      return res.status(400).json({ success: false, message: 'Organization name is required.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    if (!location || !location.address || !location.city) {
      return res.status(400).json({ success: false, message: 'Location with address and city is required.' });
    }

    // Check if duplicate user exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please login instead.'
      });
    }

    // Build Location Object
    const userLocation = {
      address: location.address.trim(),
      city: location.city.trim(),
      lat: Number(location.lat) || 0,
      lng: Number(location.lng) || 0
    };

    // Create user in DB
    const userData = {
      role,
      email: normalizedEmail,
      password,
      organizationName: organizationName.trim(),
      phone: phone.trim(),
      location: userLocation
    };

    if (role === 'DONOR') {
      userData.name = name.trim();
    } else if (role === 'RECEIVER') {
      userData.contactPerson = contactPerson.trim();
      userData.verificationStatus = 'PENDING';
    }

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: `${role} account registered successfully`,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('[Auth Controller - Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('[Auth Controller - Login Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

/**
 * @desc    Logout user (Clear server state / token confirmation)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
};
