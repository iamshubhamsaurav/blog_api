const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const AppError = require('./utils/appError');

//Security Modules
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });
connectDB();

const categoriesRoute = require('./routes/categories');
const blogsRoute = require('./routes/blogs');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ****** Security Middlewares ********
//Sanitize data
app.use(mongoSanitize());
//Set Security headers
app.use(helmet());
//Prevent XSS - Cross site scripting attack
app.use(xssClean());
// Limiting requests
app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, //  Max 100 request in the set duration
  })
);
// Prevent Http params pollution
app.use(hpp());
// Enable Cross Site Resource Sharing
app.use(cors());

app.use('/api/v1/categories', categoriesRoute);
app.use('/api/v1/blogs', blogsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Resource ${req.originalUrl} not found on the server`, 404)
  );
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running on port: ${PORT}`.yellow.bold));
