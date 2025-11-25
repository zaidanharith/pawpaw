"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaTint, FaWind, FaTemperatureHigh, FaUmbrella, FaSun, FaCloudRain, FaSnowflake, FaWater } from "react-icons/fa";

type WeatherApiResponse = {
  location?: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current?: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
  };
};

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const location = `${latitude},${longitude}` || "Yogyakarta";
              try {
                const res = await fetch(`${API_URL}/weather/${location}`);
                const json = await res.json();
                if (json.success) {
                  setWeather(json.data);
                } else {
                  setError(json.message || "Gagal mengambil data cuaca");
                }
                } catch {
                }
            },
            () => {
            }
          );
        }
      } catch {
        setError("Gagal mengambil data cuaca");
      }
      setLoading(false);
    };
    fetchWeather();
  }, []);

  const { data: session } = useSession();
  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const getWeatherRecommendation = () => {
    if (!weather?.current) return null;

    const { temp_c, condition, humidity, wind_kph } = weather.current;
    const conditionText = condition.text.toLowerCase();
    
    let icon = <FaSun className="text-yellow-500 text-2xl" />;
    let title = "Cuaca Cerah";
    let recommendations: string[] = [];

    if (conditionText.includes("rain") || conditionText.includes("hujan") || conditionText.includes("drizzle")) {
      icon = <FaUmbrella className="text-blue-500 text-2xl" />;
      title = "Hujan";
      recommendations = [
        "🌂 Bawalah payung atau jas hujan",
        "👟 Gunakan alas kaki anti air",
        "🚗 Hati-hati di jalan, hindari genangan air",
        "📱 Lindungi barang elektronik dari air"
      ];
    }
    else if (conditionText.includes("cloud") || conditionText.includes("mendung") || conditionText.includes("overcast")) {
      icon = <FaCloudRain className="text-gray-500 text-2xl" />;
      title = "Berawan";
      recommendations = [
        "☁️ Cuaca mendung, kemungkinan hujan",
        "🌂 Siapkan payung sebagai antisipasi",
        "👕 Pakaian hangat mungkin diperlukan"
      ];
    }
    else if (conditionText.includes("snow") || conditionText.includes("salju")) {
      icon = <FaSnowflake className="text-blue-300 text-2xl" />;
      title = "Bersalju";
      recommendations = [
        "🧥 Kenakan pakaian tebal dan hangat",
        "🧤 Gunakan sarung tangan dan syal",
        "⚠️ Hati-hati di jalan yang licin"
      ];
    }
    else if (temp_c > 32) {
      icon = <FaSun className="text-orange-500 text-2xl" />;
      title = "Cuaca Panas";
      recommendations = [
        "☀️ Gunakan tabir surya (sunscreen)",
        "💧 Perbanyak minum air putih",
        "👒 Pakai topi atau payung untuk melindungi dari sinar matahari",
        "😎 Gunakan kacamata hitam",
        "🕐 Hindari aktivitas berat di luar ruangan siang hari"
      ];
    }
    else if (temp_c < 20) {
      icon = <FaWind className="text-blue-400 text-2xl" />;
      title = "Cuaca Dingin";
      recommendations = [
        "🧥 Kenakan jaket atau pakaian hangat",
        "☕ Siapkan minuman hangat",
        "🧣 Gunakan syal jika diperlukan"
      ];
    }
    else if (humidity > 80) {
      icon = <FaWater className="text-cyan-500 text-2xl" />;
      title = "Lembab";
      recommendations = [
        "💨 Udara cukup lembab",
        "👕 Gunakan pakaian yang menyerap keringat",
        "💧 Tetap terjaga hidrasi"
      ];
    }
    else if (wind_kph > 30) {
      icon = <FaWind className="text-gray-600 text-2xl" />;
      title = "Angin Kencang";
      recommendations = [
        "🌬️ Angin cukup kencang",
        "🧥 Kenakan jaket untuk melindungi dari angin",
        "⚠️ Amankan barang-barang yang mudah terbawa angin"
      ];
    }
    else {
      recommendations = [
        "☀️ Cuaca cerah, cocok untuk aktivitas luar ruangan",
        "🚶 Waktu yang baik untuk berolahraga atau jalan-jalan",
        "😊 Nikmati cuaca yang menyenangkan!"
      ];
    }

    return { icon, title, recommendations };
  };

  const recommendation = getWeatherRecommendation();

  return (
    <section className="bg-white rounded-xl shadow py-4 flex flex-col items-center justify-center font-semibold font-sans px-3">
      <div className="relative z-10 w-full flex flex-col items-center">
        {loading ? (
          <span className="animate-pulse text-lg font-medium">Memuat data cuaca...</span>
        ) : error ? (
          <span className="text-red-500 text-lg font-medium">{error}</span>
        ) : weather && weather.location && weather.current ? (
          <div className="flex flex-col items-center w-full sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-between gap-4 mb-3">
                <Image
                  src={weather.current.condition.icon.startsWith("//") ? `https:${weather.current.condition.icon}` : weather.current.condition.icon}
                  alt={weather.current.condition.text}
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <div>
                  <div className="text-2xl font-extrabold">{weather.location.name}</div>
                  <div className="text-sm text-gray-500">{weather.location.region}, {weather.location.country}</div>
                  <div className="text-xs text-gray-400">Diperbarui pada {weather.location.localtime}</div>
                </div>
              </div>

              <div className="flex gap-7">
                  <div>
                      <div className="text-4xl font-black mt-2">{weather.current.temp_c}°C</div>
                      <div className="mt-1 text-base italic text-blue-500">{weather.current.condition.text}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                          <FaTint /> {weather.current.humidity}%
                      </span>
                      <span className="flex items-center gap-1">
                          <FaWind /> {weather.current.wind_kph} kph
                      </span>
                      <span className="flex items-center gap-1">
                          <FaTemperatureHigh /> {weather.current.feelslike_c}°C
                      </span>
                  </div>
              </div>

            </div>

            {recommendation && (
                <div className="border border-2 rounded-lg p-3 mt-4 w-full" style={{ borderColor: accentColor }}>
                  <div className="flex items-center gap-2 mb-2">
                    {recommendation.icon}
                    <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                      Rekomendasi :
                    </h3>
                  </div>
                  <ul className="text-sm space-y-1 font-normal">
                    {recommendation.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ) : (
          <span className="text-gray-400">Data cuaca tidak tersedia</span>
        )}
      </div>
    </section>
  );
};

export default Weather;