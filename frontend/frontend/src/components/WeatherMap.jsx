import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { motion } from "framer-motion";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  WiDaySunny,
  WiCloudy,
  WiRain,
} from "react-icons/wi";

// ---------------- FIX LEAFLET ICON ----------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ---------------- CUSTOM WEATHER ICON ----------------

const customIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",

  iconSize: [50, 50],
});

// ---------------- COMPONENT ----------------

export default function WeatherMap({

  lat,

  lon,

  city,

  weather,

  temperature,

  humidity,

  wind_speed,

}) {

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
      rounded-3xl
      overflow-hidden
      shadow-2xl
      h-[500px]
      border
      border-white/20
      backdrop-blur-lg
      relative
      "
    >

      {/* HEADER */}

      <div
        className="
        absolute
        top-0
        left-0
        right-0
        z-[1000]
        bg-black/40
        backdrop-blur-lg
        text-white
        p-4
        flex
        justify-between
        items-center
        "
      >

        <div>

          <h2 className="text-2xl font-bold">
            🌍 Live Weather Radar
          </h2>

          <p className="text-sm opacity-80">
            {city}
          </p>

        </div>

        <div>

          {
            weather?.includes("rain")
              ? <WiRain className="text-5xl" />
              : weather?.includes("cloud")
              ? <WiCloudy className="text-5xl" />
              : <WiDaySunny className="text-5xl" />
          }

        </div>

      </div>

      {/* MAP */}

      <MapContainer
        center={[lat, lon]}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >

        {/* DARK MAP */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* CLOUD LAYER */}

        <TileLayer
          attribution='&copy; OpenWeatherMap'
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
          opacity={0.5}
        />

        {/* WEATHER AREA */}

        <Circle
          center={[lat, lon]}
          radius={12000}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#60a5fa",
            fillOpacity: 0.3,
          }}
        />

        {/* MARKER */}

        <Marker
          position={[lat, lon]}
          icon={customIcon}
        >

          <Popup>

            <div className="text-center">

              <h2 className="font-bold text-xl">
                {city}
              </h2>

              <p className="capitalize mt-2">
                {weather}
              </p>

              <p className="text-2xl font-bold mt-2">
                🌡️ {temperature}°C
              </p>

              <p className="mt-2">
                💧 Humidity: {humidity}%
              </p>

              <p className="mt-1">
                🌬️ Wind: {wind_speed} km/h
              </p>

            </div>

          </Popup>

        </Marker>

      </MapContainer>

    </motion.div>
  );
}