from sqlalchemy import (Column, Integer, Enum, ForeignKey, DateTime, func)
from app.db.base import Base
import enum

class OrderStatus(str, enum.Enum):
    created = "created"
    paid = "paid"
    assigned = "assigned"
    picked = "picked"
    delivered = "delivered"
    cancelled = "cancelled"
    returned = "returned"
    refunded = "refunded"
    
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key = True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable = False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable = False)
    status = Column(Enum(OrderStatus), default=OrderStatus.created)
    total_amount = Column(Integer, nullable=False)
    is_prepaid = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
