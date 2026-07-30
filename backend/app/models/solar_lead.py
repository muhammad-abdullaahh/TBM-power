from sqlalchemy import Column, Integer, String, DateTime, Numeric
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ENUM
from app.database import Base
from app.models.enums import SystemTypeEnum

class SolarLead(Base):
    __tablename__ = "solar_leads"

    lead_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(150), nullable=True)
    city = Column(String(100), nullable=True)
    system_type = Column(ENUM(SystemTypeEnum, name="system_type_enum", create_type=False), nullable=False)
    monthly_bill_range = Column(String(50), nullable=False)
    region = Column(String(100), nullable=False)
    recommended_kw = Column(Numeric(5, 2), nullable=True)
    panels_needed = Column(Integer, nullable=True)
    units_per_day = Column(Numeric(6, 2), nullable=True)
    peak_sun_hours = Column(Numeric(4, 2), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
