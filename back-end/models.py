from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Dict

class UserRegister(BaseModel): # sign-in (input)
    email: EmailStr
    password: str = Field(
        ...,
        min_length=6
    )
    
class UserLogin(BaseModel): # login (input)
    email: EmailStr
    password: str
    
class Token(BaseModel): # token format
    access_token: str
    token_type: str = 'bearer'
    
class Limit(BaseModel): # create (user entry) limit (active)
    category: str
    amount_limit: float
    expiry_date: datetime
    
categories = [
    'Pet Care', 'Dining Out', 'Therapy & Counselling', 'Public Transaport', 'Groceries',
    'Home Appliances', 'Hospital Visit', 'Gadgets', 'Subscription', 'Furniture', 'Online shopping',
    'Rent', 'Utility', 'Vacation & Travel', 'Take Out', 'Education', 'Gift', 'Entertainment',
    'Fuel & Gas', 'Internet', 'Car Service', 'Clothing & Footwear', 'Personal Care', 'Medicine',
    'Emergency', 'Salon & Spa', 'Toll gate & Parking', 'Phone recharge', 'Stationary & Supplies', 
    'Fitness & Gym'
]

class MonthlyExpense(BaseModel):
    month: int
    category: Dict[str, float]
    total: float
    status: str = 'ongoing'
    
class Transaction(BaseModel):
    category: str
    amount: float