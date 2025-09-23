const axios = require('axios');

const getWeather = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const baseUrl = process.env.WEATHER_API_URL;

    const url = `${baseUrl}?q=${city}&key=${apiKey}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Gagal mengambil data cuaca');
  }
};

module.exports = { getWeather };