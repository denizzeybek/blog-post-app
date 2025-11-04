const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimum password length is 8 characters'],
    validate: {
      validator: function(v) {
        // Strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  // Account lockout fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  // Security audit fields
  lastLogin: {
    type: Date
  },
  lastLoginIP: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// Virtual field for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // Increased rounds for better security
  this.password = await bcrypt.hash(this.password, salt);

  // Update timestamp
  this.updatedAt = Date.now();
  next();
});

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

  // Lock account after max attempts
  const needsLock = this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS;
  if (needsLock && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    console.warn(`[SECURITY] Account locked for email: ${this.email}`);
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// static method to login user with account lockout
userSchema.statics.login = async function(email, password, ipAddress) {
  const user = await this.findOne({ email });

  if (!user) {
    // Log failed attempt for security monitoring
    console.warn(`[SECURITY] Login attempt for non-existent email: ${email} from IP: ${ipAddress}`);
    throw Error('incorrect email');
  }

  // Check if account is locked
  if (user.isLocked) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000); // minutes
    console.warn(`[SECURITY] Login attempt on locked account: ${email} from IP: ${ipAddress}`);
    throw Error(`Account is locked. Try again in ${remainingTime} minutes.`);
  }

  const auth = await bcrypt.compare(password, user.password);

  if (!auth) {
    // Increment login attempts on failed password
    await user.incLoginAttempts();
    console.warn(`[SECURITY] Failed login attempt for ${email} from IP: ${ipAddress}. Attempts: ${user.loginAttempts + 1}`);
    throw Error('incorrect password');
  }

  // Successful login - reset attempts and update last login
  if (user.loginAttempts > 0 || user.lockUntil) {
    await user.resetLoginAttempts();
  }

  // Update last login info
  await user.updateOne({
    $set: {
      lastLogin: Date.now(),
      lastLoginIP: ipAddress
    }
  });

  console.log(`[SECURITY] Successful login for ${email} from IP: ${ipAddress}`);
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;