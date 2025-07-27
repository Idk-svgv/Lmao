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

# Player Management Endpoints
@api_router.post("/players", response_model=Player)
async def create_player(player_data: PlayerCreate):
    """Create a new player with initial setup"""
    try:
        player = await database.create_player(player_data)
        
        # Initialize story chapters for the player
        story_chapters = get_story_chapters()
        for i, chapter_data in enumerate(story_chapters):
            chapter = StoryChapter(
                chapter_number=chapter_data["chapter_number"],
                title=chapter_data["title"],
                description=chapter_data["description"],
                content=chapter_data["content"],
                unlocked=(i == 0),
                player_id=player.id
            )
            await db.story_chapters.insert_one(chapter.dict())
            
        return player
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: str):
    """Get player information"""
    player = await database.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@api_router.put("/players/{player_id}", response_model=Player)
async def update_player(player_id: str, updates: PlayerUpdate):
    """Update player information"""
    player = await database.update_player(player_id, updates)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

# Daily Quest System - The Iconic Solo Leveling Feature!
@api_router.get("/players/{player_id}/daily-quest")
async def get_daily_quest(player_id: str):
    """Get today's daily quest status"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Check if daily quest exists for today
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc:
        # Create new daily quest for today
        daily_quest = DailyQuestStatus(player_id=player_id, date=today)
        await db.daily_quests.insert_one(daily_quest.dict())
        daily_quest_doc = daily_quest.dict()
    
    # Add the penalty zone threat message
    quest_data = {
        **daily_quest_doc,
        "title": "Preparation for Becoming Strong",
        "description": "Complete the daily training regimen. Failure will result in punishment.",
        "requirements": {
            "pushups": 100,
            "situps": 100,
            "running_km": 10.0
        },
        "penalty_warning": "⚠️ Failure to complete within 24 hours will transport you to the Penalty Zone for 2 hours!",
        "time_remaining": "23:45:30",  # Calculate actual remaining time
        "easter_egg": "💀 The System is always watching... 👁️"
    }
    
    return quest_data

@api_router.put("/players/{player_id}/daily-quest")
async def update_daily_quest(player_id: str, update: DailyQuestUpdate):
    """Update daily quest progress"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Find today's quest
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc:
        raise HTTPException(status_code=404, detail="No daily quest found for today")
    
    # Update progress
    update_data = {}
    if update.pushups is not None:
        update_data["pushups"] = min(update.pushups, 100)
    if update.situps is not None:
        update_data["situps"] = min(update.situps, 100)
    if update.running_km is not None:
        update_data["running_km"] = min(update.running_km, 10.0)
    
    # Check if quest is completed
    current_pushups = update_data.get("pushups", daily_quest_doc["pushups"])
    current_situps = update_data.get("situps", daily_quest_doc["situps"])
    current_running = update_data.get("running_km", daily_quest_doc["running_km"])
    
    if current_pushups >= 100 and current_situps >= 100 and current_running >= 10.0:
        update_data["completed"] = True
        
        # Award rewards
        player = await database.get_player(player_id)
        if player:
            # Level up logic
            level_info = await game_logic.level_up_player(player_id, 1000)
            
            # Add stat bonuses
            new_stats = player.stats
            new_stats.strength += 2
            new_stats.vitality += 1
            new_stats.agility += 1
            
            await database.update_player(player_id, PlayerUpdate(
                stats=new_stats,
                experience=player.experience + 1000
            ))
    
    await db.daily_quests.update_one(
        {"player_id": player_id, "date": today},
        {"$set": update_data}
    )
    
    # Return updated quest with motivational messages
    updated_quest = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    # Add Easter egg messages based on progress
    progress_messages = [
        "💪 Jin-Woo's determination burns bright!",
        "🔥 The System acknowledges your effort...",
        "⚡ Power flows through your muscles!",
        "🌟 You're becoming stronger than yesterday!",
        "👑 The Shadow Monarch's power awakens!"
    ]
    
    updated_quest["motivational_message"] = random.choice(progress_messages)
    return updated_quest

@api_router.post("/players/{player_id}/penalty-zone")
async def enter_penalty_zone(player_id: str):
    """Enter the dreaded penalty zone - Giant Centipede Desert!"""
    
    # Check if player has failed daily quest
    today = datetime.now().strftime("%Y-%m-%d")
    daily_quest_doc = await db.daily_quests.find_one({
        "player_id": player_id,
        "date": today
    })
    
    if not daily_quest_doc or daily_quest_doc.get("completed", False):
        raise HTTPException(status_code=400, detail="No penalty required - quest completed or not found")
    
    # Create penalty zone session
    penalty_session = PenaltyZoneSession(player_id=player_id)
    await db.penalty_zones.insert_one(penalty_session.dict())
    
    return {
        "message": "⚠️ SYSTEM WARNING ⚠️",
        "description": "You have been transported to the Penalty Zone!",
        "location": "🏜️ Endless Desert of Giant Centipedes",
        "objective": "Survive for 2 hours while being hunted by massive centipedes",
        "danger_level": "EXTREME",
        "easter_egg": "🦂 The centipedes are the size of subway cars... Good luck! 💀",
        "survival_tip": "Keep moving. They can sense vibrations in the sand.",
        "session_id": penalty_session.id,
        "duration_minutes": 120
    }

@api_router.get("/players/{player_id}/penalty-zone/{session_id}")
async def get_penalty_zone_status(player_id: str, session_id: str):
    """Get current penalty zone survival status"""
    session_doc = await db.penalty_zones.find_one({
        "id": session_id,
        "player_id": player_id
    })
    
    if not session_doc:
        raise HTTPException(status_code=404, detail="Penalty zone session not found")
    
    session = PenaltyZoneSession(**session_doc)
    elapsed_minutes = (datetime.utcnow() - session.start_time).total_seconds() / 60
    remaining_minutes = max(0, 120 - elapsed_minutes)
    
    # Random centipede encounter messages
    encounter_messages = [
        "🦂 A massive centipede bursts from the sand behind you!",
        "👁️ You feel dozens of eyes watching from beneath the dunes...",
        "🏜️ The sand shifts ominously around your feet...",
        "⚡ Lightning crackles as a giant centipede charges!",
        "💀 The skeletal remains of previous victims litter the sand..."
    ]
    
    return {
        "session_id": session_id,
        "elapsed_minutes": int(elapsed_minutes),
        "remaining_minutes": int(remaining_minutes),
        "progress_percent": min(100, (elapsed_minutes / 120) * 100),
        "status": "SURVIVING" if remaining_minutes > 0 else "ESCAPED",
        "encounter_message": random.choice(encounter_messages) if remaining_minutes > 0 else "🎉 You have survived the Penalty Zone!",
        "centipedes_encountered": random.randint(3, 8),
        "damage_taken": random.randint(20, 50),
        "easter_egg": "🎮 This is harder than Dark Souls..." if remaining_minutes > 60 else "🏃‍♂️ Almost there! Don't give up!"
    }

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
