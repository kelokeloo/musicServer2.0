const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "swsh23hjddnns";
const ACCESS_TOKEN_LIFE = 1200000;
const algorithm = "HS256";
const tokenOptions = {
  algorithm: algorithm,
  expiresIn: ACCESS_TOKEN_LIFE,
};

function createToken(account) {
  const payload = {
    account,
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, tokenOptions);
  return accessToken;
}

function verifyToken(accessToken) {
  try {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = {
  createToken,
  verifyToken,
};
