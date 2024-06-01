const userRepository = require('../repositories/userRepository');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    verificationToken,
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Email Verification',
    text: `Click on the following link to verify your email: ${verificationLink}`,
  });

  return user;
};

const verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userRepository.findUserByEmail(decoded.email);

  if (!user) {
    throw new Error('Invalid token.');
  }

  await userRepository.updateUser(user.email, {
    isVerified: true,
    verificationToken: null,
  });

  return user;
};

const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email to log in.');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token, user };
};

module.exports = {
  register,
  verifyEmail,
  login,
};
