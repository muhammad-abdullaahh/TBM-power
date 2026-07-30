from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.enums import OrderStatusEnum, PaymentMethodEnum

class OrderItemResponse(BaseModel):
    order_item_id: int
    order_id: int
    product_id: Optional[int]
    product_name: str
    unit_price: Decimal
    quantity: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None
    payment_method: PaymentMethodEnum
    delivery_city: str
    delivery_address: str
    delivery_charge: Optional[Decimal] = None

class OrderCreate(OrderBase):
    session_id: str # The cart session ID to create the order from

class OrderStatusUpdate(BaseModel):
    status: OrderStatusEnum

class OrderResponse(BaseModel):
    order_id: int
    customer_name: str
    customer_phone: str
    customer_email: Optional[str]
    status: OrderStatusEnum
    payment_method: PaymentMethodEnum
    delivery_city: str
    delivery_address: str
    delivery_charge: Decimal
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
