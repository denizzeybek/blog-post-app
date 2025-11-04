const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const user = await User.create({
      email,
      password,
      lastLoginIP: ipAddress,
      lastLogin: Date.now()
    });

    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge * 1000
    });

    console.log(`[SECURITY] New user registered: ${email} from IP: ${ipAddress}`);

    res.status(201).json({
      user: user._id,
      token,
      message: 'Account created successfully'
    });
  } catch (err) {
    const errors = handleErrors(err);
    console.warn(`[SECURITY] Signup failed for email: ${email} from IP: ${ipAddress}`, err.message);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const user = await User.login(email, password, ipAddress);
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: maxAge * 1000
    });
    res.status(200).json({
      user: user._id,
      token,
      message: 'Login successful'
    });
  } catch (err) {
    const errors = handleErrors(err);

    // Check if account is locked
    if (err.message.includes('locked')) {
      return res.status(423).json({
        error: 'Account Locked',
        message: err.message
      });
    }

    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

// Fetch user from JWT
module.exports.fetchUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded token's id
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user; // Attach user to request object
    res.status(200).json({ message: 'Token is valid', user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
