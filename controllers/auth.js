const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  res.status(statusCode).json({ success: true, token, user });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});

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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Token Doesnot Exist', 403));
  }

  // Not working
  // const decoded = await promisify(
  //   jsonwebtoken.verify(token, process.env.JWT_SECRET)
  // );
  //Using this line instead

  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(`User with the id: ${decoded.id} doesn't exist`, 401)
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password has been changed. Please login again', 401)
    );
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to carry out this action', 403)
      );
    }
    return next();
  };
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, data: user });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const fields = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = req.user;
  user.name = fields.name;
  user.email = fields.email;
  await user.save({ validateBeforeSave: false });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();
});
