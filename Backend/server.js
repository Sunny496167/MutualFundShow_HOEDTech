const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

const authRoutes = require('./Routes/authRoutes');
const mutualFundsRoutes = require('./Routes/mutualFundsRoutes');
const savedFundsRoutes = require('./Routes/savedFundsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/mutual-funds', mutualFundsRoutes);
app.use('/api/saved-funds', savedFundsRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Mutual funds Backend');
});



connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });






