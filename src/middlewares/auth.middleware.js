// auth.middleware.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Ensure your token payload includes the user's id in 'id'
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};

exports.checkAuthForPublic = (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ loggedIn: true });
    } catch (err) {
      return res.json({ loggedIn: false });
    }
  } else {
    return res.json({ loggedIn: false });
  }
};