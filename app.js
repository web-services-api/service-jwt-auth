require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

// Synchronize the database and then start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', err => {
  console.error('Error during database synchronization:', err);
});
