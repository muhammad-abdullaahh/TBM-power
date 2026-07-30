from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.enums import OrderStatusEnum, PaymentMethodEnum

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(150), nullable=True)
    status = Column(ENUM(OrderStatusEnum, name="order_status_enum", create_type=False), nullable=False, default=OrderStatusEnum.pending)
    payment_method = Column(ENUM(PaymentMethodEnum, name="payment_method_enum", create_type=False), nullable=False)
    delivery_city = Column(String(100), nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_charge = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    items = relationship("OrderItem", back_populates="order", lazy="selectin")

class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=True)
    product_name = Column(String(200), nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
