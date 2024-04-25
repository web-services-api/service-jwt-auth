module.exports = {
    accessTokenSecret: 'your_access_token_secret',
    refreshTokenSecret: 'your_refresh_token_secret',
    dbConfig: {
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    },
  };
  