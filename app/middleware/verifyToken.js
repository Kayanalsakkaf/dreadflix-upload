const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
function verify(req, res, next) {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json("Token is not valid!");
        console.error("Token is not valid!!");
      }
      req.user = user;

      next();
    });
  } else {
    console.error("You are not authenticated!");
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;
