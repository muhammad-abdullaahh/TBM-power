from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    cart_item_id: int
    session_id: str
    added_at: datetime
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True
