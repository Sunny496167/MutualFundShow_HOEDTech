const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

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






