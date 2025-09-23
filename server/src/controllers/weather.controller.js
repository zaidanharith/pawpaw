const { getWeather } = require('../services/weather.service');

const weatherController = {
  fetchWeather: async (req, res) => {
    try {
      const { location } = req.params;
      if (!location) {
        return res.status(400).json({ message: 'Lokasi tidak ditemukan' });
      }

      const data = await getWeather(location);
      res.json({ message: 'Data cuaca berhasil diambil', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = weatherController;