require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to KidConnect!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});