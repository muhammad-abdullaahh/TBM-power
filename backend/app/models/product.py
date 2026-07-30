from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    specs = Column(JSONB, nullable=True)
    original_price = Column(Numeric(12, 2), nullable=False)
    sale_price = Column(Numeric(12, 2), nullable=True)
    stock_quantity = Column(Integer, nullable=False, default=0)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # Relationships
    category = relationship("Category", lazy="selectin")
    reviews = relationship("Review", back_populates="product", lazy="selectin")
