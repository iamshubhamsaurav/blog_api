const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
  password: {
    type: String,
    minlength: [6, 'Password should be atleast 6 character long'],
    required: [true, 'Please provide a password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide your confirmation password'],
    validate: {
      validator: function (value) {
        return this.password === this.value;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', function (next) {
  // If password is not modified :- Jump to the next middleware
  if (!this.isModified('password')) return next();
  // If password is modified :- Hash the password and save it in DB
  this.password = bcrypt.hash(this.password, 10);
  this.passwordConfirm = null;
  next();
});

// If the candidatePassword is the userPassword then it returns true
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
