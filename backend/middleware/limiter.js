const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  messages: "Too many resquests from this IP, please try again after an 15 minutes"
});

module.exports = limiter;