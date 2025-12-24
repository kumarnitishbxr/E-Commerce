from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order_model import Order, OrderStatus
from app.core.exceptions import PermissionDeniedException, NotFoundException

async def create_order(db: AsyncSession, buyer_id: int, seller_id: int, amount: int, prepaid: bool) -> Order:
    order = Order(
        buyer_id = buyer_id,
        seller_id = seller_id,
        total_amount = amount,
        is_Prepaid = int(prepaid)    
    )
    db.add(order)
    await db.commit()
    await db.refresh()
    return order

async def update_order_status(db: AsyncSession, order_id: int, user_id: int, new_status: OrderStatus) -> Order:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalars().first()
    
    if not order:
        raise NotFoundException("Order not found")
    if user_id not in (order.buyer_id, order.seller_id):
        raise PermissionDeniedException("Not allowed")
    
    order.status = new_status
    await db.commit()
    return order