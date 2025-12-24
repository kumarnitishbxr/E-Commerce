from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.schemas.payment_schema import PaymentInitiate
from app.services.payment_service import (initiate_payment, verify_payment)
from app.api.deps.auth_deps import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/initiate")
async def initiate(data: PaymentInitiate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await initiate_payment(db, data.order_id)


@router.post("/webhook")
async def webhook(payload: dict, x_razorpay_signature: str = Header(...), db: AsyncSession = Depends(get_db)):
    await verify_payment(db=db, payload=payload, signature=x_razorpay_signature)
    return {"status" : "ok"}

