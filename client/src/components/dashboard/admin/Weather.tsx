"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTint, FaWind, FaTemperatureHigh } from "react-icons/fa";

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
      } catch (err) {
        setError("Gagal mengambil data cuaca");
      }
      setLoading(false);
    };
    fetchWeather();
  }, []);

  return (
    <section className="bg-white rounded-xl shadow py-4 flex flex-col items-center justify-center font-semibold font-sans">
      <div className="relative z-10 w-full flex flex-col items-center">
        {loading ? (
          <span className="animate-pulse text-lg font-medium">Memuat data cuaca...</span>
        ) : error ? (
          <span className="text-red-500 text-lg font-medium">{error}</span>
        ) : weather && weather.location && weather.current ? (
          <div>
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
        ) : (
          <span className="text-gray-400">Data cuaca tidak tersedia</span>
        )}
      </div>
    </section>
  );
};

export default Weather;