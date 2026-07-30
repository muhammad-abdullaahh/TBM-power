from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.enums import SystemTypeEnum

class SolarLeadBase(BaseModel):
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    system_type: SystemTypeEnum
    monthly_bill_range: str
    region: str
    recommended_kw: Optional[Decimal] = None
    panels_needed: Optional[int] = None
    units_per_day: Optional[Decimal] = None
    peak_sun_hours: Optional[Decimal] = None

class SolarLeadCreate(SolarLeadBase):
    pass

class SolarLeadResponse(SolarLeadBase):
    lead_id: int
    created_at: datetime

    class Config:
        from_attributes = True
