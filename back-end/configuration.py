from motor.motor_asyncio import AsyncIOMotorClient # motor (connects python to mongoDB, similar to pymongo) + asynchronous
import os # Python module to interact with the operating system (like reading environment variables).
from dotenv import load_dotenv # A package that loads variables from a .env file into your environment.

load_dotenv()
MONGO_DETAILS = os.environ.get('MONGO_URI')

client = AsyncIOMotorClient(MONGO_DETAILS) # connection to MongoDB cluster
database = client["expense_tracker"] # creating a container

# collections
user_collection = database["users"] # collection - users
active_limit_collection = database["active_limit"] # collection active_limit
monthly_expense_collection = database["monthly_expense"] # collection monthly_expense
limit_collection = database["limit"] # collection limit
transaction_collection = database["transaction"] # collection transaction