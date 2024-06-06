require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api', authRoutes);
app.use('/api/account', userRoutes);

const PORT = 3000;

// Import models to ensure they are loaded
const Users = require('./models/users');
const Roles = require('./models/roles');
const Token = require('./models/token');

// Synchronize the database and then start the server
sequelize.sync({ force: false }) // { force: true } will drop and recreate tables
  .then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });