from datetime import datetime, timedelta, timezone
from bson import ObjectId

from configuration import *
from models import *

# check
async def archive_expired_limits():
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    expired_limits = await active_limit_collection.find({
        "expiry_date": {"$lt": today_start}
    }).to_list(length=None)
    if not expired_limits:
        print('No expired limits found for yesterday.')
        return
    for limit in expired_limits:
        if limit.get('status') == 'ongoing':
            limit['status'] = 'completed'
        await limit_collection.insert_one(limit)
        await active_limit_collection.delete_one({'_id': limit['_id']})
    print(f"Archived {len(expired_limits)} expired limits.")
  
from datetime import datetime
import logging

logger = logging.getLogger("monthly_record")
logger.setLevel(logging.INFO)
  
# create monthly record every month
async def create_monthly_record():
    current_month = datetime.now().month
    logger.info(f"Running create_monthly_record job for month {current_month}")

    # Fetch all users
    all_users = await user_collection.find({}).to_list(length=None)

    for user in all_users:
        user_id = user["_id"]

        # Check if current month record already exists
        record_exists = await monthly_expense_collection.find_one({
            "user_id": user_id,
            "month": current_month
        })

        if not record_exists:
            # Create a new monthly record
            new_record = {
                "month": current_month,
                "category": {key: 0 for key in [
                    "Pet Care", "Dining Out", "Therapy & Counselling", "Public Transport", "Groceries",
                    "Home Appliances", "Hospital Visit", "Gadgets", "Subscription", "Furniture",
                    "Online shopping", "Rent", "Utility", "Vacation & Travel", "Take Out",
                    "Education", "Gift", "Entertainment", "Fuel & Gas", "Internet",
                    "Car Service", "Clothing & Footwear", "Personal Care", "Medicine", "Emergency",
                    "Salon & Spa", "Toll gate & Parking", "Phone recharge", "Stationary & Supplies",
                    "Fitness & Gym"
                ]},
                "total": 0,
                "status": "ongoing",
                "user_id": user_id
            }
            await monthly_expense_collection.insert_one(new_record)
            logger.info(f"Created monthly record for user {user_id}")