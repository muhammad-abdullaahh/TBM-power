from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True
