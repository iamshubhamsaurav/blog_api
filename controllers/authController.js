const catchAsync = require('../utils/catchAsync');
const errorHandler = require('../utils/errorHandler');
const AppError = require('../utils/appError');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jsonwebtoken.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.statusCode(statusCode).json({ success: true, token, user });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError('Invalid Login', 401));
  }
  createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});
