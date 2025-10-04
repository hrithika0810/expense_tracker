import logging
from fastapi import FastAPI # backend application
from router import router # Import your router from router.py
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
from apscheduler.triggers.cron import CronTrigger
from scheduler import *

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("apscheduler")

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schedule async jobs directly
    scheduler.add_job(archive_expired_limits, 'interval', seconds=10, id="archive_expired_limits_job")
    scheduler.add_job(create_monthly_record, 'interval', seconds=10, id="create_monthly_record")
    
    scheduler.start()
    logger.info("Scheduler started with jobs: %s", scheduler.get_jobs())
    
    yield  # FastAPI app is running
    
    scheduler.shutdown()
    logger.info("Scheduler stopped.")


app = FastAPI(lifespan=lifespan)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,    
    allow_origins=["*"],   # change this to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)