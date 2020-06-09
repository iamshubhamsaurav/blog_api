const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });
connectDB();

const categoriesRoute = require('./routes/categories');
const blogsRoute = require('./routes/blogs');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/categories', categoriesRoute);
app.use('/api/v1/blogs', blogsRoute);

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

const PORT = process.env.PORT;
// const PORT = 8000;
app.listen(PORT, console.log(`Server running on port: ${PORT}`.yellow.bold));
