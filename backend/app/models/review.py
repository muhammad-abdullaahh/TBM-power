from sqlalchemy import Column, Integer, String, Text, SmallInteger, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    reviewer_name = Column(String(100), nullable=False)
    rating = Column(SmallInteger, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="reviews_rating_check"),
    )

    product = relationship("Product", back_populates="reviews")
