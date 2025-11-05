const { getWeather } = require('../services/weather.service');

const weatherController = {
  fetchWeather: async (req, res) => {
    try {
      const { location } = req.params;
      
      if (!location) {
        return res.status(400).json({ 
          success: false,
          message: 'Lokasi wajib diisi' 
        });
      }

      const data = await getWeather(location);
      
      res.status(200).json({ 
        success: true,
        message: 'Data cuaca berhasil diambil', 
        data 
      });
    } catch (error) {
      console.error('Fetch weather error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data cuaca'
      });
    }
  }
};

module.exports = weatherController;