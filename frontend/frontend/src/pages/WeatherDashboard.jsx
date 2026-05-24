import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Bangalore");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/weather/${city}`
      );

      setWeather(res.data.current);

      const formatted = res.data.forecast.map((item) => ({
        day: item.day,
        temp: item.temp,
      }));

      setForecast(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-5xl font-bold mb-8">
        Weather Forecast Application
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter City"
          className="p-3 rounded-xl w-64"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={fetchWeather}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Search
        </button>
      </div>

      {weather && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-3xl font-semibold">{weather.city}</h2>

          <p className="text-6xl mt-4">
            {weather.temperature}°C
          </p>

          <p className="text-xl mt-2">
            {weather.description}
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Temperature Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}