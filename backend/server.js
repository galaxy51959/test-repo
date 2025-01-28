const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socket = require('./socket');
dotenv.config();

// Routes
const reportRoutes = require('./routes/reportRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/auth');
// const calendarRoutes = require('./routes/calendarRoutes');
const studentRoutes = require('./routes/studentRoutes');
// const callRoutes = require('./routes/callRoutes');

// Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/calendar', calendarRoutes);
app.use('/api/students', studentRoutes);
// app.use('/api/calls', callRoutes);

// Error Handler
app.use(errorHandler);

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const server = http.createServer(app);
const io = socket.init(server);

server.listen(process.env.PORT || 5000);
