const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socket = require('./socket');
// const { Upload } = require('@aws-sdk/lib-storage');
// const s3Client = require('./config/aws-config');
// const { fromNodeStream } = require('@aws-sdk/stream-transform-node');

dotenv.config();

// Routes
const reportRoutes = require('./routes/reportRoutes');
const templateRoutes = require('./routes/templateRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/promptRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const studentRoutes = require('./routes/studentRoutes');
const storageRoutes = require('./routes/storageRoutes');
// Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/storage', storageRoutes);
// app.use('/api/upload', async (req, res) => {
// const { file } = req;
// })

// Error Handler
app.use(errorHandler);

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const server = http.createServer(app);

// Initialize socket.io
socket.init(server);

server.listen(process.env.PORT || 5000, () => {
    console.log('Server Running at:', server.address().port);
});
