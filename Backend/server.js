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

app.get("/api/mutualfunds/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/search?q=${query}`);
    console.log("Response from mfapi:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from mfapi:", error.message);
    res.status(500).json({ message: "Failed to fetch data from mfapi.in" });
  }
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






