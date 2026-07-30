from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from decimal import Decimal

from app.database import get_db
from app.models import CartItem, Order, OrderItem
from app.schemas import OrderCreate, OrderResponse
from app.utils.email import send_order_email
from app.utils.whatsapp import send_order_whatsapp

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(
    order_in: OrderCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # Fetch cart items
    cart_result = await db.execute(select(CartItem).filter(CartItem.session_id == order_in.session_id))
    cart_items = cart_result.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate subtotal and snapshot items
    subtotal = Decimal("0.0")
    order_items_data = []

    for c_item in cart_items:
        product = c_item.product
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail=f"Product {c_item.product_id} is no longer available.")
        
        # Check stock (mock logic - in reality you might decrement this)
        if product.stock_quantity < c_item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}.")

        price = product.sale_price if product.sale_price else product.original_price
        subtotal += price * c_item.quantity
        
        order_items_data.append({
            "product_id": product.product_id,
            "product_name": product.name,
            "unit_price": price,
            "quantity": c_item.quantity
        })

    # Calculate delivery charge
    delivery_charge = Decimal("0.0")
    if order_in.delivery_city.lower() == "karachi" and subtotal > Decimal("1000000"):
        delivery_charge = Decimal("0.0")
    else:
        # If client provided a charge, use it, else default to 5000
        delivery_charge = order_in.delivery_charge if order_in.delivery_charge is not None else Decimal("5000.00")

    total_amount = subtotal + delivery_charge

    # Create Order
    order_data = order_in.model_dump(exclude={"session_id", "delivery_charge"})
    order = Order(
        **order_data,
        delivery_charge=delivery_charge,
        total_amount=total_amount
    )
    db.add(order)
    await db.flush() # flush to get order_id

    # Create Order Items
    for item_data in order_items_data:
        order_item = OrderItem(order_id=order.order_id, **item_data)
        db.add(order_item)

    # Clear Cart
    for c_item in cart_items:
        await db.delete(c_item)

    await db.commit()
    await db.refresh(order)

    # Notifications in background
    background_tasks.add_task(send_order_email, order.order_id)
    background_tasks.add_task(send_order_whatsapp, order.order_id)

    return order
