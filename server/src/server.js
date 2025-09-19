const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const routes = require('./routes');

const { Activity, Announcement, Attendance, Classroom, FileUpload, LiveReport, Message, Student, User, WeatherCache} = require("./models");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to KidConnect!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servernya jalan di : ${PORT}`));