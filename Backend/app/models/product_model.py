from sqlalchemy import (Column, Integer, String, Boolean, ForeignKey)
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_returnable = Column(Boolean, default=False)

