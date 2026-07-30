from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from decimal import Decimal
from .category import CategoryResponse

class ProductBase(BaseModel):
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    specs: Optional[dict[str, Any]] = None
    original_price: Decimal
    sale_price: Optional[Decimal] = None
    stock_quantity: int = 0
    image_url: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[dict[str, Any]] = None
    original_price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    product_id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
