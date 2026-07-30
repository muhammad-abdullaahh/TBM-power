from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models import CartItem, Product
from app.schemas import CartItemCreate, CartItemResponse

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/{session_id}", response_model=List[CartItemResponse])
async def get_cart(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItem).filter(CartItem.session_id == session_id))
    return result.scalars().all()

@router.post("/{session_id}/items", response_model=CartItemResponse)
async def add_or_update_cart_item(
    session_id: str,
    item_in: CartItemCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if product exists and is active
    prod_res = await db.execute(select(Product).filter(Product.product_id == item_in.product_id, Product.is_active == True))
    if not prod_res.scalars().first():
        raise HTTPException(status_code=404, detail="Product not found or inactive")

    # Check if item already in cart
    result = await db.execute(
        select(CartItem).filter(CartItem.session_id == session_id, CartItem.product_id == item_in.product_id)
    )
    cart_item = result.scalars().first()

    if cart_item:
        # Update quantity
        cart_item.quantity += item_in.quantity
    else:
        # Create new
        cart_item = CartItem(session_id=session_id, **item_in.model_dump())
        db.add(cart_item)

    await db.commit()
    await db.refresh(cart_item)
    return cart_item

@router.delete("/{session_id}/items/{product_id}", status_code=204)
async def delete_cart_item(session_id: str, product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItem).filter(CartItem.session_id == session_id, CartItem.product_id == product_id)
    )
    cart_item = result.scalars().first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    await db.delete(cart_item)
    await db.commit()
