const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(res, user, statusCode = 200) {
  res.status(statusCode).json({
    token: signToken(user),
    user: user.toSafeObject(),
  });
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'A user with this email already exists.' });
  }

  // Public registration always creates a normal user. Role and permissions from
  // the request body are intentionally ignored.
  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
    permissions: [],
  });

  return sendAuthResponse(res, user, 201);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return sendAuthResponse(res, user);
}

async function me(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

module.exports = {
  register,
  login,
  me,
};
