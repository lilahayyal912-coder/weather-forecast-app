from sqlalchemy import Column, Integer, String
from database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String)
    temperature = Column(String)
    description = Column(String)