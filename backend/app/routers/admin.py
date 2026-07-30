from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models import Admin, Category, Product, Order, SolarLead
from app.schemas import (
    Token, CategoryCreate, CategoryResponse, 
    ProductCreate, ProductUpdate, ProductResponse,
    OrderResponse, OrderStatusUpdate, SolarLeadResponse
)
from app.utils.auth import verify_password, create_access_token, get_current_admin
from app.utils.file_upload import save_upload_file

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).filter(Admin.email == form_data.username))
    admin = result.scalars().first()
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": admin.email})
    return {"access_token": access_token, "token_type": "bearer"}

# -- Categories --
@router.post("/categories", response_model=CategoryResponse, status_code=201)
async def create_category(category_in: CategoryCreate, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    category = Category(**category_in.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# -- Products --
@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    product = Product(**product_in.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product_in: ProductUpdate, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    result = await db.execute(select(Product).filter(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/products/{product_id}", status_code=204)
async def soft_delete_product(product_id: int, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    result = await db.execute(select(Product).filter(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = False # Soft delete
    await db.commit()
    return

@router.post("/products/upload-image")
async def upload_image(file: UploadFile = File(...), admin: Admin = Depends(get_current_admin)):
    file_url = await save_upload_file(file)
    return {"image_url": file_url}

# -- Orders --
@router.get("/orders", response_model=List[OrderResponse])
async def get_orders(status: str | None = None, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    query = select(Order).order_by(Order.created_at.desc())
    if status:
        query = query.filter(Order.status == status)
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, status_in: OrderStatusUpdate, db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    result = await db.execute(select(Order).filter(Order.order_id == order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_in.status
    await db.commit()
    await db.refresh(order)
    return order

# -- Solar Leads --
@router.get("/leads", response_model=List[SolarLeadResponse])
async def get_leads(db: AsyncSession = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    result = await db.execute(select(SolarLead).order_by(SolarLead.created_at.desc()))
    return result.scalars().all()
