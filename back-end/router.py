from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from typing import List, Dict

from models import *
from configuration import *

router = APIRouter()
secret_key = os.getenv('SECRET_KEY', 'fallback_if_missing')

password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
def hash_password(password: str):
    return password_context.hash(password)

# sign-in (register new user) router
@router.post("/register")
async def register_user(user: UserRegister):
    existing_user = await user_collection.find_one({ "email": user.email })
    if existing_user:
        raise HTTPException(status_code=400, detail={'field': 'email', 'message': 'Email already exists!'})
    hashed_password = hash_password(user.password)
    result = await user_collection.insert_one({"email": user.email, "password": hashed_password})
    user_ID = str(result.inserted_id)
    
    # create monthly-expense record for current month
    now = datetime.utcnow()
    current_month = now.month
    new_month_record = MonthlyExpense(
        month = current_month,
        category={category: 0.0 for category in categories},
        total=0.0,
        status='ongoing'
    )
    await monthly_expense_collection.insert_one({**new_month_record.dict(), 'user_id': ObjectId(user_ID)})
    token = create_access_token({'sub': user.email})
    return {'id': user_ID, 'email': user.email, 'access_token': token, 'token_type': 'bearer'}
    
def verify_password(plain_password: str, hashed_password: str):
    return password_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expiry = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({'exp': expiry})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm='HS256')
    return encoded_jwt

# login router
@router.post('/login')
async def user_login(user: UserLogin):
    existing_user = await user_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail={'field': 'email', 'message': 'Email does not exists!'})
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail={'field': 'password', 'message': 'invalid password'})
    token = create_access_token({'sub': existing_user['email']})
    return {'access_token': token, 'token_type': 'bearer'}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        email: str = payload.get('sub')
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        user = await user_collection.find_one({'email': email})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return str(user['_id'])
    except JWTError:
        raise HTTPException(status_code=404, detail="User not found")
        
# create limit - insert to active limit collection
@router.post('/createlimit')
async def create_limit(limit: Limit, current_user: str = Depends(get_current_user_id)):
    try:
        user_id = ObjectId(current_user)
        existing_limit = await active_limit_collection.find_one({'user_id': ObjectId(user_id), 'category': limit.category})
        if existing_limit and existing_limit.get('status') == 'ongoing': # remove 'ongoing' check
            raise HTTPException(status_code=400, detail=f'Limit for {limit.category} already exists.')
        if limit.amount_limit <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than zero.")
        limit_created = {
            'user_id': ObjectId(user_id),
            'category': limit.category,
            'current_amount': 0.0,
            'amount_limit': limit.amount_limit,
            'created_at':  datetime.utcnow(),
            'expiry_date': limit.expiry_date,
            'status': 'ongoing',
        }
        result = await active_limit_collection.insert_one(limit_created)
        return {
            'message': 'limit created successfully',
            'limit_id': str(result.inserted_id),
            'user_id': str(user_id),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# to display all active limit
@router.get('/activelimit')
async def get_active_limit(current_user: str = Depends(get_current_user_id)) -> List[Dict]:
    try:
        cursor: AsyncIOMotorClient = active_limit_collection.find({'user_id': ObjectId(current_user)})
        limits: List[Dict] = await cursor.to_list(length=None)
        if not isinstance(limits, list):
            raise HTTPException(status_code=500, detail="Failed to fetch limits")
        for limit in limits:
            if '_id' in limit:
                limit['_id'] = str(limit['_id'])
            if 'user_id' in limit:
                limit['user_id'] = str(limit['user_id'])
        return limits
    except Exception as e:
        print("Error in /activelimit:", repr(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# check - only 3 option needed
def convert_objectids(doc: dict) -> dict:
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, dict):
            doc[key] = convert_objectids(value)
        elif isinstance(value, list):
            doc[key] = [
                convert_objectids(item) if isinstance(item, dict) else item
                for item in value
            ]
    return doc

# to display monthly records
@router.get('/monthlyexpense')
async def get_monthly_expense(current_user: str = Depends(get_current_user_id)):
    cursor = monthly_expense_collection.find({"user_id": ObjectId(current_user)})
    records = await cursor.to_list(length=None)
    records = [convert_objectids(record) for record in records]
    return records

# to display limit records
@router.get('/limit')
async def get_limit(current_user: str = Depends(get_current_user_id)):
    try:
        # today = datetime.utcnow()
        cursor = limit_collection.find({'user_id': ObjectId(current_user)})
        limitRecords: List[Dict] = await cursor.to_list(length=None)
        for limitRecord in limitRecords:
            limitRecord['_id'] = str(limitRecord.get('_id', ''))
            limitRecord['user_id'] = str(limitRecord.get('user_id', ''))
        print("Fetched limits:", limitRecords)
        return limitRecords
    except Exception as e:
        print("Error in /limit:", repr(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@router.delete('/deletelimit/{limit_id}')
async def delete_limit(limit_id: str, current_user: str = Depends(get_current_user_id)):
    try:
        user_id = ObjectId(current_user)
        limit_Object_id = ObjectId(limit_id)
        existing_limit = await active_limit_collection.find_one({'_id': limit_Object_id, 'user_id': user_id})
        if not existing_limit:
            raise HTTPException(status_code=404, detail="Limit not found")
        existing_limit['status'] = 'deleted'
        await limit_collection.insert_one(existing_limit)
        result = await active_limit_collection.delete_one({'_id': limit_Object_id})
        if result.deleted_count == 1:
            return {"message": "Limit archived with status 'deleted' and removed from active limits"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete active limit")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def update_limit_and_month_record(user_id: ObjectId, category: str, amount: float):
    active_limit_exceeded = await active_limit_collection.find_one({'user_id': user_id, 'category': category, 'status': 'exceeded'})
    if active_limit_exceeded:
        new_amount = active_limit_exceeded['current_amount'] + amount
        await active_limit_collection.update_one({'_id': active_limit_exceeded['_id']}, {'$set': {'current_amount': new_amount}})
    active_limit_ongoing = await active_limit_collection.find_one({'user_id': user_id, 'category': category, 'status': 'ongoing'})
    if active_limit_ongoing:
        new_amount = active_limit_ongoing['current_amount'] + amount
        new_status = 'exceeded' if new_amount > float(active_limit_ongoing['amount_limit']) else 'ongoing'
        await active_limit_collection.update_one({'_id': active_limit_ongoing['_id']}, {'$set': {'current_amount': new_amount, 'status': new_status}})
    now = datetime.utcnow()
    current_month = now.month
    monthly_record = await monthly_expense_collection.find_one({'user_id': user_id, 'month': current_month})
    if monthly_record:
        updated_category_amount = monthly_record['category'].get(category, 0.0) + amount
        updated_total = monthly_record['total'] + amount
        await monthly_expense_collection.update_one({'_id': monthly_record['_id']}, {'$set': {f'category.{category}': updated_category_amount, 'total': updated_total}})
    
# create transaction
@router.post('/createtransaction')
async def create_transaction(transaction: Transaction, current_user: str = Depends(get_current_user_id)):
    user_id = ObjectId(current_user)
    present_date = datetime.utcnow()
    try:
        result = await transaction_collection.insert_one({
            'user_id': user_id,
            'category': transaction.category,
            'amount': transaction.amount,
            'date_of_transaction': present_date,
        })
        await update_limit_and_month_record(user_id, transaction.category, transaction.amount)
        return {"message": "Transaction created successfully", "transaction_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insert failed: {str(e)}")
  
# display all transaction  
@router.get('/transactions')
async def get_transactions(current_user: str = Depends(get_current_user_id)) -> List[Dict]:
    try:
        cursor: AsyncIOMotorClient = transaction_collection.find({'user_id': ObjectId(current_user)})
        transactions: List[Dict] = await cursor.to_list(length=None)
        for transaction in transactions:
            transaction['_id'] = str(transaction.get('_id', ''))
            transaction['user_id'] = str(transaction.get('user_id', ''))
        return transactions
    except Exception as e:
        print("Error in /recenttransaction:", repr(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# delete transaction
@router.delete('/deletetransaction/{transaction_id}')
async def delete_transaction(transaction_id: str, current_user: str = Depends(get_current_user_id)):
    try:
        user_id = ObjectId(current_user)
        transaction_Object_Id = ObjectId(transaction_id)
        existing_transaction = await transaction_collection.find_one({'_id': transaction_Object_Id, 'user_id': user_id})
        
        if not existing_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")

        category = existing_transaction['category']
        amount = existing_transaction['amount']
        existing_limit = await active_limit_collection.find_one({ 'user_id': user_id, 'category': category, 'status': { '$in': ['ongoing', 'exceeded']}})
        
        if existing_limit:
            new_current_amount = existing_limit['current_amount'] - amount
            if existing_limit['status'] == 'exceeded' or existing_limit['status'] == 'ongoing':
                new_status = 'ongoing' if new_current_amount <= existing_limit['amount_limit'] else 'exceeded'
                await active_limit_collection.update_one({'_id': existing_limit['_id']}, {'$set': {'current_amount': new_current_amount, 'status': new_status}})
        now = datetime.utcnow()
        current_month = now.month
        monthly_record = await monthly_expense_collection.find_one({'user_id': user_id, 'month': current_month})
        if monthly_record:
            updated_category_amount = monthly_record['category'].get(category, 0.0) - amount
            updated_total = monthly_record['total'] - amount
            await monthly_expense_collection.update_one({"_id": monthly_record["_id"]}, {"$set": { f"category.{category}": updated_category_amount, "total": updated_total }})
        await transaction_collection.delete_one({'_id': transaction_Object_Id})
        return {"detail": "Transaction deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# display all budget violation
@router.get('/budgetviolation')
async def get_budget_violation(current_user: str = Depends(get_current_user_id)) -> List[Dict]:
    try:
        cursor = active_limit_collection.find({'user_id': ObjectId(current_user), 'status': 'exceeded'})
        budgetViolations: List[Dict] = await cursor.to_list(length=None)
        for budgetViolation in budgetViolations:
            budgetViolation['_id'] = str(budgetViolation.get('_id', ''))
            budgetViolation['user_id'] = str(budgetViolation.get('user_id', ''))
            budgetViolation['limit_amount'] = budgetViolation.get('amount_limit', 0)
        return budgetViolations
    except Exception as e:
        print("Error in /budgetviolation:", repr(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# get first letter from email
@router.get('/getLetter')
async def get_first_letter(current_user: str = Depends(get_current_user_id)):
    print("current_user:", current_user)
    user = await user_collection.find_one({'_id': ObjectId(current_user)})
    print("user found:", user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    email = user.get("email", "")
    return {"first_letter": email[0].lower()}