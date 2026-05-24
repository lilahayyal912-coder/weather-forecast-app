import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThermometer,
} from "react-icons/wi";

import {
  FaMoon,
  FaSun,
  FaMapMarkerAlt,
  FaClock,
  FaTemperatureHigh,
  FaLocationArrow,
  FaEye,
} from "react-icons/fa";

import axios from "axios";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WeatherDashboard() {

  const navigate = useNavigate();

  // ---------------- STATES ----------------

  const [city, setCity] = useState("Bangalore");

  const [weather, setWeather] = useState(null);

  const [forecast, setForecast] = useState([]);

  const [savedCities, setSavedCities] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [theme, setTheme] = useState("day");

  const [currentTime, setCurrentTime] = useState("");

  const [aqi, setAqi] = useState(null);

  const [hourlyForecast, setHourlyForecast] = useState([]);

  // ---------------- LIVE CLOCK ----------------

  useEffect(() => {

    const timer = setInterval(() => {

      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString()
      );

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // ---------------- AQI MAP ----------------

  const aqiMap = {

    1: {
      text: "Good 😊",
      color: "from-green-400 to-green-600",
      message: "Air quality is excellent.",
    },

    2: {
      text: "Fair 🙂",
      color: "from-yellow-300 to-yellow-500",
      message: "Air quality is acceptable.",
    },

    3: {
      text: "Moderate 😐",
      color: "from-orange-400 to-orange-600",
      message: "Sensitive people should be careful.",
    },

    4: {
      text: "Poor 😷",
      color: "from-red-400 to-red-600",
      message: "Avoid outdoor exercise.",
    },

    5: {
      text: "Very Poor ☠️",
      color: "from-purple-500 to-purple-800",
      message: "Stay indoors if possible.",
    },
  };

  // ---------------- FETCH WEATHER ----------------

  const fetchWeather = async (selectedCity = city) => {

    try {

      setLoading(true);

      setError("");

      const res = await axios.get(
        `http://127.0.0.1:8000/weather/${selectedCity}`
      );

      const weatherData = {

        ...res.data.current,

        air_quality:
          aqiMap[res.data.aqi]?.text || "Unknown",

        air_quality_color:
          aqiMap[res.data.aqi]?.color || "from-gray-400 to-gray-600",

        air_quality_message:
          aqiMap[res.data.aqi]?.message || "",
      };

      setWeather(weatherData);

      setAqi(res.data.aqi);

      // ---------------- FORECAST ----------------

      const formatted = res.data.forecast.map((item) => ({

        day: item.day,

        temp: item.temp,

        icon: item.icon,

        condition: item.condition,

      }));

      setForecast(formatted);

      // ---------------- HOURLY ----------------

      if (res.data.hourly_forecast) {

        setHourlyForecast(
          res.data.hourly_forecast
        );
      }

      // ---------------- THEME ----------------

      const condition =
        res.data.current.description.toLowerCase();

      const hour = new Date().getHours();

      if (condition.includes("rain")) {

        setTheme("rain");

      }

      else if (condition.includes("cloud")) {

        setTheme("cloud");

      }

      else if (hour >= 18 || hour <= 6) {

        setTheme("night");

      }

      else {

        setTheme("day");
      }

      setLoading(false);

    } catch (err) {

      setError("City not found");

      setLoading(false);
    }
  };

  // ---------------- GEOLOCATION ----------------

  useEffect(() => {

    const getLocationWeather = async () => {

      if (!navigator.geolocation) {

        fetchWeather();

        return;
      }

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          try {

            const lat = position.coords.latitude;

            const lon = position.coords.longitude;

            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
            );

            setCity(res.data.name);

            fetchWeather(res.data.name);

          } catch {

            fetchWeather();
          }
        },

        () => {

          fetchWeather();
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocationWeather();

  }, []);

  // ---------------- AUTO REFRESH ----------------

  useEffect(() => {

    const interval = setInterval(() => {

      fetchWeather();

    }, 60000);

    return () => clearInterval(interval);

  }, [city]);

  // ---------------- FETCH SAVED CITIES ----------------

  const fetchSavedCities = async () => {

    try {

      const user_id =
        localStorage.getItem("user_id");

      const res = await axios.get(
        `http://127.0.0.1:8000/saved-locations/${user_id}`
      );

      setSavedCities(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchSavedCities();

  }, []);

  // ---------------- SAVE CITY ----------------

  const saveCity = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/save-location",
        {

          user_id:
            localStorage.getItem("user_id"),

          city: weather.city,

          country: weather.country,

          latitude: weather.latitude,

          longitude: weather.longitude
        }
      );

      alert("City saved successfully ⭐");

      fetchSavedCities();

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Failed to save city"
      );
    }
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {

    localStorage.removeItem("user_id");

    localStorage.removeItem("username");

    navigate("/login");
  };

  // ---------------- AI INSIGHTS ----------------

  const getWeatherInsight = () => {

    if (!weather) return "";

    const temp = weather.temperature;

    const desc = weather.description.toLowerCase();

    if (desc.includes("rain")) {
      return "🌧️ Carry an umbrella today. Rain expected in several areas.";
    }

    if (temp > 35) {
      return "🔥 Very hot weather. Stay hydrated and avoid direct sunlight.";
    }

    if (temp < 15) {
      return "❄️ Cold weather today. Wear warm clothes.";
    }

    if (desc.includes("cloud")) {
      return "☁️ Cloudy weather throughout the day.";
    }

    return "☀️ Great weather for outdoor activities today.";
  };

  // ---------------- BACKGROUND ----------------

  const getBackground = () => {

    if (theme === "night") {

      return "bg-gradient-to-br from-black via-gray-900 to-slate-950 text-white";
    }

    if (theme === "rain") {

      return "bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900 text-white";
    }

    if (theme === "cloud") {

      return "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 text-white";
    }

    return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 text-white";
  };

  // ---------------- WEATHER ICON ----------------

  const getWeatherIcon = () => {

    if (!weather) return null;

    const desc = weather.description.toLowerCase();

    if (desc.includes("rain")) {
      return <WiRain className="text-7xl text-blue-300 animate-bounce" />;
    }

    if (desc.includes("cloud")) {
      return <WiCloudy className="text-7xl text-gray-200 animate-pulse" />;
    }

    return <WiDaySunny className="text-7xl text-yellow-300 animate-spin-slow" />;
  };

  return (

    <div
      className={`min-h-screen p-6 transition-all duration-700 relative overflow-hidden ${getBackground()}`}
    >

      {/* ANIMATED BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
          }}
          className="absolute top-10 left-10 text-9xl opacity-10"
        >
          ☁️
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="absolute bottom-20 right-20 text-8xl opacity-10"
        >
          🌤️
        </motion.div>

        <motion.div
          animate={{
            x: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
          className="absolute top-1/2 left-1/3 text-7xl opacity-10"
        >
          🌦️
        </motion.div>

      </div>

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10"
      >

        <div>

          <h1 className="text-5xl md:text-7xl font-black tracking-wide">
            SkyCast Pro ☀️
          </h1>

          <p className="mt-3 text-lg flex items-center gap-2">

            <FaClock />

            {currentTime}

          </p>

        </div>

        <button
          onClick={logout}
          className="mt-4 md:mt-0 bg-red-500 hover:bg-red-700 transition-all text-white px-6 py-3 rounded-2xl shadow-2xl"
        >
          Logout
        </button>

      </motion.div>

      {/* SEARCH */}

      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="flex flex-col md:flex-row gap-4 justify-center mb-8 relative z-10"
      >

        <input
          className="
          p-5
          rounded-3xl
          w-full
          md:w-[450px]
          shadow-2xl
          bg-white/20
          backdrop-blur-2xl
          text-white
          placeholder:text-gray-200
          outline-none
          border
          border-white/20
          "
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={() => fetchWeather()}
          className="
          bg-gradient-to-r
          from-green-500
          to-emerald-700
          hover:scale-105
          transition-all
          text-white
          px-8
          py-4
          rounded-3xl
          shadow-2xl
          font-bold
          "
        >
          Search
        </button>

      </motion.div>

      {/* SAVED CITIES */}

      <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-10">

        {
          savedCities.map((item, index) => (

            <motion.button
              whileHover={{ scale: 1.08 }}
              key={index}
              onClick={() => {
                setCity(item.city);
                fetchWeather(item.city);
              }}
              className="
              bg-yellow-400/90
              hover:bg-yellow-500
              px-5
              py-2
              rounded-2xl
              shadow-xl
              text-black
              font-bold
              "
            >
              ⭐ {item.city}
            </motion.button>
          ))
        }

      </div>

      {/* LOADING */}

      {
        loading && (

          <div className="flex justify-center mt-20">

            <div className="animate-spin rounded-full h-28 w-28 border-b-4 border-white"></div>

          </div>
        )
      }

      {/* ERROR */}

      {
        error && (

          <div className="text-center text-red-300 text-2xl">

            {error}

          </div>
        )
      }

      {/* MAIN WEATHER CARD */}

      {
        weather && (

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="
            backdrop-blur-2xl
            bg-white/10
            border
            border-white/20
            rounded-[40px]
            shadow-[0_0_40px_rgba(255,255,255,0.2)]
            p-8
            max-w-7xl
            mx-auto
            mb-10
            relative
            z-10
            overflow-hidden
            "
          >

            {/* Glow */}

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">

              <div>

                <h2 className="text-6xl font-black flex items-center gap-4">

                  <FaMapMarkerAlt />

                  {weather.city}

                </h2>

                <p className="capitalize text-3xl mt-4 font-semibold">
                  {weather.description}
                </p>

                <p className="mt-3 text-xl opacity-80">
                  {weather.country}
                </p>

                <div className="mt-5 flex items-center gap-3 text-lg">

                  <FaLocationArrow />

                  <span>
                    {weather.latitude}, {weather.longitude}
                  </span>

                </div>

              </div>

              <div className="flex flex-col items-center">

                {getWeatherIcon()}

                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                  alt="weather icon"
                  className="drop-shadow-2xl"
                />

              </div>

            </div>

            {/* TEMP */}

            <div className="flex items-center gap-5 mt-8 relative z-10">

              <FaTemperatureHigh className="text-6xl text-orange-300" />

              <h1 className="text-[110px] font-black leading-none">
                {weather.temperature}°
              </h1>

              <span className="text-4xl font-bold">
                C
              </span>

            </div>

            {/* FEELS */}

            <div className="flex flex-wrap gap-6 mt-5 text-xl font-semibold">

              <p>
                Feels Like: {weather.feels_like}°C
              </p>

              <p>
                Min: {weather.temp_min}°C
              </p>

              <p>
                Max: {weather.temp_max}°C
              </p>

            </div>

            {/* AI INSIGHT */}

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="
              mt-8
              bg-white/10
              border
              border-white/20
              p-6
              rounded-3xl
              backdrop-blur-xl
              shadow-2xl
              "
            >

              <h3 className="text-3xl font-black mb-3">
                AI Weather Insight 🤖
              </h3>

              <p className="text-lg opacity-90">
                {getWeatherInsight()}
              </p>

            </motion.div>

            {/* ANALYTICS */}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

              {/* HUMIDITY */}

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-blue-500/20 backdrop-blur-xl p-6 rounded-3xl text-center border border-white/10"
              >

                <WiHumidity className="text-7xl mx-auto text-cyan-200" />

                <h3 className="font-bold text-xl mt-2">
                  Humidity
                </h3>

                <p className="text-4xl mt-3 font-black">
                  {weather.humidity}%
                </p>

              </motion.div>

              {/* WIND */}

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-green-500/20 backdrop-blur-xl p-6 rounded-3xl text-center border border-white/10"
              >

                <WiStrongWind className="text-7xl mx-auto text-green-200" />

                <h3 className="font-bold text-xl mt-2">
                  Wind
                </h3>

                <p className="text-4xl mt-3 font-black">
                  {weather.wind_speed}
                </p>

              </motion.div>

              {/* PRESSURE */}

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-yellow-500/20 backdrop-blur-xl p-6 rounded-3xl text-center border border-white/10"
              >

                <WiBarometer className="text-7xl mx-auto text-yellow-200" />

                <h3 className="font-bold text-xl mt-2">
                  Pressure
                </h3>

                <p className="text-4xl mt-3 font-black">
                  {weather.pressure}
                </p>

              </motion.div>

              {/* AQI */}

              <motion.div
                whileHover={{ y: -8 }}
                className={`
                bg-gradient-to-br
                ${weather.air_quality_color}
                p-6
                rounded-3xl
                text-center
                shadow-2xl
                `}
              >

                <h3 className="font-black text-2xl">
                  AQI 🌫️
                </h3>

                <p className="text-2xl mt-4 font-bold">
                  {weather.air_quality}
                </p>

                <p className="text-sm mt-3 opacity-90">
                  {weather.air_quality_message}
                </p>

              </motion.div>

              {/* VISIBILITY */}

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-purple-500/20 backdrop-blur-xl p-6 rounded-3xl text-center border border-white/10"
              >

                <FaEye className="text-5xl mx-auto text-purple-200" />

                <h3 className="font-bold text-xl mt-4">
                  Visibility
                </h3>

                <p className="text-4xl mt-3 font-black">
                  {weather.visibility / 1000}km
                </p>

              </motion.div>

            </div>

            {/* SUN */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">

              <div className="bg-orange-500/20 backdrop-blur-xl p-6 rounded-3xl text-center">

                <WiSunrise className="text-7xl mx-auto text-orange-200" />

                <h3 className="font-black text-2xl">
                  Sunrise
                </h3>

                <p className="text-3xl mt-3 font-bold">
                  {
                    new Date(
                      weather.sunrise * 1000
                    ).toLocaleTimeString()
                  }
                </p>

              </div>

              <div className="bg-indigo-500/20 backdrop-blur-xl p-6 rounded-3xl text-center">

                <WiSunset className="text-7xl mx-auto text-indigo-200" />

                <h3 className="font-black text-2xl">
                  Sunset
                </h3>

                <p className="text-3xl mt-3 font-bold">
                  {
                    new Date(
                      weather.sunset * 1000
                    ).toLocaleTimeString()
                  }
                </p>

              </div>

            </div>

            {/* SAVE */}

            <div className="flex justify-center">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveCity}
                className="
                mt-10
                bg-gradient-to-r
                from-yellow-400
                to-orange-500
                text-white
                px-12
                py-5
                rounded-3xl
                shadow-2xl
                text-2xl
                font-black
                "
              >
                ⭐ Save Favorite City
              </motion.button>

            </div>

          </motion.div>
        )
      }

      {/* HOURLY FORECAST */}

      <div className="max-w-7xl mx-auto mb-10 relative z-10">

        <h2 className="text-4xl font-black mb-6">
          Hourly Forecast ⏰
        </h2>

        <div className="flex gap-5 overflow-x-auto pb-5">

          {
            hourlyForecast.map((item, index) => (

              <motion.div
                whileHover={{ scale: 1.05 }}
                key={index}
                className="
                min-w-[160px]
                bg-white/10
                backdrop-blur-2xl
                rounded-3xl
                p-5
                text-center
                shadow-2xl
                border
                border-white/10
                "
              >

                <p className="font-bold text-lg">
                  {item.time}
                </p>

                <img
                  className="mx-auto"
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                />

                <p className="text-3xl font-black">
                  {item.temp}°C
                </p>

              </motion.div>
            ))
          }

        </div>

      </div>

      {/* FORECAST CHART */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
        backdrop-blur-2xl
        bg-white/10
        border
        border-white/20
        rounded-[40px]
        shadow-2xl
        p-8
        max-w-7xl
        mx-auto
        relative
        z-10
        "
      >

        <h2 className="text-4xl font-black mb-8">
          7 Day Forecast 📈
        </h2>

        <ResponsiveContainer width="100%" height={450}>

          <AreaChart data={forecast}>

            <defs>

              <linearGradient
                id="colorTemp"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#60a5fa"
                  stopOpacity={0.9}
                />

                <stop
                  offset="95%"
                  stopColor="#60a5fa"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              fillOpacity={1}
              fill="url(#colorTemp)"
            />

          </AreaChart>

        </ResponsiveContainer>

        {/* FORECAST CARDS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

          {
            forecast.map((item, index) => (

              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -8,
                }}
                key={index}
                className="
                bg-white/10
                backdrop-blur-xl
                rounded-3xl
                p-5
                text-center
                shadow-2xl
                border
                border-white/10
                "
              >

                <h3 className="font-black text-xl">
                  {item.day}
                </h3>

                <img
                  className="mx-auto"
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                />

                <p className="text-4xl font-black">
                  {item.temp}°C
                </p>

                <p className="capitalize mt-3 opacity-90">
                  {item.condition}
                </p>

              </motion.div>
            ))
          }

        </div>

      </motion.div>

      {/* WEATHER RADAR */}

      {
        weather && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto mt-10 relative z-10"
          >

            <h2 className="text-4xl font-black mb-6">
              Live Weather Radar 🛰️
            </h2>

            <div className="rounded-[40px] overflow-hidden shadow-2xl border border-white/20">

              <iframe
                title="weather-map"
                className="w-full h-[550px]"
                src={`https://embed.windy.com/embed2.html?lat=${weather.latitude}&lon=${weather.longitude}&detailLat=${weather.latitude}&detailLon=${weather.longitude}&width=650&height=450&zoom=5&level=surface&overlay=rain&product=ecmwf`}
              ></iframe>

            </div>

          </motion.div>
        )
      }

    </div>
  );
}