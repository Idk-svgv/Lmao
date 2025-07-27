from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random
import asyncio

# Import our models and database
from models import *
from database import database
from game_logic import game_logic
from story_content import get_story_chapters, get_chapter_by_number

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Solo Leveling API", description="API for the Solo Leveling RPG Game")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Daily Quest Models
class DailyQuestStatus(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    date: str
    pushups: int = 0
    situps: int = 0
    running_km: float = 0.0
    completed: bool = False
    failed: bool = False
    penalty_served: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DailyQuestUpdate(BaseModel):
    pushups: Optional[int] = None
    situps: Optional[int] = None
    running_km: Optional[float] = None

class PenaltyZoneSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    duration_minutes: int = 120  # 2 hours
    survived: bool = False
    damage_taken: int = 0
    centipedes_killed: int = 0

# Combat and Shadow Extraction Models
class CombatResult(BaseModel):
    success: bool
    exp_gained: int
    damage_taken: int
    items_dropped: List[str] = []
    shadows_available: List[Dict[str, Any]] = []

class ShadowExtractionAttempt(BaseModel):
    enemy_name: str
    success_rate: float
    mana_cost: int

# Basic API endpoints
@api_router.get("/")
async def root():
    return {"message": "Welcome to Solo Leveling RPG API - The Shadow Monarch Awaits..."}

@api_router.get("/health")
async def health_check():
    return {"status": "alive", "message": "System is operational"}

# Initialize game data on startup
@app.on_event("startup")
async def startup_event():
    await database.initialize_game_data()
    logger.info("Game data initialized successfully")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
