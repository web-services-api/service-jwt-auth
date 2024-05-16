const crypto = require('crypto');

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

module.exports = {
  accessTokenSecret: generateRandomString(64),
  refreshTokenSecret: generateRandomString(64),
  dbConfig: {
    user: "root",
    host: process.env.DB_HOST,
    database: "preprod_movies",
    password: "root",
    port: 5430,
  },
};
