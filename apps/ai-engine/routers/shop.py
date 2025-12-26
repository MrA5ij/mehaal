from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from pydantic import BaseModel

router = APIRouter()

# Memory Store for Demo (Since we don't have a Product table yet)
# In a real app, this would query a 'Product' table.
inventory_db = [
    {"id": 1, "name": "Wireless Headset", "stock": 45, "price": 99},
    {"id": 2, "name": "Mechanical Keyboard", "stock": 12, "price": 150},
    {"id": 3, "name": "Gaming Mouse", "stock": 28, "price": 60},
]

class SaleRequest(BaseModel):
    item_id: int
    quantity: int

@router.get("/shop/inventory")
async def get_inventory():
    return inventory_db

@router.post("/shop/sale")
async def process_sale(sale: SaleRequest):
    for item in inventory_db:
        if item["id"] == sale.item_id:
            if item["stock"] >= sale.quantity:
                item["stock"] -= sale.quantity
                return {"status": "success", "message": f"Sold {sale.quantity}x {item['name']}", "new_stock": item["stock"]}
            else:
                return {"status": "error", "message": "Out of stock"}
    return {"status": "error", "message": "Item not found"}
