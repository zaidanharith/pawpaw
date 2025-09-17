const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { Activity, Announcement, LiveReport, Parent, ParentMessage, Student, Teacher, User, WeatherCache} = require("./models");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to KidConnect');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
