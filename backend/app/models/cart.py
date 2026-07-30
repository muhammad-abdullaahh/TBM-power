from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class CartItem(Base):
    __tablename__ = "cart_items"

    cart_item_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime, nullable=False, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("session_id", "product_id", name="cart_items_session_id_product_id_key"),
    )

    product = relationship("Product", lazy="selectin")
