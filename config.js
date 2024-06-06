const crypto = require('crypto');

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

module.exports = {
  accessTokenSecret: generateRandomString(64),
  refreshTokenSecret: generateRandomString(64)
};
