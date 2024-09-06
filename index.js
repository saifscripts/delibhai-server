const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// route imports
const userRoutes = require('./routes/v1/user.route');
const divisionRoutes = require('./routes/v1/division.route');
const districtRoutes = require('./routes/v1/district.route');
const upazilaRoutes = require('./routes/v1/upazila.route');
const unionRoutes = require('./routes/v1/union.route');
const wardRoutes = require('./routes/v1/ward.route');
const villageRoutes = require('./routes/v1/village.route');

dotenv.config();
const app = express();

// Application level middleware
// app.use(viewCount);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      //   'http://localhost:5173',
      'https://delibhai.com',
      'https://delibhai.vercel.app',
    ],
    credentials: true,
  })
);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DATABASE_URI).then(() => {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/division', divisionRoutes);
app.use('/api/v1/district', districtRoutes);
app.use('/api/v1/upazila', upazilaRoutes);
app.use('/api/v1/union', unionRoutes);
app.use('/api/v1/ward', wardRoutes);
app.use('/api/v1/village', villageRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'App is running successfully!',
  });
});
