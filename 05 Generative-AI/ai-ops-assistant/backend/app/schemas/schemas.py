from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "customer"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    stock_quantity: int
    description: Optional[str] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    status: str
    total_amount: float
    shipping_city: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

# --- AI Agent Chat Schemas ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    agent_type: str  # "support" or "analytics"
    escalated: Optional[bool] = False