from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base
from sqlalchemy import DateTime, JSON, Date
from datetime import datetime

# ---------------- SEARCH HISTORY ----------------

class SearchHistory(Base):

    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)

    city = Column(String)

    temperature = Column(String)

    description = Column(String)

# ---------------- USERS ----------------

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)

    email = Column(String, unique=True, index=True)

    password = Column(String)

# ---------------- LOCATION ----------------

class Location(Base):

    __tablename__ = "location"

    id = Column(Integer, primary_key=True, index=True)

    city = Column(String)

    country = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

# ---------------- SAVED LOCATION ----------------

class SavedLocation(Base):

    __tablename__ = "saved_location"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    location_id = Column(Integer, ForeignKey("location.id"))
    # ---------------- CURRENT WEATHER ----------------

class CurrentWeather(Base):

    __tablename__ = "current_weather"

    id = Column(Integer, primary_key=True, index=True)

    location_id = Column(
        Integer,
        ForeignKey("location.id")
    )

    temperature = Column(Float)

    humidity = Column(Integer)

    weather_condition = Column(String)

    wind_speed = Column(Float)

    recorded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

# ---------------- FORECAST ----------------

class Forecast(Base):

    __tablename__ = "forecast"

    id = Column(Integer, primary_key=True, index=True)

    location_id = Column(
        Integer,
        ForeignKey("location.id")
    )

    forecast_date = Column(Date)

    min_temp = Column(Float)

    max_temp = Column(Float)

    weather_condition = Column(String)

# ---------------- API CACHE ----------------

class ApiCache(Base):

    __tablename__ = "api_cache"

    id = Column(Integer, primary_key=True, index=True)

    city = Column(String)

    api_response = Column(JSON)

    cached_at = Column(
        DateTime,
        default=datetime.utcnow
    )