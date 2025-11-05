const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');
const routes = require('./routes'); 
const setupSwagger = require("./config/swagger");


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

setupSwagger(app);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Selamat Datang di Aplikasi KidConnect!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server sedang berjalan di : http://localhost:${PORT}`));