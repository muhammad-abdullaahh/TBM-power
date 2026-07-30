from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models import Category, Product, Review, SolarLead
from app.schemas import CategoryResponse, ProductResponse, ReviewCreate, ReviewResponse, SolarLeadCreate, SolarLeadResponse
from app.utils.email import send_lead_email
from app.utils.whatsapp import send_lead_whatsapp

router = APIRouter(tags=["Public"])

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    return result.scalars().all()

@router.get("/products", response_model=List[ProductResponse])
async def get_products(category_id: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Product).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/products/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.slug == slug, Product.is_active == True))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/products/{product_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(product_id: int, review_in: ReviewCreate, db: AsyncSession = Depends(get_db)):
    # Check if product exists and is active
    result = await db.execute(select(Product).filter(Product.product_id == product_id, Product.is_active == True))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Product not found")

    review = Review(product_id=product_id, **review_in.model_dump())
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review

@router.post("/solar-leads", response_model=SolarLeadResponse, status_code=201)
async def create_solar_lead(
    lead_in: SolarLeadCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    lead = SolarLead(**lead_in.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    # Notifications in background
    background_tasks.add_task(send_lead_email, lead.lead_id)
    background_tasks.add_task(send_lead_whatsapp, lead.lead_id)

    return lead
